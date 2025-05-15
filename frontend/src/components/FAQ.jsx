import React, { useState } from 'react';

const FAQSection = () => {
  const [isOpen, setIsOpen] = useState(Array(5).fill(false));

  const toggleAnswer = (index) => {
    setIsOpen(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div>
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
            {[1, 2, 3, 4, 5].map(index => (
              <div
                key={index}
                className="transition-all duration-200 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg cursor-pointer hover:bg-gray-700"
              >
                <button
                  type="button"
                  onClick={() => toggleAnswer(index - 1)}
                  className="flex items-center justify-between w-full px-4 py-5 sm:p-6 text-white"
                >
                  <span className="flex text-lg font-semibold">
                    {index === 1 && 'What is VNST and how does it work?'}
                    {index === 2 && 'How is vBTC different from regular Bitcoin?'}
                    {index === 3 && 'Can I trade VNST and vBTC anytime?'}
                    {index === 4 && 'How can VNST help new users enter the crypto space?'}
                    {index === 5 && 'What can I do with vBTC and VNST on the VinaSwap platform?'}
                  </span>
                  <svg
                    className={`w-6 h-6 text-white transition-transform transform ${isOpen[index - 1] ? 'rotate-0' : 'rotate-180'
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  style={{ display: isOpen[index - 1] ? 'block' : 'none' }}
                  className="px-4 pb-5 sm:px-6 sm:pb-6 text-white"
                >
                  <p>
                    {index === 1 &&
                      "VNST is a stable digital asset designed for fast, secure, and 24/7 transactions. It's ideal for storing value and acts as a bridge between traditional finance and crypto, making it perfect for both beginners and experienced users."}
                    {index === 2 &&
                      "Unlike regular BTC, which uses long decimal values, vBTC represents whole-number ownership of Bitcoin. Each vBTC equals 0.001 BTC, making it easier to use, trade, and understand."}
                    {index === 3 &&
                      "Yes! Both VNST and vBTC are available for trading anytime on supported platforms, including VinaSwap. Our ecosystem ensures liquidity and fast transaction processing around the clock."}
                    {index === 4 &&
                      "VNST lowers the entry barrier by providing a stable and easy-to-use asset. New users can start exploring DeFi, trading, or saving without dealing with the price volatility of other cryptocurrencies."}
                    {index === 5 &&
                      "You can use VNST and vBTC to trade, stake, earn yield, and participate in DeFi services across the VinaSwap ecosystem. They're key assets that power our financial tools and community-driven features."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQSection;
