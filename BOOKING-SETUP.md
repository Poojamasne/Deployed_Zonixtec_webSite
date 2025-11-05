# Booking System - Setup Instructions

## Issue Explanation

The error you're seeing has two causes:

1. **CORS Policy Error**: Your local dev server (http://127.0.0.1:5500) cannot access production server (https://zonixtec.com)
2. **404 Not Found**: The new PHP files haven't been uploaded to the production server yet

## Solution

I've updated the code to use **relative paths** instead of absolute URLs:
- ✅ `Admin/bookings.html` now uses `../server/admin/admin-get-bookings.php`
- ✅ `script/booking-modal.js` now uses `./server/booking/save-booking.php`

## Required Steps

### Step 1: Setup Database Table
Run this SQL in your database (u627961759_zonixtec):

```sql
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(255),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    service VARCHAR(255) NOT NULL,
    message TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_booking_date (booking_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Step 2: Upload New PHP Files to Server

Upload these files to your hosting:

1. **server/booking/save-booking.php** (handles form submissions)
2. **server/admin/admin-get-bookings.php** (fetches bookings for admin)
3. **server/admin/admin-update-booking-status.php** (updates booking status)

### Step 3: Test Locally (Optional)

If you want to test locally, you need PHP running:

**Option A: Using PHP Built-in Server**
```bash
cd D:\Zonixtec_Final\Zonixtec_webSite
php -S localhost:8000
```
Then open: http://localhost:8000

**Option B: Using XAMPP/WAMP**
- Copy project to htdocs folder
- Access via http://localhost/Zonixtec_webSite

### Step 4: Verify Setup

1. Open any page with "Book A 30 Min Call" button
2. Fill out the form
3. Check browser console for success message
4. Go to `Admin/bookings.html` to see the booking

## File Changes Made

- ✅ Created `server/config/bookings-table.sql`
- ✅ Created `server/booking/save-booking.php`
- ✅ Created `server/admin/admin-get-bookings.php`
- ✅ Created `server/admin/admin-update-booking-status.php`
- ✅ Created `Admin/bookings.html`
- ✅ Updated `script/booking-modal.js` (localStorage → database)
- ✅ Updated navigation in all admin pages

## Need Help?

If errors persist:
1. Check browser console for specific errors
2. Verify PHP files are uploaded correctly
3. Ensure database table exists
4. Check file permissions on server (755 for folders, 644 for files)
