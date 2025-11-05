# 🚨 BOOKING FORM NOT WORKING - TROUBLESHOOTING GUIDE

## Problem
The "Book 30 Min Call" form is not saving bookings to the database.

## ✅ SOLUTION - Follow These Steps:

### Step 1: Upload PHP Files to Server
You need to upload these 3 NEW files to your hosting server (zonixtec.com):

1. **server/booking/save-booking.php**
2. **server/admin/admin-get-bookings.php**  
3. **server/admin/admin-update-booking-status.php**

**How to Upload:**
- Use FileZilla or cPanel File Manager
- Upload to: `public_html/server/booking/` and `public_html/server/admin/`
- Make sure the folder structure matches exactly

---

### Step 2: Create Database Table
Open **phpMyAdmin** on your hosting and run this SQL:

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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**How to Run SQL:**
1. Go to your cPanel
2. Open phpMyAdmin
3. Select database: `u627961759_zonixtec`
4. Click "SQL" tab
5. Paste the SQL above
6. Click "Go"

---

### Step 3: Test the Connection

**Option A - Use Test Page:**
1. Open `test-api-connection.html` in your browser
2. Click "Check if PHP File Exists"
3. Click "Submit Test Booking"
4. See if it works

**Option B - Check Browser Console:**
1. Open any page with "Book 30 Min Call" button
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Fill out and submit the booking form
5. Look for these messages:
   - ✅ Green checkmark = Working
   - ❌ Red X = Error (read the error message)

---

## 🔍 Common Errors and Solutions:

### Error: "404 Not Found"
**Cause:** PHP file not uploaded to server
**Solution:** Upload `save-booking.php` to `server/booking/` folder on your hosting

### Error: "Table 'bookings' doesn't exist"
**Cause:** Database table not created
**Solution:** Run the SQL code in phpMyAdmin (Step 2 above)

### Error: "CORS policy"
**Cause:** This is normal during development
**Solution:** Upload files to server and test on live site

### Error: "Database connection failed"
**Cause:** Database credentials wrong in db.php
**Solution:** Check `server/config/db.php` has correct credentials

---

## 📋 Checklist:

- [ ] Uploaded `save-booking.php` to server
- [ ] Uploaded `admin-get-bookings.php` to server
- [ ] Uploaded `admin-update-booking-status.php` to server
- [ ] Created `bookings` table in database
- [ ] Tested booking form
- [ ] Checked browser console for errors
- [ ] Verified booking appears in Admin panel

---

## 🎯 Quick Test Command:

Open browser console (F12) and run:

```javascript
fetch('https://zonixtec.com/server/booking/save-booking.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Test',
        email: 'test@test.com',
        phone: '1234567890',
        bookingDate: '2025-11-10',
        bookingTime: '14:00',
        service: 'Test',
        message: 'Test'
    })
}).then(r => r.json()).then(d => console.log(d));
```

If you see `{success: true, bookingId: X}` = Working! ✅
If you see error = Read the error message

---

## 🆘 Still Not Working?

Tell me:
1. What error message do you see in browser console (F12)?
2. Did you upload the PHP files?
3. Did you create the database table?
4. What happens when you click "Submit" on the booking form?
