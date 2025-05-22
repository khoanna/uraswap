import React from 'react';

const Metrics = ({ fearGreedIndex, marketCap }) => (
  <section className="py-5 px-4">
    <div className="max-w-7xl mx-auto text-center text-white">
      <h2 className="text-3xl font-bold mb-6">Market Metrics</h2>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-semibold">Fear & Greed Index</h3>
          <p className="text-lg">{fearGreedIndex}</p>
        </div>
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-semibold">Market Capitalization</h3>
          <p className="text-lg">{marketCap}</p>
        </div>
      </div>
    </div>
  </section>
);

export default Metrics;
