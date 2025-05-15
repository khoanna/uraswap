import { apple, bill, google } from "../assets";
import styles, { layout } from "../style";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Billing = () => {
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
    <section id="product" className={layout.sectionReverse}>

        <div className={layout.sectionImgReverse}>
          <img src={bill} alt="billing" className=" relative z-[5]" />

          {/* gradient start */}
          <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
          <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
          {/* gradient end */}
        </div>

   
        <div className={layout.sectionInfo}>
          <h2 className={styles.heading2}>
            Financial Journey <br className="sm:block hidden" /> with VinaSwap
          </h2>
          <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
            VinaSwap commit to continually enhancing our platform for our users. We're excited to announce that we'll soon be launching our app on both Google Play and the App Store, making it even easier to manage your assets and transactions on the go.
          </p>

          <div className="flex flex-row flex-wrap sm:mt-10 mt-6">
            <img src={apple} alt="App Store" className="w-[128.86px] h-[42.05px] object-contain mr-5" />
            <img src={google} alt="Google Play" className="w-[144.17px] h-[43.08px] object-contain" />
          </div>
        </div>

    </section>
  )
};

export default Billing;
