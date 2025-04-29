import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// 🖼️ Feature images
import fastImage from "../assets/features/fast.png";
import bestPriceImage from "../assets/features/bestPrice.png";
import secureImage from "../assets/features/secure.png";
import wideImage from "../assets/features/wide.png";

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentImage, setCurrentImage] = useState(wideImage);

  const sectionRef = useRef(null);

  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Create parallax and opacity transforms
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.5, 1], [0, 1, 1, 0]);

  const features = [
    {
      icon: "⚡",
      title: "Fast Delivery",
      description: "Get your food delivered in under 30 minutes",
      image: fastImage,
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive prices with no hidden fees",
      image: bestPriceImage,
    },
    {
      icon: "🍽️",
      title: "Wide Selection",
      description: "Choose from hundreds of restaurants",
      image: wideImage,
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "100% secure payment options",
      image: secureImage,
    },
  ];

  const handleFeatureHover = (index) => {
    setHoveredIndex(index);
    setCurrentImage(features[index].image);
  };

  return (
    <motion.section
      ref={sectionRef}
      style={{
        y,
        opacity,
        backgroundImage: "url('/your-background.jpg')",
      }}
      className="py-16 bg-cover bg-center bg-no-repeat"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 backdrop-blur-lg rounded-2xl p-8">
          {/* 📸 Image Side */}
          <div className="w-full lg:w-1/2 relative min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredIndex ?? "default"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <img
                  src={currentImage}
                  alt="Feature Visual"
                  className="rounded-xl w-full h-full shadow-lg"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 💡 Features Side */}
          <div className="w-full lg:w-1/2 text-white">
            <h2 className="text-5xl font-bold mb-8 text-center font-cabinet lg:text-left">
              Why Choose <span className="text-yellow-400">Eato</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white/10 border border-white/20 opacity-65 rounded-xl p-5 backdrop-blur-sm shadow-md hover:shadow-lg transition"
                  whileHover={{ scale: 1.05 }}
                  onMouseEnter={() => handleFeatureHover(index)}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    setCurrentImage(wideImage);
                  }}
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Features;
