/**
 * Notification service using Firebase Cloud Messaging
 */

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Flag to check if Firebase is initialized
let isInitialized = false;
let messaging = null;

/**
 * Initialize Firebase and Firebase Cloud Messaging
 * @returns {Promise<void>}
 */
export const initializeFirebase = async () => {
  if (isInitialized) return;

  try {
    // Dynamically import Firebase modules
    const { initializeApp } = await import('firebase/app');
    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    isInitialized = true;

    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

/**
 * Request permission for push notifications
 * @returns {Promise<string>} FCM token
 */
export const requestNotificationPermission = async () => {
  if (!isInitialized) {
    await initializeFirebase();
  }

  try {
    // For demo purposes, we'll simulate a successful permission request
    // In a real app, this would request permission and get a token
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a mock token
    return `fcm-token-${Math.random().toString(36).substring(2, 15)}`;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

/**
 * Subscribe to push notifications for a specific topic
 * @param {string} topic - Topic to subscribe to
 * @returns {Promise<void>}
 */
export const subscribeToTopic = async (topic) => {
  if (!isInitialized) {
    await initializeFirebase();
  }

  try {
    // In a real app, this would call your backend API to subscribe to a topic
    // For demo purposes, we'll simulate a successful subscription
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`Subscribed to topic: ${topic}`);
  } catch (error) {
    console.error(`Error subscribing to topic ${topic}:`, error);
    throw error;
  }
};

/**
 * Unsubscribe from push notifications for a specific topic
 * @param {string} topic - Topic to unsubscribe from
 * @returns {Promise<void>}
 */
export const unsubscribeFromTopic = async (topic) => {
  if (!isInitialized) {
    await initializeFirebase();
  }

  try {
    // In a real app, this would call your backend API to unsubscribe from a topic
    // For demo purposes, we'll simulate a successful unsubscription
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`Unsubscribed from topic: ${topic}`);
  } catch (error) {
    console.error(`Error unsubscribing from topic ${topic}:`, error);
    throw error;
  }
};

/**
 * Set up a callback for handling foreground messages
 * @param {Function} callback - Function to call when a message is received
 * @returns {Function} Unsubscribe function
 */
export const onForegroundMessage = (callback) => {
  if (!isInitialized || !messaging) {
    console.warn('Firebase not initialized. Call initializeFirebase first.');
    return () => {};
  }

  // In a real app, this would set up a listener for foreground messages
  // For demo purposes, we'll simulate message handling
  
  // Set up a mock interval to simulate receiving messages
  const interval = setInterval(() => {
    // Only simulate messages occasionally (10% chance)
    if (Math.random() < 0.1) {
      const mockMessage = {
        notification: {
          title: 'Order Update',
          body: 'Your order status has been updated!'
        },
        data: {
          orderId: `order_${Math.random().toString(36).substring(2, 10)}`,
          status: ['preparing', 'ready', 'out_for_delivery'][Math.floor(Math.random() * 3)]
        }
      };
      
      callback(mockMessage);
    }
  }, 30000); // Check every 30 seconds
  
  // Return a function to clear the interval
  return () => clearInterval(interval);
};

/**
 * Get all notifications for the current user
 * @returns {Promise<Array>} Array of notifications
 */
export const getNotifications = async () => {
  try {
    // In a real app, this would call your backend API to fetch notifications
    // For demo purposes, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate mock notifications
    const mockNotifications = Array.from({ length: 5 }, (_, i) => ({
      id: `notif_${Math.random().toString(36).substring(2, 10)}`,
      title: ['Order Confirmed', 'Order Ready', 'Out for Delivery', 'Delivery Completed', 'Special Offer'][i],
      body: [
        'Your order has been confirmed and is being prepared.',
        'Your order is ready for pickup or delivery.',
        'Your order is on the way! Estimated delivery in 15 minutes.',
        'Your order has been delivered. Enjoy your meal!',
        'Get 20% off your next order with code FOODIE20!'
      ][i],
      read: i > 2,
      createdAt: new Date(Date.now() - i * 3600000).toISOString() // Subtract hours
    }));
    
    return mockNotifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - ID of the notification to mark as read
 * @returns {Promise<Object>} Updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    // In a real app, this would call your backend API to mark a notification as read
    // For demo purposes, we'll simulate a successful update
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      id: notificationId,
      read: true,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Export the service
const notificationService = {
  initializeFirebase,
  requestNotificationPermission,
  subscribeToTopic,
  unsubscribeFromTopic,
  onForegroundMessage,
  getNotifications,
  markNotificationAsRead
};

export default notificationService;
