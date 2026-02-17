(() => {
  const STORAGE_KEY = "esila_nurse_studio_v3";

  const SKINS = [
    { id: "mint", name: "Mint Classic", cost: 0, className: "skin-mint", desc: "Temel profesyonel gorunum" },
    { id: "coral", name: "Coral Shift", cost: 140, className: "skin-coral", desc: "Sicak tonlu klinik stil" },
    { id: "navy", name: "Navy Night", cost: 220, className: "skin-navy", desc: "Gece nobeti tasarimi" },
    { id: "rose", name: "Rose Calm", cost: 280, className: "skin-rose", desc: "Sakin ve yumusak stil" },
    { id: "aurora", name: "Aurora Elite", cost: 360, className: "skin-aurora", desc: "Ust seviye premium skin" }
  ];

  const UPGRADES = [
    { id: "monitor_plus", name: "Monitor Plus", cost: 170, desc: "Simulasyon baslangicinda +6 stabilite" },
    { id: "trauma_kit", name: "Trauma Kit", cost: 190, desc: "Basincli pansuman etkisi artar" },
    { id: "rapid_team", name: "Rapid Team Link", cost: 200, desc: "Hekim/kod cagrisi daha guclu" },
    { id: "smart_pump", name: "Smart Pump AI", cost: 240, desc: "Doz hatasi cezasi azalir" },
    { id: "sterile_pack", name: "Sterile Pack", cost: 160, desc: "Enfeksiyon riski etkisi azalir" },
    { id: "mentor_ai", name: "Mentor AI", cost: 260, desc: "Tum modlardan kazanilan XP +%15" }
  ];

  const QUIZ_BANK = [
    {
      id: "q1",
      topic: "Farmakoloji",
      q: "Yuksek riskli ilac uygulamasinda en guvenli adim hangisidir?",
      options: ["Ilaci hizli vermek", "Iki hemsire dogrulamasi", "Kimlik kontrolunu atlamak", "Karsilastirma yapmamak"],
      answer: 1,
      explain: "Yuksek riskli ilaclarda cift kontrol hasta guvenligini arttirir."
    },
    {
      id: "q2",
      topic: "Enfeksiyon",
      q: "Temas izolasyonunda odaya girerken ilk yapilmasi gereken nedir?",
      options: ["Maske degistirmek", "El hijyeni", "Monitoru acmak", "Sadece onluk giymek"],
      answer: 1,
      explain: "Temel adim her zaman el hijyenidir."
    },
    {
      id: "q3",
      topic: "Vital Bulgular",
      q: "Aritmik nabizda en dogru sayim suresi nedir?",
      options: ["15 saniye", "30 saniye", "45 saniye", "60 saniye"],
      answer: 3,
      explain: "Aritmi varsa tam 1 dakika sayim daha dogrudur."
    },
    {
      id: "q4",
      topic: "Sivi Dengesi",
      q: "Sivi takipte en guvenilir hemsirelik verisi hangisidir?",
      options: ["Sadece oral alim", "Aldigi-cikardigi takibi", "Ayin sonu kilo", "Yuz ifadesi"],
      answer: 1,
      explain: "Intake-output takibi objektif veri saglar."
    },
    {
      id: "q5",
      topic: "Bakim Plani",
      q: "NANDA temelli bakim surecinde dogru siralama hangisidir?",
      options: ["Degerlendirme-Uygulama", "Tani-Hedef-Girisim-Degerlendirme", "Kayit-Tani", "Hedef-Uygulama"],
      answer: 1,
      explain: "Bakim sureci tani ile baslar, degerlendirme ile kapanir."
    },
    {
      id: "q6",
      topic: "Acil Durum",
      q: "SpO2 %84 olan hastada ilk oncelik nedir?",
      options: ["Taburculuk notu", "ABC degerlendirmesi", "Beslenme takibi", "Rutin pansuman"],
      answer: 1,
      explain: "Yasam bulgusu bozuldugunda once ABC."
    },
    {
      id: "q7",
      topic: "Cerrahi",
      q: "Post-op hastada dusme riskini azaltan en etkili adim nedir?",
      options: ["Yardimsiz mobilizasyon", "Yavas ve destekli mobilizasyon", "Yatak kenarini acik birakma", "Alarm kapatma"],
      answer: 1,
      explain: "Destekli mobilizasyon dusme riskini azaltir."
    },
    {
      id: "q8",
      topic: "Iletisim",
      q: "Hastaya girisimi aciklamak neden onemlidir?",
      options: ["Sadece formalite", "Hasta uyumunu arttirir", "Zamani uzatir", "Sadece kayit icin"],
      answer: 1,
      explain: "Acil ama acik iletisim tedavi uyumunu ve guveni arttirir."
    },
    {
      id: "q9",
      topic: "Farmakoloji",
      q: "IM uygulamada hangi bolge guvenli secimlerden biridir?",
      options: ["Karaciğer alani", "Ventrogluteal", "Kalp apeksi", "Trakea"],
      answer: 1,
      explain: "Ventrogluteal bolge guvenli IM bolgelerindendir."
    },
    {
      id: "q10",
      topic: "Enfeksiyon",
      q: "Steril alan bozulursa ne yapilmalidir?",
      options: ["Devam et", "Sadece ustunu ort", "Steril alan yeniden kur", "Kayit acmadan bitir"],
      answer: 2,
      explain: "Sterilite bozuldugunda alan yeniden kurulmalidir."
    },
    {
      id: "q11",
      topic: "Vital Bulgular",
      q: "TA 82/50, nabiz 124 hastada oncelik ne olmalidir?",
      options: ["Beklemek", "Hemodinamik degerlendirme ve bildirim", "Sadece ates bakmak", "Yuruyus"],
      answer: 1,
      explain: "Hipotansiyon + tasikardi hemodinamik risktir."
    },
    {
      id: "q12",
      topic: "Etik",
      q: "Ilac hatasi saptandiginda en dogru yaklasim nedir?",
      options: ["Saklamak", "Kayit ve bildirimi protokole gore yapmak", "Hastaya soylememek", "Takibi kesmek"],
      answer: 1,
      explain: "Hasta guvenligi icin acik bildirim ve kayit esastir."
    },
    {
      id: "q13",
      topic: "Sivi Dengesi",
      q: "Oliguri gelisirse hangi veri oncelikle degerlendirilir?",
      options: ["Sac rengi", "Hemodinamik durum", "TV izleme suresi", "Uyku pozisyonu"],
      answer: 1,
      explain: "Oliguri perfuzyon bozuklugunun isareti olabilir."
    },
    {
      id: "q14",
      topic: "Acil Durum",
      q: "Kod cagrisi hangi durumda gerekir?",
      options: ["Stabil hastada", "Hayati bulgu hizla kotulesiyorsa", "Rutin pansuman", "Taburculuk"],
      answer: 1,
      explain: "Hizli kotulesen klinikte erken kod cagrisi yasam kurtarir."
    },
    {
      id: "q15",
      topic: "Bakim Plani",
      q: "Olculebilir hedef yazmanin faydasi nedir?",
      options: ["Kaydi zorlastirir", "Sonuc degerlendirmesini objektif yapar", "Tedaviyi uzatir", "Hedefi anlamsiz yapar"],
      answer: 1,
      explain: "Olculebilir hedefler bakim etkinligini gostermeyi kolaylastirir."
    }
  ];

  const DOSE_CASES = [
    { id: "d1", orderMg: 500, stockMg: 250, stockMl: 5 },
    { id: "d2", orderMg: 750, stockMg: 500, stockMl: 4 },
    { id: "d3", orderMg: 125, stockMg: 250, stockMl: 2 },
    { id: "d4", orderMg: 300, stockMg: 100, stockMl: 2 },
    { id: "d5", orderMg: 80, stockMg: 40, stockMl: 1 },
    { id: "d6", orderMg: 900, stockMg: 450, stockMl: 3 },
    { id: "d7", orderMg: 360, stockMg: 120, stockMl: 2 },
    { id: "d8", orderMg: 200, stockMg: 100, stockMl: 2 },
    { id: "d9", orderMg: 50, stockMg: 25, stockMl: 1 },
    { id: "d10", orderMg: 640, stockMg: 320, stockMl: 4 }
  ];

  const VITAL_CASES = [
    {
      id: "v1",
      text: "SpO2 86, Nabiz 126, TA 84/54, Bilincte bulaniklik",
      options: ["Stabil", "Yakin izlem", "Sari alarm", "Kirmizi acil"],
      answer: 3,
      explain: "Hipoksi + hipotansiyon + bilinc bozulmasi acil mudahale gerektirir."
    },
    {
      id: "v2",
      text: "SpO2 95, Nabiz 88, TA 118/72, Bilinc acik",
      options: ["Stabil", "Yakin izlem", "Sari alarm", "Kirmizi acil"],
      answer: 0,
      explain: "Degerler stabil aralikta."
    },
    {
      id: "v3",
      text: "Ates 39.2, Nabiz 118, TA 92/58, idrar azalmasi",
      options: ["Stabil", "Yakin izlem", "Sari alarm", "Kirmizi acil"],
      answer: 2,
      explain: "Sepsis supheli, hizli bildirim ve yakin izlem gerekli."
    },
    {
      id: "v4",
      text: "SpO2 90, Nabiz 102, TA 104/66, dispne",
      options: ["Stabil", "Yakin izlem", "Sari alarm", "Kirmizi acil"],
      answer: 2,
      explain: "Oksijenlenme sinirda, erken mudahale gerekir."
    },
    {
      id: "v5",
      text: "SpO2 97, Nabiz 76, TA 120/78, agri 3/10",
      options: ["Stabil", "Yakin izlem", "Sari alarm", "Kirmizi acil"],
      answer: 0,
      explain: "Klinik tablo genel olarak stabil."
    },
    {
      id: "v6",
      text: "SpO2 88, Nabiz 132, TA 78/46, soguk nemli cilt",
      options: ["Stabil", "Yakin izlem", "Sari alarm", "Kirmizi acil"],
      answer: 3,
      explain: "Sok tablosu ile uyumlu, acil mudahale gerekli."
    },
    {
      id: "v7",
      text: "SpO2 92, Nabiz 110, TA 100/60, ates 38.4",
      options: ["Stabil", "Yakin izlem", "Sari alarm", "Kirmizi acil"],
      answer: 2,
      explain: "Yakindan takip ve protokol aktivasyonu gerekir."
    },
    {
      id: "v8",
      text: "SpO2 94, Nabiz 90, TA 108/70, hafif bas donmesi",
      options: ["Stabil", "Yakin izlem", "Sari alarm", "Kirmizi acil"],
      answer: 1,
      explain: "Yakindan takip ile durum netlestirilmelidir."
    }
  ];

  const SIM_ACTIONS = [
    { id: "abc_assess", label: "ABC degerlendirme", group: "Temel" },
    { id: "monitor_vitals", label: "Vital monitorizasyon", group: "Temel" },
    { id: "oxygen_support", label: "Oksijen destegi", group: "Temel" },
    { id: "iv_fluid", label: "IV sivi destegi", group: "Temel" },
    { id: "pressure_dressing", label: "Basincli pansuman", group: "Acil" },
    { id: "sterile_field", label: "Steril alan hazirligi", group: "Temel" },
    { id: "medication_recheck", label: "Ilac dogrulama/recheck", group: "Temel" },
    { id: "call_team", label: "Hekim/Kod cagrisi", group: "Acil" },
    { id: "record_followup", label: "Takip ve kayit", group: "Temel" },
    { id: "scalpel_misuse", label: "Bisturi ile gereksiz girisim", group: "Riskli" },
    { id: "skip_alarm", label: "Alarmi gormezden gel", group: "Riskli" },
    { id: "wrong_dose", label: "Doz dogrulamadan ilac", group: "Riskli" },
    { id: "skip_hygiene", label: "El hijyenini atla", group: "Riskli" }
  ];

  const SIM_SCENARIOS = [
    {
      id: "s1",
      title: "Acil Servis - Solunum Distresi",
      department: "Acil",
      summary: "Hasta ciddi dispne ile geliyor. Hipoksi ve anksiyete mevcut.",
      baseline: {
        spo2: [82, 91],
        hr: [106, 128],
        bpSys: [88, 110],
        bpDia: [52, 68],
        hb: [11.8, 13.8],
        temp: [36.8, 38.0],
        con: [68, 88],
        bleed: [0, 4]
      },
      phases: [
        { prompt: "Kabulde ilk oncelik?", hint: "Yasamsal degerlendirme", good: ["abc_assess", "monitor_vitals"], failComp: "hypoxia" },
        { prompt: "SpO2 dusuk, sonraki adim?", hint: "Oksijen + ekip bildirimi", good: ["oxygen_support", "call_team"], failComp: "hypoxia" },
        { prompt: "Hastada ajitasyon var", hint: "Klinik izlem surmeli", good: ["monitor_vitals", "record_followup"], failComp: "med_error" },
        { prompt: "Klinik yaniti guvenceye al", hint: "Kayit ve takip", good: ["record_followup", "monitor_vitals"], failComp: "shock" },
        { prompt: "Vaka kapanisi", hint: "Son guvenlik kontrolu", good: ["abc_assess", "record_followup"], failComp: "shock" }
      ]
    },
    {
      id: "s2",
      title: "Yogun Bakim - Sepsis Suphesi",
      department: "Yogun Bakim",
      summary: "Ateş yuksek, hipotansiyon gelisiyor, idrar cikisi azalmis.",
      baseline: {
        spo2: [88, 95],
        hr: [102, 132],
        bpSys: [82, 104],
        bpDia: [48, 64],
        hb: [10.9, 12.8],
        temp: [38.1, 39.6],
        con: [62, 85],
        bleed: [0, 3]
      },
      phases: [
        { prompt: "Ilk degerlendirme adimi", hint: "ABC + vital", good: ["abc_assess", "monitor_vitals"], failComp: "shock" },
        { prompt: "Kultur sureci baslayacak", hint: "Steril alan kritiktir", good: ["sterile_field", "call_team"], failComp: "infection" },
        { prompt: "Hemodinamik destek", hint: "Sivi destegi degerlendir", good: ["iv_fluid", "monitor_vitals"], failComp: "shock" },
        { prompt: "Ilac/antibiyotik guvenligi", hint: "Doz ve dogrulama", good: ["medication_recheck", "record_followup"], failComp: "med_error" },
        { prompt: "Kapanis kontrolu", hint: "Kayit ve ekip koordinasyonu", good: ["record_followup", "call_team"], failComp: "septic_drop" }
      ]
    },
    {
      id: "s3",
      title: "Cerrahi Servis - Post-op Komplikasyon",
      department: "Cerrahi",
      summary: "Post-op hastada agri, bas donmesi ve dusme riski var.",
      baseline: {
        spo2: [90, 97],
        hr: [88, 114],
        bpSys: [90, 116],
        bpDia: [54, 72],
        hb: [10.4, 12.6],
        temp: [36.7, 38.2],
        con: [70, 92],
        bleed: [2, 8]
      },
      phases: [
        { prompt: "Agri ve durum degerlendirme", hint: "Vital + klinik gozlem", good: ["monitor_vitals", "abc_assess"], failComp: "shock" },
        { prompt: "Kanama belirtileri artiyor", hint: "Hedefli mudahale", good: ["pressure_dressing", "call_team"], failComp: "bleeding" },
        { prompt: "Ilac uygulama karari", hint: "Dogrulama unutulmaz", good: ["medication_recheck", "record_followup"], failComp: "med_error" },
        { prompt: "Mobilizasyon oncesi", hint: "Stabilite guvenceye alin", good: ["monitor_vitals", "iv_fluid"], failComp: "shock" },
        { prompt: "Vaka kapanisi", hint: "Kayit + guvenlik", good: ["record_followup", "abc_assess"], failComp: "bleeding" }
      ]
    },
    {
      id: "s4",
      title: "Dahiliye - Izolasyon Hastasi",
      department: "Dahiliye",
      summary: "Izolasyon hastasinda enfeksiyon kontrolu ve guvenli bakim onceligi var.",
      baseline: {
        spo2: [90, 97],
        hr: [84, 108],
        bpSys: [94, 120],
        bpDia: [58, 76],
        hb: [11.6, 13.4],
        temp: [37.3, 39.1],
        con: [74, 94],
        bleed: [0, 2]
      },
      phases: [
        { prompt: "Odaya giris hazirligi", hint: "Hijyen + sterilite", good: ["sterile_field", "abc_assess"], failComp: "infection" },
        { prompt: "Vital ve klinik izlem", hint: "Objektif veri", good: ["monitor_vitals", "record_followup"], failComp: "infection" },
        { prompt: "Ani kotulesme sinyali", hint: "Erken ekip bildirimi", good: ["call_team", "oxygen_support"], failComp: "hypoxia" },
        { prompt: "Ilac sureci", hint: "Doz guvenligi", good: ["medication_recheck", "record_followup"], failComp: "med_error" },
        { prompt: "Kapanis", hint: "Kayit ve guvenlik", good: ["record_followup", "sterile_field"], failComp: "septic_drop" }
      ]
    },
    {
      id: "s5",
      title: "Pediatri - Solunum Enfeksiyonu",
      department: "Pediatri",
      summary: "Pediatrik hastada solunum sikintisi ve ates var.",
      baseline: {
        spo2: [86, 94],
        hr: [110, 148],
        bpSys: [80, 102],
        bpDia: [46, 62],
        hb: [10.8, 12.9],
        temp: [38.0, 39.8],
        con: [72, 92],
        bleed: [0, 3]
      },
      phases: [
        { prompt: "Kabulde ilk adim", hint: "ABC ve monitor", good: ["abc_assess", "monitor_vitals"], failComp: "hypoxia" },
        { prompt: "Ateş + dispne devam ediyor", hint: "Oksijen ve ekip koordinasyonu", good: ["oxygen_support", "call_team"], failComp: "hypoxia" },
        { prompt: "Sivi durumu degerlendir", hint: "Destek secimi", good: ["iv_fluid", "monitor_vitals"], failComp: "shock" },
        { prompt: "Tedavi sureci kaydi", hint: "Takipte kayit", good: ["record_followup", "medication_recheck"], failComp: "med_error" },
        { prompt: "Cikis kontrolu", hint: "Son guvenlik adimi", good: ["record_followup", "abc_assess"], failComp: "shock" }
      ]
    }
  ];

  const DEFAULT_STATE = {
    profile: {
      name: "Esila",
      skin: "mint"
    },
    economy: {
      xp: 0,
      coins: 180,
      level: 1
    },
    inventory: {
      skins: ["mint"],
      upgrades: []
    },
    stats: {
      quizCorrect: 0,
      quizTotal: 0,
      doseSolved: 0,
      vitalSolved: 0,
      simRuns: 0,
      simSuccess: 0,
      simFail: 0
    },
    history: []
  };

  let state = loadState();
  let noticeTimer = null;

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_STATE);

    try {
      const parsed = JSON.parse(raw);
      return {
        profile: {
          name: parsed?.profile?.name || DEFAULT_STATE.profile.name,
          skin: parsed?.profile?.skin || DEFAULT_STATE.profile.skin
        },
        economy: {
          xp: Number(parsed?.economy?.xp || 0),
          coins: Number(parsed?.economy?.coins || DEFAULT_STATE.economy.coins),
          level: Number(parsed?.economy?.level || 1)
        },
        inventory: {
          skins: Array.isArray(parsed?.inventory?.skins) && parsed.inventory.skins.length ? unique(parsed.inventory.skins) : ["mint"],
          upgrades: Array.isArray(parsed?.inventory?.upgrades) ? unique(parsed.inventory.upgrades) : []
        },
        stats: {
          quizCorrect: Number(parsed?.stats?.quizCorrect || 0),
          quizTotal: Number(parsed?.stats?.quizTotal || 0),
          doseSolved: Number(parsed?.stats?.doseSolved || 0),
          vitalSolved: Number(parsed?.stats?.vitalSolved || 0),
          simRuns: Number(parsed?.stats?.simRuns || 0),
          simSuccess: Number(parsed?.stats?.simSuccess || 0),
          simFail: Number(parsed?.stats?.simFail || 0)
        },
        history: Array.isArray(parsed?.history) ? parsed.history.slice(0, 40) : []
      };
    } catch {
      return clone(DEFAULT_STATE);
    }
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function unique(list) {
    return [...new Set(list)];
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

  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomPick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function levelFromXp(xp) {
    return 1 + Math.floor(xp / 180);
  }

  function xpToNextLevel(xp) {
    const nextLevel = levelFromXp(xp) + 1;
    return nextLevel * 180 - xp;
  }

  function getSkin(id) {
    return SKINS.find((s) => s.id === id) || SKINS[0];
  }

  function getUpgrade(id) {
    return UPGRADES.find((u) => u.id === id) || null;
  }

  function hasUpgrade(id) {
    return state.inventory.upgrades.includes(id);
  }

  function getUpgradeModifiers() {
    return {
      monitorBonus: hasUpgrade("monitor_plus") ? 6 : 0,
      traumaBoost: hasUpgrade("trauma_kit") ? 1.6 : 1,
      rapidTeamBoost: hasUpgrade("rapid_team") ? 1.45 : 1,
      smartPumpPenaltyFactor: hasUpgrade("smart_pump") ? 0.55 : 1,
      sterilePenaltyFactor: hasUpgrade("sterile_pack") ? 0.6 : 1,
      xpBoost: hasUpgrade("mentor_ai") ? 1.15 : 1
    };
  }

  function persist() {
    state.economy.level = levelFromXp(state.economy.xp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderShell();
  }

  function addHistory(text, type = "info") {
    state.history.unshift({
      id: `h-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text,
      type,
      at: new Date().toISOString()
    });

    if (state.history.length > 40) {
      state.history = state.history.slice(0, 40);
    }
  }

  function addRewards({ xp = 0, coins = 0, reason = "Odul" }) {
    const mods = getUpgradeModifiers();
    const boostedXp = Math.round(xp * mods.xpBoost);

    state.economy.xp += boostedXp;
    state.economy.coins += coins;
    addHistory(`${reason}: +${boostedXp} XP, +${coins} coin`, "gain");
    persist();

    return { xp: boostedXp, coins };
  }

  function recordStats(partial) {
    Object.keys(partial).forEach((key) => {
      if (Object.hasOwn(state.stats, key)) {
        state.stats[key] += Number(partial[key] || 0);
      }
    });
    persist();
  }

  function updateProfileName(name) {
    state.profile.name = (name || "Esila").trim().slice(0, 22) || "Esila";
    persist();
  }

  function buySkin(id) {
    const skin = getSkin(id);
    if (!skin) return { ok: false, msg: "Skin bulunamadi." };
    if (state.inventory.skins.includes(id)) return { ok: false, msg: "Bu skin zaten acik." };
    if (state.economy.coins < skin.cost) return { ok: false, msg: "Yeterli coin yok." };

    state.economy.coins -= skin.cost;
    state.inventory.skins.push(id);
    addHistory(`Skin acildi: ${skin.name}`, "shop");
    persist();
    return { ok: true, msg: `${skin.name} acildi.` };
  }

  function equipSkin(id) {
    if (!state.inventory.skins.includes(id)) return { ok: false, msg: "Bu skin kilitli." };
    state.profile.skin = id;
    addHistory(`Skin equip edildi: ${getSkin(id).name}`, "shop");
    persist();
    return { ok: true, msg: `${getSkin(id).name} aktif.` };
  }

  function buyUpgrade(id) {
    const upgrade = getUpgrade(id);
    if (!upgrade) return { ok: false, msg: "Upgrade bulunamadi." };
    if (state.inventory.upgrades.includes(id)) return { ok: false, msg: "Bu upgrade zaten aktif." };
    if (state.economy.coins < upgrade.cost) return { ok: false, msg: "Yeterli coin yok." };

    state.economy.coins -= upgrade.cost;
    state.inventory.upgrades.push(id);
    addHistory(`Upgrade alindi: ${upgrade.name}`, "shop");
    persist();
    return { ok: true, msg: `${upgrade.name} aktif oldu.` };
  }

  function applySkinToElement(elm, skinId, initial) {
    if (!elm) return;

    Array.from(elm.classList)
      .filter((className) => className.startsWith("skin-"))
      .forEach((className) => elm.classList.remove(className));

    const skin = getSkin(skinId);
    elm.classList.add(skin.className);
    elm.textContent = (initial || "E").slice(0, 1).toUpperCase();
  }

  function mountShell(activePage) {
    renderShell(activePage);
  }

  function renderShell(activePage) {
    const initial = state.profile.name.slice(0, 1).toUpperCase() || "E";

    const nameNode = document.getElementById("shellName");
    const levelNode = document.getElementById("shellLevel");
    const coinsNode = document.getElementById("shellCoins");
    const avatarNode = document.getElementById("shellAvatar");

    if (nameNode) nameNode.textContent = state.profile.name;
    if (levelNode) levelNode.textContent = String(levelFromXp(state.economy.xp));
    if (coinsNode) coinsNode.textContent = String(state.economy.coins);
    if (avatarNode) applySkinToElement(avatarNode, state.profile.skin, initial);

    document.querySelectorAll("[data-page-link]").forEach((link) => {
      if (link.dataset.pageLink === activePage) link.classList.add("active");
      else link.classList.remove("active");
    });
  }

  function notify(text, type = "info") {
    const node = document.getElementById("globalNotice");
    if (!node) return;

    node.textContent = text;
    node.className = `notice visible ${type}`;

    if (noticeTimer) clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => {
      node.className = "notice";
      node.textContent = "";
    }, 2600);
  }

  function getState() {
    return state;
  }

  function formatHistoryDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    }
  }

  window.EsilaApp = {
    SKINS,
    UPGRADES,
    QUIZ_BANK,
    DOSE_CASES,
    VITAL_CASES,
    SIM_ACTIONS,
    SIM_SCENARIOS,
    clamp,
    shuffle,
    randomRange,
    randomPick,
    getState,
    mountShell,
    notify,
    addRewards,
    recordStats,
    addHistory,
    buySkin,
    equipSkin,
    buyUpgrade,
    hasUpgrade,
    getUpgradeModifiers,
    getSkin,
    updateProfileName,
    applySkinToElement,
    xpToNextLevel,
    levelFromXp,
    formatHistoryDate,
    registerServiceWorker
  };
})();
