import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { bnb, bgstake, ura, line } from '../assets';
import { Loader, Notification, FAQ, AddLiquidity } from '../components';
import { useStateContext } from '../context';
import { contract } from '../constants';
import showStore from "../store/showStore";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";



const DEX = () => {
  const { address, isConnected, swap, getVBTCPrice, approveVBTC, approveVNST, claim, claimBNB } = useStateContext();
  const [isLoading, setLoading] = useState(false);
  const [mode, setMode] = useState('buy');
  const [amountVNST, setAmountVNST] = useState('');
  const [amountVBTC, setAmountVBTC] = useState('');
  const [notification, setNotification] = useState(null);
  const [price, setPrice] = useState(0);

  const store = showStore();

  const { fetchData } = showStore((state) => ({
    detail: state.detail,
    graphData: state.graphData,
    error: state.error,
    fetchData: state.fetchData,
  }));
  useEffect(() => {
    fetchData('bitcoin');
  }, [fetchData]);

  useEffect(() => {
    const get = async () => {
      const price = await getVBTCPrice();
      setPrice(price);
    }
    get();
  }, [address, isConnected])

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === 'buy') {
        await approveVNST(amountVNST);
        await swap(contract.VNST, amountVNST)
      } else {
        await approveVBTC(amountVBTC);
        await swap(contract.VBTC, amountVBTC)
      }
    } catch (error) {
      showNotification('error', 'Insufficient balance or liquidity in pool!')
    }
    setLoading(false);
  };

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
  };

  const getVNST = async () => {
    setLoading(true);
    if (!address) {
      showNotification('error', "Please connect wallet!");
      setLoading(false);
      return;
    }
    await claim();
    setLoading(false);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = payload[0].payload.FullDate;
      return (
        <div className="custom-tooltip bg-gray-800 p-3 rounded-md text-white">
          <p className="label">{`${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`}</p>
          <p className="intro">{`Price: ${(Number(payload[0].value) / 1000).toFixed(0)} VNST`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${line}), url(${bgstake})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat',
        }}
      >
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
        <div className='flex w-full justify-center items-center'>
          <div className='flex md:flex-row flex-col items-start justify-between md:p-16 md:pr-2 py-8 md:w-full w-10/12'>
            <div className='m-auto flex justify-start flex-col mt-10 mf:mr-10 md:w-2/3 mb-0'>
              <div className='text-white font-extrabold text-3xl mb-4 text-gradient m-auto'>vBTC Price Chart </div>
              <div className='flex flex-col justify-between h-full'>
                <ResponsiveContainer width="100%" height={600}>
                  <AreaChart
                    data={store.graphData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(255, 255, 102)" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="rgb(255, 255, 204)" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="Time" stroke="#fff" />
                    <YAxis stroke="#fff" tickFormatter={(value) => `${(value / 1000).toFixed(0)}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="Price"
                      stroke="#8994d8"
                      fill="url(#colorUv)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className='flex flex-col items-center justify-start w-full md:w-1/3 mf:mt-0 mt-10'>

              <div className='mt-8 md:mt-3 p-5 sm:w-96 w-full flex flex-col justify-start items-center bg-black-gradient bg-opacity-75 rounded-xl'>
                <div className='flex flex-row items-center m-auto'>
                  <h2 className='md:text-3xl text-2xl font-bold text-lime-200	'>Buy vBTC</h2>
                </div>
                <div className='flex flex-col py-6 pl-0 rounded-lg w-full'>
                  <p className='text-white mb-1 text-center'>
                    A friendly way to own 0.001 BTC and your gateway to everything VinaSwap has to offer!
                  </p>

                </div>
                <div className='flex items-center justify-center py-4 pt-0 w-full space-x-4'>
                  <button
                    onClick={() => getVNST()}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-xl'
                  >
                    Get VNST token
                  </button>
                </div>

                <div className='mb-8 md:mb-3 p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-80 w-full my-3 eth-card white-glassmorphism'>
                  <div className='flex justify-between flex-col w-full h-full'>
                    <div className='flex justify-between items-start'>
                      <div className='flex flex-row items-center justify-between '>
                        <div className='w-10 h-10 rounded-full border-2 border-white flex justify-center items-center'>
                          <img src={bnb} alt="BNB logo" className="w-8 h-8" />
                        </div>
                        <span className='ml-2 text-white font-semibold'> VinaSwap </span>
                      </div>
                      <FaInfoCircle fontSize={17} color='#fff' />
                    </div>
                    <div>
                      {address ? (
                        <p className='text-white font-light text-sm'>
                          {shortenAddress(address)}
                        </p>
                      ) : (
                        <p className='text-white font-light text-sm'>
                          Please Connect Your Wallet
                        </p>
                      )}
                      <p className='text-white font-semibold text-lg mt-1'>Sepolia Testnet</p>
                    </div>
                  </div>
                </div>
                <w3m-button size='md' />
                <div className="w-full mx-auto mt-4 mb-4 p-6 bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-3xl shadow-2xl text-white relative overflow-hidden">
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-2xl" />
                  <p className='text-center mb-4'>Current Price: 1 vBTC = {price} VNST</p>
                  <div className="flex justify-between mb-6">
                    <button
                      className={`w-5/12 py-2 rounded-xl font-semibold transition-all ${mode === 'buy'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                        }`}
                      onClick={() => {
                        setMode('buy');
                        setAmountVNST('');
                        setAmountVBTC('');
                      }}
                    >
                      Buy vBTC
                    </button>
                    <button
                      className={`w-5/12 py-2 rounded-xl font-semibold transition-all ${mode === 'sell'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                        }`}
                      onClick={() => {
                        setMode('sell');
                        setAmountVNST('');
                        setAmountVBTC('');
                      }}
                    >
                      Sell vBTC
                    </button>
                  </div>

                  {mode === 'buy' ? (
                    <div className="space-y-5">
                      <div className="relative">
                        <input
                          type="number"
                          value={amountVNST}
                          onChange={(e) => setAmountVNST(e.target.value)}
                          placeholder="Enter VNST amount"
                          className="pl-12 w-full bg-gray-900 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="relative">
                        <input
                          type="number"
                          value={amountVBTC}
                          onChange={(e) => setAmountVBTC(e.target.value)}
                          placeholder="Enter vBTC amount"
                          className="pl-12 w-full bg-gray-900 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className='h-[1px] w-full bg-gray-400 my-2'></div>
                {address ? (
                  isLoading ? (
                    <div className='w-full'>
                      <Loader />
                      <button
                        type='button'
                        className='text-white bg-gradient hover:bg-gradient-hover w-full mt-2 p-2 rounded-full cursor-pointer font-bold'
                      >
                        LOADING ...
                      </button>
                    </div>
                  ) : (
                    <button
                      type='button'
                      onClick={handleSubmit}
                      className='text-white bg-gradient hover:bg-gradient-hover w-full mt-2 p-2 rounded-full cursor-pointer font-bold'
                    >
                      Submit
                    </button>
                  )
                ) : (
                  <button
                    className="mt-5 font-semibold text-[16px] w-full text-white min-h-[40px] px-4 rounded-3xl bg-gradient-hover transition-all duration-700 ease-in-out cursor-default	"
                  >
                    Please Connect Your Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddLiquidity />
      <FAQ />
    </div>

  );
};

export default DEX;
