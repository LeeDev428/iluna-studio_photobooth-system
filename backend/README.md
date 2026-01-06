# Illuna Studio Photobooth Backend

PHP backend for the Illuna Studio Photobooth mobile application.

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- PDO PHP Extension

## Installation

1. **Import the database:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. **Configure database connection:**
   Edit `config/database.php` and update the database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'iluna_studio_photobooth');
   ```

3. **Set up your web server:**
   - Point your web server document root to the `backend` folder
   - Or use PHP built-in server for testing:
     ```bash
     cd backend
     php -S localhost:8000
     ```

## API Endpoints

### Authentication

#### Register User
- **URL:** `/api/auth/register.php`
- **Method:** POST
- **Body:**
  ```json
  {
    "surname": "Dela Cruz",
    "firstName": "Juan",
    "middleInitial": "P",
    "email": "juan@example.com",
    "contact": "09123456789",
    "address": "123 Main St, City",
    "message": "Optional message",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

#### Sign In
- **URL:** `/api/auth/signin.php`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "juan@example.com",
    "contact": "09123456789"
  }
  ```

### User

#### Get User
- **URL:** `/api/user/get_user.php?id={user_id}`
- **Method:** GET

## Database Schema

### Users Table
- id (Primary Key)
- surname
- first_name
- middle_initial
- email (Unique)
- contact
- address
- message
- password
- created_at
- updated_at

### Bookings Table (Future use)
- id (Primary Key)
- user_id (Foreign Key)
- booking_date
- booking_time
- duration
- package_type
- event_type
- location
- special_requests
- status
- total_amount
- created_at
- updated_at

### Packages Table
- id (Primary Key)
- name
- description
- price
- duration
- features
- is_active
- created_at
- updated_at

## Security Features

- Password hashing using bcrypt
- Input sanitization
- Prepared statements (PDO)
- CORS headers configured
- SQL injection prevention

## Testing

Test the API using:
- Postman
- cURL
- Your React Native app

Example cURL command:
```bash
curl -X POST http://localhost:8000/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{"surname":"Test","firstName":"User","email":"test@example.com","contact":"09123456789","password":"password123"}'
```
