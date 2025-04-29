// sections/PopularRestaurants.jsx
import React from "react";
import RollingGallery from '../util/lib/RollingGallery'

const PopularRestaurants = () => {
  const restaurants = [
    {
      name: "Burger Palace",
      cuisine: "American • Burgers",
      rating: 4.8,
      deliveryTime: "15-25 min",
      image: "/images/burger-restaurant.jpg"
    },
    {
      name: "Pizza Heaven",
      cuisine: "Italian • Pizza",
      rating: 4.7,
      deliveryTime: "20-30 min",
      image: "/images/pizza-restaurant.jpg"
    },
    {
      name: "Sushi World",
      cuisine: "Japanese • Sushi",
      rating: 4.9,
      deliveryTime: "25-35 min",
      image: "/images/sushi-restaurant.jpg"
    },
    {
      name: "Taco Fiesta",
      cuisine: "Mexican • Tacos",
      rating: 4.6,
      deliveryTime: "15-20 min",
      image: "/images/taco-restaurant.jpg"
    }
  ];

  return (
    <section className="md:hidden">
{/* 
      <RollingGallery autoplay={false} pauseOnHover={false} /> */}
        <h2 className="text-5xl font-bold text-center mb-12 font-cabinet text-white">
          Most  <span className="text-orange-500">Popular</span> Resturants
        </h2>
         
    </section>
  );
};

export default PopularRestaurants;