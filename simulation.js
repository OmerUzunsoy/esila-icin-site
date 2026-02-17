(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const app = window.EsilaApp;
    app.mountShell("simulation");
    app.registerServiceWorker();

    const el = {
      startBtn: document.getElementById("simStartBtn"),
      scenarioName: document.getElementById("simScenarioName"),
      scenarioInfo: document.getElementById("simScenarioInfo"),
      turnStat: document.getElementById("simTurnStat"),
      phaseText: document.getElementById("simPhaseText"),
      phaseHint: document.getElementById("simPhaseHint"),
      actionGrid: document.getElementById("actionGrid"),
      selectedActionTag: document.getElementById("selectedActionTag"),
      applyActionBtn: document.getElementById("applyActionBtn"),
      complicationList: document.getElementById("complicationList"),
      simLog: document.getElementById("simLog"),
      simResult: document.getElementById("simResult"),
      selectedZoneLabel: document.getElementById("selectedZoneLabel"),
      bodyHint: document.getElementById("bodyHint"),
      spo2Value: document.getElementById("spo2Value"),
      hrValue: document.getElementById("hrValue"),
      bpValue: document.getElementById("bpValue"),
      conValue: document.getElementById("conValue"),
      hbValue: document.getElementById("hbValue"),
      bleedValue: document.getElementById("bleedValue"),
      spo2Bar: document.getElementById("spo2Bar"),
      hrBar: document.getElementById("hrBar"),
      bpBar: document.getElementById("bpBar"),
      conBar: document.getElementById("conBar"),
      hbBar: document.getElementById("hbBar"),
      bleedBar: document.getElementById("bleedBar")
    };

    const run = {
      active: false,
      finished: false,
      scenario: null,
      phaseIndex: 0,
      turn: 0,
      maxTurns: 0,
      selectedAction: null,
      selectedZone: "chest",
      patient: null,
      complications: [],
      score: 0,
      log: []
    };

    function createPatient(baseline) {
      const mods = app.getUpgradeModifiers();
      return {
        spo2: app.randomRange(baseline.spo2[0], baseline.spo2[1]),
        hr: app.randomRange(baseline.hr[0], baseline.hr[1]),
        bpSys: app.randomRange(baseline.bpSys[0], baseline.bpSys[1]),
        bpDia: app.randomRange(baseline.bpDia[0], baseline.bpDia[1]),
        hb: app.randomRange(Math.round(baseline.hb[0] * 10), Math.round(baseline.hb[1] * 10)) / 10,
        temp: app.randomRange(Math.round(baseline.temp[0] * 10), Math.round(baseline.temp[1] * 10)) / 10,
        con: app.randomRange(baseline.con[0], baseline.con[1]) + mods.monitorBonus,
        bleed: app.randomRange(baseline.bleed[0], baseline.bleed[1])
      };
    }

    function clampPatient() {
      run.patient.spo2 = app.clamp(run.patient.spo2, 50, 100);
      run.patient.hr = app.clamp(run.patient.hr, 30, 190);
      run.patient.bpSys = app.clamp(run.patient.bpSys, 40, 190);
      run.patient.bpDia = app.clamp(run.patient.bpDia, 20, 120);
      run.patient.hb = app.clamp(run.patient.hb, 5.0, 16.5);
      run.patient.temp = app.clamp(run.patient.temp, 34.0, 41.8);
      run.patient.con = app.clamp(run.patient.con, 0, 100);
      run.patient.bleed = app.clamp(run.patient.bleed, 0, 100);
    }

    function getComplication(id) {
      return run.complications.find((item) => item.id === id) || null;
    }

    function getCompName(id) {
      const map = {
        bleeding: "Kanama",
        hypoxia: "Hipoksi",
        infection: "Enfeksiyon Riski",
        med_error: "Ilac Hatasi",
        shock: "Sok",
        arrhythmia: "Aritmi",
        septic_drop: "Septik Dusus"
      };
      return map[id] || id;
    }

    function addLog(text, type = "info") {
      run.log.unshift({ text, type, at: new Date().toISOString() });
      if (run.log.length > 25) run.log = run.log.slice(0, 25);
      renderLog();
    }

    function addComplication(id, severity, source, zone = null) {
      const existing = getComplication(id);
      if (existing) {
        existing.severity = app.clamp(existing.severity + severity, 1, 4);
        existing.zone = existing.zone || zone;
        existing.source = source;
      } else {
        run.complications.push({ id, severity: app.clamp(severity, 1, 4), ticks: 0, source, zone });
      }
      addLog(`Komplikasyon gelisti: ${getCompName(id)} (S${app.clamp(severity, 1, 4)})`, "bad");
    }

    function reduceComplication(id, amount) {
      const comp = getComplication(id);
      if (!comp) return false;
      comp.severity = app.clamp(comp.severity - amount, 0, 4);
      if (comp.severity <= 0) {
        run.complications = run.complications.filter((item) => item.id !== id);
        addLog(`${getCompName(id)} kontrol altina alindi.`, "gain");
      }
      return true;
    }

    function tickComplications() {
      const bleedComp = getComplication("bleeding");

      run.complications.forEach((comp) => {
        comp.ticks += 1;

        if (comp.id === "bleeding") {
          run.patient.hb -= 0.28 * comp.severity;
          run.patient.bpSys -= 2.4 * comp.severity;
          run.patient.hr += 3.1 * comp.severity;
          run.patient.bleed += 5.2 * comp.severity;
          if (comp.severity >= 3 && !getComplication("shock")) {
            addComplication("shock", 1, "Kontrolsuz kanama", comp.zone);
          }
        }

        if (comp.id === "hypoxia") {
          run.patient.spo2 -= 2.1 * comp.severity;
          run.patient.hr += 1.6 * comp.severity;
          run.patient.con -= 2.4 * comp.severity;
          if (run.patient.spo2 < 82 && !getComplication("arrhythmia")) {
            addComplication("arrhythmia", 1, "Derin hipoksi");
          }
        }

        if (comp.id === "infection") {
          run.patient.temp += 0.18 * comp.severity;
          run.patient.hr += 1.2 * comp.severity;
          run.patient.bpSys -= 0.9 * comp.severity;
          if (comp.severity >= 3 && !getComplication("septic_drop")) {
            addComplication("septic_drop", 1, "Enfeksiyon ilerlemesi");
          }
        }

        if (comp.id === "med_error") {
          run.patient.con -= 3.3 * comp.severity;
          run.patient.bpSys -= 1.8 * comp.severity;
          run.patient.hr += 1.1 * comp.severity;
        }

        if (comp.id === "shock") {
          run.patient.bpSys -= 3.4 * comp.severity;
          run.patient.bpDia -= 1.9 * comp.severity;
          run.patient.con -= 2.6 * comp.severity;
          run.patient.hr += 3.2 * comp.severity;
        }

        if (comp.id === "arrhythmia") {
          run.patient.hr += 4.2 * comp.severity;
          run.patient.bpSys -= 1.3 * comp.severity;
          run.patient.con -= 0.9 * comp.severity;
        }

        if (comp.id === "septic_drop") {
          run.patient.bpSys -= 2.7 * comp.severity;
          run.patient.temp += 0.2 * comp.severity;
          run.patient.hr += 1.8 * comp.severity;
          run.patient.con -= 1.7 * comp.severity;
        }

        if (comp.ticks % 3 === 0 && comp.severity < 4) {
          comp.severity += 1;
        }
      });

      if (!bleedComp && run.patient.bleed > 0) {
        run.patient.bleed = Math.max(0, run.patient.bleed - 4);
      }

      clampPatient();
    }

    function actionHelpsComplication(actionId) {
      if (actionId === "oxygen_support" && (getComplication("hypoxia") || getComplication("arrhythmia"))) return true;
      if (actionId === "iv_fluid" && (getComplication("shock") || getComplication("septic_drop"))) return true;
      if (actionId === "pressure_dressing" && getComplication("bleeding")) return true;
      if (actionId === "sterile_field" && getComplication("infection")) return true;
      if (actionId === "medication_recheck" && getComplication("med_error")) return true;
      if (actionId === "call_team" && run.complications.length > 0) return true;
      return false;
    }

    function applyActionDetails(actionId) {
      const mods = app.getUpgradeModifiers();

      if (actionId === "abc_assess") {
        run.patient.con += 2;
        run.patient.bpSys += 1;
        run.score += 4;
      }

      if (actionId === "monitor_vitals") {
        run.patient.con += 1;
        run.patient.bpSys += 1;
        run.score += 3;
      }

      if (actionId === "oxygen_support") {
        run.patient.spo2 += 4;
        run.score += 4;
        reduceComplication("hypoxia", 2);
        reduceComplication("arrhythmia", 1);
      }

      if (actionId === "iv_fluid") {
        run.patient.bpSys += 4;
        run.patient.bpDia += 2;
        run.score += 4;
        reduceComplication("shock", 2);
        reduceComplication("septic_drop", 1);
      }

      if (actionId === "pressure_dressing") {
        const bleeding = getComplication("bleeding");
        if (bleeding) {
          const zoneMatch = bleeding.zone ? run.selectedZone === bleeding.zone : true;
          const base = zoneMatch ? 2 : 1;
          const amount = Math.max(1, Math.round(base * mods.traumaBoost));
          reduceComplication("bleeding", amount);
          run.patient.bleed = Math.max(0, run.patient.bleed - amount * 12);
          run.score += zoneMatch ? 10 : 6;
          addLog(zoneMatch ? "Dogru bolgede basinci pansuman uygulandi." : "Basincli pansuman uygulandi fakat bolge tam hedef degildi.", "gain");
        } else {
          run.score -= 1;
          addLog("Aktif kanama olmadan pansuman secildi.", "warn");
        }
      }

      if (actionId === "sterile_field") {
        run.score += 5;
        reduceComplication("infection", 2);
      }

      if (actionId === "medication_recheck") {
        run.score += 6;
        reduceComplication("med_error", 2);
      }

      if (actionId === "call_team") {
        const amount = Math.max(1, Math.round(mods.rapidTeamBoost));
        run.score += 5;
        run.complications.slice().forEach((comp) => reduceComplication(comp.id, amount));
      }

      if (actionId === "record_followup") {
        run.score += 6;
        run.patient.con += 1;
      }

      if (actionId === "scalpel_misuse") {
        run.score -= 14;
        addComplication("bleeding", 2, "Gereksiz invaziv girisim", run.selectedZone);
        run.patient.bleed += 18;
      }

      if (actionId === "skip_alarm") {
        run.score -= 12;
        addComplication("hypoxia", 2, "Alarmi gormezden gelme");
      }

      if (actionId === "wrong_dose") {
        run.score -= 13;
        const severity = Math.max(1, Math.round(2 * mods.smartPumpPenaltyFactor));
        addComplication("med_error", severity, "Doz dogrulamadan ilac");
      }

      if (actionId === "skip_hygiene") {
        run.score -= 11;
        const severity = Math.max(1, Math.round(2 * mods.sterilePenaltyFactor));
        addComplication("infection", severity, "Hijyen adimi atlandi");
      }

      clampPatient();
    }

    function evaluateTurn() {
      if (!run.active || run.finished) {
        app.notify("Once yeni vaka baslat.", "bad");
        return;
      }

      if (!run.selectedAction) {
        app.notify("Once bir aksiyon sec.", "bad");
        return;
      }

      const phase = run.scenario.phases[run.phaseIndex];
      if (!phase) return;

      const actionId = run.selectedAction;
      const isPrimary = phase.good.includes(actionId);
      const isRescue = actionHelpsComplication(actionId);

      if (isPrimary) {
        run.score += 14;
        addLog(`Dogru adim: ${labelOfAction(actionId)}`, "gain");
        el.bodyHint.textContent = "Dogru klinik secim.";
        el.bodyHint.className = "feedback-line ok";
      } else if (isRescue) {
        run.score += 8;
        addLog(`Kurtarici adim: ${labelOfAction(actionId)}`, "gain");
        el.bodyHint.textContent = "Vaka hedefine tam uymasa da komplikasyon yonetimi dogru.";
        el.bodyHint.className = "feedback-line warn";
      } else {
        run.score -= 8;
        addComplication(phase.failComp, 1, "Yanlis adim secimi", run.selectedZone);
        addLog(`Yanlis adim: ${labelOfAction(actionId)}`, "bad");
        el.bodyHint.textContent = "Yanlis secim komplikasyon riskini arttirdi.";
        el.bodyHint.className = "feedback-line bad";
      }

      applyActionDetails(actionId);
      tickComplications();

      run.turn += 1;
      run.phaseIndex += 1;
      run.selectedAction = null;

      if (isPatientLost()) {
        endRun(false, "Hasta kaybedildi. Kritik degerler esik altina dustu.");
        return;
      }

      if (run.phaseIndex >= run.maxTurns) {
        endRun(true, "Vaka tamamlandi. Hasta hayatta ve stabil sinirlarda.");
        return;
      }

      renderScenario();
      renderActions();
      renderMonitor();
      renderComplications();
      renderBody();
    }

    function isPatientLost() {
      return (
        run.patient.spo2 <= 68 ||
        run.patient.bpSys <= 58 ||
        run.patient.con <= 15 ||
        run.patient.hb <= 6.0 ||
        run.patient.bleed >= 95
      );
    }

    function startRun() {
      run.active = true;
      run.finished = false;
      run.scenario = app.randomPick(app.SIM_SCENARIOS);
      run.phaseIndex = 0;
      run.turn = 1;
      run.maxTurns = run.scenario.phases.length;
      run.selectedAction = null;
      run.selectedZone = "chest";
      run.patient = createPatient(run.scenario.baseline);
      run.complications = [];
      run.score = 0;
      run.log = [];

      el.simResult.textContent = "Vaka aktif. Hasta durumunu stabil tut ve turleri tamamla.";
      el.simResult.className = "result-box";

      renderScenario();
      renderActions();
      renderMonitor();
      renderComplications();
      renderBody();

      addLog(`${run.scenario.title} basladi.`, "info");
      app.notify("Yeni rastgele vaka basladi.", "gain");
    }

    function endRun(success, message) {
      run.active = false;
      run.finished = true;

      const survivalBonus = success ? 1 : 0;
      const normalizedScore = Math.max(0, Math.round(run.score + run.patient.con + run.patient.spo2 - run.patient.bleed));

      if (success) {
        const xp = 80 + Math.round(normalizedScore * 0.33);
        const coins = 45 + Math.round(normalizedScore * 0.16);
        app.addRewards({ xp, coins, reason: "Simulasyon Basari" });
        app.recordStats({ simRuns: 1, simSuccess: 1 });
        app.notify(`Hasta hayatta kaldi: +${xp} XP / +${coins} coin`, "gain");
      } else {
        const xp = 20 + Math.round(Math.max(0, run.score) * 0.08);
        app.addRewards({ xp, coins: 0, reason: "Simulasyon Denemesi" });
        app.recordStats({ simRuns: 1, simFail: 1 });
        app.notify(`Hasta kaybi: +${xp} XP, coin yok`, "bad");
      }

      app.addHistory(
        `${run.scenario.title}: ${success ? "Hasta yasadi" : "Hasta kaybi"} | Skor ${Math.max(0, run.score)} | Bonus ${survivalBonus}`,
        success ? "gain" : "bad"
      );

      el.simResult.textContent = `${message} | Skor: ${Math.max(0, run.score)}`;
      el.simResult.className = `result-box ${success ? "ok" : "bad"}`;

      addLog(message, success ? "gain" : "bad");
      renderMonitor();
      renderComplications();
      renderBody();
      app.mountShell("simulation");
    }

    function labelOfAction(id) {
      const action = app.SIM_ACTIONS.find((item) => item.id === id);
      return action ? action.label : id;
    }

    function renderScenario() {
      const phase = run.scenario.phases[run.phaseIndex];
      el.scenarioName.textContent = `Vaka: ${run.scenario.title}`;
      el.scenarioInfo.textContent = `${run.scenario.department} | ${run.scenario.summary}`;
      el.turnStat.innerHTML = `<b>Tur:</b> ${run.turn} / ${run.maxTurns}`;

      if (phase) {
        el.phaseText.textContent = phase.prompt;
        el.phaseHint.textContent = phase.hint;
      }
    }

    function renderActions() {
      const groups = ["Temel", "Acil", "Riskli"];

      el.actionGrid.innerHTML = groups
        .map((group) => {
          const cards = app.SIM_ACTIONS
            .filter((action) => action.group === group)
            .map((action) => {
              const selected = run.selectedAction === action.id ? "selected" : "";
              const kind = group === "Riskli" ? "risk" : group === "Acil" ? "urgent" : "safe";
              return `<button class="action-card ${selected} ${kind}" data-action-id="${action.id}">${action.label}</button>`;
            })
            .join("");

          return `<div class="action-group"><h3>${group}</h3><div class="action-row">${cards}</div></div>`;
        })
        .join("");

      el.selectedActionTag.textContent = run.selectedAction
        ? `Secilen aksiyon: ${labelOfAction(run.selectedAction)}`
        : "Secilen aksiyon: -";

      el.actionGrid.querySelectorAll("[data-action-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          run.selectedAction = btn.dataset.actionId;
          renderActions();
        });
      });
    }

    function metricPercent(value, min, max) {
      return app.clamp(Math.round(((value - min) / (max - min)) * 100), 0, 100);
    }

    function setBar(node, value, min, max, inverse = false) {
      const p = metricPercent(value, min, max);
      node.style.width = `${inverse ? 100 - p : p}%`;
      node.className = p < 35 ? "bad" : p < 60 ? "warn" : "ok";
      if (inverse) {
        const inv = 100 - p;
        node.className = inv < 35 ? "ok" : inv < 60 ? "warn" : "bad";
      }
    }

    function renderMonitor() {
      if (!run.patient) return;
      el.spo2Value.textContent = `${Math.round(run.patient.spo2)}%`;
      el.hrValue.textContent = `${Math.round(run.patient.hr)}/dk`;
      el.bpValue.textContent = `${Math.round(run.patient.bpSys)}/${Math.round(run.patient.bpDia)}`;
      el.conValue.textContent = `${Math.round(run.patient.con)}%`;
      el.hbValue.textContent = run.patient.hb.toFixed(1);
      el.bleedValue.textContent = `${Math.round(run.patient.bleed)}%`;

      setBar(el.spo2Bar, run.patient.spo2, 60, 100, false);
      setBar(el.hrBar, 190 - Math.abs(95 - run.patient.hr), 0, 190, false);
      setBar(el.bpBar, run.patient.bpSys, 50, 140, false);
      setBar(el.conBar, run.patient.con, 0, 100, false);
      setBar(el.hbBar, run.patient.hb, 5, 15, false);
      setBar(el.bleedBar, run.patient.bleed, 0, 100, true);
    }

    function renderComplications() {
      if (!run.complications.length) {
        el.complicationList.innerHTML = "<span class='chip'>Aktif komplikasyon yok.</span>";
        return;
      }

      el.complicationList.innerHTML = run.complications
        .map((comp) => {
          const zoneText = comp.zone ? ` | Bolge: ${zoneName(comp.zone)}` : "";
          return `<span class="chip bad">${getCompName(comp.id)} S${comp.severity}${zoneText}</span>`;
        })
        .join("");
    }

    function zoneName(zone) {
      const map = {
        chest: "Gogus",
        right_arm: "Sag Kol",
        left_thigh: "Sol Uyluk",
        right_gluteal: "Sag Gluteal"
      };
      return map[zone] || zone;
    }

    function renderBody() {
      document.querySelectorAll(".body-zone").forEach((zone) => {
        zone.classList.remove("selected", "injury", "critical");
        if (zone.dataset.zone === run.selectedZone) zone.classList.add("selected");
      });

      const bleeding = getComplication("bleeding");
      if (bleeding?.zone) {
        const injuryNode = document.querySelector(`.body-zone[data-zone='${bleeding.zone}']`);
        if (injuryNode) {
          injuryNode.classList.add("injury");
          if (bleeding.severity >= 3) injuryNode.classList.add("critical");
        }
      }

      el.selectedZoneLabel.textContent = `Secili bolge: ${zoneName(run.selectedZone)}`;
    }

    function renderLog() {
      if (!run.log.length) {
        el.simLog.innerHTML = "<p class='muted'>Log kaydi henuz yok.</p>";
        return;
      }

      el.simLog.innerHTML = run.log
        .map((entry) => `<div class="history-item ${entry.type}"><p>${entry.text}</p><small>${app.formatHistoryDate(entry.at)}</small></div>`)
        .join("");
    }

    function initZoneEvents() {
      document.querySelectorAll(".body-zone").forEach((zone) => {
        const pick = () => {
          run.selectedZone = zone.dataset.zone;
          renderBody();
        };

        zone.addEventListener("click", pick);
        zone.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            pick();
          }
        });
      });
    }

    el.startBtn.addEventListener("click", startRun);
    el.applyActionBtn.addEventListener("click", evaluateTurn);

    initZoneEvents();
    renderActions();
    renderLog();
    renderComplications();
    renderBody();
  });
})();
