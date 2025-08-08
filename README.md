# 🍕 MERN Food Ordering App

🍕 Modern MERN Stack Food Ordering App with beautiful blue gradient UI. Features include user authentication, shopping cart, order management, and comprehensive admin dashboard. Built with React, Node.js, Express, MongoDB. Includes food CRUD operations, real-time cart sync, and responsive design. Ready for production deployment.

## ✨ Features

### 🛍️ Customer Features
- **Browse Menu**: Explore a diverse range of food items with high-quality images
- **Shopping Cart**: Add, remove, and modify items with real-time cart updates
- **User Authentication**: Secure login and registration system
- **Order Placement**: Easy checkout with delivery address and phone number
- **Order Tracking**: View order history and current order status
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👨‍💼 Admin Features
- **Comprehensive Dashboard**: Overview of orders, revenue, and business analytics
- **Food Management**: Complete CRUD operations for menu items
- **Order Management**: View all orders with detailed information
- **Analytics**: Revenue tracking, completion rates, and performance metrics

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Deployment**: Vercel (Frontend), Render (Backend)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Poonam021-tech/Food-Ordering-App-.git
   cd Food-Ordering-App-
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/foodordering
   JWT_SECRET=your_jwt_secret_key
   PORT=5001
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm start
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5001`

## 📁 Project Structure

```
Food-Ordering-App-/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/         # React Context providers
│   │   ├── pages/           # Application pages
│   │   ├── utils/           # Utility functions
│   │   └── App.js          # Main application component
│   └── package.json
├── server/                   # Express backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   └── server.js           # Server entry point
└── README.md
```

## 🌐 Live Demo

**🚀 Try the app now:**
- **Frontend**: [https://mealifyy.vercel.app/](https://mealifyy.vercel.app/)
- **Backend API**: [https://food-ordering-api-fqtz.onrender.com](https://food-ordering-api-fqtz.onrender.com)
- **GitHub Repository**: [https://github.com/Poonam021-tech/Food-Ordering-App-](https://github.com/Poonam021-tech/Food-Ordering-App-)

## 🌐 Deployment

### Frontend (Vercel)
- Deploy to Vercel with root directory set to `client`
- Set environment variable: `REACT_APP_API_URL`

### Backend (Render)
- Deploy to Render with root directory set to `server`
- Set environment variables for production

---

⭐ Don't forget to star this repository if you found it helpful!
