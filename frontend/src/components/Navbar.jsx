import { useState, useEffect } from "react";
import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  const handleMenuClick = (title) => {
    setActive(title);
    setToggle(false);
  };

  return (
    <nav className="w-full flex py-6 justify-between items-center">
      <Link to="/">
        <div className="flex flex-row">
          <img src={logo} alt="hoobank" className="w-[70px]" />
          <div className="text-white m-auto ml-1 font-bold tracking-widest text-gradient text-xl">VINASWAP</div>
        </div>
      </Link>

      <ul className="list-none sm:flex hidden justify-end items-center flex-1 navbar">

        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] mr-10 ${active === nav.id ? "text-white" : "text-dimWhite"
              }`}
            onClick={() => setActive(nav.id)}
          >
            <Link to={nav.id}>{nav.title}</Link>
          </li>
        ))}


      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${!toggle ? "hidden" : "flex"
            } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar z-100`}
          style={{ zIndex: 9999 }}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">

            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${active === nav.id ? "text-white" : "text-dimWhite"
                  } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => handleMenuClick(nav.id)}
              >
                <Link to={nav.id}>{nav.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
