import React, { useEffect, useState } from "react";

const Countdown = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center items-center space-x-4 text-white text-3xl font-bold bg-gradient p-4 mb-4 rounded-lg shadow-lg">
      <div className="flex flex-col items-center">
        <span className="text-5xl">{timeLeft.days}</span>
        <span className="text-sm">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-5xl">{timeLeft.hours}</span>
        <span className="text-sm">Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-5xl">{timeLeft.minutes}</span>
        <span className="text-sm">Minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-5xl">{timeLeft.seconds}</span>
        <span className="text-sm">Seconds</span>
      </div>
    </div>
  );
};

export default Countdown;
