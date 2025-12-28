import "dotenv/config"
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PinataSDK } from "pinata"
import { createProductSchema, deleteProductSchema, getProductSchema } from "./schemas/product.schema.js"
import { buffer } from "stream/consumers"
import { v4 } from "uuid"


const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL
})


const fastify = Fastify({
  logger: {
    file: "logger.txt",
  },
})

await fastify.register(cors, {
  origin: [process.env.CLIENT_URL],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})


await fastify.register(import('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
})

await fastify.register(import('@fastify/multipart'), {
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
})


fastify.get('/', function (_, reply) {
  reply.send({ hello: 'world' })
})

fastify.post(
  "/create-product",
  {
    schema: createProductSchema,
    preValidation: async (request, reply) => {
      if (!request.isMultipart()) return;

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
        return reply.status(400).send({ error: "Image file required" });
      }

      request.body = {
        ...fields,
        file: {
          buffer: fileBuffer,
          metadata: fileMeta
        }
      };
    },
  },
  async (request, reply) => {
    try {
      let { file: image, ...fields } = request.body;

      const file = new File([image.buffer], v4(), {
        type: image.metadata.mimetype,
      });

      const { id, cid } = await pinata.upload.public.file(file).keyvalues(fields);

      return reply.send({
        id, cid
      });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ error: "Upload failed" });
    }
  }
);


fastify.get(
  "/get-product",
  { schema: getProductSchema },
  async (request, reply) => {
    try {
      const { cid } = request.params;

      const result = await pinata.files.public
        .list()
        .cid(cid)

      return reply.send({
        success: true,
        data: result,
        message: "Product retrieved successfully",
      });
    } catch (err) {
      request.log.error(err);

      if (err?.response?.status === 404) {
        return reply.send({
          success: true,
          message: "Product already deleted",
        });
      }

      return reply.status(500).send({
        error: "Failed to delete product",
      });
    }
  }
);

fastify.delete(
  "/delete-product",
  { schema: deleteProductSchema },
  async (request, reply) => {
    try {
      const { id } = request.body;

      await pinata.files.public.delete([id]);

      return reply.send({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      request.log.error(err);

      if (err?.response?.status === 404) {
        return reply.send({
          success: true,
          message: "Product already deleted",
        });
      }

      return reply.status(500).send({
        error: "Failed to delete product",
      });
    }
  }
);


fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`);
})