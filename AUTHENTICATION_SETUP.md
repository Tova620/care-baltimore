# Authentication & Visit Log Setup Instructions

## Overview
This implementation adds:
1. Sign-in functionality for registered volunteers
2. Protected visit log page accessible only to authenticated volunteers
3. Visit log form that syncs to Google Sheets
4. Password-based authentication during volunteer registration

## Setup Steps

### 1. Enable Firebase Authentication
1. Go to Firebase Console > Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method
4. Save changes

### 2. Update Google Sheets ID for Visit Log
1. Open `functions/index.js`
2. Find line: `const VISIT_LOG_SHEET_ID = "YOUR_VISIT_LOG_SHEET_ID";`
3. Replace with your actual Google Sheet ID from the Visit Log sheet URL
4. The sheet should have columns: Timestamp, Email, Name, Person Visited, Visit Date, Notes

### 3. Share Google Sheet with Service Account
1. Open your Visit Log Google Sheet
2. Click "Share" button
3. Add the service account email (found in `functions/service-account-key.json`)
4. Give it "Editor" permissions

### 4. Deploy Firebase Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

### 5. Install Required Angular Dependencies
```bash
npm install
```

## How It Works

### Volunteer Registration Flow
1. Volunteer fills out the registration form at `/join-our-volunteers`
2. They now must provide a password (minimum 6 characters)
3. Upon submission:
   - Firebase Auth account is created with email/password
   - Volunteer data is saved to Firestore `volunteers` collection
   - Data syncs to Google Sheets via Cloud Function

### Sign-In Flow
1. Volunteer clicks "Sign In" button in top-right of navbar
2. They enter their email and password
3. System verifies they are a registered volunteer in Firestore
4. Upon successful authentication, they're redirected to `/visit-log`

### Visit Log Flow
1. Only authenticated volunteers can access `/visit-log`
2. Form is pre-filled with volunteer's email and name
3. Volunteer enters:
   - Name of person visited
   - Date of visit
   - Optional notes
4. Upon submission:
   - Data is saved to Firestore `visitLogs` collection
   - Cloud Function syncs to Visit Log Google Sheet

### Protected Routes
- `/visit-log` is protected by AuthGuard
- Unauthenticated users are redirected to `/sign-in`
- "Visit Log" tab only appears in navbar when user is signed in

## Files Created/Modified

### New Files
- `src/app/auth.service.ts` - Authentication service
- `src/app/auth.guard.ts` - Route guard for protected pages
- `src/app/sign-in/` - Sign-in component
- `src/app/visit-log/` - Visit log component

### Modified Files
- `src/app/firebase.service.ts` - Added submitVisitLog method and auth integration
- `src/app/join-our-volunteers/` - Added password fields
- `src/app/navbar/` - Added sign-in button and conditional visit log tab
- `src/app/app-routing.module.ts` - Added new routes
- `functions/index.js` - Added visitLogToSheet Cloud Function

## Security Notes
- Passwords are handled by Firebase Authentication (not stored in Firestore)
- Only registered volunteers (in Firestore) can sign in
- Visit log page is protected by route guard
- All data syncs to Google Sheets via secure Cloud Functions
