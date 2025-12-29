# Firebase Security Rules Documentation

## Firestore Rules (`firestore.rules`)

Comprehensive security rules have been created for all application features.

### Collections & Permissions

#### **Users Collection** (`/users/{userId}`)

- ✅ Users can only read/write their own data
- ✅ Email validation on create
- ✅ Required fields: `email`, `createdAt`

**Subcollections:**

- `profilePictures/{pictureId}` - User profile images
- `fitnessGoals/{goalId}` - Fitness goals and targets
- `bodyMeasurements/{measurementId}` - Body measurements over time
- `preferences/{prefId}` - User app preferences

#### **Workouts Collection** (`/workouts/{workoutId}`)

- ✅ Users can only access their own workouts
- ✅ Required fields: `userId`, `date`, `createdAt`

**Subcollections:**

- `exercises/{exerciseId}` - Exercises in the workout
- `sets/{setId}` - Sets and reps data

#### **Workout Plans** (`/workoutPlans/{planId}`)

- ✅ Custom workout plan templates
- ✅ Required fields: `userId`, `name`, `createdAt`

**Subcollections:**

- `days/{dayId}` - Daily workout schedules

#### **Diet Plans** (`/dietPlans/{planId}`)

- ✅ Personalized diet plans
- ✅ Required fields: `userId`, `name`, `createdAt`

**Subcollections:**

- `meals/{mealId}` - Meal details and nutrition

#### **Progress Tracking** (`/progress/{progressId}`)

- ✅ Weight, measurements, photos
- ✅ Required fields: `userId`, `date`, `createdAt`

**Subcollections:**

- `photos/{photoId}` - Before/after progress photos

#### **AI Analysis** (`/aiAnalysis/{analysisId}`)

- ✅ Pose detection results
- ✅ Form correction suggestions
- ✅ Required fields: `userId`, `timestamp`, `analysisType`

#### **Notifications** (`/notifications/{notificationId}`)

- ✅ User can read their own notifications
- ✅ System can create notifications for any user

#### **Achievements** (`/achievements/{achievementId}`)

- ✅ Badges and milestones
- ✅ User-specific access

#### **Streaks** (`/streaks/{streakId}`)

- ✅ Daily activity tracking
- ✅ Workout consistency monitoring

#### **Exercise Library** (`/exerciseLibrary/{exerciseId}`)

- ✅ Read-only for all authenticated users
- ✅ Admin-only write access (via Admin SDK)

---

## Storage Rules (`storage.rules`)

### File Upload Limits & Permissions

#### **Profile Pictures** (`/users/{userId}/profile/`)

- ✅ Publicly readable (by authenticated users)
- ✅ Owner can upload
- ✅ Images only
- ✅ Max size: 5MB

#### **Progress Photos** (`/users/{userId}/progress/`)

- ✅ Private (owner only)
- ✅ Images only
- ✅ Max size: 10MB

#### **Workout Media** (`/users/{userId}/workouts/`)

- ✅ Private (owner only)
- ✅ Images and videos
- ✅ Max size: 50MB

#### **AI Analysis Media** (`/users/{userId}/analysis/`)

- ✅ Private (owner only)
- ✅ Images and videos
- ✅ Max size: 100MB

---

## How to Deploy

### Deploy Firestore Rules:

```bash
firebase deploy --only firestore:rules
```

### Deploy Storage Rules:

```bash
firebase deploy --only storage:rules
```

### Deploy Both:

```bash
firebase deploy --only firestore:rules,storage:rules
```

---

## Security Features

✅ **Authentication Required** - All operations require valid Firebase auth  
✅ **User Isolation** - Users can only access their own data  
✅ **Data Validation** - Required fields enforced on creation  
✅ **Email Validation** - Regex check for valid email format  
✅ **File Type Validation** - Only allowed file types (images/videos)  
✅ **Size Limits** - Prevent abuse with file size restrictions  
✅ **Subcollection Security** - Parent document ownership checked

---

## Testing Rules

You can test these rules in the Firebase Console:

1. Go to Firebase Console → Firestore/Storage
2. Click "Rules" tab
3. Use the "Rules Playground" to simulate requests

Example test cases:

- ✅ User can read their own `/users/{uid}` document
- ❌ User cannot read another user's `/users/{otherUid}` document
- ✅ User can create `/workouts/{id}` with their `userId`
- ❌ User cannot create workout with someone else's `userId`
