import {  motion } from 'framer-motion'

const FoodTag = ({ iconUrl, label, rating, position, opacity }) => {
    return (
      <motion.div
        className={`absolute ${position} px-4 py-2 rounded-full flex items-center gap-3 shadow-md 
        backdrop-blur-sm border border-white/20 bg-gradient-to-r from-gray-800/50 to-gray-700/50`}
        style={{ opacity }} 
      >
        <img src={iconUrl} alt={label} className="w-8 h-8" />
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="text-xs text-yellow-400">⭐ {rating}</p>
        </div>
      </motion.div>
    )
  }
  
  export default FoodTag
  