import { create } from 'zustand';
import axios from 'axios';


const showStore = create((set) => ({
  graphData: [],
  detail: {},
  error: null,

  fetchData: async (id, retries = 3, delay = 1000) => {
    try {
      const res = await axios.get('https://ura-server.vercel.app/api/v3/coins', {
        params: { id }
      });

      const data = res.data.market_data.sparkline_7d.price.map((price, index) => ({
        Time: new Date(Date.now() - ((res.data.market_data.sparkline_7d.price.length - index) * 60 * 60 * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        FullDate: new Date(Date.now() - ((res.data.market_data.sparkline_7d.price.length - index) * 60 * 60 * 1000)),
        Price: price,
      }));
      set({ graphData: data });

      const detail = {
        img: res.data.image.large,
        name: res.data.name,
        symbol: res.data.symbol ? res.data.symbol.toUpperCase() : '', // Ensure symbol is available
        circulating_supply: res.data.market_data.circulating_supply,
        total_supply: res.data.market_data.total_supply,
        current_price: res.data.market_data.current_price.usd,
        total_volume: res.data.market_data.total_volume.usd,
        market_cap: res.data.market_data.market_cap.usd,
        ath: res.data.market_data.ath.usd,
        homePage: res.data.links.homepage,
        des: res.data.description.en
      };

      set({ detail, error: null });

    } catch (error) {
      if (error.response) {
        // Handle server response errors
        if (error.response.status === 429 && retries > 0) {
          console.warn('Too many requests. Retrying after delay...');
          setTimeout(() => showStore.getState().fetchData(id, retries - 1, delay * 2), delay); // Double the delay time
        } else {
          set({ error: error.message });
          console.error('Error fetching data:', error.response.data);
        }
      } else if (error.request) {
        // Handle no response from the server
        console.error('Error request:', error.request);
        set({ error: "No response received from the server." });
      } else {
        // Handle other errors during setup
        console.error('Error message:', error.message);
        set({ error: error.message });
      }
    }
  },

}));

export default showStore;
