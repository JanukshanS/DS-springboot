/**
 * Data Transfer Object for review data
 * Matches the backend ReviewDTO.java structure
 */
class ReviewDTO {
  constructor({
    id = null,
    userId = null,
    userName = '',
    rating = 0,
    comment = '',
    createdAt = new Date().toISOString(),
    restaurantId = null
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
    this.restaurantId = restaurantId;
  }

  /**
   * Create a ReviewDTO from API response data
   * @param {Object} data - Review data from API
   * @returns {ReviewDTO} - A new ReviewDTO instance
   */
  static fromResponse(data) {
    return new ReviewDTO(data);
  }

  /**
   * Create a new review from user input
   * @param {number} userId - User ID
   * @param {string} userName - User name
   * @param {number} rating - Rating (1-5)
   * @param {string} comment - Review comment
   * @param {number} restaurantId - Restaurant ID
   * @returns {ReviewDTO} - A new ReviewDTO instance
   */
  static createNew(userId, userName, rating, comment, restaurantId) {
    return new ReviewDTO({
      userId,
      userName,
      rating,
      comment,
      restaurantId,
      createdAt: new Date().toISOString()
    });
  }

  /**
   * Validate the review data
   * @returns {Object} - Object with validation errors
   */
  validate() {
    const errors = {};
    
    if (!this.userId) {
      errors.userId = 'User ID is required';
    }
    
    if (!this.rating || this.rating < 1 || this.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
    
    if (!this.comment) {
      errors.comment = 'Comment is required';
    }
    
    if (!this.restaurantId) {
      errors.restaurantId = 'Restaurant ID is required';
    }
    
    return errors;
  }

  /**
   * Format the creation date
   * @returns {string} - Formatted date
   */
  formattedDate() {
    return new Date(this.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export default ReviewDTO;
