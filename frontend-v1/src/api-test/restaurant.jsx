import { restaurant } from '../services/api.js';
import { useState, useEffect } from 'react';

const TestDisplayRestaurants = () => {
    const [restaurantsFromApi, setRestaurantsFromApi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionStatus, setActionStatus] = useState({ message: '', type: '' });
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        description: '',
        cuisineType: '',
        openingHours: '',
        imageUrl: '',
        isActive: true,
        averageRating: null
    });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = () => {
        setLoading(true);
        restaurant.getAllRestaurants()
            .then((response) => {
                console.log("All Restaurants:", response.data);
                setRestaurantsFromApi(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching restaurants:", error);
                setError(error);
                setLoading(false);
                setActionStatus({
                    message: `Error fetching restaurants: ${error.message || 'Unknown error'}`,
                    type: 'error'
                });
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEditRestaurant = (restaurant) => {
        setIsEditing(true);
        setCurrentRestaurant(restaurant);
        // Copy all restaurant properties to formData
        setFormData({
            name: restaurant.name,
            address: restaurant.address || '',
            phoneNumber: restaurant.phoneNumber || '',
            email: restaurant.email || '',
            description: restaurant.description || '',
            cuisineType: restaurant.cuisineType || '',
            openingHours: restaurant.openingHours || '',
            imageUrl: restaurant.imageUrl || '',
            isActive: restaurant.isActive !== undefined ? restaurant.isActive : true,
            averageRating: restaurant.averageRating || null
        });
        
        // Scroll to the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteRestaurant = (id, name) => {
        if (window.confirm(`Are you sure you want to delete the restaurant "${name}"?`)) {
            setIsSubmitting(true);
            setActionStatus({ message: 'Deleting restaurant...', type: 'info' });
            console.log("Deleting restaurant with ID:", id);
            restaurant.deleteRestaurant(id)
                .then(() => {
                    fetchRestaurants();
                    setActionStatus({ 
                        message: `Restaurant "${name}" has been successfully deleted.`, 
                        type: 'success' 
                    });
                })
                .catch((error) => {
                    console.error("Error deleting restaurant:", error);
                    setError(error);
                    setActionStatus({ 
                        message: `Error deleting restaurant: ${error.message || 'Unknown error'}`, 
                        type: 'error' 
                    });
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (isEditing && currentRestaurant) {
            setActionStatus({ message: 'Updating restaurant...', type: 'info' });
            restaurant.updateRestaurant(currentRestaurant.id, formData)
                .then(() => {
                    fetchRestaurants();
                    resetForm();
                    setActionStatus({ 
                        message: `Restaurant "${formData.name}" has been successfully updated.`, 
                        type: 'success' 
                    });
                })
                .catch((error) => {
                    console.error("Error updating restaurant:", error);
                    setError(error);
                    setActionStatus({ 
                        message: `Error updating restaurant: ${error.message || 'Unknown error'}`, 
                        type: 'error' 
                    });
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            setActionStatus({ message: 'Creating restaurant...', type: 'info' });
            restaurant.createRestaurant(formData)
                .then(() => {
                    fetchRestaurants();
                    resetForm();
                    setActionStatus({ 
                        message: `Restaurant "${formData.name}" has been successfully created.`, 
                        type: 'success' 
                    });
                })
                .catch((error) => {
                    console.error("Error creating restaurant:", error);
                    setError(error);
                    setActionStatus({ 
                        message: `Error creating restaurant: ${error.message || 'Unknown error'}`, 
                        type: 'error' 
                    });
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentRestaurant(null);
        setFormData({
            name: '',
            address: '',
            phoneNumber: '',
            email: '',
            description: '',
            cuisineType: '',
            openingHours: '',
            imageUrl: '',
            isActive: true,
            averageRating: null
        });
    };

    if (loading && restaurantsFromApi.length === 0) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="restaurant-container">
            <h1>Restaurants</h1>
            
            {actionStatus.message && (
                <div className={`status-message ${actionStatus.type}`}>
                    {actionStatus.message}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="restaurant-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="cuisineType"
                    placeholder="Cuisine Type"
                    value={formData.cuisineType}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="openingHours"
                    placeholder="Opening Hours"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                />
                <label>
                    Active:
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                </label>
                <input
                    type="number"
                    name="averageRating"
                    placeholder="Average Rating"
                    value={formData.averageRating || ''}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                />
                <input
                    type="hidden"
                    name="id"
                    value={currentRestaurant ? currentRestaurant.id : ''}
                />
                <input
                    type="hidden"
                    name="createdAt"
                    value={currentRestaurant ? currentRestaurant.createdAt : ''}
                />
                <input
                    type="hidden"
                    name="updatedAt"
                    value={currentRestaurant ? currentRestaurant.updatedAt : ''}
                />
                <input
                    type="hidden"
                    name="deletedAt"
                    value={currentRestaurant ? currentRestaurant.deletedAt : ''}
                />
                <div className="form-buttons">
                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? (
                            isEditing ? 'Updating...' : 'Creating...'
                        ) : (
                            isEditing ? 'Update Restaurant' : 'Create Restaurant'
                        )}
                    </button>
                    {isEditing && (
                        <button 
                            type="button" 
                            onClick={resetForm} 
                            className="btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form> 

            <div className="restaurant-list">
                <h2>Restaurant List</h2>
                {loading && restaurantsFromApi.length > 0 && (
                    <div className="refreshing-indicator">Refreshing data...</div>
                )}
                <div className="cards-container">
                    {restaurantsFromApi.map((r) => (
                        <div key={r.id} className="restaurant-card">
                            {r.imageUrl && (
                                <div className="restaurant-image">
                                    <img src={r.imageUrl} alt={r.name} />
                                </div>
                            )}
                            <div className="restaurant-details">
                                <h3>{r.name}</h3>
                                <div className="restaurant-info">
                                    <p><strong>Cuisine:</strong> {r.cuisineType}</p>
                                    <p><strong>Rating:</strong> {r.averageRating || 'No ratings yet'}</p>
                                    <p><strong>Status:</strong> {r.isActive ? 'Active' : 'Inactive'}</p>
                                    <p><strong>Address:</strong> {r.address}</p>
                                    <p><strong>Hours:</strong> {r.openingHours}</p>
                                    <p><strong>Phone:</strong> {r.phoneNumber}</p>
                                    <p><strong>Email:</strong> {r.email}</p>
                                    <p className="description"><strong>Description:</strong> {r.description}</p>
                                </div>
                                <div className="action-buttons">
                                    <button 
                                        onClick={() => handleEditRestaurant(r)} 
                                        className="edit-btn"
                                        disabled={isSubmitting}
                                        aria-label={`Edit ${r.name}`}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteRestaurant(r.id, r.name)} 
                                        className="delete-btn"
                                        disabled={isSubmitting}
                                        aria-label={`Delete ${r.name}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {restaurantsFromApi.length === 0 && !loading && (
                    <div className="no-data">No restaurants found. Create one to get started!</div>
                )}
            </div>

            <style jsx>{`
                .restaurant-container {
                    font-family: Arial, sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .restaurant-form {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 30px;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                }
                
                .restaurant-form input, .restaurant-form textarea {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                
                .form-buttons {
                    grid-column: span 2;
                    display: flex;
                    gap: 10px;
                }
                
                .btn-primary, .btn-secondary, .edit-btn, .delete-btn {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .btn-primary {
                    background-color: #4CAF50;
                    color: white;
                }
                
                .btn-secondary {
                    background-color: #f44336;
                    color: white;
                }
                
                .cards-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                
                .restaurant-card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }
                
                .restaurant-card:hover {
                    transform: translateY(-5px);
                }
                
                .restaurant-image img {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                }
                
                .restaurant-details {
                    padding: 15px;
                }
                
                .restaurant-details h3 {
                    margin-top: 0;
                    color: #333;
                    font-size: 1.2rem;
                }
                
                .restaurant-info p {
                    margin: 5px 0;
                    font-size: 0.9rem;
                }
                
                .description {
                    margin-top: 10px;
                    font-size: 0.85rem;
                    color: #555;
                }
                
                .action-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 15px;
                }
                
                .edit-btn {
                    background-color: #2196F3;
                    color: white;
                }
                
                .delete-btn {
                    background-color: #f44336;
                    color: white;
                }

                .status-message {
                    padding: 10px 15px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    text-align: center;
                }
                
                .status-message.success {
                    background-color: #dff0d8;
                    color: #3c763d;
                    border: 1px solid #d6e9c6;
                }
                
                .status-message.error {
                    background-color: #f2dede;
                    color: #a94442;
                    border: 1px solid #ebccd1;
                }
                
                .status-message.info {
                    background-color: #d9edf7;
                    color: #31708f;
                    border: 1px solid #bce8f1;
                }
                
                .loading-spinner, .refreshing-indicator {
                    text-align: center;
                    padding: 20px;
                    font-style: italic;
                    color: #666;
                }
                
                .no-data {
                    text-align: center;
                    padding: 40px 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    color: #666;
                }
                
                button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .edit-btn, .delete-btn {
                    transition: all 0.2s ease;
                }
                
                .edit-btn:hover:not(:disabled) {
                    background-color: #0b7dda;
                }
                
                .delete-btn:hover:not(:disabled) {
                    background-color: #d32f2f;
                }
            `}</style>
        </div>
    );
};

export default TestDisplayRestaurants;
