/**
 * Data Transfer Object for JWT authentication response
 * This model matches the backend JwtResponse.java class
 */
class JwtResponse {
  constructor({
    token,
    type = 'Bearer',
    id,
    username,
    email,
    role,
    refreshToken
  }) {
    this.token = token;
    this.type = type;
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
    this.accessToken = token; // Alias for token for compatibility
    this.refreshToken = refreshToken;
  }

  /**
   * Get the full authorization header value
   * @returns {string} Authorization header value
   */
  getAuthorizationHeader() {
    return `${this.type} ${this.token}`;
  }

  /**
   * Create a JwtResponse instance from API response
   * @param {Object} response - API response data
   * @returns {JwtResponse} New JwtResponse instance
   */
  static fromResponse(response) {
    return new JwtResponse({
      token: response.token || response.accessToken,
      type: response.type || 'Bearer',
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
      refreshToken: response.refreshToken
    });
  }
}

export default JwtResponse;
