import React, { useState, useEffect } from 'react';
import { bgstake, bnb } from '../assets';
import { Connect, Loader, Notification, StakingHistory } from '../components';
import { useStateContext } from '../context';


const Stake = () => {
  const { address, getUserStakes, staking, approveShares, getSharesBalance, isConnected } = useStateContext();
  const [duration, setDuration] = useState(30)
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchAmount = async () => {
      if (address) {
        try {
          const history = await getUserStakes(address)
          const balance = await getSharesBalance(address)
          setBalance(balance)
          setHistory(history);
        } catch (error) {
          showNotification('error', "Error fetching staked amount");
          console.error("Error fetching staked amount:", error);
        }
      }
    };

    fetchAmount();
  }, [address, getUserStakes, isConnected]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleStake = async () => {
    if (!address) {
      showNotification('error', "Please connect wallet");
      return;
    }

    const amountNumber = parseFloat(amount);

    if (!amount || isNaN(amountNumber) || amountNumber <= 0) {
      showNotification('error', "Please enter a valid amount to stake.");
      return;
    }

    if (amountNumber < 1) {
      showNotification('error', "Please stake more than 1 URA!");
      return;
    }

    let indexDuration;
    if (duration == 30) {
      indexDuration = 0;
    } else if (duration == 60) {
      indexDuration = 1;
    } else if (duration == 90) {
      indexDuration = 2;
    }

    try {
      setLoading(true);
      await approveShares(amount.toString())
      await staking(amount, indexDuration);
      setLoading(false);
      setAmount('')
      showNotification('success', `Successfully staked ${amountNumber} VinaSwap.`);
    } catch (error) {
      console.error(error);
      showNotification('error', "An error occurred while staking. Please make sure you have enough VinaSwap and URA.");
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const getMaturityDate = () => {
    const startDate = new Date();
    const maturityDate = new Date(startDate.setDate(startDate.getDate() + duration));
    const dd = String(maturityDate.getDate()).padStart(2, '0');
    const mm = String(maturityDate.getMonth() + 1).padStart(2, '0');
    const yyyy = maturityDate.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const getBonusPercentage = (duration) => {
    if (duration === 30) {
      return 5;
    } else if (duration === 60) {
      return 8;
    } else if (duration === 90) {
      return 17;
    } else {
      return 'N/A';
    }
  };

  return (
    <div>
      <div className="md:w-full w-10/12 mx-auto justify-center">
        {loading && <Loader />}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
        <h3 className='font-bold text-4xl text-center mb-4 text-gradient p-4'>Staking Dashboard</h3>
        <Connect />
        <div className='max-w-[700px] mx-auto'>
          <div className="max-w-[700px] mx-auto bg-opacity-50 shadow-md rounded-3xl p-6 text-white"
            style={{
              backgroundImage: `url(${bgstake}), linear-gradient(98deg, rgba(255, 255, 255, .4) -2.25%, rgba(187, 187, 187, 0) 112.47%)`, backgroundSize: 'cover', backgroundPosition: 'top center',
            }}
          >
            <div className="mb-4">
              <div className="flex items-center rounded-lg p-2 mr-2 mb-2">
                <span className="font-semibold">VinaSwap</span>
              </div>
              <input
                id="swap-amount-input"
                type='number'
                className="w-full p-2 border-b border-gray-500 text-2xl bg-opacity-50 bg-box text-white focus:outline-none"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="mb-6 w-full">
              <div className="flex justify-between gap-4">
                {[30, 60, 90].map((day) => (
                  <button
                    key={day}
                    onClick={() => setDuration(day)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 border-2 ${duration === day
                      ? 'bg-box text-white shadow-md scale-105'
                      : 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md'
                      }`}
                  >
                    {day} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col p-1 items-center justify-center h-18 bg-box border border-[#131313] rounded-lg">
                  <span className="text-left text-[12px] font-medium leading-3 p-2 pb-0">Current day</span>
                  <span className="text-left font-bold">{getCurrentDate()}</span>
                </div>
                <div className="flex flex-col p-1 items-center justify-center h-18 bg-box border border-[#131313] rounded-lg">
                  <span className="text-left text-[12px] font-medium leading-3 p-2 pb-0">Maturity Date</span>
                  <span className="text-left font-bold">{getMaturityDate()}</span>
                </div>
                <div className="flex flex-col p-1 items-center justify-center h-18 bg-box border border-[#131313] rounded-lg">
                  <span className="text-left text-[12px] font-medium leading-3 p-2 pb-0">Profit</span>
                  <span className="text-left font-bold">{getBonusPercentage(duration)}%</span>
                </div>
                <div className="flex flex-col p-1 items-center justify-center h-18 bg-box border border-[#131313] rounded-lg">
                  <span className="text-left text-[12px] font-medium leading-3 p-2 pb-0">VinaSwap Balance:</span>
                  <span className="text-left font-bold">{balance ? `${Number(balance).toFixed(0)} VinaSwap` : 'Loading...'}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            {address ? (
              <button
                className="mt-5 font-bold text-[16px] w-full text-white min-h-[40px] px-4 rounded-3xl bg-gradient-custom hover:bg-gradient-hover transition-all duration-700 ease-in-out"
                onClick={handleStake}
              >
                STAKE
              </button>
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
      <StakingHistory stakingHistory={history} />
    </div>
  );
};

export default Stake;
