import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to scroll to top smoothly with custom speed
  const scrollToTop = () => {
    let currentPosition = window.pageYOffset;
    const scrollStep = Math.ceil(currentPosition / 10); // Control the speed here
    const scrollInterval = setInterval(() => {
      if (currentPosition > 0) {
        window.scrollTo(0, currentPosition - scrollStep);
        currentPosition -= scrollStep;
      } else {
        clearInterval(scrollInterval);
      }
    }, 15); // Control the interval timing here (15ms)
  };

  useEffect(() => {
    // Function to handle scroll event
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="scroll-btn p-2 px-4 rounded-full shadow-lg text-black font-bold text-2xl transition duration-300"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollToTopButton;
