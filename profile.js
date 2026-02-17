(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const app = window.EsilaApp;
    app.mountShell("profile");
    app.registerServiceWorker();

    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const profileNameInput = document.getElementById("profileNameInput");
    const avatarLarge = document.getElementById("profileAvatarLarge");
    const skinShopGrid = document.getElementById("skinShopGrid");
    const upgradeShopGrid = document.getElementById("upgradeShopGrid");
    const profileStats = document.getElementById("profileStats");
    const ownedUpgrades = document.getElementById("ownedUpgrades");

    function render() {
      const state = app.getState();
      profileNameInput.value = state.profile.name;
      app.applySkinToElement(avatarLarge, state.profile.skin, state.profile.name.slice(0, 1));

      const simRuns = state.stats.simRuns;
      const survival = simRuns ? Math.round((state.stats.simSuccess / simRuns) * 100) : 0;

      profileStats.innerHTML = [
        { label: "Toplam XP", value: state.economy.xp },
        { label: "Seviye", value: state.economy.level },
        { label: "Coin", value: state.economy.coins },
        { label: "Sim Basari", value: `${state.stats.simSuccess}/${simRuns}` },
        { label: "Hayatta Kalma", value: `${survival}%` },
        { label: "Toplam Test", value: state.stats.quizTotal }
      ]
        .map((row) => `<div class="stat-card"><span>${row.label}</span><b>${row.value}</b></div>`)
        .join("");

      renderSkins();
      renderUpgrades();
      app.mountShell("profile");
    }

    function renderSkins() {
      const state = app.getState();

      skinShopGrid.innerHTML = app.SKINS.map((skin) => {
        const unlocked = state.inventory.skins.includes(skin.id);
        const active = state.profile.skin === skin.id;

        let button = "";
        if (active) {
          button = `<button class="btn btn-ghost" disabled>Aktif</button>`;
        } else if (unlocked) {
          button = `<button class="btn btn-primary" data-skin-equip="${skin.id}">Equip</button>`;
        } else {
          button = `<button class="btn btn-primary" data-skin-buy="${skin.id}">${skin.cost} coin</button>`;
        }

        return `
          <article class="shop-card">
            <div class="shop-preview ${skin.className}">E</div>
            <h3>${skin.name}</h3>
            <p>${skin.desc}</p>
            ${button}
          </article>
        `;
      }).join("");

      skinShopGrid.querySelectorAll("[data-skin-buy]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const result = app.buySkin(btn.dataset.skinBuy);
          app.notify(result.msg, result.ok ? "gain" : "bad");
          render();
        });
      });

      skinShopGrid.querySelectorAll("[data-skin-equip]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const result = app.equipSkin(btn.dataset.skinEquip);
          app.notify(result.msg, result.ok ? "gain" : "bad");
          render();
        });
      });
    }

    function renderUpgrades() {
      const state = app.getState();
      const mods = app.getUpgradeModifiers();

      upgradeShopGrid.innerHTML = app.UPGRADES.map((upgrade) => {
        const owned = state.inventory.upgrades.includes(upgrade.id);
        const button = owned
          ? `<button class="btn btn-ghost" disabled>Aktif</button>`
          : `<button class="btn btn-primary" data-upgrade-buy="${upgrade.id}">${upgrade.cost} coin</button>`;

        return `
          <article class="shop-card">
            <h3>${upgrade.name}</h3>
            <p>${upgrade.desc}</p>
            ${button}
          </article>
        `;
      }).join("");

      const ownedList = [];
      if (state.inventory.upgrades.includes("monitor_plus")) ownedList.push("Monitor Plus: Baslangic stabilitesi +6");
      if (state.inventory.upgrades.includes("trauma_kit")) ownedList.push(`Trauma Kit: Kanama kontrol etkisi x${mods.traumaBoost.toFixed(2)}`);
      if (state.inventory.upgrades.includes("rapid_team")) ownedList.push(`Rapid Team: Kod cagrisi etkisi x${mods.rapidTeamBoost.toFixed(2)}`);
      if (state.inventory.upgrades.includes("smart_pump")) ownedList.push("Smart Pump: Doz hatasi zarari azalir");
      if (state.inventory.upgrades.includes("sterile_pack")) ownedList.push("Sterile Pack: Enfeksiyon ceza etkisi azalir");
      if (state.inventory.upgrades.includes("mentor_ai")) ownedList.push(`Mentor AI: XP carpan x${mods.xpBoost.toFixed(2)}`);

      ownedUpgrades.innerHTML = ownedList.length
        ? ownedList.map((text) => `<span class="chip">${text}</span>`).join("")
        : "<span class='chip'>Henuz upgrade alinmadi.</span>";

      upgradeShopGrid.querySelectorAll("[data-upgrade-buy]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const result = app.buyUpgrade(btn.dataset.upgradeBuy);
          app.notify(result.msg, result.ok ? "gain" : "bad");
          render();
        });
      });
    }

    saveProfileBtn.addEventListener("click", () => {
      app.updateProfileName(profileNameInput.value);
      app.notify("Profil guncellendi.", "gain");
      render();
    });

    profileNameInput.addEventListener("input", () => {
      app.applySkinToElement(avatarLarge, app.getState().profile.skin, profileNameInput.value.slice(0, 1));
    });

    render();
  });
})();
