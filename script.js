const NOTE_FILES = [
  "do_1.png",
  "do_d.png",
  "do_g.png",
  "do.png",
  "re_d.png",
  "re_g.png",
  "mi_d.png",
  "mi_g.png",
  "fa_d.png",
  "fa_g.png",
  "so_d.png",
  "so_g.png",
  "la_d.png",
  "la_g.png",
  "xi_d.png",
  "xi_g.png",
];

const NOTE_ALIASES = {
  do: "do",
  "1": "do",
  d: "do",
  re: "re",
  "2": "re",
  r: "re",
  mi: "mi",
  "3": "mi",
  m: "mi",
  fa: "fa",
  "4": "fa",
  f: "fa",
  so: "so",
  sol: "so",
  "5": "so",
  s: "so",
  la: "la",
  "6": "la",
  l: "la",
  xi: "xi",
  si: "xi",
  ti: "xi",
  "7": "xi",
  x: "xi",
};

const NOTES = NOTE_FILES.map((file) => {
  const baseName = file.replace(".png", "");
  const note = baseName.split("_")[0];
  return {
    src: `music_pictures/${file}`,
    baseName,
    note,
  };
});

const imageEl = document.getElementById("noteImage");
const formEl = document.getElementById("answerForm");
const inputEl = document.getElementById("answerInput");
const feedbackEl = document.getElementById("feedback");
const skipButton = document.getElementById("skipButton");
const correctCountEl = document.getElementById("correctCount");
const totalCountEl = document.getElementById("totalCount");

const stats = { total: 0, correct: 0 };
let currentQuestion = null;
let nextQuestionTimer = null;
let questionCounted = false;
let questionSolved = false;

function pickRandomQuestion() {
  currentQuestion = NOTES[Math.floor(Math.random() * NOTES.length)];
  imageEl.src = currentQuestion.src;
  imageEl.alt = `${currentQuestion.baseName} 的谱例`;
  inputEl.value = "";
  inputEl.focus();
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  questionCounted = false;
  questionSolved = false;
}

function sanitizeInput(value) {
  return value.trim().toLowerCase();
}

function matchesAnswer(answer) {
  if (!currentQuestion) return false;

  const normalized = sanitizeInput(answer);
  if (!normalized) return false;

  const { baseName, note } = currentQuestion;
  const fileMatch =
    baseName.toLowerCase() === normalized ||
    baseName.toLowerCase().startsWith(normalized);

  const noteMatch = NOTE_ALIASES[normalized] === note;

  return fileMatch || noteMatch;
}

function updateStats(isCorrect) {
  if (!questionCounted) {
    stats.total += 1;
    questionCounted = true;
  }
  if (isCorrect && !questionSolved) {
    stats.correct += 1;
    questionSolved = true;
  }
  correctCountEl.textContent = stats.correct;
  totalCountEl.textContent = stats.total;
}

function showFeedback(message, isCorrect) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${isCorrect ? "success" : "error"}`;
}

function handleSubmit(event) {
  event.preventDefault();
  if (!currentQuestion) return;

  const userAnswer = inputEl.value;
  const isCorrect = matchesAnswer(userAnswer);
  updateStats(isCorrect);

  if (isCorrect) {
    showFeedback(`✅ 正确！这是 ${currentQuestion.note.toUpperCase()}.`, true);
    scheduleNextQuestion();
  } else {
    showFeedback("❌ 再试一次，注意看谱面细节。", false);
  }
}

function scheduleNextQuestion() {
  if (nextQuestionTimer) {
    clearTimeout(nextQuestionTimer);
  }
  nextQuestionTimer = setTimeout(pickRandomQuestion, 1200);
}

function handleSkip() {
  if (nextQuestionTimer) {
    clearTimeout(nextQuestionTimer);
  }
  pickRandomQuestion();
}

formEl.addEventListener("submit", handleSubmit);
skipButton.addEventListener("click", handleSkip);

pickRandomQuestion();

