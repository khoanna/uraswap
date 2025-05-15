import { more } from "../constants";
import styles from "../style";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer"; // Import đúng cách

const FeatureCard = ({ icon, title, content, index }) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const [inViewRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView, index]);


  // Kết hợp ref với inViewRef
  const setRefs = (node) => {
    ref.current = node;
    inViewRef(node);
  };

  return (
    <motion.div
      ref={setRefs}
      initial="hidden"
      animate={controls}
      className={`flex flex-row p-6 rounded-[20px] ${index !== more.length - 1 ? "mb-6" : "mb-0"} feature-card`}
    >

      <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
        <img src={icon} alt={title} className="w-[50%] h-[50%] object-contain" />
      </div>
      <div className="flex-1 flex flex-col ml-3">
        <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1">
          {title}
        </h4>
        <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
          {content}
        </p>
      </div>
    </motion.div>
  );
};

const CardDeal = () => (
  <div className="mt-24 flex flex-col justify-center items-center p-4 pb-0">
    <h2 className={`${styles.heading2} text-center mb-12`}>
      Our Features
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {more.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </div>
);

export default CardDeal;
