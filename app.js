// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEkxTwVTNOiDr5nqJzlF32GIhlts-HpRk",
  authDomain: "edupeak-bea8c.firebaseapp.com",
  projectId: "edupeak-bea8c",
  storageBucket: "edupeak-bea8c.firebasestorage.app",
  messagingSenderId: "783539303255",
  appId: "1:783539303255:web:4bb068761756a756dac412",
  measurementId: "G-SCMVNDB400"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const googleLoginBtn = document.getElementById('googleLogin');
const adminLoginBtn = document.getElementById('adminLogin'); // <-- new button
const adminEmailInput = document.getElementById('adminEmail'); // <-- new input
const adminPassInput = document.getElementById('adminPass');   // <-- new input

// Only one admin email
const adminEmail = "umashiduwara890@gmail.com";

// Check if user is already logged in
auth.onAuthStateChanged(user => {
    if (user) {
        if (user.email === adminEmail) {
            window.location.href = 'admin-dashboard.html';
        } else {
            // Store user info in Firestore if new user
            db.collection('users').doc(user.uid).get()
                .then(doc => {
                    if (!doc.exists) {
                        return db.collection('users').doc(user.uid).set({
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                })
                .then(() => {
                    window.location.href = 'dashboard.html';
                })
                .catch(error => {
                    console.error("Error checking user:", error);
                });
        }
    }
});

// Admin Email/Password Login
if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
        const email = adminEmailInput.value.trim();
        const password = adminPassInput.value;

        if (!email || !password) {
            return alert("Please enter admin email and password");
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                if (result.user.email === adminEmail) {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    alert("This account is not authorized as admin.");
                    auth.signOut();
                }
            })
            .catch(error => {
                console.error("Admin login failed:", error);
                alert("Admin login failed: " + error.message);
            });
    });
}

// Google Sign In (for normal users)
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .catch(error => {
                console.error("Error during Google sign in:", error);
                alert("Google sign in failed. Please try again.");
            });
    });
}
