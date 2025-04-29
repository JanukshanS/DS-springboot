import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import Button from '../common/Button';

const RestaurantPartner = () => {
  const benefits = [
    'Increase your restaurant\'s visibility and reach more customers',
    'Boost your sales with our large customer base',
    'Streamlined order management system',
    'Dedicated support team for restaurant partners',
    'Flexible commission structure',
    'Marketing and promotional opportunities',
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <h2 className="text-3xl font-rowdies font-bold mb-6">
              Become a Restaurant Partner
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join our network of successful restaurants and grow your business. Our platform connects you with hungry customers looking for great food delivered to their doorstep.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <FiCheckCircle className="text-orange-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-300">{benefit}</p>
                </div>
              ))}
            </div>
            
            <Button size="lg">Partner With Us</Button>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-white p-8 rounded-xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Register Your Restaurant</h3>
              
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="restaurantName" className="block text-gray-700 text-sm font-semibold mb-2">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      id="restaurantName"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your Restaurant Name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="ownerName" className="block text-gray-700 text-sm font-semibold mb-2">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your Full Name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">
                      Restaurant Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="cuisine" className="block text-gray-700 text-sm font-semibold mb-2">
                      Cuisine Type
                    </label>
                    <select
                      id="cuisine"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Cuisine Type</option>
                      <option value="italian">Italian</option>
                      <option value="chinese">Chinese</option>
                      <option value="mexican">Mexican</option>
                      <option value="indian">Indian</option>
                      <option value="japanese">Japanese</option>
                      <option value="american">American</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <Button type="submit" fullWidth>Submit Application</Button>
                
                <p className="text-gray-500 text-sm text-center mt-4">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantPartner;
