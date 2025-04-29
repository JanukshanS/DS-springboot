import { useRef, useState } from 'react'
import { useScroll, useVelocity, useSpring, useAnimationFrame, motion, useTransform} from 'framer-motion'
import { FaMotorcycle } from 'react-icons/fa'
import { IoIosArrowRoundForward } from 'react-icons/io'
import pizzaImage from '../assets/pizza.png'
import riderImage from '../assets/Rider.png'
import burgermage from '../assets/foodTag/burger.png'
import FrideRicemage from '../assets/foodTag/frideRice.png'
import FoodTag from './FoodTag'

const HeroSection = () => {
  const pizzaRef = useRef(null)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 40, stiffness: 150 })

  const [angle, setAngle] = useState(0)
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useAnimationFrame((_, delta) => {
    const baseSpeed = 0.01 // deg/ms → 10 deg/sec
    const scrollSpeed = smoothVelocity.get() / 2000 // scale scroll speed down
    const totalSpeed = baseSpeed + scrollSpeed // combined rotation speed

    setAngle(prev => prev + totalSpeed * delta)
  })

  return (
    <main className="flex flex-col lg:flex-row items-center justify-between px-[10%] pt-40">
      {/* Left Text */}
      <div className="max-w-xl -mt-10">
        <h1 className="text-7xl font-bold leading-tight font-cabinet">
          Order <span className="text-yellow-400">Tasty</span> & <span className="text-green-400">Fresh</span> Foods
        </h1>
        <p className="text-xl mt-4 text-gray-300">To Your Doorstep</p>

        <button className="mt-8 bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-400 text-white flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-colors duration-300">
          <img src={riderImage} className="w-10" />
          Order Now
          <IoIosArrowRoundForward className="text-2xl" />
        </button>
      </div>

      {/* Right Image */}
      <div className="relative mt-10 lg:mt-0" ref={pizzaRef}>
        <motion.img
          src={pizzaImage}
          alt="Pizza"
          className="w-[100%] rounded-full shadow-xl"
          style={{ rotate: angle, opacity }}
        />

        <FoodTag
          iconUrl={burgermage}
          label="Burger"
          rating="4.2"
          position="bottom-40 -left-6"
          opacity={opacity}
        />

        <FoodTag
          iconUrl={FrideRicemage}
          label="Fried Rice"
          rating="5.0"
          position="bottom-20 -left-0"
          opacity={opacity}
        />
      </div>
    </main>
  )
}

export default HeroSection
