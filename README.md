# AI Fitness Trainer

![AI Fitness Trainer Banner](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop&q=80)

**AI Fitness Trainer** is a cutting-edge web application designed to revolutionize your fitness journey. Powered by advanced Artificial Intelligence and Computer Vision, it provides personalized workout plans, diet schedules, and real-time form correction to help you achieve your health goals safely and effectively.

## 🚀 Features

- **🤖 AI-Powered Personalization**: Generates custom workout routines and diet plans based on your body type, goals, and fitness level using Gemini AI.
- **📷 Real-Time Form Correction**: Utilizes TensorFlow.js and MoveNet to analyze your exercise form via webcam and provide instant feedback to prevent injuries.
- **📊 Smart Analytics**: Tracks your progress with detailed charts and insights, monitoring reps, sets, and overall performance.
- **🔐 Secure Authentication**: Robust user management and data security powered by Firebase Authentication and Firestore.
- **🎨 Modern UI/UX**: A sleek, responsive, and dark-themed interface built with Next.js, Tailwind CSS, and Shadcn/UI for a premium user experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **AI & ML**: [TensorFlow.js](https://www.tensorflow.org/js), [MediaPipe](https://developers.google.com/mediapipe), [Google Gemini API](https://ai.google.dev/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/prashant13-bh/AI-Fitness-Trainer.git
    cd AI-Fitness-Trainer
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your API keys.
    **Note:** Never commit your actual keys to GitHub.

    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

    # AI Gateway / Gemini API
    AI_GATEWAY_API_KEY=your_ai_gateway_key
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📸 Screenshots

_(Add your screenshots here. Create a `public/screenshots` folder and link them)_

|                                  Dashboard                                   |                              Workout Analysis                              |
| :--------------------------------------------------------------------------: | :------------------------------------------------------------------------: |
| ![Dashboard](https://via.placeholder.com/600x400.png?text=Dashboard+Preview) | ![Analysis](https://via.placeholder.com/600x400.png?text=Workout+Analysis) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
