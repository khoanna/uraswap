import React, { useEffect } from 'react';

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Adjusted to account for the fade-out animation duration
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type === 'error' ? 'bg-red-900' : 'bg-green-600'} text-white z-50`}>
      <div className="flex items-center">
        {type === 'error' ? (
          <span className="mr-2">❌</span>
        ) : (
          <span className="mr-2">✅</span>
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
