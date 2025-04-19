import React, { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Enthusiast',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 5,
    text: 'The food delivery service is exceptional! My orders always arrive hot and on time. The variety of restaurants available is impressive, and the app is so easy to use.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Busy Professional',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 4,
    text: 'As someone with a hectic schedule, this food delivery service has been a lifesaver. The delivery is prompt, and the food quality is consistently good. Highly recommend!',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Parent of Three',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'With three kids, cooking every day is challenging. This service has made family meals so much easier. The kids love the variety, and I love the convenience!',
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'College Student',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 4,
    text: 'Perfect for late-night study sessions! The prices are reasonable, delivery is fast, and the food options are diverse. My go-to for satisfying cravings while studying.',
  },
  {
    id: 5,
    name: 'Olivia Thompson',
    role: 'Fitness Trainer',
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
    rating: 5,
    text: 'I appreciate the healthy food options available. It makes sticking to my nutrition plan much easier. The delivery is always on time, and the food is fresh!',
  },
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
          <p className="text-gray-500 text-sm">{testimonial.role}</p>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`${
              i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } w-5 h-5`}
          />
        ))}
      </div>
      <p className="text-gray-600 flex-grow">{testimonial.text}</p>
    </div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsPerPage = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-rowdies font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about our food delivery service.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${activeIndex * (100 / totalPages)}%)`,
                width: `${totalPages * 100}%`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="px-4"
                  style={{ width: `${100 / (itemsPerPage * totalPages)}%` }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  activeIndex === index ? 'bg-orange-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
