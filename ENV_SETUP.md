# Firebase Configuration Template

Copy this content to create a `.env.local` file in your project root and fill in your Firebase project details.

Get these values from: **Firebase Console → Project Settings → General**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## How to Get Firebase Credentials:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create one)
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to "Your apps" section
5. Click on the web app (</>) or create one
6. Copy the configuration values

## AI Gateway (Optional):

```env
AI_GATEWAY_API_KEY=your_ai_gateway_key
```

⚠️ **Important:** Never commit `.env.local` to Git. It's already in `.gitignore`.
