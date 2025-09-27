// Firebase configuration
const firebaseConfig = {
            apiKey: "AIzaSyAEkxTwVTNOiDr5nqJzlF32GIhlts-HpRk",
            authDomain: "edupeak-bea8c.firebaseapp.com",
            projectId: "edupeak-bea8c",
            storageBucket: "edupeak-bea8c.firebasestorage.app",
            messagingSenderId: "783539303255",
            appId: "1:783539303255:web:4bb068761756a756dac412"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const googleLoginBtn = document.getElementById('googleLogin');

// Check if user is already logged in
auth.onAuthStateChanged(user => {
    if (user) {
        // Check if user is admin
        const adminEmails = ['admin1@example.com', 'admin2@example.com', 'admin3@example.com'];
        if (adminEmails.includes(user.email)) {
            window.location.href = 'admin-dashboard.html';
        } else {
            // Store user info in Firestore if new user
            db.collection('users').doc(user.uid).get()
                .then(doc => {
                    if (!doc.exists) {
                        db.collection('users').doc(user.uid).set({
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

// Google Sign In
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .catch(error => {
                console.error("Error during sign in:", error);
                alert("Sign in failed. Please try again.");
            });
    });
}