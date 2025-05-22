import { features } from "../constants";
import styles, { layout } from "../style";
import Button from "./Button";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const FeatureCard = ({ icon, title, content, index }) => (
  <div
    className={`flex flex-row p-6 rounded-[20px] ${
      index !== features.length - 1 ? "mb-6" : "mb-0"
    } feature-card`}
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
  </div>
);

const Business = () => {
  // Use useInView hook to observe visibility of the sectionInfo and sectionImg
  const { ref: infoRef, inView: infoInView } = useInView({ triggerOnce: true });
  const { ref: imgRef, inView: imgInView } = useInView({ triggerOnce: true });

  const infoControls = useAnimation();
  const imgControls = useAnimation();

  useEffect(() => {
    if (infoInView) {
      infoControls.start("visible");
    }
    if (imgInView) {
      imgControls.start("visible");
    }
  }, [infoControls, imgControls, infoInView, imgInView]);

  // Define animation variants for sliding effects


  return (
    <section id="features" className={layout.section}>
      <motion.div
        ref={infoRef}
        className={layout.sectionInfo}
        initial="hidden"
        animate={infoControls}
      >
        <h2 className={styles.heading2}>
          Focus on your investment, <br className="sm:block hidden" /> we’ll handle the rest.
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          With VinaSwap, you can streamline your financial operations, optimize your investments, and maximize your returns effortlessly. Our innovative solutions are designed to provide you with the ultimate control and convenience in the DeFi space.
        </p>

        <Button styles={`mt-10`} />
      </motion.div>

      <motion.div
        ref={imgRef}
        className={`${layout.sectionImg} flex-col`}
        initial="hidden"
        animate={imgControls}
      >
        {features.map((feature, index) => (
          <FeatureCard key={feature.id} {...feature} index={index} />
        ))}
      </motion.div>
    </section>
  );
};

export default Business;
