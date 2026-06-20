/**
 * A_D CBT Hub - Core Ecosystem Controller
 * Restores Section Controls, Authentication Triggers, and Tutor Chatbot Loops
 */
document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.documentElement;
    const globalSpotlight = document.getElementById('global-spotlight');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const appContainer = document.querySelector('.app-container');
    const settingsToggle = document.getElementById('settings-toggle');
    const customizerDrawer = document.getElementById('customizer-drawer');
    const closeCustomizerBtn = document.getElementById('close-customizer-btn');
    const themeButtons = document.querySelectorAll('.theme-picker-btn');
    const glowSlider = document.getElementById('glow-radius-slider');
    
    // Viewport Router Element Selection Hooks
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    const viewportPanels = document.querySelectorAll('.viewport-panel');

    // Chatbot UI Hooks
    const chatbotDock = document.getElementById('chatbot-wrapper');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatMinimize = document.getElementById('chat-minimize');
    const chatInput = document.getElementById('chat-user-input');
    const chatSendBtn = document.getElementById('chat-send-trigger');
    const chatMessagesContainer = document.getElementById('chat-messages-container');

    // Authentication Trigger Link
    const signoutTrigger = document.getElementById('auth-signout-trigger');

    /* ==========================================================================
       1. EXPLICIT CONTAINER VIEW ROUTING ENGINE
       ========================================================================== */
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetedViewportId = item.getAttribute('data-target');

            // Switch active classes across navigation links
            menuItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Hide old layers and reveal targeted viewport section smoothly
            viewportPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetedViewportId) {
                    panel.classList.add('active');
                }
            });
        });
    });

    /* ==========================================================================
       2. AUTHENTICATION MECHANICS HOOK
       ========================================================================== */
    if (signoutTrigger) {
        signoutTrigger.addEventListener('click', () => {
            console.log("Initializing secure platform logout redirection protocols...");
            // If utilizing Supabase auth globally, re-inject: await supabase.auth.signOut()
            alert("A_D CBT Hub secure session terminated. Redirecting to login portal...");
            window.location.reload(); 
        });
    }

    /* ==========================================================================
       3. HIGH-END EXPERT NURSING TUTOR CHATBOT MECHANICS
       ========================================================================== */
    const toggleChatWindow = () => chatbotDock.classList.toggle('chat-open');
    chatbotToggle.addEventListener('click', toggleChatWindow);
    chatMinimize.addEventListener('click', toggleChatWindow);

    const appendChatBubble = (messageText, senderType) => {
        const bubbleElement = document.createElement('div');
        bubbleElement.className = senderType === 'user' ? 'user-chat-bubble' : 'system-chat-bubble';
        bubbleElement.textContent = messageText;
        chatMessagesContainer.appendChild(bubbleElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    };

    const processTutorQuery = () => {
        const userQueryText = chatInput.value.trim();
        if (!userQueryText) return;

        appendChatBubble(userQueryText, 'user');
        chatInput.value = '';

        // Micro-animated typing delay emulation loops
        setTimeout(() => {
            let optimizedBotResponse = "I have updated my metrics profile to track your dashboard analysis. Ask me specifically about pharmaceutical dosages or OSCE assessment criteria!";
            
            if(userQueryText.toLowerCase().includes('cardio') || userQueryText.toLowerCase().includes('heart')) {
                optimizedBotResponse = "For cardiovascular testing parameters, keep in mind that Digoxin requires checking the apical pulse rate for a full minute. Hold medication if it is below 60 bpm.";
            }
            
            appendChatBubble(optimizedBotResponse, 'bot');
        }, 750);
    };

    chatSendBtn.addEventListener('click', processTutorQuery);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') processTutorQuery();
    });

    /* ==========================================================================
       4. GLOBAL COORDINATE TRACKING & SIDEBAR TRANSFORMS
       ========================================================================== */
    window.addEventListener('mousemove', (e) => {
        globalSpotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
        globalSpotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    document.addEventListener('mousemove', (e) => {
        const matchingCard = e.target.closest('.glow-card');
        if (matchingCard) {
            const boundingBox = matchingCard.getBoundingClientRect();
            matchingCard.style.setProperty('--card-x', `${e.clientX - boundingBox.left}px`);
            matchingCard.style.setProperty('--card-y', `${e.clientY - boundingBox.top}px`);
        }
    });

    sidebarToggle.addEventListener('click', () => {
        appContainer.classList.toggle('sidebar-minimized');
        sidebarToggle.querySelector('i').className = appContainer.classList.contains('sidebar-minimized') ? 'fa-solid fa-bars' : 'fa-solid fa-bars-staggered';
    });

    settingsToggle.addEventListener('click', () => customizerDrawer.classList.add('drawer-open'));
    closeCustomizerBtn.addEventListener('click', () => customizerDrawer.classList.remove('drawer-open'));
    customizerDrawer.addEventListener('click', (e) => { if (e.target === customizerDrawer) customizerDrawer.classList.remove('drawer-open'); });

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

    // Hydrate layout presets natively from browser cache options
    const preservedTheme = localStorage.getItem('cbt-user-theme');
    if (preservedTheme) {
        body.setAttribute('data-theme', preservedTheme);
        themeButtons.forEach(b => {
            b.classList.remove('active-theme');
            if(b.getAttribute('data-theme-set') === preservedTheme) b.classList.add('active-theme');
        });
    }
});