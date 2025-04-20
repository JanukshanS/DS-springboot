import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import Button from "../components/common/Button";
// import { authService } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setError("");

      try {
        // In a real app, this would call an API endpoint
        // For now, we'll simulate a successful response
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate API call
        // await authService.requestPasswordReset(email);

        setSuccess(true);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to send password reset email. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="py-8 px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-rowdies font-bold text-gray-800">
                Forgot Password
              </h2>
              <p className="text-gray-600 mt-2">
                {!success
                  ? "Enter your email address and we'll send you a link to reset your password"
                  : "Check your email for instructions to reset your password"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
                <FiAlertCircle className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div>
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <FiCheckCircle className="mr-2" />
                  <span>Password reset email sent! Check your inbox.</span>
                </div>

                <div className="text-center mt-8">
                  <p className="text-gray-600 text-sm">
                    Didn't receive the email?{" "}
                    <button
                      onClick={handleSubmit}
                      className="text-orange-500 hover:text-orange-600 font-semibold"
                      disabled={loading}
                    >
                      Resend
                    </button>
                  </p>

                  <p className="text-gray-600 text-sm mt-4">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="text-orange-500 hover:text-orange-600 font-semibold"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        error ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
                </div>

                <div className="mb-6">
                  <Button type="submit" fullWidth disabled={loading}>
                    {loading ? "Sending..." : "Reset Password"}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="text-orange-500 hover:text-orange-600 font-semibold"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
