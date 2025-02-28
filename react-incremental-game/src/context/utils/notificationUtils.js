// This file contains utility functions for managing notifications in the game context.

export const showNotification = (message, type = 'info') => {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;

    // Append the notification to the body
    document.body.appendChild(notification);

    // Automatically remove the notification after a timeout
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

export const clearNotifications = () => {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => notification.remove());
};