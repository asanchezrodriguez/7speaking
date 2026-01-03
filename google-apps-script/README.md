# Setup Instructions - Email Notifications for 7Speaking Contact Form

## Quick Setup (3 Steps)

### 1️⃣ Open Your Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Find your existing project (the one with deployment ID `AKfycbx3fAOS...`)
3. Or open it from your Google Sheet: **Extensions** > **Apps Script**

### 2️⃣ Update the Code

1. **Select all existing code** (Ctrl+A / Cmd+A)
2. **Delete it**
3. **Copy the new code** from `Code.gs` in this directory
4. **Paste it** into the editor
5. **Save** (💾 icon or Ctrl+S)

### 3️⃣ Test the Email

1. In the function dropdown, select `testNotificationEmail`
2. Click **Run** (▶️)
3. **First time only**: Authorize the script
   - Click "Review Permissions"
   - Choose your account
   - Click "Advanced" → "Go to [project] (unsafe)"
   - Click "Allow"
4. Check `aminael.iv@gmail.com` for the test email

✅ **Done!** Your form will now send email notifications.

---

## What Changed?

The updated script:
- ✅ **Keeps all existing functionality** (saves to Google Sheets)
- ✅ **Adds email notifications** to `aminael.iv@gmail.com`
- ✅ **Sends beautiful HTML emails** with all contact details
- ✅ **Includes UTM tracking data** in the email
- ✅ **Won't break the form** if email fails

## Email Preview

You'll receive emails like this:

**Subject:** 🔔 Nuevo contacto desde 7Speaking

**Content:**
- 👤 Contact name
- 📧 Email address (clickable)
- 📱 Phone number
- 💬 Message
- 🌐 Source URL and UTM parameters
- 📅 Timestamp (Ecuador timezone)

## Troubleshooting

### Not receiving emails?

1. **Check spam folder** in Gmail
2. **Verify email address** in the script (line 8):
   ```javascript
   const NOTIFICATION_EMAIL = 'aminael.iv@gmail.com';
   ```
3. **Check execution logs**:
   - In Apps Script, click **Executions** (left sidebar)
   - Look for errors

### Need to change the email address?

Edit line 8 in the script:
```javascript
const NOTIFICATION_EMAIL = 'your-new-email@example.com';
```

## Google Apps Script Limits

- **100 emails per day** (free Gmail account)
- **1,500 emails per day** (Google Workspace account)

If you exceed limits, the form will still work, but emails won't be sent.

## Files

- `Code.gs` - The complete script code (copy this to Apps Script)
- `README.md` - This file
