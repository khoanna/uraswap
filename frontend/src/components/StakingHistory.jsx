import React, { useState } from 'react';
import { useStateContext } from '../context';
import Loader from './Loader';
const StakingHistory = ({ stakingHistory }) => {
  const [loading, setLoading] = useState(false);
  const { withdraw } = useStateContext();

  const getDurationDays = (duration) => {
    switch (duration) {
      case 0: return 30;
      case 1: return 60;
      case 2: return 90;
      default: return 0;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatEndDate = (timestamp, add) => {
    const date = new Date(Number(timestamp) * 1000);
    date.setDate(date.getDate() + add);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getBonusPercentage = (duration) => {
    if (duration === 30) {
      return 5 / 100;
    } else if (duration === 60) {
      return 8 / 100;
    } else if (duration === 90) {
      return 17 / 100;
    } else {
      return 0;
    }
  };

  const handleWithdraw = async (index) => {
    try {
      setLoading(true);
      await withdraw(index);
      setLoading(false);
    } catch (err) {
      console.log("Error", err);
    }
  }

  return (
    <div className="w-full mx-auto justify-center p-16">
      {loading && <Loader />}
      <div className="text-white text-2xl font-extrabold text-center mb-6">Your Staking History</div>
      <div className='mx-auto'>
        <div className="overflow-x-auto">
          <table className="w-full text-center border border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                <th className="p-4">Start Date</th>
                <th className="p-4">End Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Estimated</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {stakingHistory?.length > 0 ? stakingHistory.map((stake, index) => {

                return (
                  <tr key={index} className="bg-gray-900 text-white hover:bg-gray-800">
                    <td className="p-4">{formatDate(stake.startTime)}</td>
                    <td className="p-4">{formatEndDate(stake.startTime, getDurationDays(Number(stake.duration)))}</td>
                    <td className="p-4">{Number(stake.amount)} VinaSwap</td>
                    <td className="p-4">{(Number(stake.amount) * ( getBonusPercentage(getDurationDays(Number(stake.duration))))).toFixed(0)} VNST</td>
                    <td className="p-4">
                      {(() => {
                        const withdrawDate = new Date(Number(stake.startTime) * 1000);
                        withdrawDate.setDate(withdrawDate.getDate() + getDurationDays(Number(stake.duration)));
                        const unixTime = Math.floor(withdrawDate.getTime() / 1000);
                        const currentTime = Math.floor(Date.now() / 1000);
                        const canWithdraw = !stake.withdrawn && currentTime >= unixTime;

                        if (canWithdraw) {
                          return (
                            <button
                              onClick={() => handleWithdraw(index)}
                              className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200"
                            >
                              Withdraw
                            </button>
                          );
                        } else {
                          return (
                            <button
                              disabled
                              className="bg-gray-600 text-white py-2 px-4 rounded-lg opacity-60 cursor-not-allowed"
                            >
                              {stake.withdrawn ? "Withdrawn" : "Locked"}
                            </button>
                          );
                        }
                      })()}
                    </td>

                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center">No staking history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StakingHistory;
