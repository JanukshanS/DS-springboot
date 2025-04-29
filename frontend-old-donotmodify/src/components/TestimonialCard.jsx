// components/TestimonialCard.jsx
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TestimonialCard = ({ logo, text, author, position, company }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{
        borderColor: "rgba(255,255,255,0.8)",
        boxShadow: "0 0 12px rgba(255,255,255,0.3)",
      }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white shadow-lg max-w-sm mx-auto"
    >
      {logo && (
        <div className="mb-4 text-2xl font-bold text-white">{logo}</div>
      )}
      <p className="text-gray-300 mb-4">{text}</p>
      <div className="flex items-center">
        <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
          <span className="text-white text-lg">👤</span>
        </div>
        <div>
          <h4 className="font-semibold text-white">{author}</h4>
          <p className="text-sm text-gray-300">
            {position}, {company}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
