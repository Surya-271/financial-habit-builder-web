const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully using serviceAccountKey.json');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK using serviceAccountKey.json:', error.message);
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    let serviceAccount;
    const envValue = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
    if (envValue.startsWith('{')) {
      serviceAccount = JSON.parse(envValue);
    } else {
      // Support Base64 encoded JSON strings
      const decoded = Buffer.from(envValue, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decoded);
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully using FIREBASE_SERVICE_ACCOUNT environment variable');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK using FIREBASE_SERVICE_ACCOUNT:', error.message);
  }
} else {
  console.warn('WARNING: Firebase Admin credentials file not found at:', serviceAccountPath);
  console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT environment variable is also not set.');
  console.warn('Please generate a Service Account key in your Firebase Console and save it to serviceAccountKey.json or set FIREBASE_SERVICE_ACCOUNT env var.');
}

module.exports = admin;
