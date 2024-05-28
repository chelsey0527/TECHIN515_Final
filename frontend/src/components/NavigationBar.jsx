import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Gauge,
  Clock3,
  ArrowRight,
  Settings,
  Calendar,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import logo from "/logo.svg";

const navLinks = [
  {
    name: "Dashboard",
    icon: Gauge,
    path: "/dashboard",
  },
  {
    name: "Upcoming schedules",
    icon: Calendar,
    path: "/upcoming-schedules",
  },
  {
    name: "Intake History",
    icon: Clock3,
    path: "/intake-history",
  },
  {
    name: "Analyzation",
    icon: BarChart3,
    path: "/data-analyzation",
  },
  // {
  //   name: "Settings",
  //   icon: Settings,
  //   path: "/settings",
  // },
];

const variants = {
  expanded: { width: "25%" },
  nonExpanded: { width: "6%" },
};

export default function NavigationBar() {
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Retrieve the active navigation index from localStorage
    const savedIndex = localStorage.getItem("activeNavIndex");
    if (savedIndex !== null) {
      setActiveNavIndex(parseInt(savedIndex, 10));
    }
  }, []);

  const handleNavClick = (index) => {
    setActiveNavIndex(index);
    // Save the active navigation index to localStorage
    localStorage.setItem("activeNavIndex", index);
  };

  return (
    <>
      <motion.div
        animate={isExpanded ? "expanded" : "nonExpanded"}
        variants={variants}
        className={
          " py-12 flex flex-col  w-1/5 h-full relative  lg:border-b" +
          (isExpanded ? " px-5 " : " px-2 ")
        }
      >
        <Link
          to={`/`}
          className="logo-div flex space-x-3 items-center font-bold border-b-[1px] border-blue-50 pb-4 "
          onClick={() => handleNavClick(0)}
        >
          <img className="w-10" src={logo} />
          <span
            className={" text-[#382CDD] " + (isExpanded ? "block" : "hidden")}
          >
            Medibox
          </span>
        </Link>

        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 bg-[#382CDD] rounded-full absolute -right-[10.5px] top-12 flex items-center justify-center"
        >
          <ArrowRight className="w-4 text-white" />
        </div>

        <div className="mt-9 flex-col">
          {navLinks.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={
                " flex space-x-3 p-2 rounded text-sm " +
                (activeNavIndex === index
                  ? " bg-[#382CDD] text-white "
                  : " text-gray-500 hover:bg-indigo-50 ")
              }
              onClick={() => handleNavClick(index)}
            >
              <item.icon />
              <span className={isExpanded ? "block" : "hidden"}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
}
