import fp from "fastify-plugin";
import mongoose from "mongoose";

const mongoosePlugin = fp(async (fastify, options) => {
  const { uri } = options;

  try {
    mongoose.connection.on('connected', () => console.log('mongoose connected'));
    mongoose.connection.on('open', () => console.log('mongoose open'));
    mongoose.connection.on('disconnected', () => console.log('mongoose disconnected'));
    mongoose.connection.on('reconnected', () => console.log('mongoose reconnected'));
    mongoose.connection.on('disconnecting', () => console.log('mongoose disconnecting'));
    mongoose.connection.on('close', () => console.log('close'));
    await mongoose.connect(uri, {
      autoIndex: false,
      maxPoolSize: 10,
    });

    fastify.log.info("MongoDB connected");

    fastify.decorate("mongoose", mongoose);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.addHook("onClose", async () => {
    await mongoose.connection.close();
  });
});

export default mongoosePlugin;