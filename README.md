# Illuna Studio: Rental Photobooth Mobile Application

A complete mobile application for booking photobooth services with a clean PHP backend and React Native frontend.

## 🎨 Project Overview

This is a mobile application that allows users to book photobooth rental services from Illuna Studio. The design strictly follows the provided reference images with a beautiful teal/turquoise color scheme.

## 📱 Technology Stack

- **Frontend:** React Native with Expo Go
- **Backend:** PHP 7.4+
- **Database:** MySQL
- **Navigation:** React Navigation v6
- **HTTP Client:** Axios
- **Styling:** Linear Gradients, Custom StyleSheet

## 📂 Project Structure

```
iluna-studio_photobooth-system/
├── mobile-app/                 # React Native frontend
│   ├── App.js
│   ├── app.json
│   ├── package.json
│   ├── assets/
│   │   └── landing-bg.jpg     # Add your photobooth image here
│   └── src/
│       ├── screens/
│       │   ├── LandingScreen.js
│       │   ├── SignInScreen.js
│       │   └── RegisterScreen.js
│       └── config/
│           └── api.js
│
└── backend/                    # PHP backend
    ├── index.php
    ├── config/
    │   └── database.php
    ├── models/
    │   └── User.php
    ├── api/
    │   ├── auth/
    │   │   ├── register.php
    │   │   └── signin.php
    │   └── user/
    │       └── get_user.php
    └── database/
        └── schema.sql
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Import database
mysql -u root -p < database/schema.sql

# Start PHP server
php -S localhost:8000
```

Update database credentials in `backend/config/database.php` if needed.

### 2. Frontend Setup

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Update API endpoint in src/config/api.js
# Change localhost to your computer's IP address

# Start Expo
npm start
```

### 3. Add Landing Background Image

Place a photobooth-themed image at:
```
mobile-app/assets/landing-bg.jpg
```

### 4. Test on Device

1. Install **Expo Go** on your phone
2. Scan QR code from terminal
3. App will load on your device

## 📱 Screens

### 1. Landing Screen
- Welcome screen with brand introduction
- "Illuna Studio: Rental Photobooth with Easy Booking" title
- "Tap to continue" button
- Teal gradient background with photobooth images

### 2. Sign In Screen
- Form fields:
  - Message (optional)
  - Current Address
  - Personal Email (required)
  - Telephone Number (required)
- "Click to Proceed" button
- Link to Register screen

### 3. Register Screen
- Form fields:
  - Surname
  - First Name
  - Middle Initial
  - Message (optional)
  - Current Address
  - Personal Email
  - Telephone Number
  - Password
  - Confirm Password
- "Click to Register" button
- Link to Sign In screen

## 🎨 Design Features

✅ Teal/turquoise gradient background (#0D9488 to #14B8A6)
✅ Semi-transparent white input fields with borders
✅ Rounded pill-shaped buttons
✅ Status bar with time and bell icon
✅ "ILLUNA STUDIO" watermark effect
✅ Clean typography and spacing
✅ Smooth animations and transitions

## 🔌 API Endpoints

### Authentication

**POST** `/api/auth/register.php`
```json
{
  "surname": "string",
  "firstName": "string",
  "middleInitial": "string",
  "email": "string",
  "contact": "string",
  "address": "string",
  "message": "string",
  "password": "string"
}
```

**POST** `/api/auth/signin.php`
```json
{
  "email": "string",
  "contact": "string"
}
```

**GET** `/api/user/get_user.php?id={user_id}`

## 🗄️ Database Schema

### Users Table
- Personal information (name, email, contact)
- Address and message fields
- Hashed password
- Timestamps

### Bookings Table (Future)
- User booking details
- Date, time, duration
- Package selection
- Status tracking

### Packages Table
- Predefined packages (Basic, Premium, Deluxe)
- Pricing and features

## 🔒 Security Features

- Password hashing (bcrypt)
- Input sanitization
- SQL injection prevention (PDO prepared statements)
- CORS configuration
- Email and contact uniqueness validation

## 📝 Testing

1. **Test Backend:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/register.php \
     -H "Content-Type: application/json" \
     -d '{"surname":"Test","firstName":"User","email":"test@example.com","contact":"09123456789","password":"password123"}'
   ```

2. **Test Frontend:**
   - Register a new user
   - Sign in with credentials
   - Verify form validations
   - Test navigation flow

## 🔧 Configuration

### Update Backend URL (Important!)

In `mobile-app/src/config/api.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000/api';
```

Find your IP:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

Use your local IP (e.g., 192.168.1.100), NOT localhost!

## 🎯 Next Features to Implement

- [ ] User dashboard
- [ ] Browse packages
- [ ] Booking calendar
- [ ] Booking history
- [ ] Photo gallery
- [ ] Payment integration
- [ ] Push notifications
- [ ] Admin panel

## 📱 Requirements

- Node.js 14+
- PHP 7.4+
- MySQL 5.7+
- Expo Go app (for testing)
- Android/iOS device or emulator

## 🐛 Troubleshooting

**Can't connect to backend:**
- Ensure backend server is running
- Use computer's IP, not localhost
- Check firewall settings
- Verify phone and computer on same network

**Images not showing:**
- Add `landing-bg.jpg` to assets folder
- Check image file name and path

**Expo won't start:**
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📄 License

Private project for Illuna Studio

## 👨‍💻 Development

Built with ❤️ using React Native and PHP
Designed to match the exact specifications from the reference images

---

**Ready to run!** Follow the Quick Start guide above to get started. 🚀
