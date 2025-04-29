import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      icon: "📍",
      title: "Choose Location",
      description: "Enter your address to find restaurants near you"
    },
    {
      icon: "🍔",
      title: "Select Food",
      description: "Browse menus and add items to your cart"
    },
    {
      icon: "💳",
      title: "Make Payment",
      description: "Pay securely online or cash on delivery"
    },
    {
      icon: "🚚",
      title: "Enjoy Meal",
      description: "Track your order until it arrives at your door"
    }
  ];

  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -30]);

  const smoothOpacity = useSpring(opacity, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(translateY, { stiffness: 80, damping: 20 });

  return (
    <section ref={ref} className="py-16 h-[70vh] overflow-hidden">
      <motion.div
        style={{ opacity: smoothOpacity, y: smoothY }}
        className="container mx-auto px-4"
      >
        <h2 className="text-5xl font-bold text-center mb-12 font-cabinet text-white">
          How Eato <span className="text-red-400">Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
              className="p-6 rounded-lg shadow-sm text-center backdrop-blur-sm border border-white/20 bg-gradient-to-r from-gray-800/50 to-gray-700/50"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {step.title}
              </h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
