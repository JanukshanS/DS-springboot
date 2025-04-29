import React, { useRef, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import img from '../../assets/logBg.png';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { authService } from '../../services/api';

const LoginCard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cardRef = useRef(null);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [0, 600], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 800], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Reset to center position when mouse leaves
    mouseX.set(400);
    mouseY.set(300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For demo purposes, we'll use a simplified login
      // In a real app, you would validate the credentials with your backend
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });

      // Store the token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Update authentication state
      setIsAuthenticated(true);

      // Redirect to user dashboard
      navigate('/user');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, let's add a quick login function
  const handleDemoLogin = () => {
    // Create a mock user and token
    const mockUser = {
      id: 1,
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'CUSTOMER'
    };
    const mockToken = 'mock-jwt-token';

    // Store in localStorage
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));

    // Update authentication state
    setIsAuthenticated(true);

    // Redirect to user dashboard
    navigate('/user');
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Right Side: Login */}
      <div className="sm:w-1/2 w-full h-full flex items-center justify-center">
        {/* Overlapping Login Card with Parallax */}
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            transformPerspective: 1000,
          }}
          className="absolute sm:left-[25%] sm:w-1/3 w-full bg-white bg-opacity-10 backdrop-blur-md p-10 rounded-3xl shadow-xl z-10 flex flex-col gap-6 border border-white/20"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-white text-3xl font-cabinet font-bold text-center">Login</h2>

          {error && (
            <div className="bg-red-500 bg-opacity-20 text-white p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />

            <div className="flex items-center justify-between mt-4">
              <motion.button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-bold shadow-md disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>
              <p className="text-white text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-yellow-400 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-white/20">
            <motion.button
              onClick={handleDemoLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Demo Login (No Credentials)
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Left Side: Image */}
      <div className="w-1/2 h-full relative pt-4 hidden sm:block">
        <img
          src={img}
          alt="Burger"
          className="w-full h-full"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            transformPerspective: 1000,
          }}
        />
      </div>
    </div>
  );
};

export default LoginCard;