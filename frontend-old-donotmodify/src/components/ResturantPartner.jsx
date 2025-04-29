import React from "react";
import imgbg from "../assets/foodbg.jpg";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const RestaurantPartner = () => {
  const ref = useRef();

  // Track scroll position relative to this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Opacity and translateY for text and buttons
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  // Filter for background brightness
  const brightness = useTransform(scrollYProgress, [0, 0.3,0.8, 1], [1, 0.3,0.3, 1]);

  // Smooth out all animations
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 20 });
  const smoothBrightness = useSpring(brightness, { stiffness: 100, damping: 20 });

  return (
    <section
      ref={ref}
      className="relative py-16 bg-cover bg-center bg-no-repeat mb-20 overflow-hidden"
      style={{ backgroundImage: `url(${imgbg})` }}
    >
      {/* Overlay with dynamic brightness */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "black", opacity: smoothBrightness }}
      />

      {/* Content with scroll animation */}
      <motion.div
        style={{ opacity: smoothOpacity, y: smoothY }}
        className="relative z-10 container mx-auto py-10 rounded-3xl px-4 text-center bg-backdrop-blur-sm border border-white/20 bg-gradient-to-r from-gray-800/60 to-gray-700/60 text-white"
      >
        <h2 className="text-5xl font-bold mb-4 font-cabinet">
          <span className="text-green-400">Join</span> Eato as a Restaurant Partner
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Grow your business by reaching thousands of hungry customers in your area
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition">
            Sign Up Your Restaurant
          </button>
          <button className="bg-white text-orange-500 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition">
            Learn More
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default RestaurantPartner;
