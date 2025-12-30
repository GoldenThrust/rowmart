import { createProductSchema, updateProductSchema, deleteProductSchema, getProductsSchema, getProductSchema } from "../schemas/product.schema.js";
import { buffer } from "stream/consumers";
import { v4 } from "uuid";
import Product from "../models/product.js";
import { getProductCount } from "../contract/services/getProductCount.js";
import { File } from "buffer";

export default async function productRoutes(fastify, opts) {
    const { pinata } = fastify;
    // TODO: Listen to create Product event and send mail
    // TODO: Delete product after 20 minute of no CreateProduct Events
    // ---------------- CREATE PRODUCT ----------------
    fastify.post(
        "/create-product",
        {
            schema: createProductSchema,
            preValidation: async (request, reply) => {
                if (!request.isMultipart()) {
                    return reply.status(400).send({ message: "Multipart required" });
                }

                let fileBuffer;
                let fileMeta;
                const fields = {};
                for await (const part of request.parts()) {
                    if (part.type === "file") {
                        fileMeta = part;
                        fileBuffer = await buffer(part.file);
                    } else {
                        fields[part.fieldname] = part.value;
                    }
                }

                if (!fileBuffer) {
                    return reply.status(400).send({ message: "Image file required" });
                }

                request.body = {
                    ...fields,
                    file: {
                        buffer: fileBuffer,
                        metadata: fileMeta,
                    },
                };
            },
        },
        async (request, reply) => {
            try {
                const { file: image, ...fields } = request.body;

                const file = new File([image.buffer], v4(), {
                    type: image.metadata.mimetype,
                });


                // Read productCount from blockchain
                const productCount = await getProductCount(fastify);

                // Upload to Pinata
                const { id, cid } = await pinata.upload.public.file(file).keyvalues(fields);

                // Save to MongoDB
                const product = await Product.create({
                    imageId: id,
                    imageCid: cid,
                    name: fields.name,
                    email: fields.email,
                    price: fields.price,
                    description: fields.description,
                    productId: (productCount + 1n).toString(),
                });

                return reply.send({ success: true, product });
            } catch (err) {
                request.log.error(err);
                return reply.status(500).send({ message: "Upload failed" });
            }
        }
    );

    // ---------------- UPDATE PRODUCT ----------------
    fastify.put(
        "/update-product",
        { schema: updateProductSchema },
        async (request, reply) => {
            try {
                const { id, ...fields } = request.body;
                const updatedProduct = await Product.findByIdAndUpdate(id, fields, { new: true });

                return reply.send({ success: true, product: updatedProduct });
            } catch (err) {
                request.log.error(err);
                return reply.status(500).send({ message: "Failed to update product" });
            }
        }
    );

    // ---------------- GET PRODUCTS WITH PAGINATION ----------------
    fastify.get(
        "/get-products",
        { schema: getProductsSchema },
        async (request, reply) => {
            try {
                const { page = 1, limit = 10, search: searchQuery } = request.query;

                const search = searchQuery ? { $or: [{ name: { $regex: searchQuery, $options: "i" } }, { description: { $regex: searchQuery, $options: "i" } }], active: true } : { active: true };

                // TODO: price range filter
                const products = await Product.find(search).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
                const total = await Product.countDocuments(search);

                return reply.send({
                    success: true,
                    meta: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit),
                    },
                    products,
                });
            } catch (err) {
                request.log.error(err);
                return reply.status(500).send({ success: false, message: "Failed to get products" });
            }
        }
    );

    // ---------------- GET SINGLE PRODUCT ----------------
    fastify.get(
        "/get-product",
        { schema: getProductSchema },
        async (request, reply) => {
            try {
                const { productId, id } = request.query;

                const result = await Product.findOne(id ? { _id: id } : { productId });

                return reply.send({ success: true, data: result });
            } catch (err) {
                request.log.error(err);
                return reply.status(500).send({ message: "Failed to get product" });
            }
        }
    );

    // ---------------- DELETE PRODUCT ----------------
    fastify.delete(
        "/delete-product",
        { schema: deleteProductSchema },
        async (request, reply) => {
            try {
                const { id } = request.body;

                // Delete from Mongo
                const deletedProduct = await Product.findByIdAndDelete(id);

                if (!deletedProduct) {
                    return reply.status(404).send({
                        success: false,
                        message: "Product not found"
                    });
                }

                // Delete from Pinata
                await pinata.files.public.delete([deletedProduct.imageId]);

                return reply.send({ success: true, message: "Product deleted successfully" });
            } catch (err) {
                request.log.error(err);
                return reply.status(500).send({ message: "Failed to delete product" });
            }
        }
    );
}
