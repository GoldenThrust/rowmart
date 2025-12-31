import fp from "fastify-plugin";
import { listenToEvents } from "../contract/services/Eventlistener.js";
import { Contract } from "ethers";
import { JsonRpcProvider } from "ethers";
import { MarketplaceContractConfig } from "../contract/marketPlace.js";
import MailService from "../services/mailService.js";

const ethersPlugin = fp(async function (fastify, opts) {
    const provider = new JsonRpcProvider(opts.rpcUrl);
    // const provider = new WebsocketProvider(opts.rpcUrl);

    // Verify connection
    await provider.getBlockNumber();

    const contract = new Contract(
        ...MarketplaceContractConfig,
        provider
    );

    fastify.decorate("ethers", { provider, contract });

    fastify.decorate("mailservice", (new MailService(fastify.mailer, "RowMart")));

    listenToEvents(fastify);

    fastify.log.info("Ethers provider connected");

    fastify.addHook("onClose", async () => {
        if (provider.destroy) {
            provider.destroy();
        }
    });
});

export default ethersPlugin;