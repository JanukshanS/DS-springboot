//import retaurant class 
import Restaurant from './../services/RestaurantService';
import axios from 'axios';

const restaurantDataLoader = async () => {
    //fetch restaurant pics from public api
    try {
        const response = await axios.get('https://api.example.com/restaurants');
        return response.data;
    } catch (error) {
        console.error('Error loading restaurant data:', error);
        throw error;
    }
}



