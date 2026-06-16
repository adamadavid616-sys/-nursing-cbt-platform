import { guideSections } from "./guide-content.js";
import { researchGuideSections } from "./research-guides.js";
import { learningResources } from "./learning-resources.js";
import { QUESTION_BANK, CATEGORIES } from "./question-bank.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function textLooksClear(text) {
  const value = String(text || "").trim();
  if (value.length < 2) return false;
  const noisy = [
    "Copyright 2010",
    "Editorial review",
    "Cengage Learning",
    "CamScanner",
    "MARKING GUIDE",
    "MARKING SCHEME",
    "______"
  ];
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
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Normalize new question bank: convert answer from number to array format
const rawQuestions = QUESTION_BANK.map(q => ({
  ...q,
  answer: Array.isArray(q.answer) ? q.answer : [q.answer],
}));
const clearQuestions = rawQuestions.filter(q =>
  q.question && q.options && q.options.length >= 2 && q.answer && q.answer.length > 0
);
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
  progress: JSON.parse(localStorage.getItem("nclex-progress") || "{}")
};

const categoryFilter = $("#category-filter");
const chapterFilter = $("#chapter-filter");

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
    const categoryMatch = category === "All categories" || q.category === category;
    const chapterMatch = chapter === "All chapters" || q.chapter === chapter;
    return categoryMatch && chapterMatch;
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
  if (/\bfever|infection|sterile|asepsis|hand hygiene|isolation|wound|catheter\b/.test(`${stem} ${lowerCorrect}`)) {
    points.push("The infection-control principle is to prevent organism transfer before it reaches the patient or a sterile body site.");
  }
  if (/\bdrug|medication|insulin|digoxin|warfarin|furosemide|antibiotic|opioid|dose\b/.test(`${stem} ${lowerCorrect}`)) {
    points.push("For drug questions, connect the medication to the required nursing check: allergy, vital sign, lab value, dose, route, expected effect, and danger sign.");
  }
  if (/\bpregnan|postpartum|newborn|labour|labor|breastfeeding|immunization|child|infant\b/.test(`${stem} ${lowerCorrect}`)) {
    points.push("For maternal-child questions, first separate normal findings from danger signs, then choose the option that protects mother, fetus, newborn, or child from the most immediate harm.");
  }
  if (/\bsuicide|hallucination|anxiety|depression|mental|psychiatric|therapeutic\b/.test(`${stem} ${lowerCorrect}`)) {
    points.push("For psychosocial questions, safety and therapeutic communication matter. Acknowledge feelings, assess risk, avoid false reassurance, and do not argue with altered perceptions.");
  }
  if (/\bexcept|least|not appropriate|needs further teaching|incorrect\b/.test(stem)) {
    points.push("Be careful with negative wording. The correct answer may be the unsafe, false, or least appropriate statement rather than the best nursing action.");
  }

  points.push("A fast way to confirm the answer is to ask: does this option solve the exact problem in the stem, and is it safer than the other choices?");
  return points;
}

function optionReason(question, option, isAnswer) {
  const text = option.toLowerCase();
  if (isAnswer) {
    return `This is correct because it best fits the stem and follows the nursing rule for ${stemFocus(question)}. ${cleanSourceRationale(question)}`;
  }
  if (/\bdelay|wait|later|next round|end of the shift\b/.test(text)) return "This is less appropriate because it delays care when the stem requires assessment, prevention, or immediate action.";
  if (/\bignore|normal|document as normal|no need\b/.test(text)) return "This is less appropriate because it minimizes a cue that may need nursing assessment or reporting.";
  if (/\bwithout|skip|before doing it|no assessment\b/.test(text)) return "This is less appropriate because it skips a safety, assessment, or procedure step.";
  if (/\baspirin|double|extra dose|stop|share|abruptly\b/.test(text)) return "This is less appropriate because it creates medication-safety risk.";
  if (/\bflat|heavy meal|feed|ambulate\b/.test(text) && /\bbreath|dyspnea|cyanotic|oxygen|chest\b/.test(question.prompt.toLowerCase())) return "This is less appropriate because it does not protect airway, breathing, or circulation first.";
  if (/\breassure|don't worry|calm down|dramatic\b/.test(text)) return "This is less appropriate because reassurance without assessment can miss a serious clinical or psychosocial risk.";
  if (/\bfamily|relative|friend\b/.test(text) && /\bconsent|confidential|privacy|adult\b/.test(question.prompt.toLowerCase())) return "This is less appropriate because it may violate consent, autonomy, or confidentiality.";
  return "This option is less appropriate because it is not the best match for the key cue, priority word, or safest nursing action in the stem.";
}

function easyBreakdown(question) {
  const categoryAdvice = {
    "Coordinated Care": {
      why: "The item is testing professional judgment: priority, assignment, documentation, consent, confidentiality, advocacy, referral, or legal accountability.",
      rule: "Keep the client safe, protect rights and confidentiality, delegate only stable routine tasks, and remember that assessment, teaching, and evaluation remain nursing responsibilities.",
      trap: "Wrong options often delay reporting, delegate nursing judgment, breach confidentiality, or ignore documentation."
    },
    "Safety and Infection Prevention and Control": {
      why: "The item is testing harm prevention. The safest answer usually prevents infection, injury, exposure, falls, medication error, or procedure contamination.",
      rule: "Hand hygiene, standard precautions, sterile technique, isolation, patient identification, and immediate safety checks come before comfort or routine tasks.",
      trap: "Wrong options often skip hand hygiene, break sterile field, delay urgent safety action, or assume gloves replace infection-control practice."
    },
    "Health Promotion and Maintenance": {
      why: "The item is testing prevention, normal development, maternity/newborn care, screening, immunization, nutrition, and patient teaching.",
      rule: "First separate normal findings from danger signs, then choose the answer that teaches clearly or prevents complications.",
      trap: "Wrong options often treat normal findings as emergencies, miss danger signs, or give teaching that is too absolute or culturally unsafe."
    },
    "Psychosocial Integrity": {
      why: "The item is testing emotional safety, communication, coping, mental health assessment, crisis response, and therapeutic relationship.",
      rule: "Use open-ended, nonjudgmental responses. Acknowledge feelings, assess safety, avoid false reassurance, and do not argue with hallucinations or delusions.",
      trap: "Wrong options commonly give advice too quickly, ask 'why' in a blaming way, promise secrecy, or leave a high-risk client alone."
    },
    "Basic Care and Comfort": {
      why: "The item is testing essential bedside care: comfort, hygiene, mobility, nutrition, elimination, positioning, sleep, skin care, and assistive devices.",
      rule: "Choose the action that is safe, practical, patient-centered, and prevents common complications such as pressure injury, aspiration, constipation, or immobility.",
      trap: "Wrong options often force activity, ignore dignity, skip assessment, or choose convenience over safety."
    },
    "Pharmacological Therapies": {
      why: "The item is testing medication safety, drug action, side effects, toxicity, contraindications, dose checks, and patient teaching.",
      rule: "Before giving a drug, check the right patient, drug, dose, route, time, indication, allergy, relevant vital sign/lab, and expected response.",
      trap: "Wrong options often ignore allergies, vital signs, glucose/electrolytes, bleeding signs, toxicity, or advise stopping medication abruptly."
    },
    "Reduction of Risk Potential": {
      why: "The item is testing early detection of complications through labs, diagnostics, procedures, vital signs, pre/postoperative care, and monitoring.",
      rule: "Look for the finding that signals deterioration and should be reported before harm occurs.",
      trap: "Wrong options often focus on routine comfort while ignoring abnormal labs, bleeding, respiratory change, neurologic change, or procedure complications."
    },
    "Physiological Adaptation": {
      why: "The item is testing response to illness and urgent clinical judgment in acute or chronic disease.",
      rule: "Use ABCs, perfusion, bleeding, shock, neurologic status, fluid/electrolyte balance, and worsening symptoms to decide priority.",
      trap: "Wrong options often delay emergency care, treat a minor symptom first, or ignore the pathophysiology behind the cues."
    }
  };
  return categoryAdvice[question.category] || {
    why: "The item is testing the safest nursing interpretation of the stem.",
    rule: "Focus on the main cue, identify the nursing problem, and choose the option that directly addresses it.",
    trap: "Wrong options are usually delayed, unsafe, unrelated, incomplete, or not the priority."
  };
}

function rationaleHtml(question, heading = "Easy explanation") {
  const explanation = easyBreakdown(question);
  const correct = answerText(question);
  const teachingPoints = individualizedTeaching(question)
    .map((point) => `<li>${escapeHtml(point)}</li>`)
    .join("");
  const optionRows = question.options
    .map((option, index) => {
      const isAnswer = question.answer.includes(index);
      const label = isAnswer ? "Correct" : "Why less likely";
      const reason = optionReason(question, option, isAnswer);
      return `
        <div class="rationale-option ${isAnswer ? "is-answer" : ""}">
          <strong>${label}: ${escapeHtml(option)}</strong>
          <p>${escapeHtml(reason)}</p>
        </div>
      `;
    })
    .join("");
  const links = resourceLinksFor(question)
    .map(([label, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`)
    .join("");
  return `
    <div class="rationale-title">${escapeHtml(heading)}</div>
    <div class="rationale-grid">
      <section>
        <h4>Correct Answer</h4>
        <p>${escapeHtml(correct)}</p>
      </section>
      <section>
        <h4>What The Question Is Testing</h4>
        <p>${escapeHtml(explanation.why)}</p>
      </section>
      <section>
        <h4>Core Nursing Rule</h4>
        <p>${escapeHtml(explanation.rule)}</p>
      </section>
      <section>
        <h4>Common Trap</h4>
        <p>${escapeHtml(explanation.trap)}</p>
      </section>
      <section>
        <h4>Source Rationale</h4>
        <p>${escapeHtml(cleanSourceRationale(question))}</p>
      </section>
    </div>
    <div class="rationale-deep-dive">
      <h4>Detailed Teaching Explanation</h4>
      <ul>${teachingPoints}</ul>
    </div>
    <div class="rationale-options">
      <h4>Option-by-option review</h4>
      ${optionRows}
    </div>
    <div class="resource-links"><span>Further study:</span>${links}</div>
  `;
}

function renderPractice() {
  const question = state.filtered[state.practiceIndex];
  $("#practice-rationale").hidden = true;
  if (!question) {
    $("#practice-category").textContent = "No match";
    $("#practice-progress").textContent = "";
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
  const current = state.filtered[state.practiceIndex];
  if (current) {
    const selected = getSelections($("#practice-options"));
    if (selected.length) state.practiceAnswers[current.id] = selected;
  }
  if (!state.filtered.length) return;
  state.practiceIndex = (state.practiceIndex + step + state.filtered.length) % state.filtered.length;
  saveSession();
  renderPractice();
}

function switchView(view) {
  state.view = view;
  $$(".nav__item").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  $$(".view").forEach((panel) => panel.classList.toggle("is-visible", panel.id === `${view}-view`));
  const titles = {
    practice: ["Learning mode", "Practice with instant rationales"],
    cbt: ["Simulation", "CBT exam mode"],
    review: ["Performance", "Review weak areas"],
    guide: ["Study map", "High-yield council exam guide"]
  };
  $("#view-kicker").textContent = titles[view][0];
  $("#view-title").textContent = titles[view][1];
  if (view !== "cbt" || !state.timerId) {
    $("#timer-label").textContent = view === "cbt" ? "Ready" : "Untimed";
    $("#timer-value").textContent = "00:00";
  }
  if (view === "cbt" && state.exam.length) {
    $("#exam-setup").hidden = true;
    $("#exam-results").hidden = true;
    $("#exam-panel").hidden = false;
    state.examIndex = Math.min(state.examIndex, state.exam.length - 1);
    renderExam();
  }
  renderProgress();
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
  $("#exam-results").hidden = true;
  $("#exam-panel").hidden = false;
  $("#timer-label").textContent = "Time left";
  $("#timer-value").textContent = formatTime(state.remainingSeconds);
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    state.remainingSeconds -= 1;
    $("#timer-value").textContent = formatTime(Math.max(state.remainingSeconds, 0));
    if (state.remainingSeconds <= 0) submitExam();
  }, 1000);
  renderExam();
  saveSession();
}

function renderExam() {
  const question = state.exam[state.examIndex];
  if (!question) return;
  $("#exam-category").textContent = `${question.category} - ${question.chapter}`;
  $("#exam-progress").textContent = `${state.examIndex + 1} of ${state.exam.length}`;
  $("#exam-question").textContent = question.prompt;
  renderOptions($("#exam-options"), question, state.examAnswers[question.id] || []);
  $("#exam-prev").disabled = state.examIndex === 0;
  $("#exam-next").textContent = state.examIndex === state.exam.length - 1 ? "Review" : "Next";
  renderExamNavigator();
}

function storeExamAnswer() {
  const question = state.exam[state.examIndex];
  state.examAnswers[question.id] = getSelections($("#exam-options"));
  saveSession();
}

function moveExam(step) {
  storeExamAnswer();
  state.examIndex = Math.min(Math.max(state.examIndex + step, 0), state.exam.length - 1);
  saveSession();
  renderExam();
}

function jumpExam(index) {
  storeExamAnswer();
  state.examIndex = index;
  saveSession();
  renderExam();
}

function renderExamNavigator() {
  const answered = state.exam.filter((question) => (state.examAnswers[question.id] || []).length).length;
  $("#exam-answered-count").textContent = `${answered}/${state.exam.length} answered`;
  $("#exam-jump-list").innerHTML = state.exam
    .map((question, index) => {
      const status = (state.examAnswers[question.id] || []).length ? "is-answered" : "";
      const active = index === state.examIndex ? "is-current" : "";
      return `<button class="exam-jump ${status} ${active}" type="button" data-exam-index="${index}">${index + 1}</button>`;
    })
    .join("");
  $$("#exam-jump-list .exam-jump").forEach((button) => {
    button.addEventListener("click", () => jumpExam(Number(button.dataset.examIndex)));
  });
}

function submitExam() {
  if (!state.exam.length) return;
  storeExamAnswer();
  clearInterval(state.timerId);
  state.timerId = null;
  $("#exam-panel").hidden = true;
  $("#exam-results").hidden = false;
  $("#exam-setup").hidden = false;
  $("#timer-label").textContent = "Completed";

  const rows = state.exam.map((question) => {
    const selected = state.examAnswers[question.id] || [];
    const correct = isCorrect(question, selected);
    state.progress[question.id] = { correct, selected, at: new Date().toISOString() };
    return { question, selected, correct };
  });
  saveProgress();
  saveSession();

  const score = rows.filter((row) => row.correct).length;
  $("#exam-results").innerHTML = `
    <p class="eyebrow">CBT result</p>
    <h3>Exam submitted</h3>
    <div class="score">${score}/${rows.length}</div>
    <p class="subtle">Review the rationales below, then use the Review tab to target weak client-needs categories.</p>
    <div class="missed-list">
      ${rows
        .map(
          ({ question, selected, correct }) => `
          <div class="missed-card">
            <strong>${correct ? "Correct" : "Missed"} - ${escapeHtml(question.category)}</strong>
            <p>${escapeHtml(question.prompt)}</p>
            <p><strong>Answer:</strong> ${question.answer.map((i) => escapeHtml(question.options[i])).join("; ")}</p>
            ${rationaleHtml(question, "Easy explanation")}
          </div>`
        )
        .join("")}
    </div>
  `;
}

function renderProgress() {
  $("#bank-count").textContent = questions.length;
  const records = Object.values(state.progress);
  const mastery = records.length ? Math.round((records.filter((r) => r.correct).length / records.length) * 100) : 0;
  $("#mastery-score").textContent = `${mastery}%`;

  const bars = blueprint.map(([category]) => {
    const categoryQuestions = questions.filter((q) => q.category === category);
    const answered = categoryQuestions.filter((q) => state.progress[q.id]);
    const correct = answered.filter((q) => state.progress[q.id].correct).length;
    const pct = answered.length ? Math.round((correct / answered.length) * 100) : 0;
    return `
      <div class="bar">
        <div class="bar__row"><strong>${escapeHtml(category)}</strong><span>${correct}/${answered.length || categoryQuestions.length} - ${pct}%</span></div>
        <div class="bar__track"><div class="bar__fill" style="width:${pct}%"></div></div>
      </div>
    `;
  });
  $("#category-bars").innerHTML = bars.join("");

  const missed = questions.filter((q) => state.progress[q.id] && !state.progress[q.id].correct).slice(-12).reverse();
  $("#missed-list").innerHTML = missed.length
    ? missed
        .map(
          (q) => `
          <div class="missed-card">
            <strong>${escapeHtml(q.category)} - ${escapeHtml(q.chapter)}</strong>
            <p>${escapeHtml(q.prompt)}</p>
            ${rationaleHtml(q, "Correct focus")}
          </div>`
        )
        .join("")
    : `<p class="subtle">No missed questions yet. Start Practice or CBT mode to build your review list.</p>`;
}

function renderGuide() {
  const importedStrategyOnly = guideSections.filter((item) => item.group === "Textbook exam strategy");
  const allGuides = [...researchGuideSections, ...importedStrategyOnly].filter((item) => {
    const content = `${item.source || ""} ${item.title || ""} ${(item.points || []).join(" ")}`.toLowerCase();
    return !content.includes("dako college");
  });
  if (allGuides.length) {
    const groups = [...new Set(allGuides.map((item) => item.group))];
    $("#study-guide").innerHTML = groups
      .map((group) => {
        const cards = allGuides
          .filter((item) => item.group === group)
          .map(
            (item) => `
              <div class="guide-card">
                <span class="guide-source">${escapeHtml(item.source)}</span>
                <strong>${escapeHtml(item.title)}</strong>
                <ul>${item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
                ${
                  item.links
                    ? `<div class="resource-links">${item.links
                        .map(([label, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`)
                        .join("")}</div>`
                    : ""
                }
              </div>
            `
          )
          .join("");
        return `<section class="guide-group"><h4>${escapeHtml(group)}</h4>${cards}</section>`;
      })
      .join("");
  } else {
    $("#study-guide").innerHTML = studyGuide
      .map((item) => `<div class="guide-card"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.points)}</p></div>`)
      .join("");
  }

  $("#blueprint-list").innerHTML = blueprint
    .map(([category, weight, focus]) => `<div class="blueprint-card"><strong>${escapeHtml(category)}</strong><p>${escapeHtml(weight)} of items - ${escapeHtml(focus)}</p></div>`)
    .join("");
}

function bindEvents() {
  $$(".nav__item").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  categoryFilter.addEventListener("change", applyFilters);
  chapterFilter.addEventListener("change", applyFilters);
  $("#shuffle-button").addEventListener("click", () => {
    state.filtered = shuffle(state.filtered);
    state.practiceIndex = 0;
    localStorage.setItem("ad-question-order", JSON.stringify(shuffle(questions).map((question) => question.id)));
    saveSession();
    renderPractice();
  });
  $("#check-answer").addEventListener("click", checkPracticeAnswer);
  $("#previous-question").addEventListener("click", () => nextPractice(-1));
  $("#next-question").addEventListener("click", () => nextPractice(1));
  $("#start-exam").addEventListener("click", startExam);
  $("#exam-next").addEventListener("click", () => moveExam(1));
  $("#exam-prev").addEventListener("click", () => moveExam(-1));
  $("#submit-exam").addEventListener("click", submitExam);
  $("#reset-progress").addEventListener("click", () => {
    state.progress = {};
    saveProgress();
  });
}

populateFilters();
bindEvents();
renderGuide();
renderProgress();
renderPractice();
switchView(state.view);
