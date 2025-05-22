import { useEffect, useState } from "react";
import homeStore from "../store/homeStore";
import { ListItems, Pagination } from "../components";

export default function Home() {
  const { coins, fetchCoins } = homeStore((state) => ({
    coins: state.coins,
    fetchCoins: state.fetchCoins,
  }));

  const [filteredCoins, setFilteredCoins] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 20; 

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  useEffect(() => {
    setFilteredCoins(coins);
  }, [coins]);

  useEffect(() => {
    handleSearch();
  }, [query, coins]);

  const handleSearch = () => {
    if (query.trim() === "") {
      setFilteredCoins(coins);
    } else {
      const filtered = coins.filter((coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCoins(filtered);
    }
    setCurrentPage(1); // Reset to the first page on search
  };

  // Get current coins
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-16 min-h-screen">
      <h2 className="text-center text-gradient font-bold text-3xl mb-12">Top 100 Cryptocurrencies by Market Cap</h2>
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a token..."
          className="w-full md:w-1/2 p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="bg-gray-800 text-white font-medium p-2 rounded-t-lg md:grid md:grid-cols-5 grid grid-cols-2 gap-4">
        <div className="col-span-1 text-center text-xl">Token</div>
        <div className="col-span-1 text-center text-xl">Price (USD)</div>
        <div className="col-span-1 text-center hidden text-xl md:block">Market Cap</div>
        <div className="col-span-1 text-center hidden text-xl md:block">24h Volume</div>
        <div className="col-span-1 text-center hidden text-xl md:block">24h</div>
      </div>
      <div className="bg-gray-900 text-white rounded-b-lg">
        {currentCoins.length > 0 ? (
          currentCoins.map((coin) => (
            <ListItems key={coin.id} coin={coin} />
          ))
        ) : (
          <div className="text-center p-4 text-gray-400">Loading ...</div>
        )}
      </div>
      <Pagination
        coinsPerPage={coinsPerPage}
        totalCoins={filteredCoins.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
}
