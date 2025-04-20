import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const PaymentSuccessPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <FiCheckCircle className="text-green-500" size={48} />
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-green-700">
        Payment Successful!
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for your payment. Your order has been placed and is being
        processed.
      </p>
      <div className="flex flex-col gap-3">
        <Link to="/user/orders">
          <button className="w-full py-2 px-4 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700 transition">
            View My Orders
          </button>
        </Link>
        <Link to="/restaurants">
          <button className="w-full py-2 px-4 rounded border border-orange-600 text-orange-600 font-semibold hover:bg-orange-50 transition">
            Order More Food
          </button>
        </Link>
      </div>
    </div>
  </div>
);

export default PaymentSuccessPage;
