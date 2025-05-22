import styles from "../style";
import Button from "./Button";

const CTA = () => (
  <section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}>
    <div className="flex-1 flex flex-col">
      <h2 className={`${styles.heading2} text-yellow-400`}>Future of Finance with VinaSwap!</h2>
      <p className={`${styles.paragraph} max-w-[750px] mt-5`}>
        Discover the power of decentralized finance with VinaSwap Token. Seize this exclusive opportunity to be part of a groundbreaking ecosystem that’s designed for growth, transparency, and security. Whether you're an early adopter or looking to diversify your portfolio, VinaSwap Token is your gateway to the future of digital assets.
      </p>
    </div>

    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
      <Button />
    </div>
  </section>
);

export default CTA;
