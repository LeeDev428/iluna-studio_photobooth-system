# Illuna Studio Photobooth Mobile App

A React Native mobile application for booking photobooth services from Illuna Studio.

## Tech Stack

- **Frontend:** React Native with Expo
- **Backend:** PHP with MySQL
- **Navigation:** React Navigation
- **HTTP Client:** Axios
- **Styling:** React Native StyleSheet with Linear Gradients

## Features

- 🎨 Beautiful teal-themed UI matching the design reference
- 📱 Landing page with brand introduction
- 🔐 User authentication (Sign In & Register)
- 📝 Complete user profile management
- 🎯 Clean and intuitive navigation

## Installation

1. **Install dependencies:**
   ```bash
   cd mobile-app
   npm install
   ```

2. **Configure API endpoint:**
   Edit `src/config/api.js` and update the backend URL:
   ```javascript
   const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000/api';
   ```
   
   **Note:** Replace `YOUR_IP_ADDRESS` with your computer's local IP address (not localhost) for testing on physical devices.

3. **Add background image:**
   - Place a photobooth-themed image at `assets/landing-bg.jpg`
   - Recommended: Use images similar to the reference (people using photobooth)

## Running the App

1. **Start Expo:**
   ```bash
   npm start
   ```

2. **Run on device:**
   - Download **Expo Go** app on your phone
   - Scan the QR code shown in terminal/browser
   - Or press `a` for Android emulator, `i` for iOS simulator

## Project Structure

```
mobile-app/
├── App.js                      # Main app with navigation
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── assets/                     # Images and assets
│   └── landing-bg.jpg         # Landing page background
└── src/
    ├── screens/
    │   ├── LandingScreen.js   # Landing page
    │   ├── SignInScreen.js    # Sign in form
    │   └── RegisterScreen.js  # Registration form
    └── config/
        └── api.js             # API configuration
```

## Screen Flow

1. **Landing Screen** → Tap to continue
2. **Sign In Screen** → Enter email & contact OR navigate to Register
3. **Register Screen** → Complete registration form

## API Integration

The app connects to the PHP backend with these endpoints:

- **POST** `/auth/register.php` - User registration
- **POST** `/auth/signin.php` - User sign in
- **GET** `/user/get_user.php?id={id}` - Get user details

## Design Features

✨ **Strictly following your design reference:**
- Teal/turquoise gradient background (#0D9488 to #14B8A6)
- Semi-transparent input fields with white borders
- Rounded pill-shaped buttons
- Time display (9:00) and bell icon at top
- "ILLUNA STUDIO" watermark on landing page
- Clean, modern typography
- Smooth navigation transitions

## Testing

1. Make sure backend is running
2. Update API endpoint with your computer's IP
3. Test registration flow
4. Test sign in with registered credentials
5. Verify form validations work

## Common Issues & Solutions

**Issue:** Can't connect to API
- Solution: Use your computer's IP address, not localhost
- Find IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

**Issue:** Image not showing on landing page
- Solution: Add `landing-bg.jpg` to `assets/` folder

**Issue:** Expo Go not connecting
- Solution: Ensure phone and computer are on same WiFi network

## Next Steps

- Add main dashboard after sign in
- Implement booking system
- Add package selection
- Create booking history
- Add photo gallery
- Implement payment integration

## Support

For issues or questions, check:
- Backend README for API documentation
- Expo documentation: https://docs.expo.dev
- React Navigation docs: https://reactnavigation.org
