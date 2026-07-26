import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authAPI, adminAPI } from '../services/api';
const mapAuthError = (err) => {
  // Log detailed error to console for developers
  console.error('Firebase Auth Error Details:', err);

  const errorCode = err.code || (err.message && err.message.includes('auth/') ? err.message.match(/auth\/[a-zA-Z0-9-]+/)?.[0] : null);

  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please wait a few minutes before trying again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    default:
      if (err.response?.data?.message) {
        return err.response.data.message;
      }
      return 'Something went wrong while signing you in. Please try again.';
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user/admin on mount
  useEffect(() => {
    // Immediate load from local storage to avoid flash
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedAdmin = localStorage.getItem('admin');
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          if (firebaseUser.emailVerified) {
            const token = await firebaseUser.getIdToken(true); // force refresh to get latest verification status
            localStorage.setItem('token', token);
            const res = await authAPI.getProfile();
            if (res.data.success) {
              const userData = res.data;
              const userObj = {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                profile: userData.profile || { bio: '', phone: '', currency: 'INR', monthlyBudget: 0 }
              };
              setUser(userObj);
              localStorage.setItem('user', JSON.stringify(userObj));
            }
          } else {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } else {
          // Only clear user session if it is not an Admin account
          if (!localStorage.getItem('adminToken')) {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Session validation failed:', err);
        // Only log out if the token has expired, is invalid, or the user was deleted/suspended
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Standard User Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Log in via Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // 2. Check if verified
      if (!firebaseUser.emailVerified) {
        // Do NOT sign out immediately, so they can verify on /verify-email page.
        throw new Error('Please verify your email first.');
      }
      
      // 3. Obtain Firebase ID Token
      const token = await firebaseUser.getIdToken(true);
      
      // 4. Send token to backend to retrieve MongoDB user document
      const res = await authAPI.login({}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data.success) {
        const userData = res.data;
        const userObj = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profile: userData.profile || { bio: '', phone: '', currency: 'INR', monthlyBudget: 0 }
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
        return { success: true };
      }
    } catch (err) {
      const msg = mapAuthError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // User Registration
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Set display name in Firebase
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      
      // 3. Send email verification
      await sendEmailVerification(userCredential.user);
      
      // 4. Retrieve ID token to authorize backend synchronization
      const token = await userCredential.user.getIdToken();
      
      // 5. Post to backend /register to synchronize database
      const res = await authAPI.register({ name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Do NOT sign out immediately, so they can verify on /verify-email page.
      
      if (res.data.success) {
        return { success: true, email };
      }
    } catch (err) {
      // Clean up Firebase user if sync failed
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch (delErr) {
          console.error('Failed to clean up Firebase user after sync error:', delErr);
        }
      }
      
      const msg = mapAuthError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Admin Login
  const loginAdmin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.login({ email, password });
      if (res.data.success) {
        const { token, ...adminData } = res.data;
        const adminObj = {
          _id: adminData._id,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role,
        };

        localStorage.setItem('adminToken', token);
        localStorage.setItem('admin', JSON.stringify(adminObj));
        setAdmin(adminObj);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Admin login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // User updates their own profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      // If updating email/password, handle in Firebase first
      if (auth.currentUser) {
        if (profileData.name && profileData.name !== auth.currentUser.displayName) {
          await updateFirebaseProfile(auth.currentUser, { displayName: profileData.name });
        }
      }

      const res = await authAPI.updateProfile(profileData);
      if (res.data.success) {
        const updatedData = res.data;
        
        const userObj = {
          _id: updatedData._id,
          name: updatedData.name,
          email: updatedData.email,
          role: updatedData.role,
          profile: updatedData.profile
        };

        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Sign out User
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Firebase signout error', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Sign out Admin
  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  // Check if current user is email verified (polls/reloads Firebase)
  const checkEmailVerification = async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          const token = await auth.currentUser.getIdToken(true);
          const res = await authAPI.login({}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.data.success) {
            const userData = res.data;
            const userObj = {
              _id: userData._id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              profile: userData.profile || { bio: '', phone: '', currency: 'INR', monthlyBudget: 0 }
            };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userObj));
            setUser(userObj);
            return true;
          }
        }
      }
      return false;
    } catch (err) {
      const msg = mapAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // Resend email verification link
  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true, message: 'Verification link resent successfully.' };
      }
      throw new Error('No user is currently signed in to resend verification.');
    } catch (err) {
      const msg = mapAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // Forgot password request
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset link sent to your email.' };
    } catch (err) {
      const msg = mapAuthError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        error,
        login,
        register,
        loginAdmin,
        logout,
        logoutAdmin,
        updateProfile,
        forgotPassword,
        checkEmailVerification,
        resendVerificationEmail,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
