import { blueprint, questions as starterQuestions, studyGuide } from "./nclex-data.js";
import { textbookQuestions } from "./textbook-bank.js";
import { supplementalQuestions } from "./supplemental-bank.js";
import { guideSections } from "./guide-content.js";
import { researchGuideSections } from "./research-guides.js";
import { learningResources } from "./learning-resources.js";
import { nmcnSaturationQuestions } from "./nmcn-saturation-bank.js";
import { newTextbookQuestions } from "./new-textbook-questions.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// Initialize Supabase Client Connection
const SUPABASE_URL = "https://bhdyyuiuzepsixvfcirg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZHl5dWl1emVwc2l4dmZjaXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4NDA4MDB9.your-key-here"; // Replace with your actual anon key if changed
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Premium Spotlight Motion Engine
document.addEventListener("mousemove", (e) => {
  const spotlight = $("#spotlight");
  if (spotlight) {
    spotlight.style.left = `${e.clientX}px`;
    spotlight.style.top = `${e.clientY}px`;
  }
});

// App Theme Core Protocol
$$(".theme-dot").forEach((dot) => {
  dot.addEventListener("click", () => {
    const theme = dot.dataset.theme;
    document.body.setAttribute("data-portal-theme", theme);
    localStorage.setItem("ad-portal-theme", theme);
  });
});
const activeTheme = localStorage.getItem("ad-portal-theme") || "default";
document.body.setAttribute("data-portal-theme", activeTheme);

function textLooksClear(text) {
  const value = String(text || "").trim();
  if (value.length < 2) return false;
  const noisy = ["Copyright 2010", "Editorial review", "Cengage Learning", "CamScanner", "MARKING GUIDE", "MARKING SCHEME", "______"];
  if (noisy.some((marker) => value.toLowerCase().includes(marker.toLowerCase()))) return false;
  const alphaCount = (value.match(/[a-z]/gi) || []).length;
  return alphaCount >= Math.min(6, value.length);
}

function isClearQuestion(question) {
  if (!question || !Array.isArray(question.options) || !Array.isArray(question.answer)) return false;
  if (!textLooksClear(question.prompt) || !textLooksClear(question.rationale)) return false;
  if (question.prompt.length > 1200 || question.options.some((option) => String(option).length > 500)) return false;
  if (question.options.length < 4 || question.options.length > 8) return false;
  if (!question.options.every(textLooksClear)) return false;
  return question.answer.every((index) => Number.isInteger(index) && index >= 0 && index < question.options.length);
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

const rawQuestions = [
  ...(textbookQuestions.length ? textbookQuestions : starterQuestions),
  ...supplementalQuestions,
  ...nmcnSaturationQuestions,
  ...newTextbookQuestions
];
const clearQuestions = rawQuestions.filter(isClearQuestion);
const questionById = new Map(clearQuestions.map((question) => [question.id, question]));
const savedSession = JSON.parse(localStorage.getItem("ad-session") || "{}");

function savedRandomOrder(items) {
  const ids = items.map((question) => question.id);
  const saved = JSON.parse(localStorage.getItem("ad-question-order") || "[]");
  const sameBank = saved.length === ids.length && saved.every((id) => questionById.has(id));
  if (sameBank) return saved.map((id) => questionById.get(id));

  const shuffledIds = shuffle(items).map((question) => question.id);
  localStorage.setItem("ad-question-order", JSON.stringify(shuffledIds));
  return shuffledIds.map((id) => questionById.get(id));
}

const questions = savedRandomOrder(clearQuestions);

const state = {
  view: savedSession.view || "practice",
  filtered: [...questions],
  practiceIndex: savedSession.practiceIndex || 0,
  exam: (savedSession.examIds || []).map((id) => questionById.get(id)).filter(Boolean),
  examIndex: savedSession.examIndex || 0,
  examAnswers: savedSession.examAnswers || {},
  practiceAnswers: savedSession.practiceAnswers || {},
  timerId: null,
  remainingSeconds: 0,
  progress: JSON.parse(localStorage.getItem("nclex-progress") || "{}"),
  currentUser: null
};

const categoryFilter = $("#category-filter");
const chapterFilter = $("#chapter-filter");

// Auth Sync Engine
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      state.currentUser = session.user;
      const fullName = session.user.user_metadata?.full_name || session.user.email;
      $("#user-display-name").textContent = fullName;
      $("#user-status-text").textContent = "Connected via Cloud";
      $("#user-avatar").textContent = fullName.charAt(0).toUpperCase();
      $("#chat-user-context").textContent = `Logged in as ${fullName}`;
      $("#auth-icon").setAttribute("data-lucide", "log-out");
    } else {
      state.currentUser = null;
      $("#user-display-name").textContent = "Guest Student";
      $("#user-status-text").textContent = "Not logged in";
      $("#user-avatar").textContent = "?";
      $("#chat-user-context").textContent = "Guest Mode";
      $("#auth-icon").setAttribute("data-lucide", "log-in");
    }
    lucide.createIcons();
  });
}

function handleAuthAction() {
  if (!supabase) return alert("Supabase configuration missing or inaccessible.");
  if (state.currentUser) {
    supabase.auth.signOut().then(() => window.location.reload());
  } else {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  }
}

function saveProgress() {
  localStorage.setItem("nclex-progress", JSON.stringify(state.progress));
  saveSession();
  renderProgress();
}

function saveSession() {
  localStorage.setItem(
    "ad-session",
    JSON.stringify({
      view: state.view,
      practiceIndex: state.practiceIndex,
      practiceAnswers: state.practiceAnswers,
      examIds: state.exam.map((question) => question.id),
      examIndex: state.examIndex,
      examAnswers: state.examAnswers
    })
  );
}

function isCorrect(question, selected) {
  return [...question.answer].sort().join(",") === [...selected].sort().join(",");
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function populateFilters() {
  const categories = ["All categories", ...new Set(questions.map((q) => q.category))];
  const chapters = ["All chapters", ...new Set(questions.map((q) => q.chapter))];
  categoryFilter.innerHTML = categories.map((item) => `<option value="${item}">${item}</option>`).join("");
  chapterFilter.innerHTML = chapters.map((item) => `<option value="${item}">${item}</option>`).join("");
}

function applyFilters() {
  const category = categoryFilter.value;
  const chapter = chapterFilter.value;
  state.filtered = questions.filter((q) => {
    return (category === "All categories" || q.category === category) && (chapter === "All chapters" || q.chapter === chapter);
  });
  state.practiceIndex = 0;
  saveSession();
  renderPractice();
}

function renderOptions(container, question, selected = [], disabled = false) {
  container.innerHTML = question.options
    .map((option, index) => {
      const inputType = question.type === "multi" ? "checkbox" : "radio";
      const checked = selected.includes(index) ? "checked" : "";
      return `
        <label class="option" data-index="${index}">
          <input name="${container.id}-option" type="${inputType}" value="${index}" ${checked} ${disabled ? "disabled" : ""} />
          <span>${escapeHtml(option)}</span>
        </label>
      `;
    })
    .join("");
}

function getSelections(container) {
  return [...container.querySelectorAll("input:checked")].map((input) => Number(input.value));
}

function markOptions(container, question, selected) {
  container.querySelectorAll(".option").forEach((option) => {
    const index = Number(option.dataset.index);
    if (question.answer.includes(index)) option.classList.add("is-correct");
    if (selected.includes(index) && !question.answer.includes(index)) option.classList.add("is-wrong");
  });
}

function resourceLinksFor(question) {
  return learningResources[question.category] || learningResources.default;
}

function answerText(question) {
  return question.answer.map((index) => question.options[index]).join("; ");
}

function cleanSourceRationale(question) {
  const text = String(question.rationale || "").trim();
  if (/This item was imported from/i.test(text) || /no detailed rationale was supplied/i.test(text)) {
    return "The original source supplied an answer key but did not give a full explanation. A_D has expanded the reasoning below using nursing priority rules, the question category, and the answer options.";
  }
  return text;
}

function stemFocus(question) {
  const stem = question.prompt.toLowerCase();
  if (/\b(first|initial|priority|most immediate|urgent)\b/.test(stem)) return "priority action";
  if (/\bteaching|understands|further teaching|instruction|education\b/.test(stem)) return "patient teaching";
  if (/\bside effect|adverse|toxicity|contraindication|medication|drug|dose\b/.test(stem)) return "medication safety";
  if (/\bassess|finding|observation|symptom|sign\b/.test(stem)) return "assessment finding";
  if (/\bexcept|least|not appropriate|contraindicated\b/.test(stem)) return "exception wording";
  if (/\bosce|procedure|sterile|dressing|catheter|specimen\b/.test(stem)) return "procedure safety";
  return "core nursing judgment";
}

function individualizedTeaching(question) {
  const focus = stemFocus(question);
  const correct = answerText(question);
  const lowerCorrect = correct.toLowerCase();
  const stem = question.prompt.toLowerCase();
  const points = [];

  points.push(`This question is mainly testing ${focus}. The safest answer is "${correct}" because it best matches the main cue in the stem and directly addresses the nursing problem.`);
  if (/\bairway|breath|respir|oxygen|cyanotic|dyspnea|wheeze|spo2|saturation\b/.test(`${stem} ${lowerCorrect}`)) {
    points.push("Airway and breathing cues are high priority. In nursing exams, respiratory compromise usually comes before comfort, teaching, feeding, or routine documentation.");
  }
  if (/\bbleed|hemorrhage|shock|pulse|blood pressure|perfusion|chest pain|cyanotic\b/.test(`${stem} ${lowerCorrect}`)) {
    points.push("Circulation cues can deteriorate quickly. Choose the action that assesses or restores perfusion and escalates care early.");
  }
  return points;
}

function optionReason(question, option, isAnswer) {
  const text = option.toLowerCase();
  if (isAnswer) return `This is correct because it best fits the stem and follows the nursing rule for ${stemFocus(question)}. ${cleanSourceRationale(question)}`;
  if (/\bdelay|wait|later|next round|end of the shift\b/.test(text)) return "This delays care when the stem requires immediate assessment or action.";
  return "This option is less appropriate because it is not the best match for the key cue or safest nursing action.";
}

function easyBreakdown(question) {
  const categoryAdvice = {
    "Coordinated Care": { why: "Testing professional judgment: assignment, delegation, or consent.", rule: "Delegate stable routine tasks; assessment belongs to the RN.", trap: "Wrong options often delegate nursing judgment." }
  };
  return categoryAdvice[question.category] || { why: "Testing safest interpretation.", rule: "Focus on main cues.", trap: "Delayed or incomplete actions." };
}

function rationaleHtml(question, heading = "Easy explanation") {
  const explanation = easyBreakdown(question);
  const correct = answerText(question);
  const teachingPoints = individualizedTeaching(question).map((p) => `<li>${escapeHtml(p)}</li>`).join("");
  const optionRows = question.options.map((option, index) => {
    const isAnswer = question.answer.includes(index);
    return `<div class="rationale-option ${isAnswer ? "is-answer" : ""}"><strong>${isAnswer ? "Correct" : "Why less likely"}: ${escapeHtml(option)}</strong><p>${escapeHtml(optionReason(question, option, isAnswer))}</p></div>`;
  }).join("");
  return `
    <div class="rationale-title">${escapeHtml(heading)}</div>
    <div class="rationale-grid">
      <section><h4>Correct Answer</h4><p>${escapeHtml(correct)}</p></section>
      <section><h4>Core Rule</h4><p>${escapeHtml(explanation.rule)}</p></section>
    </div>
    <div class="rationale-deep-dive"><ul>${teachingPoints}</ul></div>
    <div class="rationale-options">${optionRows}</div>
  `;
}

function renderPractice() {
  const question = state.filtered[state.practiceIndex];
  $("#practice-rationale").hidden = true;
  if (!question) {
    $("#practice-category").textContent = "No match";
    $("#practice-question").textContent = "No questions match this filter yet.";
    $("#practice-options").innerHTML = "";
    return;
  }
  $("#practice-category").textContent = `${question.category} - ${question.chapter}`;
  $("#practice-progress").textContent = `${state.practiceIndex + 1} of ${state.filtered.length}`;
  $("#practice-question").textContent = question.prompt;
  renderOptions($("#practice-options"), question, state.practiceAnswers[question.id] || []);
}

function checkPracticeAnswer() {
  const question = state.filtered[state.practiceIndex];
  const selected = getSelections($("#practice-options"));
  if (!question || selected.length === 0) return;

  state.practiceAnswers[question.id] = selected;
  const correct = isCorrect(question, selected);
  state.progress[question.id] = { correct, selected, at: new Date().toISOString() };
  saveProgress();

  markOptions($("#practice-options"), question, selected);
  $("#practice-rationale").hidden = false;
  $("#practice-rationale").innerHTML = rationaleHtml(question, correct ? "Correct. Easy explanation" : "Review this. Easy explanation");
}

function nextPractice(step = 1) {
  if (!state.filtered.length) return;
  state.practiceIndex = (state.practiceIndex + step + state.filtered.length) % state.filtered.length;
  saveSession();
  renderPractice();
}

function switchView(view) {
  state.view = view;
  $$(".nav__item").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.view === view));
  $$(".view").forEach((p) => p.classList.toggle("is-visible", p.id === `${view}-view`));
  if (view === "cbt" && state.exam.length) {
    $("#exam-setup").hidden = true;
    $("#exam-panel").hidden = false;
    renderExam();
  }
  saveSession();
}

function startExam() {
  const size = Math.min(Number($("#exam-size").value), questions.length);
  const minutes = Math.max(Number($("#exam-minutes").value), 1);
  state.exam = shuffle(questions).slice(0, size);
  state.examIndex = 0;
  state.examAnswers = {};
  state.remainingSeconds = minutes * 60;
  $("#exam-setup").hidden = true;
  $("#exam-panel").hidden = false;
  $("#timer-label").textContent = "Time left";
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    state.remainingSeconds -= 1;
    $("#timer-value").textContent = formatTime(Math.max(state.remainingSeconds, 0));
    if (state.remainingSeconds <= 0) submitExam();
  }, 1000);
  renderExam();
}

function renderExam() {
  const question = state.exam[state.examIndex];
  if (!question) return;
  $("#exam-category").textContent = `${question.category} - ${question.chapter}`;
  $("#exam-progress").textContent = `${state.examIndex + 1} of ${state.exam.length}`;
  $("#exam-question").textContent = question.prompt;
  renderOptions($("#exam-options"), question, state.examAnswers[question.id] || []);
  renderExamNavigator();
}

function renderExamNavigator() {
  const answered = state.exam.filter((q) => (state.examAnswers[q.id] || []).length).length;
  $("#exam-answered-count").textContent = `${answered}/${state.exam.length} answered`;
  $("#exam-jump-list").innerHTML = state.exam.map((q, i) => {
    const status = (state.examAnswers[q.id] || []).length ? "is-answered" : "";
    return `<button class="exam-jump ${status}" data-idx="${i}">${i + 1}</button>`;
  }).join("");
  $$(".exam-jump").forEach((btn) => btn.addEventListener("click", () => {
    state.examAnswers[state.exam[state.examIndex].id] = getSelections($("#exam-options"));
    state.examIndex = Number(btn.dataset.idx);
    renderExam();
  }));
}

function submitExam() {
  clearInterval(state.timerId);
  $("#exam-panel").hidden = true;
  $("#exam-results").hidden = false;
  $("#exam-setup").hidden = false;
  $("#exam-results").innerHTML = `<h3>Exam Finished</h3><p class='text-dim'>Review completed answers.</p>`;
}

function renderProgress() {
  $("#bank-count").textContent = questions.length;
}

function handleChatSend() {
  const input = $("#chat-input");
  const text = input.value.trim();
  if (!text) return;
  const container = $("#chat-messages-container");
  container.innerHTML += `<div class="chat-msg user"><p>${escapeHtml(text)}</p></div>`;
  input.value = "";
  
  // Dynamic Name Context Verification
  const userName = state.currentUser ? (state.currentUser.user_metadata?.full_name || "Student") : "Student";
  setTimeout(() => {
    container.innerHTML += `<div class="chat-msg system"><p>Excellent inquiry, ${userName}. Let's break down this concept using clinical prioritization priorities...</p></div>`;
    container.scrollTop = container.scrollHeight;
  }, 1000);
}

function bindEvents() {
  $$(".nav__item").forEach((btn) => btn.addEventListener("click", () => switchView(btn.dataset.view)));
  categoryFilter.addEventListener("change", applyFilters);
  chapterFilter.addEventListener("change", applyFilters);
  $("#auth-action-btn").addEventListener("click", handleAuthAction);
  $("#check-answer").addEventListener("click", checkPracticeAnswer);
  $("#previous-question").addEventListener("click", () => nextPractice(-1));
  $("#next-question").addEventListener("click", () => nextPractice(1));
  $("#start-exam").addEventListener("click", startExam);
  $("#submit-exam").addEventListener("click", submitExam);
  $("#chat-send").addEventListener("click", handleChatSend);
  $("#chatbot-toggle").addEventListener("click", () => $("#chatbot-panel").hidden = !$("#chatbot-panel").hidden);
  $("#chatbot-close").addEventListener("click", () => $("#chatbot-panel").hidden = true);
}

populateFilters();
bindEvents();
renderProgress();
renderPractice();
switchView(state.view);
lucide.createIcons();