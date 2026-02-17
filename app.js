const TOOL_POOL = [
  { id: "pulseox", name: "Pulse Oksimetre", detail: "SpO2 ve nabiz izlemi" },
  { id: "steth", name: "Stetoskop", detail: "Auskultasyon" },
  { id: "oxygen", name: "Oksijen Maske", detail: "Destek oksijen" },
  { id: "hygiene", name: "El Hijyeni", detail: "Enfeksiyon onleme" },
  { id: "gloves", name: "Steril Eldiven", detail: "Aseptik islem" },
  { id: "culture", name: "Kan Kultur Seti", detail: "Sepsis sureci" },
  { id: "iv", name: "IV Sivi Seti", detail: "Hemodinamik destek" },
  { id: "analgesic", name: "Analjezik Ampul", detail: "Agri yonetimi" },
  { id: "scalpel", name: "Bisturi", detail: "Yanlis kullanim ciddi travma yaratir" }
];

const STEP_POOL = [
  { id: "rapid_assess", name: "Hizli ABC Degerlendir", detail: "Oncelik: yasamsal" },
  { id: "vitals_record", name: "Vital + Kayit", detail: "Objektif veri" },
  { id: "oxygen_start", name: "Oksijen Baslat", detail: "Hipoksi mudahalesi" },
  { id: "aseptic_prepare", name: "Aseptik Hazirlik", detail: "Kontaminasyon onleme" },
  { id: "protocol_alert", name: "Protokol / Hekim Bildir", detail: "Erken haberlesme" },
  { id: "med_admin", name: "Ilac Uygula ve Izle", detail: "Etki-yan etki" },
  { id: "safe_mob", name: "Guvenli Mobilizasyon", detail: "Dusme onleme" },
  { id: "followup_note", name: "Yaniti Kayda Gec", detail: "Bakim surekliligi" }
];

const CASE_TEMPLATES = [
  {
    id: "respiratory",
    title: "Acil Servis | Solunum Distresi",
    specialty: "Gogus Hastaliklari",
    stageTemplates: [
      {
        prompt: "Hasta dispneik. Ilk klinik adim ne?",
        tool: ["pulseox", "steth"],
        step: ["rapid_assess"],
        learn: "Distres durumunda once hizli degerlendirme gerekir."
      },
      {
        prompt: "SpO2 dusuk. Erken mudahale sec.",
        tool: ["oxygen"],
        step: ["oxygen_start", "protocol_alert"],
        learn: "Hipoksiyi erken yonetmek komplikasyonu azaltir."
      },
      {
        prompt: "Mudahale sonrasi takip adimi?",
        tool: ["pulseox"],
        step: ["vitals_record", "followup_note"],
        learn: "Tedavi yaniti kaydi klinik guvenlik icin kritiktir."
      }
    ],
    injectionZone: "deltoid",
    zoneText: "Bu vakada hedef bolge: Deltoid"
  },
  {
    id: "sepsis",
    title: "Yogun Bakim | Sepsis Suphesi",
    specialty: "Ic Hastaliklari",
    stageTemplates: [
      {
        prompt: "Hipotansiyon + tasikardi var. Oncelik?",
        tool: ["pulseox", "iv"],
        step: ["rapid_assess", "vitals_record"],
        learn: "Hemodinamik bozulmada sistematik veri toplanmalidir."
      },
      {
        prompt: "Sepsis protokolu icin hangi set gerekir?",
        tool: ["culture"],
        step: ["aseptic_prepare", "protocol_alert"],
        learn: "Kultur sureci aseptik kosullarda ve protokole uygun olmali."
      },
      {
        prompt: "Sivi tedavisi basladi. Sonraki adim?",
        tool: ["iv"],
        step: ["followup_note", "vitals_record"],
        learn: "Sivi yaniti ve kayit izlenmezse risk artar."
      }
    ],
    injectionZone: "ventro",
    zoneText: "Bu vakada hedef bolge: Ventrogluteal"
  },
  {
    id: "postop",
    title: "Cerrahi Servis | Post-op Agri",
    specialty: "Cerrahi Hemsireligi",
    stageTemplates: [
      {
        prompt: "Hasta agri 8/10 bildiriyor. Ilk adim?",
        tool: ["steth", "pulseox"],
        step: ["rapid_assess", "vitals_record"],
        learn: "Ilac oncesi klinik degerlendirme zorunludur."
      },
      {
        prompt: "Agri tedavisi planla.",
        tool: ["analgesic"],
        step: ["med_admin", "followup_note"],
        learn: "Ilac uygulamasi etki-yan etki izlemiyle birlikte yapilir."
      },
      {
        prompt: "Mobilizasyon istiyor ama bas donmesi var.",
        tool: ["steth"],
        step: ["safe_mob", "protocol_alert"],
        learn: "Dusme riskinde yardimsiz mobilizasyon guvensizdir."
      }
    ],
    injectionZone: "vastus",
    zoneText: "Bu vakada hedef bolge: Vastus Lateralis"
  },
  {
    id: "infection",
    title: "Dahiliye | Izolasyon Hastasi",
    specialty: "Enfeksiyon Kontrolu",
    stageTemplates: [
      {
        prompt: "Odaya giris oncesi hangi hazirlik?",
        tool: ["hygiene", "gloves"],
        step: ["aseptic_prepare"],
        learn: "El hijyeni ve bariyer onlemler kontaminasyonu azaltir."
      },
      {
        prompt: "Islem oncesi guvenli siralama sec.",
        tool: ["gloves"],
        step: ["vitals_record", "protocol_alert"],
        learn: "Izolasyon hastasinda protokol disina cikilmaz."
      },
      {
        prompt: "Islem sonrasi en kritik kapanis?",
        tool: ["hygiene"],
        step: ["followup_note"],
        learn: "Son kayit ve hijyen bakim kalitesini tamamlar."
      }
    ],
    injectionZone: "deltoid",
    zoneText: "Bu vakada hedef bolge: Deltoid"
  }
];

const AVATARS = [
  { id: "a1", label: "A1" },
  { id: "a2", label: "A2" },
  { id: "a3", label: "A3" },
  { id: "a4", label: "A4" }
];

const STORAGE_KEY = "nursesim_profile_v2";

const el = {
  startShiftBtn: document.getElementById("startShiftBtn"),
  profileName: document.getElementById("profileName"),
  avatarPreview: document.getElementById("avatarPreview"),
  avatarList: document.getElementById("avatarList"),
  saveProfileBtn: document.getElementById("saveProfileBtn"),
  toolbox: document.getElementById("toolbox"),
  stepbox: document.getElementById("stepbox"),
  patientTitle: document.getElementById("patientTitle"),
  patientMeta: document.getElementById("patientMeta"),
  caseStat: document.getElementById("caseStat"),
  stabilityStat: document.getElementById("stabilityStat"),
  safetyStat: document.getElementById("safetyStat"),
  timeStat: document.getElementById("timeStat"),
  hbStat: document.getElementById("hbStat"),
  bleedingStat: document.getElementById("bleedingStat"),
  stageBox: document.getElementById("stageBox"),
  toolDrop: document.getElementById("toolDrop"),
  stepDrop: document.getElementById("stepDrop"),
  applyStepBtn: document.getElementById("applyStepBtn"),
  resetPickBtn: document.getElementById("resetPickBtn"),
  instantFeedback: document.getElementById("instantFeedback"),
  timelineList: document.getElementById("timelineList"),
  logFeed: document.getElementById("logFeed"),
  reportBox: document.getElementById("reportBox"),
  bodyTaskText: document.getElementById("bodyTaskText"),
  bodyFeedback: document.getElementById("bodyFeedback"),
  injuryStatus: document.getElementById("injuryStatus"),
  pressureBtn: document.getElementById("pressureBtn"),
  ivFluidBtn: document.getElementById("ivFluidBtn"),
  callCodeBtn: document.getElementById("callCodeBtn")
};

const state = {
  profile: { name: "Esila", avatar: "a1" },
  started: false,
  shiftCases: [],
  caseIndex: -1,
  stageIndex: 0,
  stability: 100,
  safety: 100,
  time: 0,
  hemoglobin: 13.8,
  bleeding: 0,
  activeInjury: null,
  selectedTool: null,
  selectedStep: null,
  solvedStages: 0,
  correctStages: 0,
  timeline: [],
  zoneTaskPending: false,
  zoneSolved: 0,
  mistakes: [],
  adverseEvents: 0
};

function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    state.profile.name = data.name || "Esila";
    state.profile.avatar = data.avatar || "a1";
  } catch {
    // gecersiz veri varsa yoksay
  }
}

function saveProfile() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profile));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createShiftCases() {
  const selected = shuffle(CASE_TEMPLATES).slice(0, 3);
  return selected.map((template) => {
    const stageTemplates = shuffle(template.stageTemplates).map((stage) => ({ ...stage }));
    const vitals = {
      spo2: randomBetween(86, 96),
      pulse: randomBetween(84, 128),
      bpSys: randomBetween(86, 132),
      bpDia: randomBetween(52, 88)
    };
    return { ...template, stageTemplates, vitals };
  });
}

function currentCase() {
  return state.shiftCases[state.caseIndex] || null;
}

function currentStage() {
  const c = currentCase();
  return c ? c.stageTemplates[state.stageIndex] : null;
}

function addLog(text) {
  const div = document.createElement("div");
  div.className = "log-item";
  const stamp = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  div.textContent = `${stamp} | ${text}`;
  el.logFeed.prepend(div);
}

function setFeedback(text, type) {
  el.instantFeedback.textContent = text;
  el.instantFeedback.style.color = type === "ok" ? "var(--ok)" : type === "bad" ? "var(--bad)" : "var(--warn)";
}

function updateStats() {
  el.caseStat.textContent = `${Math.max(state.caseIndex + 1, 0)}/${state.shiftCases.length || 3}`;
  el.stabilityStat.textContent = String(Math.round(state.stability));
  el.safetyStat.textContent = String(Math.round(state.safety));
  el.timeStat.textContent = `${state.time} dk`;
  el.hbStat.textContent = state.hemoglobin.toFixed(1);
  el.bleedingStat.textContent = `${Math.round(state.bleeding)}%`;
  el.bleedingStat.className = state.bleeding >= 35 ? "danger-text" : "";
}

function findById(list, id) {
  return list.find((x) => x.id === id) || null;
}

function clearCardSelection(kind) {
  const selector = kind === "tool" ? "#toolbox .drag-card" : "#stepbox .drag-card";
  document.querySelectorAll(selector).forEach((card) => card.classList.remove("selected"));
}

function selectItem(kind, id, sourceCard) {
  if (kind === "tool") {
    const tool = findById(TOOL_POOL, id);
    if (!tool) return;
    state.selectedTool = id;
    el.toolDrop.textContent = tool.name;
    el.toolDrop.classList.add("filled");
    clearCardSelection("tool");
  } else {
    const step = findById(STEP_POOL, id);
    if (!step) return;
    state.selectedStep = id;
    el.stepDrop.textContent = step.name;
    el.stepDrop.classList.add("filled");
    clearCardSelection("step");
  }
  if (sourceCard) sourceCard.classList.add("selected");
}

function clearSelections() {
  state.selectedTool = null;
  state.selectedStep = null;
  el.toolDrop.textContent = "Buraya birak";
  el.stepDrop.textContent = "Buraya birak";
  el.toolDrop.classList.remove("filled");
  el.stepDrop.classList.remove("filled");
  clearCardSelection("tool");
  clearCardSelection("step");
}

function onDragStart(event) {
  const { kind, id } = event.currentTarget.dataset;
  event.dataTransfer.setData("text/plain", JSON.stringify({ kind, id }));
  event.dataTransfer.effectAllowed = "copy";
}

function initDropZone(zone, expectedKind) {
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("over"));
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("over");
    let payload;
    try {
      payload = JSON.parse(event.dataTransfer.getData("text/plain"));
    } catch {
      return;
    }
    if (payload.kind !== expectedKind) return;
    selectItem(payload.kind, payload.id, document.querySelector(`.drag-card[data-kind='${payload.kind}'][data-id='${payload.id}']`));
  });
}

function renderToolAndStepCards() {
  el.toolbox.innerHTML = "";
  el.stepbox.innerHTML = "";

  shuffle(TOOL_POOL).forEach((tool) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "drag-card";
    card.draggable = true;
    card.dataset.kind = "tool";
    card.dataset.id = tool.id;
    card.innerHTML = `${tool.name}<small>${tool.detail}</small>`;
    card.addEventListener("dragstart", onDragStart);
    card.addEventListener("click", () => selectItem("tool", tool.id, card));
    el.toolbox.appendChild(card);
  });

  shuffle(STEP_POOL).forEach((step) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "drag-card";
    card.draggable = true;
    card.dataset.kind = "step";
    card.dataset.id = step.id;
    card.innerHTML = `${step.name}<small>${step.detail}</small>`;
    card.addEventListener("dragstart", onDragStart);
    card.addEventListener("click", () => selectItem("step", step.id, card));
    el.stepbox.appendChild(card);
  });
}

function renderProfile() {
  el.profileName.value = state.profile.name;
  el.avatarPreview.textContent = state.profile.name.slice(0, 1).toUpperCase() || "E";
  el.avatarPreview.className = `avatar ${state.profile.avatar}`;

  el.avatarList.innerHTML = "";
  AVATARS.forEach((avatar) => {
    const btn = document.createElement("button");
    btn.className = `avatar-choice ${avatar.id} ${avatar.id === state.profile.avatar ? "active" : ""}`;
    btn.textContent = avatar.label;
    btn.type = "button";
    btn.addEventListener("click", () => {
      state.profile.avatar = avatar.id;
      renderProfile();
    });
    el.avatarList.appendChild(btn);
  });
}

function updateBodyVisual() {
  document.querySelectorAll(".zone").forEach((z) => z.classList.remove("target", "success", "fail", "injury", "injury-critical"));

  if (state.zoneTaskPending) {
    const c = currentCase();
    document.querySelector(`.zone[data-zone='${c?.injectionZone}']`)?.classList.add("target");
  }

  if (state.activeInjury) {
    const inj = document.querySelector(`.zone[data-zone='${state.activeInjury.zone}']`);
    if (inj) {
      inj.classList.add("injury");
      if (state.bleeding >= 35) inj.classList.add("injury-critical");
    }
  }
}

function updateInjuryStatus() {
  if (!state.activeInjury) {
    el.injuryStatus.textContent = "Aktif travma yok.";
    return;
  }
  el.injuryStatus.textContent = `Aktif travma: ${state.activeInjury.label} bolgesinde yara. Kanama ${Math.round(state.bleeding)}%.`;
}

function renderStage() {
  const c = currentCase();
  const s = currentStage();
  if (!c || !s) return;

  el.patientTitle.textContent = c.title;
  el.patientMeta.textContent = `${c.specialty} | SpO2 ${c.vitals.spo2}% | Nabiz ${c.vitals.pulse} | TA ${c.vitals.bpSys}/${c.vitals.bpDia}`;
  el.stageBox.innerHTML = `
    <h3>Adim ${state.stageIndex + 1}/${c.stageTemplates.length}</h3>
    <p>${s.prompt}</p>
    <p class="hint">Alet + Adim secip "Adimi Uygula" tusuna bas. Kritik yanlis hamleler fizyolojiyi bozabilir.</p>
  `;

  renderTimeline();
  updateBodyVisual();
}

function renderTimeline() {
  const c = currentCase();
  const total = c ? c.stageTemplates.length : 0;
  el.timelineList.innerHTML = "";

  for (let i = 0; i < total; i += 1) {
    const entry = state.timeline.find((x) => x.caseIndex === state.caseIndex && x.stageIndex === i);
    const item = document.createElement("div");
    item.className = `timeline-item ${entry ? (entry.ok ? "ok" : "bad") : ""}`;
    item.textContent = entry
      ? `Adim ${i + 1}: ${entry.ok ? "Dogru" : "Yanlis"} | ${entry.message}`
      : `Adim ${i + 1}: Bekliyor`;
    el.timelineList.appendChild(item);
  }
}

function triggerInjury(zone, reason) {
  state.activeInjury = { zone, label: zone === "deltoid" ? "Deltoid" : zone === "vastus" ? "Vastus" : "Ventro" };
  state.bleeding = clamp(state.bleeding + randomBetween(24, 38), 0, 100);
  state.safety = clamp(state.safety - randomBetween(10, 16), 0, 120);
  state.stability = clamp(state.stability - randomBetween(8, 14), 0, 120);
  state.adverseEvents += 1;
  addLog(`Kritik olay: ${reason}. ${state.activeInjury.label} bolgesinde yara ve kanama basladi.`);
  el.bodyFeedback.textContent = "Kritik hata: Yaralanma olustu. Acil mudahale panelinden kanamayi kontrol et.";
  el.bodyFeedback.style.color = "var(--bad)";
  updateBodyVisual();
  updateInjuryStatus();
}

function applyPhysiologyTick() {
  if (!state.activeInjury || state.bleeding <= 0) return;

  const bleedImpact = Math.max(1, Math.round(state.bleeding / 20));
  state.time += 1;
  state.hemoglobin = clamp(state.hemoglobin - 0.1 * bleedImpact, 7.0, 15.5);
  state.stability = clamp(state.stability - 1.8 * bleedImpact, 0, 120);
  state.safety = clamp(state.safety - 1.2 * bleedImpact, 0, 120);

  if (state.bleeding > 0) {
    state.bleeding = clamp(state.bleeding - 1, 0, 100);
  }

  if (state.bleeding <= 0) {
    state.activeInjury = null;
    el.bodyFeedback.textContent = "Kanama kontrol altinda. Klinik izleme devam et.";
    el.bodyFeedback.style.color = "var(--ok)";
    addLog("Kanama kontrol altina alindi.");
  }

  updateBodyVisual();
  updateInjuryStatus();
}

function evaluateStage() {
  if (!state.started) {
    setFeedback("Once nobeti baslat.", "bad");
    return;
  }
  if (state.zoneTaskPending) {
    setFeedback("Once Body Skill Lab gorevini tamamla.", "warn");
    return;
  }
  if (!state.selectedTool || !state.selectedStep) {
    setFeedback("Hem alet hem adim secmelisin.", "bad");
    return;
  }

  const c = currentCase();
  const s = currentStage();
  if (!c || !s) return;

  const toolOk = s.tool.includes(state.selectedTool);
  const stepOk = s.step.includes(state.selectedStep);
  const ok = toolOk && stepOk;

  state.solvedStages += 1;
  state.time += randomBetween(3, 8);

  if (ok) {
    state.correctStages += 1;
    state.stability = clamp(state.stability + randomBetween(4, 9), 0, 120);
    state.safety = clamp(state.safety + randomBetween(5, 9), 0, 120);
    setFeedback(`DOGRU: ${s.learn}`, "ok");
    addLog(`${c.title} | Adim ${state.stageIndex + 1} dogru uygulandi.`);
  } else {
    const penalty = toolOk || stepOk ? 6 : 11;
    state.stability = clamp(state.stability - penalty, 0, 120);
    state.safety = clamp(state.safety - (penalty + 2), 0, 120);
    state.mistakes.push({ caseTitle: c.title, stagePrompt: s.prompt, learn: s.learn });
    setFeedback(`YANLIS: ${s.learn}`, "bad");
    addLog(`${c.title} | Adim ${state.stageIndex + 1} riskli secim nedeniyle puan kaybi.`);

    if (state.selectedTool === "scalpel") {
      const injuryZone = c.injectionZone || ["deltoid", "vastus", "ventro"][randomBetween(0, 2)];
      triggerInjury(injuryZone, "Bisturi gereksiz kullanildi");
      state.mistakes.push({ caseTitle: c.title, stagePrompt: "Iatrojenik yaralanma", learn: "Uygunsuz invaziv arac secimi hastaya ciddi zarar verir." });
    }
  }

  applyPhysiologyTick();

  state.timeline.push({
    caseIndex: state.caseIndex,
    stageIndex: state.stageIndex,
    ok,
    message: `Alet ${toolOk ? "uygun" : "uygunsuz"}, Adim ${stepOk ? "uygun" : "uygunsuz"}`
  });

  clearSelections();
  updateStats();
  renderTimeline();

  if (state.stageIndex < c.stageTemplates.length - 1) {
    state.stageIndex += 1;
    renderStage();
    return;
  }

  beginZoneTask();
}

function beginZoneTask() {
  const c = currentCase();
  if (!c) return;
  state.zoneTaskPending = true;
  el.bodyTaskText.textContent = `${c.zoneText}. Dogru bolgeye dokun.`;
  el.bodyFeedback.textContent = "Body Skill Lab gorevi aktif.";
  el.bodyFeedback.style.color = "var(--warn)";
  setFeedback("Vaka tamamlandi. Body Skill Lab gorevini cozmeye gec.", "warn");
  updateBodyVisual();
}

function evaluateZone(zoneId) {
  if (!state.zoneTaskPending) return;
  const c = currentCase();
  if (!c) return;

  const ok = zoneId === c.injectionZone;
  const selectedZone = document.querySelector(`.zone[data-zone='${zoneId}']`);
  if (selectedZone) selectedZone.classList.add(ok ? "success" : "fail");

  if (ok) {
    state.zoneSolved += 1;
    state.safety = clamp(state.safety + 6, 0, 120);
    state.stability = clamp(state.stability + 4, 0, 120);
    el.bodyFeedback.textContent = "Dogru anatomik secim.";
    el.bodyFeedback.style.color = "var(--ok)";
    addLog(`${c.title} | Body Skill Lab dogru tamamlandi.`);
  } else {
    state.safety = clamp(state.safety - 8, 0, 120);
    state.mistakes.push({ caseTitle: c.title, stagePrompt: "Enjeksiyon bolgesi secimi", learn: `Dogru hedef: ${c.zoneText}` });
    el.bodyFeedback.textContent = "Yanlis bolge secildi. Minik travma olustu, kanama baslayabilir.";
    el.bodyFeedback.style.color = "var(--bad)";
    addLog(`${c.title} | Body Skill Lab yanlis secim.`);
    triggerInjury(zoneId, "Yanlis anatomik bolgeye girisim");
  }

  state.zoneTaskPending = false;
  applyPhysiologyTick();
  updateStats();
  nextCaseOrFinish();
}

function treatPressure() {
  if (!state.activeInjury) {
    setFeedback("Aktif kanama yok.", "warn");
    return;
  }
  state.bleeding = clamp(state.bleeding - randomBetween(16, 24), 0, 100);
  state.safety = clamp(state.safety + randomBetween(3, 7), 0, 120);
  state.time += 2;
  addLog("Basincli pansuman uygulandi.");
  applyPhysiologyTick();
  updateStats();
  updateBodyVisual();
  updateInjuryStatus();
}

function treatIVFluid() {
  if (!state.activeInjury) {
    setFeedback("Aktif travma yok, rutin takipte kullanabilirsin.", "warn");
    return;
  }
  state.bleeding = clamp(state.bleeding - randomBetween(6, 12), 0, 100);
  state.hemoglobin = clamp(state.hemoglobin + 0.2, 7.0, 15.5);
  state.stability = clamp(state.stability + randomBetween(4, 8), 0, 120);
  state.time += 2;
  addLog("IV sivi destegi verildi.");
  applyPhysiologyTick();
  updateStats();
  updateBodyVisual();
  updateInjuryStatus();
}

function callCode() {
  if (!state.activeInjury) {
    setFeedback("Acil kod gerekmiyor, vaka akisini surdur.", "warn");
    return;
  }
  state.safety = clamp(state.safety + randomBetween(5, 10), 0, 120);
  state.bleeding = clamp(state.bleeding - randomBetween(8, 14), 0, 100);
  state.time += 1;
  addLog("Hekim/Kod cagrisi yapildi.");
  applyPhysiologyTick();
  updateStats();
  updateBodyVisual();
  updateInjuryStatus();
}

function nextCaseOrFinish() {
  if (state.caseIndex < state.shiftCases.length - 1) {
    state.caseIndex += 1;
    state.stageIndex = 0;
    renderStage();
    setFeedback("Yeni vaka yuklendi.", "ok");
    return;
  }
  finishShift();
}

function finishShift() {
  const stageRate = state.solvedStages ? Math.round((state.correctStages / state.solvedStages) * 100) : 0;
  const zoneRate = Math.round((state.zoneSolved / state.shiftCases.length) * 100);
  const physiologyRate = Math.round((state.stability * 0.55 + state.safety * 0.45) / 1.2);
  const bleedPenalty = state.adverseEvents * 6 + Math.max(0, Math.round((13.8 - state.hemoglobin) * 4));
  const perf = clamp(Math.round(stageRate * 0.35 + zoneRate * 0.15 + physiologyRate * 0.5 - bleedPenalty), 0, 100);

  const strengths = [];
  const focus = [];

  if (stageRate >= 75) strengths.push("Klinik adim seciminde dogruluk iyi");
  else focus.push("Alet ve adim eslestirmesini tekrar et");

  if (zoneRate >= 67) strengths.push("Anatomik hedef secimi guclu");
  else focus.push("IM enjeksiyon bolgeleri tekrar edilmeli");

  if (state.adverseEvents === 0) strengths.push("Iatrojenik travma olayi yasanmadi");
  else focus.push("Invaziv arac seciminde ciddi guvenlik kontrolu gerekli");

  if (state.hemoglobin < 11.0) focus.push("Kanama yonetimi ve hemodinamik izlem tekrar edilmeli");

  const topMistakes = state.mistakes.slice(0, 5);

  el.reportBox.innerHTML = `
    <h3>${state.profile.name} | Nobet Sonu Skor: ${perf}/100</h3>
    <p><b>Adim dogrulugu:</b> %${stageRate} | <b>Body Skill Lab:</b> %${zoneRate} | <b>Fizyoloji kontrol:</b> %${physiologyRate}</p>
    <p><b>Advers Olay:</b> ${state.adverseEvents} | <b>Final Hb:</b> ${state.hemoglobin.toFixed(1)}</p>
    <p><b>Guclu Yonler</b></p>
    <ul>${(strengths.length ? strengths : ["Temel vaka tamamlama becerisi"]).map((s) => `<li>${s}</li>`).join("")}</ul>
    <p><b>Gelisim Alanlari</b></p>
    <ul>${(focus.length ? focus : ["Performans dengeli. Zorluk seviyesini arttirabilirsin."]).map((s) => `<li>${s}</li>`).join("")}</ul>
    <p><b>Kritik Tekrar Notlari</b></p>
    <ul>${(topMistakes.length ? topMistakes.map((m) => `<li>${m.caseTitle}: ${m.stagePrompt} -> ${m.learn}</li>`) : ["Belirgin kritik hata yok."]).join("")}</ul>
    <p><b>Bilgilendirme:</b> Bu simulasyon egitim amaclidir. Gercek klinikte kurum protokolu, sorumlu egitmen ve hekim yonlendirmesi esastir.</p>
  `;

  state.started = false;
  setFeedback("Nobet tamamlandi. Final raporu olusturuldu.", "ok");
  addLog(`Nobet tamamlandi. Son skor ${perf}/100.`);
}

function startShift() {
  state.started = true;
  state.shiftCases = createShiftCases();
  state.caseIndex = 0;
  state.stageIndex = 0;
  state.stability = 100;
  state.safety = 100;
  state.time = 0;
  state.hemoglobin = 13.8;
  state.bleeding = 0;
  state.activeInjury = null;
  state.selectedTool = null;
  state.selectedStep = null;
  state.solvedStages = 0;
  state.correctStages = 0;
  state.timeline = [];
  state.zoneTaskPending = false;
  state.zoneSolved = 0;
  state.mistakes = [];
  state.adverseEvents = 0;

  el.logFeed.innerHTML = "";
  el.reportBox.innerHTML = "<p>Vaka seti suruyor. Nobet bitiminde rapor olusacak.</p>";
  el.bodyFeedback.textContent = "";
  el.bodyTaskText.textContent = "Vaka icinde enjeksiyon gorevi geldiginde hedef bolgeyi sec.";

  updateStats();
  clearSelections();
  updateBodyVisual();
  updateInjuryStatus();
  renderStage();

  addLog(`Nobet basladi. ${state.shiftCases.length} rastgele vaka atandi.`);
}

function bindZoneEvents() {
  document.querySelectorAll(".zone").forEach((zone) => {
    const handler = () => {
      if (state.zoneTaskPending) {
        evaluateZone(zone.dataset.zone);
      } else if (state.activeInjury && state.activeInjury.zone === zone.dataset.zone) {
        el.bodyFeedback.textContent = "Aktif yara bolgesi secildi. Acil mudahale panelini kullan.";
        el.bodyFeedback.style.color = "var(--warn)";
      }
    };

    zone.addEventListener("click", handler);
    zone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
    });
  });
}

function bindEvents() {
  el.saveProfileBtn.addEventListener("click", () => {
    const trimmed = el.profileName.value.trim();
    state.profile.name = trimmed || "Esila";
    renderProfile();
    saveProfile();
    setFeedback("Profil guncellendi.", "ok");
  });

  el.profileName.addEventListener("input", () => {
    el.avatarPreview.textContent = (el.profileName.value.trim().slice(0, 1) || "E").toUpperCase();
  });

  el.startShiftBtn.addEventListener("click", startShift);
  el.applyStepBtn.addEventListener("click", evaluateStage);
  el.resetPickBtn.addEventListener("click", clearSelections);

  el.pressureBtn.addEventListener("click", treatPressure);
  el.ivFluidBtn.addEventListener("click", treatIVFluid);
  el.callCodeBtn.addEventListener("click", callCode);

  initDropZone(el.toolDrop, "tool");
  initDropZone(el.stepDrop, "step");
  bindZoneEvents();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

function init() {
  loadProfile();
  renderProfile();
  renderToolAndStepCards();
  updateStats();
  updateInjuryStatus();
  bindEvents();
  registerServiceWorker();
}

init();
