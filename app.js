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

// --- Data Validation Helpers ---
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

// --- Data Preparation ---
const rawQuestions = [
  ...(textbookQuestions.length ? textbookQuestions : starterQuestions),
  ...supplementalQuestions,
  ...nmcnSaturationQuestions,
  ...newTextbookQuestions
];
const clearQuestions = rawQuestions.filter(isClearQuestion);
const questionById = new Map(clearQuestions.map((question) => [question.id, question]));

// Function to shuffle and retrieve questions, handling saved order
function savedRandomOrder(items) {
  const ids = items.map((question) => question.id);
  const saved = JSON.parse(localStorage.getItem("ad-question-order") || "[]");
  // Check if the saved order matches the current bank of questions
  const sameBank = saved.length === ids.length && saved.every((id) => questionById.has(id));
  
  if (sameBank) {
    // If it's the same bank, reorder the current items based on the saved IDs
    const orderedQuestions = saved.map(id => questionById.get(id)).filter(Boolean);
    // Ensure all current items are present in the saved order (handles cases where questions are added/removed)
    const missingIds = ids.filter(id => !saved.includes(id));
    if (missingIds.length > 0) {
      const missingQuestions = missingIds.map(id => questionById.get(id)).filter(Boolean);
      // Combine and shuffle for the new items to maintain randomness
      const finalOrder = [...orderedQuestions, ...shuffle(missingQuestions)];
      localStorage.setItem("ad-question-order", JSON.stringify(finalOrder.map(q => q.id)));
      return finalOrder;
    }
    return orderedQuestions;
  }

  // If not the same bank or no saved order, shuffle and save
  const shuffledIds = shuffle(items).map((question) => question.id);
  localStorage.setItem("ad-question-order", JSON.stringify(shuffledIds));
  return shuffledIds.map((id) => questionById.get(id));
}

const questions = savedRandomOrder(clearQuestions); // All prepared questions

// --- State Management ---
const savedSession = JSON.parse(localStorage.getItem("ad-session") || "{}");

const state = {
  view: savedSession.view || "dashboard", // Default view is dashboard
  filtered: [...questions], // Questions filtered by category
  practiceIndex: savedSession.practiceIndex || 0,
  exam: (savedSession.examIds || []).map((id) => questionById.get(id)).filter(Boolean), // Rehydrate exam questions
  examIndex: savedSession.examIndex || 0,
  examAnswers: savedSession.examAnswers || {},
  practiceAnswers: savedSession.practiceAnswers || {},
  timerId: null,
  remainingSeconds: 0,
  progress: JSON.parse(localStorage.getItem("nclex-progress") || "{}") // User's progress data
};

// --- DOM Elements ---
const categoryFilter = $("#category-filter");
const dashboardFactElement = $("#dashboard-fact");

// --- Utility Functions ---
function saveProgress() {
  localStorage.setItem("nclex-progress", JSON.stringify(state.progress));
  saveSession(); // Save session after progress updates
  renderProgress(); // Update the review section when progress changes
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
  // Sort both arrays to ensure order doesn't matter for comparison
  const expected = [...question.answer].sort().join(",");
  const actual = [...selected].sort().join(",");
  return expected === actual;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

// --- Rendering Functions ---

// Populate the category filter dropdown
function populateFilters() {
  const categories = ["All categories", ...new Set(questions.map((q) => q.category))];
  categoryFilter.innerHTML = categories.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
}

// Apply selected category filter
function applyFilters() {
  const category = categoryFilter.value;
  state.filtered = questions.filter((q) => category === "All categories" || q.category === category);
  state.practiceIndex = 0; // Reset index when filters change
  saveSession();
  renderPractice(); // Re-render practice questions based on new filter
}

// Render the answer options for a question
function renderOptions(container, question, selected = [], disabled = false) {
  container.innerHTML = question.options
    .map((option, index) => {
      const inputType = question.type === "multi" ? "checkbox" : "radio";
      const checked = selected?.includes(index) ? "checked" : ""; // Safely check if options were selected
      return `
        <label class="option glass-panel" data-index="${index}">
          <input name="${container.id}-option" type="${inputType}" value="${index}" ${checked} ${disabled ? "disabled" : ""} />
          <span>${escapeHtml(option)}</span>
        </label>
      `;
    }).join("");
}

// Get the currently selected answer indices from the option inputs
function getSelections(container) {
  return [...container.querySelectorAll("input:checked")].map((input) => Number(input.value));
}

// Mark options with correct/incorrect highlights after an answer is checked
function markOptions(container, question, selected) {
  container.querySelectorAll(".option").forEach((option) => {
    const index = Number(option.dataset.index);
    if (question.answer.includes(index)) option.classList.add("is-correct");
    // Highlight as wrong only if it was selected by the user and is not a correct answer
    if (selected.includes(index) && !question.answer.includes(index)) option.classList.add("is-wrong");
  });
}

// Get relevant learning resources based on question category
function resourceLinksFor(question) { return learningResources[question.category] || learningResources.default; }
// Get the text of the correct answer(s)
function answerText(question) { return question.answer.map((index) => question.options[index]).join("; "); }

// Clean up rationale text from original sources if necessary
function cleanSourceRationale(question) {
  const text = String(question.rationale || "").trim();
  // Patterns indicating the rationale might be boilerplate or incomplete
  if (/This item was imported from/i.test(text) || /no detailed rationale was supplied/i.test(text) || /Copyright:/i.test(text)) {
    return "The original source supplied an answer key but did not provide a full explanation. A_D has expanded the reasoning below using nursing priority rules, the question category, and the answer options.";
  }
  return text;
}

// Determine the core concept being tested in a question stem
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

// Generate detailed teaching points for a question
function individualizedTeaching(question) {
  const focus = stemFocus(question);
  const correct = answerText(question);
  const lowerCorrect = correct.toLowerCase();
  const stem = question.prompt.toLowerCase();
  const points = [];

  points.push(`This question is mainly testing ${focus}. The safest answer is "${correct}" because it best matches the main cue in the stem and directly addresses the nursing problem.`);
  if (/\bairway|breath|respir|oxygen|cyanotic|dyspnea|wheeze|spo2|saturation\b/.test(`${stem} ${lowerCorrect}`)) points.push("Airway and breathing cues are high priority. In nursing exams, respiratory compromise usually comes before comfort, teaching, feeding, or routine documentation.");
  if (/\bbleed|hemorrhage|shock|pulse|blood pressure|perfusion|chest pain|cyanotic\b/.test(`${stem} ${lowerCorrect}`)) points.push("Circulation cues can deteriorate quickly. Choose the action that assesses or restores perfusion and escalates care early.");
  if (/\bfever|infection|sterile|asepsis|hand hygiene|isolation|wound|catheter\b/.test(`${stem} ${lowerCorrect}`)) points.push("The infection-control principle is to prevent organism transfer before it reaches the patient or a sterile body site.");
  if (/\bdrug|medication|insulin|digoxin|warfarin|furosemide|antibiotic|opioid|dose\b/.test(`${stem} ${lowerCorrect}`)) points.push("For drug questions, connect the medication to the required nursing check: allergy, vital sign, lab value, dose, route, expected effect, and danger sign.");
  if (/\bpregnan|postpartum|newborn|labour|labor|breastfeeding|immunization|child|infant\b/.test(`${stem} ${lowerCorrect}`)) points.push("For maternal-child questions, first separate normal findings from danger signs, then choose the option that protects mother, fetus, newborn, or child from the most immediate harm.");
  if (/\bsuicide|hallucination|anxiety|depression|mental|psychiatric|therapeutic\b/.test(`${stem} ${lowerCorrect}`)) points.push("For psychosocial questions, safety and therapeutic communication matter. Acknowledge feelings, assess risk, avoid false reassurance, and do not argue with altered perceptions.");
  if (/\bexcept|least|not appropriate|needs further teaching|incorrect\b/.test(stem)) points.push("Be careful with negative wording. The correct answer may be the unsafe, false, or least appropriate statement rather than the best nursing action.");
  points.push("A fast way to confirm the answer is to ask: does this option solve the exact problem in the stem, and is it safer than the other choices?");
  return points;
}

// Explain why a specific option is correct or incorrect
function optionReason(question, option, isAnswer) {
  const text = option.toLowerCase();
  if (isAnswer) return `This is correct because it best fits the stem and follows the nursing rule for ${stemFocus(question)}. ${cleanSourceRationale(question)}`;
  if (/\bdelay|wait|later|next round|end of the shift\b/.test(text)) return "This is less appropriate because it delays care when the stem requires assessment, prevention, or immediate action.";
  if (/\bignore|normal|document as normal|no need\b/.test(text)) return "This is less appropriate because it minimizes a cue that may need nursing assessment or reporting.";
  if (/\bwithout|skip|before doing it|no assessment\b/.test(text)) return "This is less appropriate because it skips a safety, assessment, or procedure step.";
  if (/\baspirin|double|extra dose|stop|share|abruptly\b/.test(text)) return "This is less appropriate because it creates medication-safety risk.";
  if (/\bflat|heavy meal|feed|ambulate\b/.test(text) && /\bbreath|dyspnea|cyanotic|oxygen|chest\b/.test(question.prompt.toLowerCase())) return "This is less appropriate because it does not protect airway, breathing, or circulation first.";
  if (/\breassure|don't worry|calm down|dramatic\b/.test(text)) return "This is less appropriate because reassurance without assessment can miss a serious clinical or psychosocial risk.";
  if (/\bfamily|relative|friend\b/.test(text) && /\bconsent|confidential|privacy|adult\b/.test(question.prompt.toLowerCase())) return "This is less appropriate because it may violate consent, autonomy, or confidentiality.";
  return "This option is less appropriate because it is not the best match for the key cue, priority word, or safest nursing action in the stem.";
}

// Provide a simplified explanation based on question category
function easyBreakdown(question) {
  const categoryAdvice = {
    "Coordinated Care": { why: "Testing professional judgment, priority, or delegation.", rule: "Keep the client safe, protect rights, and remember assessment is a nursing responsibility.", trap: "Wrong options delay reporting or delegate improperly." },
    "Safety and Infection Prevention and Control": { why: "Testing harm prevention.", rule: "Hand hygiene, patient ID, and immediate safety checks come before comfort.", trap: "Wrong options skip hand hygiene or break sterile fields." },
    "Health Promotion and Maintenance": { why: "Testing prevention, normal development, and teaching.", rule: "Separate normal findings from danger signs.", trap: "Wrong options treat normal findings as emergencies." },
    "Psychosocial Integrity": { why: "Testing emotional safety and communication.", rule: "Acknowledge feelings and assess safety. Don't argue with delusions.", trap: "Wrong options give advice too quickly or promise secrecy." },
    "Basic Care and Comfort": { why: "Testing essential bedside care.", rule: "Choose the action that is safe and prevents immobility complications.", trap: "Wrong options force activity or ignore dignity." },
    "Pharmacological Therapies": { why: "Testing medication safety.", rule: "Check the right patient, drug, dose, and relevant lab before giving.", trap: "Wrong options ignore allergies or advise stopping medication abruptly." },
    "Reduction of Risk Potential": { why: "Testing early detection of complications.", rule: "Look for the finding that signals deterioration.", trap: "Wrong options focus on comfort while ignoring abnormal labs." },
    "Physiological Adaptation": { why: "Testing response to illness.", rule: "Use ABCs, bleeding, shock, and fluid balance to decide priority.", trap: "Wrong options delay emergency care." }
  };
  return categoryAdvice[question.category] || { why: "Testing the safest interpretation.", rule: "Focus on the main cue.", trap: "Wrong options are unsafe or not the priority." };
}

// Generate the HTML for the detailed rationale section
function rationaleHtml(question, heading = "Easy explanation") {
  const explanation = easyBreakdown(question);
  const correct = answerText(question);
  const teachingPoints = individualizedTeaching(question).map((point) => `<li>${escapeHtml(point)}</li>`).join("");
  const optionRows = question.options.map((option, index) => {
    const isAnswer = question.answer.includes(index);
    const label = isAnswer ? "Correct" : "Why less likely";
    const reason = optionReason(question, option, isAnswer);
    return `<div class="rationale-option ${isAnswer ? "is-answer" : ""}"><strong>${escapeHtml(label)}: ${escapeHtml(option)}</strong><p>${escapeHtml(reason)}</p></div>`;
  }).join("");
  const links = resourceLinksFor(question).map(([label, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`).join("");
  return `
    <div class="rationale-title">${escapeHtml(heading)}</div>
    <div class="rationale-grid">
      <section><h4>Correct Answer</h4><p>${escapeHtml(correct)}</p></section>
      <section><h4>What The Question Is Testing</h4><p>${escapeHtml(explanation.why)}</p></section>
      <section><h4>Core Nursing Rule</h4><p>${escapeHtml(explanation.rule)}</p></section>
      <section><h4>Common Trap</h4><p>${escapeHtml(explanation.trap)}</p></section>
      <section><h4>Source Rationale</h4><p>${escapeHtml(cleanSourceRationale(question))}</p></section>
    </div>
    <div class="rationale-deep-dive"><h4>Detailed Teaching Explanation</h4><ul>${teachingPoints}</ul></div>
    <div class="rationale-options"><h4>Option-by-option review</h4>${optionRows}</div>
    <div class="resource-links"><span>Further study:</span>${links}</div>
  `;
}

// Render the practice view (single question display)
function renderPractice() {
  const question = state.filtered[state.practiceIndex];
  $("#practice-rationale").hidden = true; // Hide rationale until checked
  if (!question) {
    $("#practice-category").textContent = "No match";
    $("#practice-progress").textContent = "";
    $("#practice-question").textContent = "No questions match this filter yet.";
    $("#practice-options").innerHTML = "";
    return;
  }
  $("#practice-category").textContent = question.category;
  $("#practice-progress").textContent = `${state.practiceIndex + 1} of ${state.filtered.length}`;
  $("#practice-question").textContent = question.prompt;
  // Render options, pre-filling if an answer was previously saved
  renderOptions($("#practice-options"), question, state.practiceAnswers[question.id] || []);
}

// Check the answer for the current practice question
function checkPracticeAnswer() {
  const question = state.filtered[state.practiceIndex];
  const selected = getSelections($("#practice-options"));
  if (!question || selected.length === 0) return; // Do nothing if no question or no answer selected

  state.practiceAnswers[question.id] = selected; // Save selection
  const correct = isCorrect(question, selected);
  state.progress[question.id] = { correct, selected, at: new Date().toISOString() }; // Update progress
  saveProgress();

  markOptions($("#practice-options"), question, selected); // Visually mark correct/incorrect
  $("#practice-rationale").hidden = false; // Show rationale
  $("#practice-rationale").innerHTML = rationaleHtml(question, correct ? "Correct. Easy explanation" : "Review this. Easy explanation");
}

// Navigate between practice questions
function nextPractice(step = 1) {
  const current = state.filtered[state.practiceIndex];
  if (current) {
    const selected = getSelections($("#practice-options"));
    if (selected.length) state.practiceAnswers[current.id] = selected; // Save current answer before moving
  }
  if (!state.filtered.length) return; // Do nothing if no questions are available
  // Calculate new index, wrapping around using modulo
  state.practiceIndex = (state.practiceIndex + step + state.filtered.length) % state.filtered.length;
  saveSession(); // Save the new index
  renderPractice(); // Render the new question
}

// Switch between different views (dashboard, practice, cbt, etc.)
function switchView(view) {
  state.view = view;
  $$(".nav__item").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  $$(".view").forEach((panel) => panel.classList.toggle("is-visible", panel.id === `${view}-view`));
  
  // Update view titles based on the selected view
  const titles = {
    dashboard: ["Welcome", "Your personalized study dashboard"],
    practice: ["Learning mode", "Practice with instant rationales"],
    cbt: ["Simulation", "CBT exam mode"],
    review: ["Performance", "Review weak areas"],
    guide: ["Study map", "High-yield council exam guide"]
  };
  
  $("#view-kicker").textContent = titles[view][0];
  $("#view-title").textContent = titles[view][1];

  // Reset timer display if not in CBT view or if CBT is not active
  if (view !== "cbt" || !state.timerId) {
    $("#timer-label").textContent = view === "cbt" ? "Ready" : "Untimed";
    $("#timer-value").textContent = "00:00";
  }

  // Handle entering CBT view
  if (view === "cbt" && state.exam.length) {
    $("#exam-setup").hidden = true; // Hide setup if exam is already loaded
    $("#exam-results").hidden = true; // Hide results if exam is active
    $("#exam-panel").hidden = false;  // Show exam panel
    // Ensure examIndex is valid
    state.examIndex = Math.min(state.examIndex, state.exam.length - 1);
    renderExam(); // Render the current exam question
  } else if (view === "cbt" && !state.exam.length) {
    // If no exam loaded, ensure setup is visible
    $("#exam-setup").hidden = false;
    $("#exam-panel").hidden = true;
    $("#exam-results").hidden = true;
  }

  renderProgress(); // Update progress indicators
  saveSession(); // Save the current view state
}

// Start the CBT exam simulation
function startExam() {
  const sizeInput = $("#exam-size");
  const minutesInput = $("#exam-minutes");
  
  const size = Math.min(Number(sizeInput.value), questions.length); // Max questions selected cannot exceed available questions
  const minutes = Math.max(Number(minutesInput.value), 1); // Minimum 1 minute
  
  sizeInput.value = size; // Update input to reflect clamped value
  minutesInput.value = minutes; // Update input to reflect clamped value

  state.exam = shuffle(questions).slice(0, size); // Select random questions
  state.examIndex = 0;
  state.examAnswers = {}; // Clear previous answers
  state.remainingSeconds = minutes * 60; // Set timer
  
  $("#exam-setup").hidden = true; // Hide setup screen
  $("#exam-results").hidden = true; // Hide results screen
  $("#exam-panel").hidden = false;  // Show exam panel
  $("#timer-label").textContent = "Time left"; // Update timer label
  $("#timer-value").textContent = formatTime(state.remainingSeconds); // Initial timer display

  // Clear any existing timer interval
  clearInterval(state.timerId);
  // Set up new timer interval
  state.timerId = setInterval(() => {
    state.remainingSeconds -= 1;
    $("#timer-value").textContent = formatTime(Math.max(state.remainingSeconds, 0)); // Ensure time doesn't go below 0
    if (state.remainingSeconds <= 0) {
      submitExam(); // Submit exam when time runs out
    }
  }, 1000);
  
  renderExam(); // Render the first question
  saveSession(); // Save the new exam state
}

// Render a single CBT exam question
function renderExam() {
  const question = state.exam[state.examIndex];
  if (!question) return; // Exit if no question found

  $("#exam-category").textContent = question.category;
  $("#exam-progress").textContent = `${state.examIndex + 1} of ${state.exam.length}`;
  $("#exam-question").textContent = question.prompt;
  // Render options, pre-filling if answer was previously saved
  renderOptions($("#exam-options"), question, state.examAnswers[question.id] || []);
  
  // Disable back button on first question
  $("#exam-prev").disabled = state.examIndex === 0;
  // Change "Next" button text to "Review" on the last question
  $("#exam-next").textContent = state.examIndex === state.exam.length - 1 ? "Review" : "Next";
  
  renderExamNavigator(); // Update the question navigator
}

// Store the user's answer for the current CBT exam question
function storeExamAnswer() {
  const question = state.exam[state.examIndex];
  state.examAnswers[question.id] = getSelections($("#exam-options"));
  saveSession(); // Save session after storing answer
}

// Move between CBT exam questions (forward or backward)
function moveExam(step) {
  storeExamAnswer(); // Save the answer for the current question
  // Calculate the new index, ensuring it stays within bounds
  state.examIndex = Math.min(Math.max(state.examIndex + step, 0), state.exam.length - 1);
  saveSession(); // Save the updated index
  renderExam(); // Render the next/previous question
}

// Jump directly to a specific question in the CBT exam
function jumpExam(index) {
  storeExamAnswer(); // Save the answer for the current question
  state.examIndex = index; // Set the new index
  saveSession(); // Save the updated index
  renderExam(); // Render the selected question
}

// Render the question navigator (jump list and answered count)
function renderExamNavigator() {
  // Count how many questions have been answered
  const answered = state.exam.filter((question) => (state.examAnswers[question.id] || []).length).length;
  $("#exam-answered-count").textContent = `${answered}/${state.exam.length} answered`;
  
  // Generate HTML for each question jump button
  $("#exam-jump-list").innerHTML = state.exam.map((question, index) => {
    // Add 'is-answered' class if the question has an answer
    const status = (state.examAnswers[question.id] || []).length ? "is-answered" : "";
    // Add 'is-current' class if this is the currently displayed question
    const active = index === state.examIndex ? "is-current" : "";
    return `<button class="exam-jump ${status} ${active}" type="button" data-exam-index="${index}">${index + 1}</button>`;
  }).join("");
  
  // Add event listeners to each jump button
  $$("#exam-jump-list .exam-jump").forEach((button) => {
    button.addEventListener("click", () => jumpExam(Number(button.dataset.examIndex)));
  });
}

// Submit the CBT exam and display results
function submitExam() {
  if (!state.exam.length) return; // Do nothing if exam is empty
  storeExamAnswer(); // Save the answer for the last question
  clearInterval(state.timerId); // Stop the timer
  state.timerId = null;
  
  $("#exam-panel").hidden = true;  // Hide exam panel
  $("#exam-results").hidden = false; // Show results section
  $("#exam-setup").hidden = false;  // Show setup again
  $("#timer-label").textContent = "Completed"; // Update timer label

  // Process results for each question
  const rows = state.exam.map((question) => {
    const selected = state.examAnswers[question.id] || [];
    const correct = isCorrect(question, selected);
    // Update overall progress based on exam results
    state.progress[question.id] = { correct, selected, at: new Date().toISOString() };
    return { question, selected, correct };
  });
  saveProgress(); // Save updated progress
  saveSession();  // Save session data

  const score = rows.filter((row) => row.correct).length;
  // Dynamically generate the results HTML
  $("#exam-results").innerHTML = `
    <p class="eyebrow">CBT result</p>
    <h3>Exam submitted</h3>
    <div class="score" style="font-size: 2rem; color: var(--accent); margin: 10px 0;">${score}/${rows.length}</div>
    <p class="subtle">Review the rationales below, then use the Review tab to target weak client-needs categories.</p>
    <div class="missed-list" style="margin-top: 20px;">
      ${rows.map(({ question, selected, correct }) => `
          <div class="missed-card glass-panel" style="padding: 20px; margin-bottom: 15px;">
            <strong style="color: ${correct ? 'var(--accent)' : 'var(--rose)'}">${correct ? "Correct" : "Missed"} - ${escapeHtml(question.category)}</strong>
            <p>${escapeHtml(question.prompt)}</p>
            <p><strong>Answer:</strong> ${question.answer.map((i) => escapeHtml(question.options[i])).join("; ")}</p>
            ${rationaleHtml(question, "Explanation")}
          </div>`
        ).join("")}
    </div>
  `;
}

// Render the overall progress and missed questions
function renderProgress() {
  const bars = blueprint.map(([category]) => {
    const categoryQuestions = questions.filter((q) => q.category === category);
    const answered = categoryQuestions.filter((q) => state.progress[q.id]);
    const correct = answered.filter((q) => state.progress[q.id].correct).length;
    const pct = answered.length ? Math.round((correct / answered.length) * 100) : 0;
    return `
      <div class="bar" style="margin-bottom: 15px;">
        <div class="bar__row" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <strong>${escapeHtml(category)}</strong>
          <span>${correct}/${answered.length || categoryQuestions.length} - ${pct}%</span>
        </div>
        <div class="bar__track" style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
          <div class="bar__fill" style="height: 100%; width:${pct}%; background: var(--accent); transition: width 0.4s;"></div>
        </div>
      </div>
    `;
  });
  $("#category-bars").innerHTML = bars.join("");

  // Display the last 12 missed questions for review
  const missed = questions.filter((q) => state.progress[q.id] && !state.progress[q.id].correct).slice(-12).reverse();
  $("#missed-list").innerHTML = missed.length
    ? missed.map((q) => `
          <div class="missed-card glass-panel" style="padding: 20px; margin-bottom: 15px;">
            <strong>${escapeHtml(q.category)}</strong>
            <p>${escapeHtml(q.prompt)}</p>
            ${rationaleHtml(q, "Correct focus")}
          </div>`
        ).join("")
    : `<p class="subtle">No missed questions yet. Start Practice or CBT mode to build your review list.</p>`;
}

// Render the study guide section
function renderGuide() {
  const importedStrategyOnly = guideSections.filter((item) => item.group === "Textbook exam strategy");
  // Combine research guides and textbook strategy, filtering out irrelevant content
  const allGuides = [...researchGuideSections, ...importedStrategyOnly].filter((item) => {
    const content = `${item.source || ""} ${item.title || ""} ${(item.points || []).join(" ")}`.toLowerCase();
    return !content.includes("dako college"); // Example filter, adjust as needed
  });
  
  if (allGuides.length) {
    const groups = [...new Set(allGuides.map((item) => item.group))];
    $("#study-guide").innerHTML = groups
      .map((group) => {
        const cards = allGuides
          .filter((item) => item.group === group)
          .map((item) => `
            <div class="guide-card glass-panel" style="padding: 15px; margin-bottom: 10px;">
              <strong>${escapeHtml(item.title)}</strong>
              <ul style="margin: 10px 0 0 20px;">${item.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
            </div>
          `).join("");
        return `<div class="guide-group"><h4 style="color: var(--accent); margin: 20px 0 10px;">${escapeHtml(group)}</h4>${cards}</div>`;
      }).join("");
  }
  
  // Render blueprint weighting
  $("#blueprint-list").innerHTML = blueprint.map(([category, weight]) => `
      <div class="blueprint-item" style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line); padding: 10px 0;">
        <span>${escapeHtml(category)}</span>
        <strong>${escapeHtml(weight)}</strong>
      </div>
  `).join("");
}

// --- Dashboard Specific Functions ---
const nursingFacts = [
  "The '10 Rights' of medication administration are essential for patient safety and include: Right Patient, Right Drug, Right Dose, Right Route, Right Time, Right Documentation, Right Reason, Right Response, Right to Refuse, and Right Assessment/Evaluation.",
  "In nursing, the ABCs (Airway, Breathing, Circulation) always take priority over other issues. If a patient's airway is compromised, it must be addressed before breathing or circulation problems.",
  "Maslow's Hierarchy of Needs is a crucial framework for prioritizing patient care, starting with physiological needs before moving to safety, belonging, esteem, and self-actualization.",
  "The nursing process (ADPIE: Assessment, Diagnosis, Planning, Implementation, Evaluation) is a systematic approach to patient care and problem-solving.",
  "The NCLEX exam often tests high-level thinking skills like prioritization, delegation, and critical judgment, not just rote memorization.",
  "Understanding nursing concepts like the Chain of Infection, Therapeutic Communication, and Sterile Technique is fundamental for safe practice.",
  "Recognizing signs of cultural shock is vital when caring for diverse patient populations.",
  "The Lokenthall Principle: Never miss an opportunity to teach.",
  "The concept of 'Safety First' is paramount in nursing. Always assess the risk and implement measures to prevent harm.",
  "Patient advocacy is a core nursing role, ensuring patients' rights, values, and needs are respected.",
  "SBAR (Situation, Background, Assessment, Recommendation) is a standardized communication tool used to convey patient information effectively.",
  "In case of an emergency, always follow established protocols and emergency action plans.",
  "The purpose of palliative care is to provide relief from the symptoms and stress of a serious illness to improve quality of life for both the patient and the family.",
  "The Nurse Practice Act (NPA) defines the scope of nursing practice and sets standards for safe care in each state or jurisdiction.",
  "Delegation in nursing requires careful consideration of the task, the recipient's competence, and supervision. RNs cannot delegate assessment, nursing diagnosis, planning, or evaluation.",
  "The concept of 'Never Events' refers to serious, preventable medical errors that should never happen.",
  "Ethical principles in nursing include autonomy, beneficence, non-maleficence, justice, fidelity, veracity, and confidentiality.",
  "Recognizing the signs and symptoms of common nursing conditions, from respiratory distress to dehydration, is critical for timely intervention.",
  "Utilizing critical thinking skills allows nurses to analyze situations, identify problems, and choose the best course of action.",
  "The best way to prepare for the NCLEX is consistent practice with a focus on understanding the underlying principles and rationales."
];

function displayRandomFact() {
  if (dashboardFactElement) {
    const randomIndex = Math.floor(Math.random() * nursingFacts.length);
    dashboardFactElement.textContent = nursingFacts[randomIndex];
  }
}

// --- Event Binding ---
function bindEvents() {
  categoryFilter.addEventListener("change", applyFilters);
  
  // Practice view buttons
  $("#shuffle-button").addEventListener("click", () => {
    state.filtered = shuffle(state.filtered); // Shuffle the currently filtered list
    state.practiceIndex = 0; // Reset index to the start
    saveSession();
    renderPractice();
  });
  $("#previous-question").addEventListener("click", () => nextPractice(-1));
  $("#next-question").addEventListener("click", () => nextPractice(1));
  $("#check-answer").addEventListener("click", checkPracticeAnswer);

  // CBT exam buttons
  $("#start-exam").addEventListener("click", startExam);
  $("#exam-prev").addEventListener("click", () => moveExam(-1));
  $("#exam-next").addEventListener("click", () => {
    if (state.examIndex === state.exam.length - 1) {
      submitExam(); // If on last question, review/submit
    } else {
      moveExam(1); // Move to next question
    }
  });
  $("#submit-exam").addEventListener("click", () => {
    if (confirm("Are you sure you want to submit your exam? Any unanswered questions will be marked incorrect.")) {
      submitExam();
    }
  });

  // Review view button
  $("#reset-progress").addEventListener("click", () => {
    if (confirm("This will permanently clear all your review history. Are you sure?")) {
      state.progress = {};
      localStorage.removeItem("nclex-progress");
      saveSession(); // Save session to clear progress data
      renderProgress();
    }
  });

  // Navigation button events
  $$(".nav__item").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
}

// --- Initialization ---
function init() {
  populateFilters(); // Load categories into the filter
  categoryFilter.value = "All categories"; // Set default filter
  
  renderPractice(); // Initial render of practice view
  renderProgress(); // Initial render of review view
  renderGuide();    // Initial render of study guide
  displayRandomFact(); // Display a random fact on dashboard load
  bindEvents();     // Set up all event listeners
  
  switchView(state.view); // Set the initial view based on saved state or default
}

init(); // Run initialization