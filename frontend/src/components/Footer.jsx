import styles from "../style";
import { logo } from "../assets";
import { footerLinks, socialMedia } from "../constants";

const Footer = () => (
  <section className={`${styles.flexCenter} ${styles.paddingY}  flex-col`}>
    <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
      <div className="flex-[1] flex flex-col justify-start md:mr-10 items-center md:items-start">
        <div className="flex ml-0">
          <img src={logo} alt="hoobank" className="w-[70px]" />
          <div className="text-white m-auto ml-1 font-bold tracking-widest text-gradient text-xl">VINASWAP</div>
        </div>
        <p className={`${styles.paragraph} mt-4 w-full m-auto text-center md:text-left`}>
          A comprehensive DeFi platform designed to provide seamless and secure trading experiences for users in the decentralized finance space, with a focus on transparency, efficiency, and cutting-edge financial technology.
        </p>
      </div>

      <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
        {footerLinks.map((footerlink) => (
          <div key={footerlink.title} className={`flex flex-col ss:my-0 my-4 min-w-[150px]`}>
            <h4 className="font-poppins font-medium text-[18px] leading-[27px] text-white">
              {footerlink.title}
            </h4>
            <ul className="list-none mt-4">
              {footerlink.links.map((link, index) => (
                <li
                  key={link.name}
                  className={`font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer ${index !== footerlink.links.length - 1 ? "mb-4" : "mb-0"
                    }`}
                >
                  <a href={link.link} target="_blank">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="w-full flex justify-between items-center md:flex-row flex-col pt-2 pb-2 border-t-[1px] border-t-[#3F3E45]">
      <p className="m-auto font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
        Copyright Ⓒ 2025 VinaSwap. All Rights Reserved.
      </p>
    </div>
  </section>
);

export default Footer;
