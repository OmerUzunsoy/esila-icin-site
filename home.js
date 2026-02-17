(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const app = window.EsilaApp;
    app.mountShell("home");
    app.registerServiceWorker();

    const state = app.getState();

    const simRuns = state.stats.simRuns;
    const survivalRate = simRuns ? Math.round((state.stats.simSuccess / simRuns) * 100) : 0;

    const homeXp = document.getElementById("homeXp");
    const homeLevel = document.getElementById("homeLevel");
    const homeSurvival = document.getElementById("homeSurvival");
    const homeNextLevel = document.getElementById("homeNextLevel");
    const homeStats = document.getElementById("homeStats");
    const homeHistory = document.getElementById("homeHistory");
    const dailyGoals = document.getElementById("dailyGoals");

    homeXp.textContent = String(state.economy.xp);
    homeLevel.textContent = String(app.levelFromXp(state.economy.xp));
    homeSurvival.textContent = `${survivalRate}%`;
    homeNextLevel.textContent = `${app.xpToNextLevel(state.economy.xp)} XP`;

    const stats = [
      { label: "Test Dogru", value: `${state.stats.quizCorrect}/${state.stats.quizTotal || 0}` },
      { label: "Doz Basarisi", value: String(state.stats.doseSolved) },
      { label: "Vital Karar", value: String(state.stats.vitalSolved) },
      { label: "Simulasyon", value: `${state.stats.simSuccess} basari / ${state.stats.simFail} kayip` },
      { label: "Acik Skin", value: String(state.inventory.skins.length) },
      { label: "Acik Upgrade", value: String(state.inventory.upgrades.length) }
    ];

    homeStats.innerHTML = stats
      .map((item) => `<div class="stat-card"><span>${item.label}</span><b>${item.value}</b></div>`)
      .join("");

    const goals = [
      {
        text: "Bugun en az 1 simulasyon vakasi tamamla",
        done: state.stats.simRuns > 0
      },
      {
        text: "Doz Lab'da en az 3 dogru yap",
        done: state.stats.doseSolved >= 3
      },
      {
        text: "Test Arena dogruluk oranini %70 ustune cikar",
        done: state.stats.quizTotal > 0 && state.stats.quizCorrect / state.stats.quizTotal >= 0.7
      }
    ];

    dailyGoals.innerHTML = goals
      .map(
        (goal) =>
          `<div class="goal ${goal.done ? "done" : ""}"><b>${goal.done ? "Tamam" : "Bekliyor"}</b><p>${goal.text}</p></div>`
      )
      .join("");

    if (!state.history.length) {
      homeHistory.innerHTML = "<p class='muted'>Henuz aktivite kaydi yok.</p>";
    } else {
      homeHistory.innerHTML = state.history
        .slice(0, 8)
        .map(
          (entry) =>
            `<div class="history-item ${entry.type}"><p>${entry.text}</p><small>${app.formatHistoryDate(entry.at)}</small></div>`
        )
        .join("");
    }
  });
})();
