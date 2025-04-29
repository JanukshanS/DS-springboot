// components/CurvedScrollLine.jsx
import { motion, useScroll, useTransform } from "framer-motion";

const CurvedScrollLine = () => {
  const { scrollYProgress } = useScroll();

  // Animate the path length as the user scrolls
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 3000" // You can adjust this to match the scroll height
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <motion.path
          d="M50 0
             C50 300, 70 600, 50 900
             C30 1200, 70 1500, 50 1800
             C30 2100, 70 2400, 50 3000"
          fill="none"
          stroke="#facc15" // Tailwind's yellow-400
          strokeWidth="2"
          strokeDasharray="8 10"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
};

export default CurvedScrollLine;
