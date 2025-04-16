document.addEventListener('DOMContentLoaded', () => {
  const leaderboardList = document.getElementById('leaderboard-list');
  leaderboardList.innerHTML = '';

  const scores = JSON.parse(localStorage.getItem('local-leaderboard')) || [];

  if (scores.length === 0) {
    leaderboardList.innerHTML = '<li>No scores available yet.</li>';
    return;
  }

  // Sort highest to lowest
  scores.sort((a, b) => b.score - a.score);

  scores.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="rank">${index + 1}.</span>
      <span class="name">${entry.username}</span>
      <span class="score">${entry.score} pts</span>
    `;
    leaderboardList.appendChild(li);
  });
});
