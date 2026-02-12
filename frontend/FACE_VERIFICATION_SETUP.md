# Face Verification Setup Guide

This application uses Face++ API for facial recognition and verification to ensure the person in the student photo matches their ID photo.

## Overview

When a student registers:
1. They upload their **student photo** and **ID card photo**
2. The system uses Face++ API to detect faces in both images
3. It compares the two faces and calculates a confidence score (0-100%)
4. If confidence is above 80%, the student is marked as **Verified** ✓
5. Otherwise, they're marked as **Not Verified** ⚠

## How to Get Face++ API Credentials

### Step 1: Sign Up for Face++

1. Go to [Face++ Website](https://www.faceplusplus.com/)
2. Click on "Sign Up" or "Get Started"
3. Create a free account (supports 1000 API calls per month)
4. Verify your email address

### Step 2: Create an API Key

1. Log in to your Face++ Console
2. Go to the "API Key" section
3. Click "Create API Key"
4. Copy your **API Key** and **API Secret**

### Step 3: Configure Your Application

1. Open the `.env` file in the frontend folder
2. Replace the placeholder values with your actual credentials:

```env
VITE_FACEPP_API_KEY=your_actual_api_key_here
VITE_FACEPP_API_SECRET=your_actual_api_secret_here
VITE_FACEPP_API_URL=https://api-us.faceplusplus.com/facepp/v3
```

3. Save the file and restart your development server

```bash
npm run dev
```

## Mock Mode (For Testing Without API)

If you don't configure the Face++ API credentials, the system will automatically run in **mock mode**:
- All verifications will return a confidence score of 85.5%
- All students will be marked as verified
- A note will appear: "Mock verification mode (Face++ API not configured)"

This allows you to test the application flow without setting up the API immediately.

## API Endpoints Used

### 1. Face Detection
- **Endpoint:** `/facepp/v3/detect`
- **Purpose:** Detect faces in uploaded images
- **Usage:** Checks if a face exists in both student photo and ID photo

### 2. Face Comparison
- **Endpoint:** `/facepp/v3/compare`
- **Purpose:** Compare two faces and calculate similarity
- **Usage:** Determines if the student photo matches the ID photo

## Verification Logic

```javascript
confidence >= 80% → ✓ Verified
confidence < 80%  → ⚠ Not Verified
```

## What Gets Stored

After verification, the following data is saved for each student:

```javascript
{
  name: "Student Name",
  college: "College Name",
  department: "Department",
  photo: "base64_image_data",
  idPhoto: "base64_image_data",
  walletAddress: "0x...",
  verified: true/false,
  verificationConfidence: 85.5,
  verificationDate: "2026-02-12T...",
  mockVerification: false,
  timestamp: "2026-02-12T..."
}
```

## Display on Wallet Page

Verified students see:
- ✓ **Verified** badge (green)
- Verification confidence score
- Progress bar showing confidence level
- Verification date and time

Unverified students see:
- ⚠ **Not Verified** badge (yellow)
- Lower confidence score
- Warning message

## Troubleshooting

### API Not Working
- Check if your API credentials are correct
- Verify you haven't exceeded the free tier limit (1000 calls/month)
- Check console for error messages
- Try using mock mode first to test the flow

### No Face Detected
- Ensure photos have clear, front-facing faces
- Photos should have good lighting
- Face should not be obscured or at extreme angles
- Try different photos if detection fails

### Low Confidence Score
- Ensure both photos are of the same person
- Use recent photos
- Ensure good lighting and image quality
- Face should be clearly visible in both images

## Security Considerations

- API credentials are stored in `.env` file (not committed to git)
- Face comparison happens server-side via Face++ API
- Images are stored as base64 in localStorage/Firestore
- Verification status cannot be easily faked as it requires API validation

## Free Tier Limits

Face++ Free Account:
- **1000 API calls per month**
- Each registration uses 3 API calls:
  - 1 for detecting face in student photo
  - 1 for detecting face in ID photo
  - 1 for comparing the two faces
- ~330 registrations per month on free tier

## Alternative: Upgrade Plans

For production use, consider Face++ paid plans:
- More API calls per month
- Higher rate limits
- Priority support
- Advanced features

## Resources

- [Face++ Documentation](https://console.faceplusplus.com/documents/4887586)
- [Face++ API Reference](https://console.faceplusplus.com/documents/5679308)
- [Face++ Pricing](https://www.faceplusplus.com/pricing/)
