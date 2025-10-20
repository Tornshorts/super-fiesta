# ProdShop - Mobile E-Commerce Marketplace

ProdShop is a full-stack mobile application built with the MERN stack and React Native (Expo). It serves as a marketplace where shop owners can create their own virtual stores, manage items, and handle incoming orders. Customers can browse items from various shops, add them to a cart, and place orders.

## Features

- **Dual User Roles**: Separate interfaces and functionalities for Customers and Shop Owners.
- **Authentication**: JWT-based user registration and login.
- **Shop Management**: Owners can create and manage their shop details.
- **Item Management**: Owners can add, edit, and delete items, including image uploads and stock management.
- **Marketplace**: Customers can browse all available items from all shops.
- **Shopping Cart**: Customers can add multiple items to a cart before checkout.
- **Multi-Shop Checkout**: The cart system intelligently groups items by shop and creates separate orders.
- **Order Management**:
  - Owners can view incoming orders and update their status (Pending, Confirmed, Shipped, Delivered).
  - Customers can view their order history and cancel pending orders.
- **In-App Notifications**: Customers receive notifications when their order status is updated.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (with Mongoose), JWT
- **Frontend**: React Native, Expo
- **Image Handling**: Multer for file uploads on the backend.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- MongoDB (a local instance or a cloud service like MongoDB Atlas)
- Expo Go app on your physical device or an Android/iOS emulator set up on your machine.

---

### Backend Setup

1.  **Navigate to the backend directory:**

    ```bash
    cd Backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `Backend` directory and add the following environment variables. Replace the placeholder values with your own.

    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  **Run the backend server:**
    ```bash
    npm start
    ```
    The server should now be running on `http://localhost:5000`.

---

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd Frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **IMPORTANT: Configure the API URL**
    Open `Frontend/api.js` and update the `API_BASE_URL` to match your computer's local network IP address and the backend port.

    ```javascript
    // Find this line in Frontend/api.js
    const API_BASE_URL = "http://YOUR_COMPUTER_IP:5000/api";
    ```

    - **Why?** The mobile app (even in an emulator) runs in a different environment from your backend server. Using `localhost` will not work. You must use the IP address of the machine running the backend server.
    - You can find your local IP address by running `ipconfig` (Windows) or `ifconfig` (macOS/Linux).

4.  **Run the frontend development server:**

    ```bash
    npx expo start
    ```

5.  **Run the app:**
    - **On a physical device**: Install the Expo Go app and scan the QR code that appears in the terminal.
    - **On an emulator/simulator**: Press `a` for Android or `i` for iOS in the terminal.

## Project Structure

```
prodShop/
├── Backend/         # Node.js, Express, MongoDB server
│   ├── models/
│   ├── routes/
│   └── ...
└── Frontend/        # React Native (Expo) mobile application
    ├── app/
    └── ...
```
