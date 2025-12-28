import fp from "fastify-plugin";
import { JsonRpcProvider } from "ethers";

export default fp(async function (fastify, opts) {
    const provider = new JsonRpcProvider(opts.rpcUrl);

    // Verify connection
    await provider.getBlockNumber();

    fastify.decorate("ethers", { provider });

    fastify.log.info("Ethers provider connected");

    fastify.addHook("onClose", async () => {
        if (provider.destroy) {
            provider.destroy();
        }
    });
});
