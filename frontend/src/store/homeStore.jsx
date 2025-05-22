import { create } from "zustand";
import axios from "axios";

const homeStore = create((set) => ({
  coins: [],

  fetchCoins: async () => {
    try {
      // Lấy dữ liệu đồng coin từ máy chủ proxy
      const response = await axios.get("https://ura-server.vercel.app/api/v3/coins/markets");
      // Xử lý dữ liệu trả về
      const coins = response.data.map((coin) => ({
        id: coin.id,
        name: coin.name,
        image: coin.image,
        priceUsd: coin.current_price.toFixed(6), 
        cap: coin.market_cap,
        volume: coin.total_volume,
        supply: coin.circulating_supply,
        change: coin.price_change_percentage_24h
      }));

      // Cập nhật state
      set({ coins });
    } catch (error) {
      console.error("Error fetching coins:", error.message);
    }
  },
}));

export default homeStore;
