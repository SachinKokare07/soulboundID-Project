# SoulboundID - Blockchain Identity Verification Platform

A decentralized identity verification system for students using Algorand blockchain and AI face recognition.

## 🌟 Features

### 🔐 Wallet Integration
- **Pera Wallet** integration for Algorand blockchain
- Secure wallet connection with session persistence
- QR code support for desktop, app redirect for mobile

### 📸 AI Face Verification
- **Face++ API** integration for facial recognition
- Automatic face detection in uploaded photos
- Face comparison between student photo and ID photo
- Confidence score calculation (80%+ threshold for verification)
- Real-time verification status display

### 👤 Student Registration
- Complete profile with name, college, and department
- Photo and ID card photo upload
- Automatic face verification during registration
- Verified badge for authenticated students

### 💼 Digital Wallet Dashboard
- View your verified credentials
- Display verification status and confidence score
- Download credentials as JSON
- Wallet address management

### 📊 Student Directory
- View all registered students (admin feature)
- Filter verified vs unverified students
- Search and browse capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Face++ API credentials (optional - works in mock mode without them)

### Installation

1. **Clone the repository**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Face++ credentials:
   ```env
   VITE_FACEPP_API_KEY=your_api_key_here
   VITE_FACEPP_API_SECRET=your_api_secret_here
   VITE_FACEPP_API_URL=https://api-us.faceplusplus.com/facepp/v3
   ```

   > **Note:** The app works in mock mode if Face++ is not configured. See [FACE_VERIFICATION_SETUP.md](./FACE_VERIFICATION_SETUP.md) for detailed setup instructions.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📱 How to Use

### For Students

1. **Get Pera Wallet**
   - Download [Pera Wallet](https://perawallet.app/) on your mobile device
   - Create or import an Algorand wallet

2. **Connect Wallet**
   - Click "Connect Wallet" on the homepage
   - Scan QR code (desktop) or approve in app (mobile)

3. **Register**
   - Fill in your information (name, college, department)
   - Upload a clear student photo
   - Upload your ID card photo
   - Click "Submit & Verify"

4. **Verification**
   - System automatically verifies your face
   - Get verified badge if faces match (80%+ confidence)
   - View your credentials on wallet page

5. **Access Your Wallet**
   - Click "Wallet" in navigation
   - View your verified profile
   - Download credentials

## 🏗️ Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling

### Blockchain
- **Algorand** - Blockchain platform
- **Pera Wallet** - Wallet integration
- **@perawallet/connect** - Connection SDK

### AI & Verification
- **Face++** - Facial recognition API
- Face detection and comparison
- Confidence score calculation

### Storage
- **LocalStorage** - Client-side data persistence
- **Firebase Firestore** (optional) - Cloud database

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ConnectPage.jsx      # Wallet connection
│   │   ├── StudentInfo.jsx      # Registration form
│   │   ├── WalletPage.jsx       # User dashboard
│   │   ├── ViewStudents.jsx     # Student directory
│   │   ├── Hero.jsx             # Home page
│   │   └── Navbar.jsx           # Navigation
│   ├── utils/
│   │   └── faceVerification.js  # Face++ integration
│   ├── firebase/
│   │   └── config.js            # Firebase setup
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── public/                      # Static assets
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Example env file
├── FACE_VERIFICATION_SETUP.md   # Face++ setup guide
└── README.md                    # This file
```

## 🔒 Security Features

- **Wallet Authentication** - Blockchain-based identity
- **AI Face Verification** - Biometric validation
- **Secure Storage** - Encrypted credentials
- **Session Management** - Persistent wallet sessions
- **Environment Variables** - Protected API keys

## 📖 Documentation

- **[Face Verification Setup](./FACE_VERIFICATION_SETUP.md)** - Complete guide for Face++ API setup
- **[Firebase Setup](./FIREBASE_SETUP.md)** - Optional cloud storage configuration

## 🎨 Features Breakdown

### ✅ Verification Badge System
- **Verified (✓)** - Green badge, 80%+ confidence
- **Not Verified (⚠)** - Yellow badge, below threshold
- Visual confidence meter
- Timestamp of verification

### 📊 Verification Metrics
- Face detection success rate
- Confidence percentage
- Verification date
- Mock mode indicator

### 🔄 Smart Routing
- Auto-redirect based on registration status
- Protected routes for registered users
- Session persistence across page reloads

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Mock Mode

Without Face++ API configured, the app runs in mock mode:
- All verifications succeed automatically
- 85.5% confidence score assigned
- "Mock verification mode" indicator shown
- Perfect for testing and development

## 🐛 Troubleshooting

### Face Verification Fails
- Ensure clear, front-facing photos
- Check Face++ API credentials
- Verify Face++ API quota
- Try mock mode for testing

### Wallet Connection Issues
- Install Pera Wallet app
- Check browser compatibility
- Clear browser cache
- Try different wallet

### Build Errors
- Clear `node_modules` and reinstall
- Check Node.js version (v16+)
- Verify all dependencies

## 📄 License

MIT License - feel free to use for your projects

## 🤝 Contributing

Contributions welcome! Please read contribution guidelines first.

## 📞 Support

For issues and questions:
- Check documentation files
- Review troubleshooting section
- Open an issue on GitHub

---

Built with ❤️ using React, Algorand, and Face++
```