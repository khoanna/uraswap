import { Link } from "react-router-dom";

export default function ListItems({ coin }) {
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 });
  };
  
  return (
    <Link to={`/market/${coin.id}`} className="grid grid-cols-4 md:grid-cols-5 gap-4 items-center p-2 md:p-4 mb-2 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-300">
      <div className="grid grid-cols-3 md-grid-cols-auto flex items-center space-x-3 md:space-x-4 col-span-2 md:col-span-1">
        <div className="w-[24px] h-[24px] md:w-10 md:h-10 col-span-1">
          <img src={coin.image} alt={`${coin.name} logo`} className="w-full h-full object-cover rounded-full" />
        </div>
        <span className="text-white md:text-lg text-sm font-medium truncate col-span-2">{coin.name}</span>
      </div>
      <div className="text-white text-right md:text-center col-span-2 md:col-span-1">${formatPrice(coin.priceUsd)}</div>
      <div className="text-white text-center col-span-1 hidden md:block">${coin.cap.toLocaleString()}</div>
      <div className="text-white text-center col-span-1 hidden md:block">${coin.volume.toLocaleString()}</div>
      <div className={`text-center col-span-1 hidden md:block ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {coin.change >= 0 ? `+${coin.change.toFixed(2)}%` : `${coin.change.toFixed(2)}%`}
      </div>
    </Link>
  );
}
