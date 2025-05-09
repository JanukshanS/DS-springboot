import axios from 'axios';

class Restaurant {
    constructor(id, name, location, cuisine, rating) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.cuisine = cuisine;
        this.rating = rating;
    }

    getDetails() {
        return `${this.name} is located at ${this.location} and serves ${this.cuisine} cuisine with a rating of ${this.rating}.`;
    }

    static fromJson(json) {
        return new Restaurant(
            json.id,
            json.name,
            json.location,
            json.cuisine,
            json.rating
        );
    }

    static fromJsonList(jsonList) {
        return jsonList.map(Restaurant.fromJson);
    }

    static toJson(restaurant) {
        return {
            id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating
        };
    }

    static toJsonList(restaurantList) {
        return restaurantList.map(Restaurant.toJson);
    }

    static fromFormData(formData) {
        return new Restaurant(
            formData.get('id'),
            formData.get('name'),
            formData.get('location'),
            formData.get('cuisine'),
            formData.get('rating')
        );
    }

    static toFormData(restaurant) {
        const formData = new FormData();
        formData.append('id', restaurant.id);
        formData.append('name', restaurant.name);
        formData.append('location', restaurant.location);
        formData.append('cuisine', restaurant.cuisine);
        formData.append('rating', restaurant.rating);
        return formData;
    }

    static fromRequest(request) {
        return new Restaurant(
            request.id,
            request.name,
            request.location,
            request.cuisine,
            request.rating
        );
    }

    static toRequest(restaurant) {
        return {
            id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating
        };
    }

    static fromResponse(response) {
        return new Restaurant(
            response.id,
            response.name,
            response.location,
            response.cuisine,
            response.rating
        );
    }

    static toResponse(restaurant) {
        return {
            id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating
        };
    }

    static fromError(error) {
        return new Restaurant(
            error.id,
            error.name,
            error.location,
            error.cuisine,
            error.rating
        );
    }

    static toError(restaurant) {
        return {
            id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating
        };
    }

    static fromSuccess(success) {
        return new Restaurant(
            success.id,
            success.name,
            success.location,
            success.cuisine,
            success.rating
        );
    }

    static toSuccess(restaurant) {
        return {
            id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating
        };
    }

    static fromWarning(warning) {
        return new Restaurant(
            warning.id,
            warning.name,
            warning.location,
            warning.cuisine,
            warning.rating
        );
    }
}

export const createRestaurant = (formData) => {
  return axios.post('/api/restaurants', Restaurant.toJson(formData));
};

export const updateRestaurant = (id, data) => {
  return axios.put(`/api/restaurants/${id}`, Restaurant.toJson(data));
};

export const deleteRestaurant = (id) => {
  return axios.delete(`/api/restaurants/${id}`);
};

export default Restaurant;
export { Restaurant };
