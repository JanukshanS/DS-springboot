import {
    useScroll,
    useVelocity,
    useTransform,
    useSpring,
    motion,
    useAnimationFrame
  } from 'framer-motion';
  import { useRef, useState } from 'react';
  import StatsCard from './StatsCard';
  import { statsCards } from '../util/data/statsData';
  
  const MarqueeStats = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
  
    const velocityFactor = useTransform(scrollVelocity, [0, 1000], [1, 5], { clamp: false });
    const smoothVelocity = useSpring(velocityFactor, {
      damping: 50,
      stiffness: 400,
    });
  
    const x = useRef(0);
    const [motionX, setMotionX] = useState(0);
  
    useAnimationFrame((_, delta) => {
      x.current -= delta * 0.02 * smoothVelocity.get();
      setMotionX(x.current % (containerRef.current?.offsetWidth || 1000));
    });
  
    // 👇 Fade out the marquee on scroll up
    const opacity = useTransform(scrollY, [0, 300,1000], [0, 1,0]);
  
    return (
      <div className="overflow-hidden w-full py-10" ref={containerRef}>
        <motion.div
          className="flex gap-6 w-max"
          style={{ x: motionX, opacity }}
        >
          {statsCards.map((card, index) => (
            <StatsCard key={index} {...card} />
          ))}
          {statsCards.map((card, index) => (
            <StatsCard key={`dup-${index}`} {...card} />
          ))}
        </motion.div>
      </div>
    );
  };
  
  export default MarqueeStats;
  