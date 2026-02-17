(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const app = window.EsilaApp;
    app.mountShell("training");
    app.registerServiceWorker();

    initQuiz(app);
    initDose(app);
    initVital(app);
  });

  function initQuiz(app) {
    const startBtn = document.getElementById("quizStartBtn");
    const nextBtn = document.getElementById("quizNextBtn");
    const topicNode = document.getElementById("quizTopic");
    const questionNode = document.getElementById("quizQuestion");
    const optionsNode = document.getElementById("quizOptions");
    const progressNode = document.getElementById("quizProgress");
    const feedbackNode = document.getElementById("quizFeedback");
    const scoreNode = document.getElementById("quizScore");

    const quiz = {
      pool: [],
      index: 0,
      correct: 0,
      finished: false,
      answered: false
    };

    function renderQuestion() {
      const q = quiz.pool[quiz.index];
      if (!q) return;

      quiz.answered = false;
      topicNode.textContent = `Konu: ${q.topic}`;
      questionNode.textContent = q.q;
      progressNode.textContent = `Soru ${quiz.index + 1} / ${quiz.pool.length}`;
      feedbackNode.textContent = "";
      nextBtn.disabled = true;

      optionsNode.innerHTML = q.options
        .map((option, idx) => `<button class="option-btn" data-index="${idx}">${option}</button>`)
        .join("");

      optionsNode.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (quiz.answered) return;
          quiz.answered = true;
          const picked = Number(btn.dataset.index);
          const isCorrect = picked === q.answer;

          optionsNode.querySelectorAll("button").forEach((node, nodeIdx) => {
            node.disabled = true;
            if (nodeIdx === q.answer) node.classList.add("correct");
            if (node === btn && !isCorrect) node.classList.add("wrong");
          });

          if (isCorrect) {
            quiz.correct += 1;
            feedbackNode.textContent = `Dogru: ${q.explain}`;
            feedbackNode.className = "feedback-line ok";
          } else {
            feedbackNode.textContent = `Yanlis: ${q.explain}`;
            feedbackNode.className = "feedback-line bad";
          }

          scoreNode.textContent = `Skor: ${quiz.correct}`;
          nextBtn.disabled = false;
        });
      });
    }

    function finishQuiz() {
      quiz.finished = true;
      questionNode.textContent = `Test tamamlandi. Dogru: ${quiz.correct}/${quiz.pool.length}`;
      optionsNode.innerHTML = "";
      topicNode.textContent = "Konu: Tum set";
      feedbackNode.textContent = "Yeni set icin Baslat'a bas.";
      feedbackNode.className = "feedback-line";
      progressNode.textContent = "Set tamamlandi";
      nextBtn.disabled = true;

      const xp = 45 + quiz.correct * 20;
      const coins = 22 + quiz.correct * 9;
      app.addRewards({ xp, coins, reason: "Test Arena" });
      app.recordStats({ quizTotal: quiz.pool.length, quizCorrect: quiz.correct });
      app.notify(`Test odulu: +${xp} XP / +${coins} coin`, "gain");
      app.mountShell("training");
    }

    startBtn.addEventListener("click", () => {
      quiz.pool = app.shuffle(app.QUIZ_BANK).slice(0, 8);
      quiz.index = 0;
      quiz.correct = 0;
      quiz.finished = false;
      scoreNode.textContent = "Skor: 0";
      renderQuestion();
    });

    nextBtn.addEventListener("click", () => {
      if (quiz.finished) return;
      quiz.index += 1;
      if (quiz.index >= quiz.pool.length) finishQuiz();
      else renderQuestion();
    });
  }

  function initDose(app) {
    const startBtn = document.getElementById("doseStartBtn");
    const checkBtn = document.getElementById("doseCheckBtn");
    const nextBtn = document.getElementById("doseNextBtn");
    const caseNode = document.getElementById("doseCase");
    const progressNode = document.getElementById("doseProgress");
    const feedbackNode = document.getElementById("doseFeedback");
    const scoreNode = document.getElementById("doseScore");
    const input = document.getElementById("doseInput");

    const dose = {
      pool: [],
      index: 0,
      correct: 0,
      answered: false
    };

    function expectedValue(item) {
      return (item.orderMg / item.stockMg) * item.stockMl;
    }

    function renderCase() {
      const item = dose.pool[dose.index];
      if (!item) return;

      dose.answered = false;
      input.value = "";
      input.disabled = false;
      checkBtn.disabled = false;
      nextBtn.disabled = true;
      feedbackNode.textContent = "";
      feedbackNode.className = "feedback-line";

      progressNode.textContent = `Vaka ${dose.index + 1} / ${dose.pool.length}`;
      caseNode.textContent = `Order: ${item.orderMg} mg | Stok: ${item.stockMg} mg / ${item.stockMl} mL | Verilecek hacim kac mL?`;
    }

    function finishDose() {
      caseNode.textContent = `Doz Lab tamamlandi. Dogru: ${dose.correct}/${dose.pool.length}`;
      progressNode.textContent = "Set tamamlandi";
      feedbackNode.textContent = "Yeni set icin Baslat'a bas.";
      checkBtn.disabled = true;
      nextBtn.disabled = true;
      input.disabled = true;

      const xp = 35 + dose.correct * 22;
      const coins = 18 + dose.correct * 10;
      app.addRewards({ xp, coins, reason: "Doz Hesaplama Lab" });
      app.recordStats({ doseSolved: dose.correct });
      app.notify(`Doz odulu: +${xp} XP / +${coins} coin`, "gain");
      app.mountShell("training");
    }

    startBtn.addEventListener("click", () => {
      dose.pool = app.shuffle(app.DOSE_CASES).slice(0, 5);
      dose.index = 0;
      dose.correct = 0;
      dose.answered = false;
      scoreNode.textContent = "Dogru: 0";
      renderCase();
    });

    checkBtn.addEventListener("click", () => {
      const item = dose.pool[dose.index];
      if (!item || dose.answered) return;

      const value = Number(input.value);
      if (Number.isNaN(value)) {
        feedbackNode.textContent = "Gecerli bir sayi gir.";
        feedbackNode.className = "feedback-line bad";
        return;
      }

      dose.answered = true;
      const expected = expectedValue(item);
      const ok = Math.abs(value - expected) <= 0.05;

      if (ok) {
        dose.correct += 1;
        feedbackNode.textContent = `Dogru. Beklenen ${expected.toFixed(2)} mL`;
        feedbackNode.className = "feedback-line ok";
      } else {
        feedbackNode.textContent = `Yanlis. Dogru cevap ${expected.toFixed(2)} mL`;
        feedbackNode.className = "feedback-line bad";
      }

      scoreNode.textContent = `Dogru: ${dose.correct}`;
      checkBtn.disabled = true;
      nextBtn.disabled = false;
      input.disabled = true;
    });

    nextBtn.addEventListener("click", () => {
      dose.index += 1;
      if (dose.index >= dose.pool.length) finishDose();
      else renderCase();
    });
  }

  function initVital(app) {
    const startBtn = document.getElementById("vitalStartBtn");
    const nextBtn = document.getElementById("vitalNextBtn");
    const caseNode = document.getElementById("vitalCase");
    const optionsNode = document.getElementById("vitalOptions");
    const progressNode = document.getElementById("vitalProgress");
    const feedbackNode = document.getElementById("vitalFeedback");
    const scoreNode = document.getElementById("vitalScore");

    const vital = {
      pool: [],
      index: 0,
      correct: 0,
      answered: false
    };

    function renderVitalCase() {
      const c = vital.pool[vital.index];
      if (!c) return;

      vital.answered = false;
      caseNode.textContent = c.text;
      progressNode.textContent = `Vaka ${vital.index + 1} / ${vital.pool.length}`;
      feedbackNode.textContent = "";
      feedbackNode.className = "feedback-line";
      nextBtn.disabled = true;

      optionsNode.innerHTML = c.options
        .map((option, idx) => `<button class="option-btn" data-index="${idx}">${option}</button>`)
        .join("");

      optionsNode.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (vital.answered) return;
          vital.answered = true;

          const picked = Number(btn.dataset.index);
          const ok = picked === c.answer;

          optionsNode.querySelectorAll("button").forEach((node, idx) => {
            node.disabled = true;
            if (idx === c.answer) node.classList.add("correct");
            if (node === btn && !ok) node.classList.add("wrong");
          });

          if (ok) {
            vital.correct += 1;
            feedbackNode.textContent = `Dogru: ${c.explain}`;
            feedbackNode.className = "feedback-line ok";
          } else {
            feedbackNode.textContent = `Yanlis: ${c.explain}`;
            feedbackNode.className = "feedback-line bad";
          }

          scoreNode.textContent = `Skor: ${vital.correct}`;
          nextBtn.disabled = false;
        });
      });
    }

    function finishVital() {
      caseNode.textContent = `Vital karar seti tamamlandi. Dogru: ${vital.correct}/${vital.pool.length}`;
      optionsNode.innerHTML = "";
      progressNode.textContent = "Set tamamlandi";
      feedbackNode.textContent = "Yeni set icin Baslat'a bas.";
      feedbackNode.className = "feedback-line";
      nextBtn.disabled = true;

      const xp = 40 + vital.correct * 18;
      const coins = 20 + vital.correct * 8;
      app.addRewards({ xp, coins, reason: "Vital Karar Lab" });
      app.recordStats({ vitalSolved: vital.correct });
      app.notify(`Vital odulu: +${xp} XP / +${coins} coin`, "gain");
      app.mountShell("training");
    }

    startBtn.addEventListener("click", () => {
      vital.pool = app.shuffle(app.VITAL_CASES).slice(0, 5);
      vital.index = 0;
      vital.correct = 0;
      vital.answered = false;
      scoreNode.textContent = "Skor: 0";
      renderVitalCase();
    });

    nextBtn.addEventListener("click", () => {
      vital.index += 1;
      if (vital.index >= vital.pool.length) finishVital();
      else renderVitalCase();
    });
  }
})();
