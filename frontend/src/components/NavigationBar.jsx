import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Gauge,
  Clock3,
  ArrowRight,
  Settings,
  Calendar,
  BarChart3,
  History,
} from "lucide-react";
import { motion } from "framer-motion";
import logo from "/logo.png";

const navLinks = [
  {
    category: "Main",
    links: [
      {
        name: "Dashboard",
        icon: Gauge,
        path: "/dashboard",
      },
      {
        name: "Upcoming Schedules",
        icon: Calendar,
        path: "/upcoming-schedules",
      },
    ],
  },
  {
    category: "History",
    links: [
      {
        name: "Intake Insights",
        icon: BarChart3,
        path: "/data-analyzation",
      },
      {
        name: "Intake History",
        icon: History,
        path: "/intake-history",
      },
    ],
  },
];

const variants = {
  expanded: { width: "25%" },
  nonExpanded: { width: "6%" },
};

export default function NavigationBar() {
  const [activeNavIndex, setActiveNavIndex] = useState("0-0");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Retrieve the active navigation index from localStorage
    const savedIndex = localStorage.getItem("activeNavIndex");
    if (savedIndex !== null) {
      setActiveNavIndex(savedIndex);
    }
  }, []);

  const handleNavClick = (categoryIndex, linkIndex) => {
    const index = `${categoryIndex}-${linkIndex}`;
    setActiveNavIndex(index);
    localStorage.setItem("activeNavIndex", index);
  };

  return (
    <>
      <motion.div
        animate={isExpanded ? "expanded" : "nonExpanded"}
        variants={variants}
        className={
          " py-12 flex flex-col  w-1/5 h-full relative " +
          (isExpanded ? " px-5 " : " px-2 ")
        }
      >
        <Link
          to={`/`}
          className="logo-div flex space-x-3 items-center font-bold border-b-[1px] border-blue-50 pb-4 "
          onClick={() => handleNavClick(0, 0)}
        >
          <img className="w-10" src={logo} />
          <span
            className={" text-[#382CDD] " + (isExpanded ? "block" : "hidden")}
          >
            MediBot
          </span>
        </Link>

        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 bg-[#382CDD] rounded-full absolute -right-[10.5px] top-12 flex items-center justify-center"
        >
          <ArrowRight className="w-4 text-white" />
        </div>

        <div className="flex-col">
          {navLinks.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xs font-bold mt-5 text-gray-400 uppercase">
                {category.category}
              </h3>
              <div className="mt-3 space-y-2">
                {category.links.map((item, linkIndex) => {
                  const index = `${categoryIndex}-${linkIndex}`;
                  return (
                    <Link
                      to={item.path}
                      key={index}
                      className={
                        "flex space-x-3 p-2 rounded text-sm " +
                        (activeNavIndex === index
                          ? " bg-[#382CDD] text-white "
                          : " text-gray-500 hover:bg-indigo-50 ")
                      }
                      onClick={() => handleNavClick(categoryIndex, linkIndex)}
                    >
                      <item.icon />
                      <span className={isExpanded ? "block" : "hidden"}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
