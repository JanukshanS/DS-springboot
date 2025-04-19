/**
 * Data Transfer Object for user login
 * This model matches the backend LoginRequest.java class
 */
class LoginRequest {
  constructor({
    usernameOrEmail,
    password
  }) {
    this.usernameOrEmail = usernameOrEmail;
    this.password = password;
  }

  /**
   * Validate the login request data
   * @returns Object with validation errors or empty object if valid
   */
  validate() {
    const errors = {};

    if (!this.usernameOrEmail || this.usernameOrEmail.trim().length === 0) {
      errors.usernameOrEmail = 'Username or email is required';
    }

    if (!this.password || this.password.length === 0) {
      errors.password = 'Password is required';
    }

    return errors;
  }

  /**
   * Create a LoginRequest instance from credentials
   * @param {string} usernameOrEmail - Username or email
   * @param {string} password - Password
   * @returns {LoginRequest} New LoginRequest instance
   */
  static fromCredentials(usernameOrEmail, password) {
    return new LoginRequest({ usernameOrEmail, password });
  }
}

export default LoginRequest;
