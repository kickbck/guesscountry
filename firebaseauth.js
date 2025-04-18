//SDKs from firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { setDoc, doc, getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDwTXSeBqdo8seIPLNbQcNcfXpssss03OQ",
  authDomain: "countryguesser-info1601.firebaseapp.com",
  projectId: "countryguesser-info1601",
  storageBucket: "countryguesser-info1601.firebasestorage.app",
  messagingSenderId: "108913989094",
  appId: "1:108913989094:web:be981920b02847a7a13227"
};

// initialize firebase + auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.innerHTML = message;
        messageDiv.style.opacity = 1;
        setTimeout(() => {
            messageDiv.style.opacity = 0;
        }, 5000);
    }
}

// auth state listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem('loggedInUserId', user.uid);
    } else {
        localStorage.removeItem('loggedInUserId');
    }
});

// logout 
function setupLogout() {
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                console.log("User signed out");
                window.location.href = 'login.html';
            }).catch((error) => {
                console.error("Logout error:", error);
            });
        });
    }
}

// more stuff for log out
document.addEventListener('DOMContentLoaded', () => {
    setupLogout();
    // protected pages, redirect if !auth
    onAuthStateChanged(auth, (user) => {
        const protectedPages = ['menu.html', 'game.html', 'leaderboard.html'];
        
        if (!user && protectedPages.some(page => window.location.pathname.includes(page))) {
            window.location.href = 'login.html';
        }
        //output for check
        if (user) {
            console.log("User logged in:", user.email);
            localStorage.setItem('loggedInUserId', user.uid);
        } else {
            console.log("No active user");
            localStorage.removeItem('loggedInUserId');
        }
    });
});

// sign up
document.getElementById('submitSignUp')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const userName = document.getElementById('uName').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = { email, userName };
            
            setDoc(doc(db, "users", user.uid), userData)
                .then(() => {
                    showMessage('Account Created Successfully', 'signUpMessage');
                    window.location.href = 'menu.html';
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email already exists', 'signUpMessage');
            } else {
                showMessage('Unable to create user', 'signUpMessage');
            }
        });
});

// sign in
document.getElementById('submitSignIn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login successful', 'signInMessage');
            window.location.href = 'menu.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect email or password', 'signInMessage');
            } else {
                showMessage('Account does not exist', 'signInMessage');
            }
        });
});



