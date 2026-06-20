/**
 * A_D CBT Hub - Ultimate Unified Functional Engine
 * Implements Live Question Sets, Countdown Logic, Active Filters, and Local Caching
 */
document.addEventListener('DOMContentLoaded', () => {

    // Global Core Architecture Banks (Re-linking the required core files)
    const CORE_QUESTION_BANK = [
        {
            id: 101,
            subject: "Cardiovascular Pharmacology",
            stem: "A 60-year-old male patient admitted to the medical ward at UATH Gwagwalada is prescribed Digoxin therapy for heart failure management. Prior to administration, the nurse must execute which high-priority safety evaluation logic?",
            options: [
                "Auscultate the apical pulse rate for 60 seconds, withholding medication if count drops below 60 bpm.",
                "Assess lateral lower extremity standard peripheral pitting edemas over a 5-minute interval.",
                "Measure immediate postprandial systemic arterial blood pressures sitting.",
                "Evaluate pupillary reactive metrics using visual accommodation penlight pathways."
            ],
            correctIndex: 0,
            rationale: "Digoxin is a potent cardiac glycoside that exerts positive inotropic and negative chronotropic physical properties. Auscultating the apical pulse configuration for a full 60 seconds is mandatory to confirm safety margins before dosing."
        },
        {
            id: 102,
            subject: "Ophthalmology Nursing",
            stem: "During an external ocular assessment of an elderly client presenting with decreased visual fields, a nurse notes increased structural intraocular fluid pressure profiles. What condition is primarily indicated?",
            options: [
                "Acute Angle-Closure Glaucoma",
                "Senile Nuclear Cataract Development",
                "Proliferative Diabetic Retinopathy",
                "Rhegmatogenous Retinal Detachment Matrix"
            ],
            correctIndex: 0,
            rationale: "Glaucoma is characterized by elevated intraocular pressure pathways due to impaired aqueous humor outflow, demanding immediate pressure-reducing drug interventions to shield optical disks from necrosis."
        }
    ];

    const EXAM_DURATION_MINUTES = 60;

    // Active Engine Runtime States
    let currentPracticeIndex = 0;
    let currentExamIndex = 0;
    let examTimeRemaining = EXAM_DURATION_MINUTES * 60;
    let examTimerInterval = null;
    let examUserAnswers = {};
    let failedQuestionsRegistry = JSON.parse(localStorage.getItem('ad-failed-matrix')) || [];

    // Core DOM Hooks
    const body = document.documentElement;
    const globalSpotlight = document.getElementById('global-spotlight');
    const appContainer = document.querySelector('.app-container');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const settingsToggle = document.getElementById('settings-toggle');
    const customizerDrawer = document.getElementById('customizer-drawer');
    const closeCustomizerBtn = document.getElementById('close-customizer-btn');
    const themeButtons = document.querySelectorAll('.theme-picker-btn');
    const glowSlider = document.getElementById('glow-radius-slider');
    
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    const viewportPanels = document.querySelectorAll('.viewport-panel');

    // Section Content Insertion Points
    const practiceRoot = document.getElementById('practice-questions-root');
    const examRoot = document.getElementById('exam-engine-root');
    const reviewRoot = document.getElementById('review-matrix-root');
    const guideRoot = document.getElementById('curriculum-library-root');

    // Chatbot UI Hooks
    const chatbotDock = document.getElementById('chatbot-wrapper');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatMinimize = document.getElementById('chat-minimize');
    const chatInput = document.getElementById('chat-user-input');
    const chatSendBtn = document.getElementById('chat-send-trigger');
    const chatMessagesContainer = document.getElementById('chat-messages-container');

    const signoutTrigger = document.getElementById('auth-signout-trigger');

    /* ==========================================================================
       1. ROUTING MATRIX ENGINE (With Timer Initialization)
       ========================================================================== */
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');

            menuItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            viewportPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetId) panel.classList.add('active');
            });

            // Action Routing Initializations
            if (targetId === 'practice-view') renderPracticeEngine();
            if (targetId === 'cbt-view') startExamSimulation();
            if (targetId === 'review-view') renderReviewMatrix();
            if (targetId === 'guide-view') renderGuideLibrary();
        });
    });

    /* ==========================================================================
       2. PRACTICE ENGINE IMPLEMENTATION (Untimed, Immediate Feedback)
       ========================================================================== */
    function renderPracticeEngine() {
        if (CORE_QUESTION_BANK.length === 0) {
            practiceRoot.innerHTML = `<div class="empty-state-notice">No questions loaded.</div>`;
            return;
        }

        const activeQ = CORE_QUESTION_BANK[currentPracticeIndex];
        
        let htmlContent = `
            <div class="functional-question-card">
                <div class="question-stem-text"><strong>Q:</strong> ${activeQ.stem}</div>
                <div class="interactive-options-list">
        `;

        activeQ.options.forEach((opt, idx) => {
            const letterCode = String.fromCharCode(65 + idx);
            htmlContent += `
                <div class="answer-option-row" data-index="${idx}">
                    <div class="option-index-badge">${letterCode}</div>
                    <div class="option-label-text">${opt}</div>
                </div>
            `;
        });

        htmlContent += `
                </div>
                <div id="practice-feedback-zone"></div>
                <div class="canvas-controls-row">
                    <button class="action-nav-btn" id="practice-prev-btn" ${currentPracticeIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <button class="action-nav-btn primary-action" id="practice-next-btn">Next Matrix</button>
                </div>
            </div>
        `;

        practiceRoot.innerHTML = htmlContent;

        // Click Handler for Selection Loops
        const rows = practiceRoot.querySelectorAll('.answer-option-row');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const selectedIdx = parseInt(row.getAttribute('data-index'));
                const feedbackZone = document.getElementById('practice-feedback-zone');
                
                // Clear out current display locks
                rows.forEach(r => r.classList.remove('selected', 'correct-reveal', 'incorrect-reveal'));
                
                if (selectedIdx === activeQ.correctIndex) {
                    row.classList.add('correct-reveal');
                    feedbackZone.innerHTML = `
                        <div class="rationale-panel-box">
                            <strong><i class="fa-solid fa-square-check"></i> Correct Response Matrix Assessed</strong>
                            ${activeQ.rationale}
                        </div>
                    `;
                } else {
                    row.classList.add('incorrect-reveal');
                    rows[activeQ.correctIndex].classList.add('correct-reveal');
                    feedbackZone.innerHTML = `
                        <div class="rationale-panel-box" style="border-color: rgba(255,59,48,0.2);">
                            <strong><i class="fa-solid fa-triangle-exclamation"></i> Incorrect Selections Tracked</strong>
                            ${activeQ.rationale}
                        </div>
                    `;
                    
                    // Log to Local Review Cache Matrix automatically
                    if (!failedQuestionsRegistry.some(item => item.id === activeQ.id)) {
                        failedQuestionsRegistry.push(activeQ);
                        localStorage.setItem('ad-failed-matrix', JSON.stringify(failedQuestionsRegistry));
                    }
                }
            });
        });

        // Attach Navigation Button Events
        document.getElementById('practice-prev-btn').addEventListener('click', () => {
            if (currentPracticeIndex > 0) {
                currentPracticeIndex--;
                renderPracticeEngine();
            }
        });

        document.getElementById('practice-next-btn').addEventListener('click', () => {
            currentPracticeIndex = (currentPracticeIndex + 1) % CORE_QUESTION_BANK.length;
            renderPracticeEngine();
        });
    }

    /* ==========================================================================
       3. TIMED CBT EXAM SIMULATION CORE ENGINE
       ========================================================================== */
    function startExamSimulation() {
        clearInterval(examTimerInterval);
        examTimeRemaining = EXAM_DURATION_MINUTES * 60;
        examUserAnswers = {};
        currentExamIndex = 0;
        
        document.getElementById('exam-timer-banner').style.display = 'flex';
        document.getElementById('exam-total-count-display').textContent = CORE_QUESTION_BANK.length;
        
        // Tick Engine Initializer
        examTimerInterval = setInterval(() => {
            examTimeRemaining--;
            if (examTimeRemaining <= 0) {
                clearInterval(examTimerInterval);
                concludeExamSimulation();
            } else {
                const mins = Math.floor(examTimeRemaining / 60).toString().padStart(2, '0');
                const secs = (examTimeRemaining % 60).toString().padStart(2, '0');
                document.getElementById('exam-countdown-clock').textContent = `${mins}:${secs}`;
            }
        }, 1000);

        renderExamQuestion();
    }

    function renderExamQuestion() {
        const activeQ = CORE_QUESTION_BANK[currentExamIndex];
        document.getElementById('exam-current-index-display').textContent = currentExamIndex + 1;

        let htmlContent = `
            <div class="functional-question-card">
                <div class="question-stem-text"><strong>Q${currentExamIndex + 1}:</strong> ${activeQ.stem}</div>
                <div class="interactive-options-list">
        `;

        activeQ.options.forEach((opt, idx) => {
            const letterCode = String.fromCharCode(65 + idx);
            const isSelected = examUserAnswers[currentExamIndex] === idx ? 'selected' : '';
            htmlContent += `
                <div class="answer-option-row ${isSelected}" data-index="${idx}">
                    <div class="option-index-badge">${letterCode}</div>
                    <div class="option-label-text">${opt}</div>
                </div>
            `;
        });

        htmlContent += `
                </div>
                <div class="canvas-controls-row">
                    <button class="action-nav-btn" id="exam-prev-btn" ${currentExamIndex === 0 ? 'disabled' : ''}>Back</button>
                    ${currentExamIndex === CORE_QUESTION_BANK.length - 1 ? 
                        `<button class="action-nav-btn primary-action" id="exam-submit-btn">Submit Examination</button>` :
                        `<button class="action-nav-btn primary-action" id="exam-next-btn">Next question</button>`
                    }
                </div>
            </div>
        `;

        examRoot.innerHTML = htmlContent;

        const rows = examRoot.querySelectorAll('.answer-option-row');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const selectedIdx = parseInt(row.getAttribute('data-index'));
                examUserAnswers[currentExamIndex] = selectedIdx;
                rows.forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
            });
        });

        document.getElementById('exam-prev-btn')?.addEventListener('click', () => {
            if (currentExamIndex > 0) {
                currentExamIndex--;
                renderExamQuestion();
            }
        });

        document.getElementById('exam-next-btn')?.addEventListener('click', () => {
            currentExamIndex++;
            renderExamQuestion();
        });

        document.getElementById('exam-submit-btn')?.addEventListener('click', concludeExamSimulation);
    }

    function concludeExamSimulation() {
        clearInterval(examTimerInterval);
        document.getElementById('exam-timer-banner').style.display = 'none';

        let score = 0;
        CORE_QUESTION_BANK.forEach((q, idx) => {
            if (examUserAnswers[idx] === q.correctIndex) score++;
        });

        examRoot.innerHTML = `
            <div class="functional-question-card" style="text-align: center; gap: 16px;">
                <div class="card-icon-frame" style="margin: 0 auto 10px;"><i class="fa-solid fa-award"></i></div>
                <h3>CBT Blocks Successfully Executed</h3>
                <p>Your calibrated scoring matrix returned: <strong>${score} / ${CORE_QUESTION_BANK.length}</strong> correct selections.</p>
                <button class="action-nav-btn primary-action" id="restart-exam-btn" style="margin: 10px auto 0;">Restart Simulation</button>
            </div>
        `;

        document.getElementById('restart-exam-btn').addEventListener('click', startExamSimulation);
    }

    /* ==========================================================================
       4. REVIEW MATRIX (Failed Questions Router Workspace)
       ========================================================================== */
    function renderReviewMatrix() {
        if (failedQuestionsRegistry.length === 0) {
            reviewRoot.innerHTML = `
                <div class="empty-state-notice">
                    <i class="fa-solid fa-face-smile"></i> No failed entries mapped in your ledger. Everything is clear!
                </div>
            `;
            return;
        }

        let htmlContent = `<div style="display:flex; flex-direction:column; gap:20px;">`;
        failedQuestionsRegistry.forEach((q, idx) => {
            htmlContent += `
                <div class="functional-question-card" style="border-left: 4px solid #ff3b30;">
                    <div class="question-stem-text"><strong>Missed Task:</strong> ${q.stem}</div>
                    <div class="rationale-panel-box" style="margin-top:0;">
                        <strong>Correct Objective Answer: ${q.options[q.correctIndex]}</strong>
                        ${q.rationale}
                    </div>
                    <button class="action-nav-btn" style="align-self: flex-end; padding:6px 14px; font-size:12px; color:#ff453a;" onclick="clearMatrixError(${idx})">
                        Clear from File
                    </button>
                </div>
            `;
        });
        htmlContent += `</div>`;
        reviewRoot.innerHTML = htmlContent;
    }

    window.clearMatrixError = function(index) {
        failedQuestionsRegistry.splice(index, 1);
        localStorage.setItem('ad-failed-matrix', JSON.stringify(failedQuestionsRegistry));
        renderReviewMatrix();
    };

    /* ==========================================================================
       5. GUIDE LIBRARY BLUEPRINTS DISPLAY
       ========================================================================== */
    function renderGuideLibrary() {
        guideRoot.innerHTML = `
            <div class="static-grid-wrapper">
                <div class="guide-reference-card">
                    <div class="guide-icon-box"><i class="fa-solid fa-heart-pulse"></i></div>
                    <h4>Cardiovascular Pharmacology Desk</h4>
                    <p>Digoxin toxicity metrics, apicals pulse evaluation logic, and beta-blocker clinical parameters.</p>
                </div>
                <div class="guide-reference-card">
                    <div class="guide-icon-box"><i class="fa-solid fa-eye"></i></div>
                    <h4>Ophthalmology Nursing Matrices</h4>
                    <p>Intraocular pressure tracking, Glaucoma nursing diagnostics, and ophthalmic drops administration protocols.</p>
                </div>
            </div>
        `;
    }

    /* ==========================================================================
       6. SECURE LOGIN REDIRECTION REDIRECTS
       ========================================================================== */
    if (signoutTrigger) {
        signoutTrigger.addEventListener('click', () => {
            alert("A_D CBT Hub secure session terminated. Redirecting to user login verification module...");
            window.location.reload();
        });
    }

    /* ==========================================================================
       7. LOW-ANCHOR CHATBOT CORE ALGORITHM
       ========================================================================== */
    chatbotToggle.addEventListener('click', () => chatbotDock.classList.toggle('chat-open'));
    chatMinimize.addEventListener('click', () => chatbotDock.classList.toggle('chat-open'));

    const processChatResponse = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // User Node Insertion
        const userDiv = document.createElement('div');
        userDiv.className = 'user-chat-bubble';
        userDiv.textContent = text;
        chatMessagesContainer.appendChild(userDiv);
        chatInput.value = '';
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        // Dynamic System Clinical Assistant Evaluator Responses
        setTimeout(() => {
            const reply = document.createElement('div');
            reply.className = 'system-chat-bubble';
            
            let systemResponseText = "Understood. I am parsing your dynamic syllabus matrices to map that clinical concept. Ask me about specific pharmacology calculations or nursing interventions!";
            
            if (text.toLowerCase().includes('digoxin') || text.toLowerCase().includes('pulse')) {
                systemResponseText = "Clinical Note: Digoxin requires monitoring the apical pulse rate for a full 60 seconds prior to dosing. Hold dose and notify clinical supervisor if it drops below 60 bpm.";
            }

            reply.textContent = systemResponseText;
            chatMessagesContainer.appendChild(reply);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }, 600);
    };

    chatSendBtn.addEventListener('click', processChatResponse);
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') processChatResponse(); });

    /* ==========================================================================
       8. GLOBAL SPOTLIGHT GENERATION & HARDWARE ACCELERATED TRANSITIONS
       ========================================================================== */
    window.addEventListener('mousemove', (e) => {
        globalSpotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
        globalSpotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    sidebarToggle.addEventListener('click', () => {
        appContainer.classList.toggle('sidebar-minimized');
        sidebarToggle.querySelector('i').className = appContainer.classList.contains('sidebar-minimized') ? 'fa-solid fa-bars' : 'fa-solid fa-bars-staggered';
    });

    settingsToggle.addEventListener('click', () => customizerDrawer.classList.add('drawer-open'));
    closeCustomizerBtn.addEventListener('click', () => customizerDrawer.classList.remove('drawer-open'));

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const activeColorTheme = btn.getAttribute('data-theme-set');
            themeButtons.forEach(b => b.classList.remove('active-theme'));
            btn.classList.add('active-theme');
            body.setAttribute('data-theme', activeColorTheme);
            localStorage.setItem('cbt-user-theme', activeColorTheme);
        });
    });

    glowSlider.addEventListener('input', (e) => {
        body.style.setProperty('--calculated-glow-radius', `${e.target.value}px`);
    });

    // Boot Trigger
    renderPracticeEngine();
});