// restaurant routes
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RestaurantDashboard from '../../pages/restaurant/DashboardPage';
import RestaurantMenu from '../../pages/restaurant/MenuPage';
import RestaurantOrders from '../../pages/restaurant/OrdersPage';
import RestaurantSettings from '../../pages/restaurant/SettingsPage';
import RestaurantAnalytics from '../../pages/restaurant/AnalyticsPage';

const RestaurantRoutes = () => {
    return (
        // <RestaurantAdminLayout>
            <Routes>
                <Route path='dashboard' element={<RestaurantDashboard />} />
                <Route path='menu' element={<RestaurantMenu />} />
                <Route path='menu/categories' element={<RestaurantMenu categoriesView={true} />} />
                <Route path='menu/new' element={<RestaurantMenu newItem={true} />} />
                <Route path='orders' element={<RestaurantOrders />} />
                <Route path='analytics' element={<RestaurantAnalytics />} />
                <Route path='settings' element={<RestaurantSettings />} />
                <Route path='*' element={<RestaurantDashboard />} />
            </Routes>
        // </RestaurantAdminLayout>
    );
};

export default RestaurantRoutes;