// components/ScrollArrow.jsx
import { useScroll, useTransform, motion } from "framer-motion";

const ScrollArrow = () => {
  const { scrollYProgress } = useScroll();
  
  // Animate the height of the revealed line based on scroll progress
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed left-6 top-0 bottom-0 z-50 flex items-start justify-center">
      {/* Arrow Line (dashed) */}
      <div className="relative w-[2px] h-full bg-transparent overflow-hidden">
        <motion.div
          className="absolute w-full border-l-4 border-dashed border-yellow-400"
          style={{ height }}
          
        />
       
      </div>
    </div>
  );
};

export default ScrollArrow;
