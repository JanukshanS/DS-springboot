// restaurant routes
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RestaurantDashboard from '../../pages/restaurant/DashboardPage';
import RestaurantMenu from '../../pages/restaurant/MenuPage';
import RestaurantOrders from '../../pages/restaurant/OrdersPage';
import RestaurantSettings from '../../pages/restaurant/SettingsPage';
import RestaurantAnalytics from '../../pages/restaurant/AnalyticsPage';
import RestaurantForm from '../../pages/restaurant/RestaurantForm';

const RestaurantRoutes = () => {
    return (
        <Routes>
            {/* Restaurant management routes */}
            <Route path='manage'>
                <Route path='create' element={<RestaurantForm />} />
                <Route path=':id/edit' element={<RestaurantForm />} />
            </Route>
            
            {/* Restaurant operational routes */}
            <Route path=':restaurantId'>
                <Route path='dashboard' element={<RestaurantDashboard />} />
                <Route path='menu' element={<RestaurantMenu />} />
                <Route path='menu/categories' element={<RestaurantMenu categoriesView={true} />} />
                <Route path='menu/new' element={<RestaurantMenu newItem={true} />} />
                <Route path='orders' element={<RestaurantOrders />} />
                <Route path='analytics' element={<RestaurantAnalytics />} />
                <Route path='settings' element={<RestaurantSettings />} />
                <Route index element={<RestaurantDashboard />} />
            </Route>
            
            {/* Default route */}
            <Route path='*' element={<RestaurantDashboard />} />
        </Routes>
    );
};

export default RestaurantRoutes;