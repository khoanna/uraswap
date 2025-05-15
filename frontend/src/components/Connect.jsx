import React from 'react';
import { useStateContext } from '../context';
import { FaWallet } from 'react-icons/fa';

const WalletConnect = ({ handleStake }) => {
  const { connectWallet, address } = useStateContext();
  const formatAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  return (
    <div className="flex flex-row items-center p-2 justify-between md:w-full mx-auto max-w-[700px] text-white">
      <div className="flex items-center m-auto w-1/2">
        <FaWallet size={30} className="mr-3 text-purple-500" />
        <div className="md:text-2xl text-xl font-extrabold">Welcome back!</div>
      </div>
      <div className="w-1/2 flex justify-end">
        <w3m-button/>
      </div>
    </div>
  );
};

export default WalletConnect;
