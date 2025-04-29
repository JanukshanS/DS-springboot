import React from 'react';
import { FiClock, FiMapPin, FiShield, FiTag } from 'react-icons/fi';

const features = [
  {
    id: 1,
    icon: <FiClock className="w-10 h-10 text-orange-500" />,
    title: 'Fast Delivery',
    description: 'Get your food delivered in under 30 minutes. We prioritize speed without compromising on quality.',
  },
  {
    id: 2,
    icon: <FiMapPin className="w-10 h-10 text-orange-500" />,
    title: 'Local Restaurants',
    description: 'Support local businesses by ordering from a wide selection of restaurants in your neighborhood.',
  },
  {
    id: 3,
    icon: <FiTag className="w-10 h-10 text-orange-500" />,
    title: 'Best Deals',
    description: 'Enjoy exclusive offers, discounts, and promotions from your favorite restaurants every day.',
  },
  {
    id: 4,
    icon: <FiShield className="w-10 h-10 text-orange-500" />,
    title: 'Secure Payments',
    description: 'Your payment information is always protected with our secure payment processing system.',
  },
];

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-rowdies font-bold text-gray-800 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            We're committed to providing the best food delivery experience with these amazing features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-white rounded-xl shadow-md p-6 transition-transform hover:transform hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-cabinet font-bold text-center mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
