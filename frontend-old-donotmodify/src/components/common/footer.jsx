import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Footer = () => {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -20]);

  const smoothOpacity = useSpring(opacity, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  return (
    <footer ref={ref} className="relative overflow-hidden">
      <motion.div
        style={{ opacity: smoothOpacity, y: smoothY }}
        className=" mx-auto px-4 text-center bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm  rounded-3xl py-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-white font-cabinet">Stay Connected</h2>
        <p className="text-gray-300 mb-6">
          Subscribe to get the latest updates, offers, and news from Eato!
        </p>
        <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 rounded-full w-full sm:w-auto flex-1 text-black outline-none"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition"
          >
            Subscribe
          </button>
        </form>
        <div className="mt-8 text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Eato. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
