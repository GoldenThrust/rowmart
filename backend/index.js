import "dotenv/config"
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PinataSDK } from "pinata"

import mongoosePlugin from "./plugins/mongoosePlugin.js"
import ethersPlugin from "./plugins/ethersPlugin.js"
import productRoutes from "./routes/productsRoute.js"
import transactionRoute from "./routes/transactionRoute.js"

const isDev = process.env.DEV === "true";

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

fastify.register(import('fastify-mailer'), {
  defaults: { from: process.env.MAIL_FROM },
  transport: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    ...(isDev ? {
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    } : {
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    }),
  }
})

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


fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`);
})