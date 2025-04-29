// sections/Testimonials.jsx
import {React, useRef } from "react";
import TestimonialCard from "./TestimonialCard";
import { motion, useInView } from 'framer-motion';

const Testimonials = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: '-100px' }); // Adjust margin for earlier/later trigger
  
    const testimonials = [
    {
      logo: "HubSpbt",
      text: "To quickly start my startup landing page design, I was looking for a landing page UI Kit. Landify is one of the best landing page UI kit I have come across. It's so flexible, well organised and easily editable.",
      author: "Floyd Miles",
      position: "Vice President",
      company: "GAP10",
    },
    {
      logo: "@drbnb",
      text: "I used landify and created a landing page for my startup within a week. The Landify UI Kit is simple and highly intuitive, so anyone can use it.",
      author: "Jane Cooper",
      position: "CEO",
      company: "Althib",
    },
    {
      logo: "1 stropi",
      text: "Landify saved our time in designing my company page.",
      author: "Kristin Watson",
      position: "Co-Founder",
      company: "Stropi",
    },
  ];

  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        <motion.h2  
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-4xl font-bold text-center mb-12 text-white font-cabinet">
          Real<span className="text-red-500"> Stories</span> from Real Customers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              logo={testimonial.logo}
              text={testimonial.text}
              author={testimonial.author}
              position={testimonial.position}
              company={testimonial.company}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;