import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sidenavToggle = document.querySelector('[data-mdb-toggle="sidenav"]');
    const sidenav = document.getElementById("sidenav-1");
    const openBtn = document.getElementById("open-btn");
    const closeBtn = document.getElementById("close-btn");

    const openSideNav = () => {
      sidenav.classList.add("visible");
      setIsOpen(true);
    };

    const closeSideNav = () => {
      sidenav.classList.remove("visible");
      setIsOpen(false);
    };

    const handleOutsideClick = (event) => {
      if (!sidenav.contains(event.target) && event.target !== openBtn) {
        closeSideNav();
      }
    };

    sidenavToggle.addEventListener("click", openSideNav);
    closeBtn.addEventListener("click", closeSideNav);
    document.addEventListener("click", handleOutsideClick);

    // Cleanup event listeners on component unmount
    return () => {
      sidenavToggle.removeEventListener("click", openSideNav);
      closeBtn.removeEventListener("click", closeSideNav);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      {/* Sidenav */}
      <nav id="sidenav-1" className="sidenav fixed top-0 left-0 h-full">
        <button id="close-btn" className="btn btn-danger absolute top-4 right-4">
          <img src="/images/close1.png" width={32} alt="" />
        </button>
        <ul className="sidenav-menu text-[#dedeff] mt-16 ml-10">
          <li className="sidenav-item">
            <ul className="sidenav-collapse flex flex-col gap-4">
              <li className="sidenav-item">
                <button className="sidenav-link">
                  <Link to="/user">Budget Planner</Link>
                </button>
              </li>
              <li className="sidenav-item">
                <button className="sidenav-link">
                  <Link to="/user/analyzer">Budget Analyzer</Link>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      {/* Sidenav */}

      {/* Toggler */}
      <button
        data-mdb-toggle="sidenav"
        className="btn btn-primary"
        aria-controls="sidenav-1"
        aria-haspopup="true"
        style={{
          marginRight: "12px",
        }}
      >
        <img src="/images/ham1.png" id="open-btn" width={32} />
      </button>
      {/* Toggler */}
    </>
  );
};

export default SideNav;
