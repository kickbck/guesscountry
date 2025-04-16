import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwTXSeBqdo8seIPLNbQcNcfXpssss03OQ",
  authDomain: "countryguesser-info1601.firebaseapp.com",
  projectId: "countryguesser-info1601",
  storageBucket: "countryguesser-info1601.firebasestorage.app",
  messagingSenderId: "108913989094",
  appId: "1:108913989094:web:be981920b02847a7a13227"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//fecth from firebase
async function getLeaderboard() {
  try {
    const docRef = doc(db, "leaderboard", "topScores");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const entries = docSnap.data().entries || [];
      return entries.sort((a, b) => b.score - a.score);
    }
    return [];
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    return [];
  }
}

async function displayLeaderboard() {
  const scores = await getLeaderboard();
  const leaderboardList = document.getElementById('leaderboard-list');
  
  leaderboardList.innerHTML = '';
  
  if (scores.length === 0) {
    leaderboardList.innerHTML = '<li>No scores available yet</li>';
    return;
  }
  
  //format
  scores.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="rank">${index + 1}.</span>
      <span class="name">${entry.username}</span>
      <span class="score">${entry.score || 0} pts</span>
    `;
    leaderboardList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', displayLeaderboard);