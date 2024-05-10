import {useState} from "react";
import { Heart, LayoutDashboard, Clock3, ArrowRight, Settings} from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
    {
        name: "Dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Intake History",
        icon: Clock3
    },
    {
        name: "Settings",
        icon: Settings
    }
]

const variants = {
    expanded: {width: "20%"},
    nonExpanded: {width: "5%"}
}

export default function NavigationBar(){
    const [activeNavIndex, setActiveNavIndex] = useState(0)
    const [isExpanded, setIsExpanded] = useState(true);

    return <>
        <motion.div 
            animate={isExpanded ? "expanded" : "nonExpanded"}
            variants={variants}
            className={
                " py-12 flex flex-col border border-r-1 w-1/5 h-screen relative " +
                (isExpanded ? " px-5 " : " px-2 ")
             }
        >
            <div className="logo-div flex space-x-3 items-center font-bold border-b-2 pb-4 ">
                <Heart className="text-[#382CDD]"/>
                <span className={" text-[#382CDD] " + (isExpanded ? "block" : "hidden")}>Medibox</span>
            </div>

            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-6 h-6 bg-[#382CDD] rounded-full absolute -right-[10.5px] top-12 flex items-center justify-center"
            >
                <ArrowRight className="w-4 text-white"/>
            </div>

            <div className="mt-9 flex-col space-y-2">
                {navLinks.map((item, index) => (
                    <div 
                        key={index} 
                        className={
                            "flex space-x-3 p-2 rounded" + 
                            (activeNavIndex === index 
                                ? " bg-[#382CDD] text-white font-semibold"  
                                : "")
                        }
                        onClick={() => setActiveNavIndex(index)}
                    >
                        <item.icon/>
                        <span className={isExpanded ? "block" : "hidden"}>{item?.name}</span>
                    </div>
                ))}

            </div>
        </motion.div>
    </>
}