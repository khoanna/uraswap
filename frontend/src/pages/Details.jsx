import { useEffect } from "react";
import showStore from "../store/showStore";
import { useParams } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { bg, arrowUp } from "../assets";

function addTargetBlankToLinks(html) {
  if (html) {
    return html.replace(
      /<a\s+(?![^>]*\s+target=["']_blank["'])([^>]*)>/gi,
      '<a target="_blank" $1>'
    );
  }
}

const gradientColors = "linearGradient(0, rgba(186, 198, 51, 0.8), rgba(186, 198, 51, 0.2))";

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(number);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = payload[0].payload.FullDate;
    return (
      <div className="custom-tooltip bg-gray-800 p-3 rounded-md text-white">
        <p className="label">{`${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`}</p>
        <p className="intro">{`Price: $${formatNumber(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

export default function Show() {
  const store = showStore();
  const { id } = useParams();
  const { fetchData } = showStore((state) => ({
    detail: state.detail,
    graphData: state.graphData,
    error: state.error,
    fetchData: state.fetchData,
  }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id, fetchData]);

  const { img, ath, des, homePage, name, symbol, circulating_supply, total_supply, current_price, total_volume, market_cap, logo } = store.detail;

  const descriptionHtml = addTargetBlankToLinks(des);

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-16 text-white flex flex-col md:flex-row" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
        <div className="w-full md:w-1/3 p-4 md:p-6 rounded-lg mb-6 md:mr-6 flex flex-col justify-around bg-opacity-60 ">
          <div className="flex flex-row justify-between">
            <div className="text-center mb-4 md:mb-6 flex  items-center">
              <img src={img} alt={`${name} logo`} className="inline-block w-8 h-8 rounded-full mr-2" />
              <h2 className="inline-block text-gradient font-bold text-xl">
                {name} - {symbol && (
                  <span className="coin-symbol">{symbol ? symbol.toUpperCase() : 'Loading...'}</span>
                )}
              </h2>
            </div>
            <h2 className="font-bold text-xl text-amber-300">${formatNumber(current_price)}</h2>
          </div>
          <div className="space-y-3 md:space-y-5">
            <div className="flex justify-between">
              <h3 className="text-lg md:text-xl font-semibold">Market Cap</h3>
              <p className="text-lg md:text-xl">${formatNumber(market_cap)}</p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-lg md:text-xl font-semibold">Total Volume - 24h</h3>
              <p className="text-lg md:text-xl">${formatNumber(total_volume)}</p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-lg md:text-xl font-semibold">Circulating Supply</h3>
              <p className="text-lg md:text-xl">{formatNumber(circulating_supply)} {symbol ? symbol.toUpperCase() : 'Loading...'}</p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-lg md:text-xl font-semibold">Total Supply</h3>
              <p className="text-lg md:text-xl">{formatNumber(total_supply)} {symbol ? symbol.toUpperCase() : 'Loading...'}</p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-lg md:text-xl font-semibold">All Time High</h3>
              <p className="text-lg md:text-xl">${formatNumber(ath)}</p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-lg md:text-xl font-semibold">Website</h3>
              <a
                href={homePage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-xl flex items-center text-cyan-500"
              >
                Visit
                <img src={arrowUp} alt="arrow" className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3 p-4 rounded-lg bg-opacity-60">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Price Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
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
              <YAxis stroke="#fff" />
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
      <div className="p-8 pt-4 bg-opacity-75 rounded-lg text-white">
        <h3 className="text-xl font-semibold mb-4">Description</h3>
        <div className="text-white description">
          {descriptionHtml ? (
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          ) : (
            <p>We apologize for the inconvenience, but a detailed description for this cryptocurrency is currently unavailable. Rest assured, we are diligently working to gather and update the latest information so you can gain a comprehensive understanding of this digital asset. In the meantime, please check back often to stay informed about any important updates. Thank you for your patience and continued interest in our project!</p>)}
        </div>
      </div>
    </div>
  );
}
