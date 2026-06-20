/**
 * Premium Ecosystem Interaction Controller
 * Handles 60fps Spotlight Computations, Theme Switching and Structural Animations
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Core Element Hooks
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
    const glowCards = document.querySelectorAll('.glow-card');

    /* ==========================================================================
       1. GLOBAL SPATIAL COORDINATE TRACKING (SPOTLIGHT EFFECT)
       ========================================================================== */
    window.addEventListener('mousemove', (e) => {
        // Efficient DOM variables writes directly via styling transforms
        globalSpotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
        globalSpotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    /* CARD PERSPECTIVE INNER SPOTLIGHT COMPONENT BINDINGS */
    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardBoundingBox = card.getBoundingClientRect();
            const localX = e.clientX - cardBoundingBox.left;
            const localY = e.clientY - cardBoundingBox.top;
            
            card.style.setProperty('--card-x', `${localX}px`);
            card.style.setProperty('--card-y', `${localY}px`);
        });
    });

    /* ==========================================================================
       2. SIDEBAR NAVIGATION MINIMIZATION ANIMATIONS
       ========================================================================== */
    sidebarToggle.addEventListener('click', () => {
        appContainer.classList.toggle('sidebar-minimized');
        
        // Dynamic structural shift rotation feedback toggle
        const toggleIcon = sidebarToggle.querySelector('i');
        if (appContainer.classList.contains('sidebar-minimized')) {
            toggleIcon.className = 'fa-solid fa-bars';
        } else {
            toggleIcon.className = 'fa-solid fa-bars-staggered';
        }
    });

    /* ==========================================================================
       3. INTERACTIVE CUSTOMIZER DRAWER OPERATIONS
       ========================================================================== */
    const openDrawer = () => {
        customizerDrawer.classList.add('drawer-open');
    };

    const closeDrawer = () => {
        customizerDrawer.classList.remove('drawer-open');
    };

    settingsToggle.addEventListener('click', openDrawer);
    closeCustomizerBtn.addEventListener('click', closeDrawer);
    
    // Tap Outside Shield Overlay Close Protocol
    customizerDrawer.addEventListener('click', (e) => {
        if (e.target === customizerDrawer) closeDrawer();
    });

    /* ==========================================================================
       4. DYNAMIC THEME SELECTION PROTOCOLS
       ========================================================================== */
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const chosenTheme = btn.getAttribute('data-theme-set');
            
            // Clean up state references across buttons
            themeButtons.forEach(b => b.classList.remove('active-theme'));
            btn.classList.add('active-theme');
            
            // Re-render ecosystem variable maps safely
            body.setAttribute('data-theme', chosenTheme);
            
            // Store configuration cache natively for persistence
            localStorage.setItem('cbt-user-theme', chosenTheme);
        });
    });

    /* GLOW RADIUS PERSISTENT TUNER TRACKS */
    glowSlider.addEventListener('input', (e) => {
        const radiusValue = e.target.value;
        body.style.setProperty('--calculated-glow-radius', `${radiusValue}px`);
    });

    /* INITIALIZATION HYDRATION CHECKS */
    const loadCachedConfigurations = () => {
        const cachedTheme = localStorage.getItem('cbt-user-theme');
        if (cachedTheme) {
            body.setAttribute('data-theme', cachedTheme);
            themeButtons.forEach(btn => {
                if (btn.getAttribute('data-theme-set') === cachedTheme) {
                    themeButtons.forEach(b => b.classList.remove('active-theme'));
                    btn.classList.add('active-theme');
                }
            });
        }
    };
    
    loadCachedConfigurations();
});