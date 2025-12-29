import "dotenv/config"
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PinataSDK } from "pinata"

import "dotenv/config"
import mongoosePlugin from "./plugins/mongoosePlugin.js"
import ethersPlugin from "./plugins/ethersPlugin.js"
import productRoutes from "./routes/productsRoute.js"

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

fastify.register(mongoosePlugin, {
  uri: process.env.MONGO_URI,
});

fastify.register(ethersPlugin, {
  rpcUrl: process.env.RPC_URL,
});

fastify.register(productRoutes, { pinata });

fastify.get('/', function (_, reply) {
  reply.send({ hello: 'world' })
})


fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`);
})