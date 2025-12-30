import { useState } from "react";

export default function ProductDetails({
  disableSubmit,
  product,
  buyProduct,
  defaultEmail,
}: {
  disableSubmit: boolean;
  product: any;
  buyProduct: (
    product: any,
    quantity: number,
    sellerEmail: string,
    price: Number
  ) => void;
  defaultEmail: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState<string>(defaultEmail);

  const price = quantity * product.price;

  return (
    <div
      className="relative bg-neutral-950 rounded-2xl shadow-xl
                w-full max-w-3xl max-h-[90vh] flex flex-col overflow-scroll"
    >
      {/* Image */}
      <div className="shrink-0">
        <img
          src={`https://ipfs.io/ipfs/${product.imageCid}`}
          alt={product.name}
          className="w-full h-72 object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title + Price */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-stone-400">{product.name}</h2>
          <div className="flex flex-col gap-3 items-end ">
            <span className="flex items-center gap-2 text-sm text-gray-500 *:border-2 *:border-gray-600 *:p-1 *:rounded-lg">
              <span
                className="select-none"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </span>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="select-none w-10 p-5 text-center"
              />

              <span
                className="select-none"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </span>
            </span>

            <span className="text-xl font-semibold text-emerald-600">
              {price} MNEE
            </span>
          </div>
        </div>

        {/* Buyer Email */}
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="buyer-email"
        >
          Buyer Email
        </label>
        <input
          type="text"
          id="buyer-email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter you email"
        />

        {/* Actions */}
        <div className="py-5 flex gap-3">
          <button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition"
            onClick={() => buyProduct(product, quantity, email, price)}
            disabled={disableSubmit}
          >
            {disableSubmit ? "Processing Transaction" : "Buy Now"}
          </button>

          <a
            href={`mailto:${product.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 border justify-center items-center border-gray-300 hover:bg-gray-100 hover:text-gray-900 py-3 rounded-xl font-semibold transition"
          >
            Contact Seller
          </a>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {product.description}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit similique
          recusandae doloribus velit ut sint distinctio soluta iure aliquam,
          totam magnam unde aspernatur! Odio consequatur optio sed nihil
          consequuntur iure. Harum, esse recusandae. Ex, officiis cumque saepe
          commodi explicabo consequatur vero consequuntur, suscipit rem
          provident fugiat aliquam, dolorem aspernatur maxime cupiditate ut
          atque ab ratione adipisci quasi fuga repudiandae dolores! Sint
          deserunt omnis atque eum, minus nam laudantium libero delectus natus,
          ad praesentium odio doloremque. Optio, laudantium temporibus quasi,
          tempora nostrum exercitationem aspernatur perspiciatis fuga deserunt
          ad, amet unde. Fugiat? Corporis ea culpa omnis laudantium itaque alias
          eos eius dolores earum. Minima id molestias tempora, explicabo non
          suscipit cumque exercitationem. Rerum, maiores animi! Vero distinctio
          nihil ea nesciunt dicta vitae? Voluptatum tempora deserunt commodi
          dolorum? Nihil quis libero, molestias rem porro assumenda facere
          voluptatem, facilis ex aliquid optio animi, mollitia expedita
          similique voluptatum delectus pariatur voluptatibus tempore deserunt
          error dolor? Quas qui officia odit non. Obcaecati reiciendis sint
          itaque officiis omnis culpa, hic consectetur non asperiores
          exercitationem iure vel, illum perspiciatis consequuntur nihil neque
          officia et voluptate, laborum ipsa atque? Non magnam omnis nostrum cum
          nisi explicabo exercitationem reiciendis recusandae consequuntur,
          repellat consequatur eaque sed optio illo veritatis, nobis, deserunt
          in dolorum rem eius odit mollitia quia! Culpa, similique tempora.
          Velit dolorum voluptates rem perspiciatis porro quidem aliquam odio
          autem incidunt repudiandae nesciunt nulla et nisi nam, sed officiis
          tempora explicabo possimus tempore enim placeat alias illum corrupti?
          Iusto, suscipit? Aperiam sint recusandae et! Praesentium officia
          explicabo quae animi perferendis quaerat expedita minus. Saepe
          quisquam, blanditiis itaque distinctio magni accusantium accusamus
          dolore molestiae voluptates architecto cumque nesciunt in repellat
          temporibus! Harum reiciendis, cum ab, nobis tempore doloribus soluta
          error nam, maxime amet at? Quae quaerat vitae ullam deserunt magnam
          nesciunt sequi qui ipsa at, eligendi aspernatur? Consequuntur commodi
          eum quasi! Quibusdam enim, ex rem ratione maxime cum quaerat. Maiores
          iste laborum quibusdam at voluptatum repudiandae? Repellendus vero
          nesciunt consectetur non inventore accusantium. Aliquid sapiente sed
          provident! Corrupti harum modi nemo. Distinctio perferendis fuga atque
          esse sequi deleniti labore placeat facilis minima, vel quidem iste
          culpa saepe veritatis, ea, nisi laboriosam ipsa harum aspernatur ipsam
          amet! Labore deserunt sint modi veniam! Et, eligendi sapiente. Nihil
          obcaecati accusamus sapiente explicabo reprehenderit autem, voluptate
          ullam? Unde in minus fugiat iure, cumque, dolore saepe minima deleniti
          ipsa quas, beatae dolorum suscipit magnam esse similique! Recusandae
          quasi iure nemo vero deserunt soluta unde adipisci, vitae velit
          provident incidunt sint aliquam eius sapiente libero iste! Mollitia,
          velit. Earum impedit deleniti veritatis porro, incidunt sapiente vel
          cumque! Quibusdam ratione deserunt blanditiis, ab hic inventore nisi
          natus nemo, pariatur mollitia sequi cum, minus quas quaerat ad aperiam
          saepe impedit nam reiciendis sapiente. Aspernatur suscipit ratione cum
          eligendi deserunt. Magnam itaque error, quisquam ab, doloribus autem
          eius temporibus nemo excepturi vero vitae quos similique nihil ducimus
          a voluptatem? Voluptas perferendis culpa in consequatur ipsam expedita
          molestiae odio ipsum commodi. Delectus ratione reiciendis minima ex
          laboriosam tenetur, quisquam animi, tempora recusandae minus ipsum et
          dolorem tempore accusantium non sunt voluptatum veniam quia nostrum
          sapiente maiores saepe. Atque quidem rerum recusandae? Temporibus est
          tempore at placeat delectus rerum velit eveniet. Esse repellat
          perspiciatis odio ipsam! Sequi aspernatur tenetur pariatur minus alias
          eos accusamus placeat at debitis ullam, id doloremque, rerum officia?
          Eius labore repudiandae voluptatem explicabo veritatis laborum
          architecto delectus, dolore officia? Sit accusamus consequuntur, optio
          nisi, sunt culpa, recusandae quasi odit deleniti veritatis adipisci
          voluptas unde. Earum deleniti libero exercitationem.
        </p>

        {/* Seller Info */}
        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <p className="font-medium text-gray-700">Seller Address</p>
            <p className="truncate">{product.seller}</p>
          </div>

          <div>
            <p className="font-medium text-gray-700">Contact</p>
            <p className="truncate">{product.email}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <p className="font-medium text-gray-700">Product ID</p>
            <p className="truncate">{product.productId}</p>
          </div>

          <div>
            <p className="font-medium text-gray-700">Created</p>
            <p>{new Date(product.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
