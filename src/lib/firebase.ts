// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const app = getApps().length
//   ? getApp()
//   : initializeApp({
//       apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//       authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//       appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//     });

// export const auth = getAuth(app);


import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

let _auth: Auth | null = null;

/**
 * Firebase ko sirf tab start karta hai jab zaroorat ho (jaise OTP bhejte time),
 * build ke time nahi. Isse keys na hone par bhi build fail nahi hota.
 */
export function getFirebaseAuth(): Auth {
  if (!_auth) {
    const app = getApps().length
      ? getApp()
      : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        });
    _auth = getAuth(app);
  }
  return _auth;
}