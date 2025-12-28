import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { Toaster } from 'react-hot-toast';
import axios from "axios";
import "./index.css";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: "#102e43ff",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <App />
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
