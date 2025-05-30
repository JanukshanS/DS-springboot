import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  ShoppingCartIcon,
  ClockIcon,
  CogIcon,
  Bars3Icon as MenuIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  MapPinIcon as LocationMarkerIcon,
  CreditCardIcon,
  ListBulletIcon as ViewListIcon,
  SquaresPlusIcon as TemplateIcon,
  TruckIcon,
  ChartBarIcon
  } from '@heroicons/react/24/outline';
import { logout } from "../../store/slices/authSlice";
import Logo from "../common/Logo";

/**
 * DashboardLayout component for authenticated users
 * Provides role-based sidebar navigation
 */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle logout action
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Get role-specific navigation items
  const getNavItems = () => {
    if (user?.role === 'RESTAURANT_ADMIN') {
      // Get restaurant ID from user data or default to empty
      const restaurantId = user?.restaurantId || '';

      //if user has a restaurantId, skip the manage restaurants link
      if (restaurantId) {
        return [
          { name: 'Dashboard', href: `/restaurant-admin/${restaurantId}/dashboard`, icon: HomeIcon },
          { name: 'Menu Management', href: `/restaurant-admin/${restaurantId}/menu`, icon: ViewListIcon },
          { name: 'Orders', href: `/restaurant-admin/${restaurantId}/orders`, icon: ClockIcon },
          { name: 'Analytics', href: `/restaurant-admin/${restaurantId}/analytics`, icon: ChartBarIcon },
          { name: 'Settings', href: `/restaurant-admin/${restaurantId}/settings`, icon: CogIcon },
        ];
      }
      return [
        { name: 'Manage Restaurants', href: '/restaurant-admin/manage/create', icon: CogIcon },
      ];
    } else if (user?.role === "DELIVERY_PERSONNEL") {
      return [
        { name: "Dashboard", href: "/delivery/dashboard", icon: HomeIcon },
        {
          name: "Available Orders",
          href: "/delivery/available-orders",
          icon: ViewListIcon,
        },
        {
          name: "Current Order",
          href: "/delivery/current-order",
          icon: TruckIcon,
        },
        {
          name: "Order History",
          href: "/delivery/order-history",
          icon: ClockIcon,
        },
        { name: "Settings", href: "/delivery/settings", icon: CogIcon },
      ];
    } else {
      // Default to customer role
      return [
        { name: "Profile", href: "/user/profile", icon: UserIcon },
        { name: "Cart", href: "/user/cart", icon: ShoppingCartIcon },
        { name: "Order History", href: "/user/orders", icon: ClockIcon },
        {
          name: "Addresses",
          href: "/user/addresses",
          icon: LocationMarkerIcon,
        },
        {
          name: "Payment Methods",
          href: "/user/payment-methods",
          icon: CreditCardIcon,
        },
      ];
    }
  };

  const navItems = getNavItems();

  // Function to check if a nav item is active
  const isActive = (href) => {
    return location.pathname.startsWith(href);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Logo className="h-8 w-auto" />
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive(item.href)
                        ? "text-orange-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-4 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link
              to="/login"
              className="flex-shrink-0 group block"
              onClick={handleLogout}
            >
              <div className="flex items-center">
                <div>
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
                    <LogoutIcon className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    Logout
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Logo className="h-8 w-auto" />
              </div>
              <div className="mt-8 px-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {user?.fullName || "User"}
                </h2>
                <p className="text-sm text-gray-500">{user?.email || ""}</p>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? "bg-orange-50 text-orange-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive(item.href)
                          ? "text-orange-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Link
                to="/login"
                className="flex-shrink-0 w-full group block"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <div>
                    <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100">
                      <LogoutIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Logout
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;