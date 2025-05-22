import React, { useState } from 'react';
import { useStateContext } from '../context';
import Loader from './Loader';

const AddLiquidity = () => {
  const { addLiquidity, getVBTCPrice, removeLiquidity } = useStateContext();

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('add');
  const [vbtc, setVbtc] = useState('');
  const [shares, setShares] = useState('');
  const [VNST, setVNST] = useState(0);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    try {
      setLoading(true);
      setError('');
      await addLiquidity(VNST, vbtc);
    } catch (err) {
      console.error(err);
      setError('Insufficient balance!');
    }
    setLoading(false);

  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      setError('');
      await removeLiquidity(shares);
    } catch (err) {
      console.error(err);
      setError('Insufficient balance!');
    }
    setLoading(false);
  };

  return (
    <div className="mt-24 py-12 px-4 flex items-center justify-center">
      {loading && <Loader />}
      <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Manage Liquidity</h2>
          <div className="bg-gray-700 p-1 rounded-full flex">
            <button
              onClick={() => {
                setMode('add');
                setError('');
              }}
              className={`px-4 py-1 rounded-full text-sm font-medium ${mode === 'add' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
            >
              Add
            </button>
            <button
              onClick={() => {
                setMode('remove');
                setError('');
              }}
              className={`px-4 py-1 rounded-full text-sm font-medium ${mode === 'remove' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
            >
              Remove
            </button>
          </div>
        </div>

        {/* 🔻 Hiển thị lỗi nếu có */}
        {error && (
          <div className="mb-4 text-red-400 bg-red-900/30 border border-red-500 px-4 py-2 rounded-md text-sm">
            ⚠ {error}
          </div>
        )}

        {mode === 'add' ? (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-300">vBTC Amount</label>
              <input
                type="number"
                onChange={async (e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    const price = await getVBTCPrice();
                    setVbtc(val);
                    setVNST(val * price);
                  }
                }}
                value={vbtc}
                className="mt-1 w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">VNST Amount</label>
              <input
                type="number"
                value={VNST}
                className="mt-1 w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
                disabled={true}
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full bg-purple-600 hover:bg-purple-700 transition-all text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              Confirm Add
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-300">VinaSwap Token to Remove</label>
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                className="mt-1 w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="0.00"
              />
            </div>
            <button
              onClick={handleRemove}
              className="w-full bg-red-600 hover:bg-red-700 transition-all text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              Confirm Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddLiquidity;
