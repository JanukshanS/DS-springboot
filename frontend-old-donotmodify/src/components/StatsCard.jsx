import React from 'react';

const StatsCard = ({
  reviewCount,
  reviewLabel,
  ordersCount,
  ordersLabel,
  chefImage,
  customerImages,
  customerText,
  ratingText
}) => {
  return (
    <div className="flex items-center justify-between gap-6 px-8 py-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 max-w-xl h-48 mx-auto text-white">
      {/* Left Section */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xl font-semibold">{reviewCount}</p>
          <p className="text-sm text-gray-300">{reviewLabel}</p>
        </div>
        <div>
          <p className="text-xl font-semibold">{ordersCount}</p>
          <p className="text-sm text-gray-300">{ordersLabel}</p>
        </div>
      </div>

      {/* Middle Image */}
      <div className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden">
        <img
          src={chefImage}
          alt="Chef"
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3">
            {customerImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                className="w-8 h-8 rounded-full border-2 border-white"
                alt={`customer-${idx}`}
              />
            ))}
          </div>
          <p className="text-white font-semibold text-sm">{customerText}</p>
        </div>
        <p className="text-sm text-gray-300 ml-12">{ratingText}</p>
      </div>
    </div>
  );
};

export default StatsCard;
