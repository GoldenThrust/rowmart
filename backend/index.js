import "dotenv/config"
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PinataSDK } from "pinata"

import mongoosePlugin from "./plugins/mongoosePlugin.js"
import ethersPlugin from "./plugins/ethersPlugin.js"
import productRoutes from "./routes/productsRoute.js"
import transactionRoute from "./routes/transactionRoute.js"
import Product from "./models/product.js"
import mailerPlugin from "./plugins/mailer.js"

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY_URL
})


const fastify = Fastify({
  logger: {
    file: "log.txt",
  },
})

fastify.decorate("pinata", pinata)

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

fastify.register(mailerPlugin);

fastify.register(mongoosePlugin, {
  uri: process.env.MONGO_URI,
});

fastify.register(ethersPlugin, {
  rpcUrl: process.env.RPC_URL,
});

fastify.register(productRoutes);
fastify.register(transactionRoute);

fastify.get("/health", async () => {
  return { status: "ok" };
});

fastify.get('/', function (_, reply) {
  reply.send({ hello: 'world' })
})

fastify.get("/send-mail", async (_, reply) => {
  const { mailservice } = fastify;

  const product = await Product.find({ productId: 1 });

  await mailservice.sendProductCreationMail("adenijiolajid01@gmail.com", "John", product);
  return reply.send({ success: true })
})

fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`);
})