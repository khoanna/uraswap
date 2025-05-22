import React from "react";
import styles from "./style";
import { Footer, Navbar, ScrollToTopButton } from "./components";
import { Route, Routes } from 'react-router-dom';
import { Home, Details, Market, DEX, Stake, DAO, Lending } from "./pages";

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

const projectId = '7bbd39afae0aeb76fbab8d37c4ba7058'

const sepolia = {
  chainId: 11155111,
  name: 'Ethereum Sepolia Testnet',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io/',
  rpcUrl: 'https://sepolia.infura.io/v3/cdee506402574d488a064f4239c4c30b' 
}


const metadata = {
  name: 'VinaSwap',
  description: 'VinaSwap',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  defaultChainId: 97
})

const modal = createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableSwaps: false,
  enableAnalytics: true
})


const App = () => (
  <div className="bg-primary w-full overflow-hidden">
    <ScrollToTopButton />
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
      </div>
    </div>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/market" element={<Market />} />
      <Route path="/market/:id" element={<Details />} />
      <Route path="/DEX" element={<DEX />} />
      <Route path="/stake" element={<Stake />} />
      <Route path="/dao" element={<DAO />} />
      <Route path="/vault" element={<Lending />} />
    </Routes>

    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Footer />
      </div>
    </div>
  </div>
);

export default App;
