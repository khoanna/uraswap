const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/v3/coins/markets', async (req, res) => {
  const options = { method: 'GET', headers: { accept: 'application/json' } };

  fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=CG-xykjMEZj36TM3KpoVQXLr91x', options)
    .then(response => response.json())
    .then(response => res.json(response))
    .catch(err => console.error(err));
});

app.get('/api/v3/coins', async (req, res) => {  
  const { id } = req.query;
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-xykjMEZj36TM3KpoVQXLr91x' }
  };

  fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=true&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`, options)
    .then(response => response.json())
    .then(response => res.json(response))
    .catch(err => console.error(err));
});


app.listen(3001, () => console.log('Proxy server running on port 3001'));
