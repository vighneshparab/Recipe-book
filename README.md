# 🍽️ RecipeBook: A Social Recipe Sharing App

![RecipeBook Banner](https://source.unsplash.com/1600x600/?food,cooking)

## 📝 Project Description
**RecipeBook** is a social platform where food lovers can share, discover, and save recipes from around the world. Users can create their own digital cookbook, interact with others, and explore a diverse collection of culinary delights.

---

## ✨ Features

✅ **User authentication** (Sign up/Login)  
✅ **Share and discover recipes**  
✅ **Like, comment, and save recipes**  
✅ **Follow other users and see their recipes**  
✅ **Categorized browsing & search functionality**  
✅ **Upload images & videos for recipes**  
✅ **Personalized recipe recommendations**  

---

## 🚀 Technologies Used

### 🖥️ Frontend
- ⚛️ React.js
- 🔀 React Router for navigation
- 🔗 Axios for API requests
- 🎨 Tailwind CSS for styling

### 🛠️ Backend
- 🌍 Node.js
- 🚀 Express.js
- 🗄️ MongoDB (Mongoose ODM)
- 🔐 JSON Web Token (JWT) for authentication

### 🔧 Additional Tools
- 📦 Cloudinary for image storage
- 🔑 Bcrypt for password encryption
- 🔍 Elasticsearch for advanced search

---

## 🛠️ Prerequisites

Ensure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) (v16.0.0 or later)
- [MongoDB](https://www.mongodb.com/)
- npm or Yarn package manager

---

## 🔧 Installation & Setup

### 📥 Clone the Repository
```bash
git clone https://github.com/vighneshparab/RecipeBook.git
cd RecipeBook
```

### 📦 Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 🔑 Setup Environment Variables
Create `.env` files in both **backend** and **frontend** directories with:
```ini
# Backend .env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 🚀 Run the Application
```bash
# Start backend (from backend directory)
npm run server

# Start frontend (from frontend directory)
npm start
```

---

## 📂 Project Structure
<details>
  <summary>Click to expand</summary>
  
  ```bash
  recipebook/
  │
  ├── backend/
  │   ├── config/          # Configuration files
  │   ├── controllers/     # Business logic
  │   ├── models/         # Database schemas
  │   ├── routes/         # API routes
  │   ├── middleware/     # Authentication & other middleware
  │
  └── frontend/
      ├── public/        # Static assets
      ├── src/
          ├── components/  # Reusable UI components
          ├── pages/       # Page components
          ├── redux/       # State management
          ├── utils/       # Helper functions
  ```
</details>

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository 🍴
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 🛠️

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## 📞 Contact

📧 **Vighnesh Sadanand Parab**  
✉️ Email: [vighneshparab83@gmail.com](mailto:vighneshparab83@gmail.com)  
🔗 Project Link: [GitHub Repository](https://github.com/vighneshparab/RecipeBook/)

---

## 🙏 Acknowledgements

Thanks to the following technologies & services that made this project possible:

- ⚛️ React.js
- 🌍 Node.js
- 🗄️ MongoDB
- 📦 Cloudinary
- 🎨 Tailwind CSS

---

🚀 **Happy Cooking & Sharing!** 🍲👨‍🍳👩‍🍳
