
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import MarqueeStats from '../components/MarqueeStatsCards'
import Testimonials from '../components/Testimonials'
import HowItWorks from '../components/HowItWork'
import PopularRestaurants from '../components/PopularResturants'
import RestaurantPartner from '../components/ResturantPartner'
import Features from '../components/Features'
import Footer from '../components/common/footer'
import ScrollArrow from '../components/ScrollArrow'
import DashboardHeader from '../components/user/menuTop'

import '../App.css'

function LandingPage() {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <ScrollArrow/>
      <Navbar />
      <HeroSection />
      <MarqueeStats/>
      <Features/>
      <HowItWorks/>
      <PopularRestaurants/>
      <RestaurantPartner/>
      <Testimonials/>
      <Footer/>
      
      
    </div>
  )
}

export default LandingPage
