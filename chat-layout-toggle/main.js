/**
 * VS Code Layout Toggle Prototype
 * 
 * Features:
 * - Click the chat sparkle icon to cycle through 3 layouts
 * - Hover over the icon to show a layout picker with animated highlight
 * - Click options in the picker to switch layouts directly
 */

(function () {
    'use strict';

    // Layout states
    const LAYOUTS = ['editor', 'split', 'chat'];
    let currentLayoutIndex = 0;
    let hoverTimeout = null;
    let isPickerVisible = false;

    // DOM Elements
    const layoutToggleBtn = document.getElementById('layout-toggle-btn');
    const layoutPicker = document.getElementById('layout-picker');
    const layoutOptions = document.querySelectorAll('.layout-option');
    const mainArea = document.querySelector('.main-area');
    const layoutHighlight = document.querySelector('.layout-highlight');

    /**
     * Set the current layout
     * @param {string} layout - The layout to set ('editor', 'split', or 'chat')
     */
    function setLayout(layout) {
        const index = LAYOUTS.indexOf(layout);
        if (index === -1) return;

        currentLayoutIndex = index;

        // Update main area layout
        mainArea.setAttribute('data-layout', layout);

        // Update toggle button active state
        layoutToggleBtn.classList.toggle('active', layout !== 'editor');

        // Update layout picker active states
        layoutOptions.forEach(option => {
            const optionLayout = option.getAttribute('data-layout');
            option.classList.toggle('active', optionLayout === layout);
        });

        // Update highlight position
        layoutPicker.setAttribute('data-active', layout);
    }

    /**
     * Cycle to the next layout
     */
    function cycleLayout() {
        currentLayoutIndex = (currentLayoutIndex + 1) % LAYOUTS.length;
        setLayout(LAYOUTS[currentLayoutIndex]);
    }

    /**
     * Show the layout picker popup
     */
    function showPicker() {
        if (isPickerVisible) return;

        clearTimeout(hoverTimeout);
        isPickerVisible = true;
        layoutPicker.removeAttribute('hidden');

        // Sync highlight position with current layout
        layoutPicker.setAttribute('data-active', LAYOUTS[currentLayoutIndex]);
    }

    /**
     * Hide the layout picker popup with delay
     * @param {number} delay - Delay in ms before hiding
     */
    function hidePicker(delay = 150) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            isPickerVisible = false;
            layoutPicker.setAttribute('hidden', '');
        }, delay);
    }

    /**
     * Keep the picker visible (cancel pending hide)
     */
    function keepPickerVisible() {
        clearTimeout(hoverTimeout);
    }

    // Initialize
    function init() {
        // Set initial layout
        setLayout(LAYOUTS[currentLayoutIndex]);

        // Click on toggle button cycles through layouts
        layoutToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cycleLayout();
        });

        // Hover on toggle button shows picker
        layoutToggleBtn.addEventListener('mouseenter', showPicker);
        layoutToggleBtn.addEventListener('mouseleave', () => hidePicker(200));

        // Keep picker visible when hovering over it
        layoutPicker.addEventListener('mouseenter', keepPickerVisible);
        layoutPicker.addEventListener('mouseleave', () => hidePicker(100));

        // Click on layout options
        layoutOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const layout = option.getAttribute('data-layout');
                setLayout(layout);
            });
        });

        // Close picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!layoutPicker.contains(e.target) && e.target !== layoutToggleBtn) {
                hidePicker(0);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isPickerVisible) {
                hidePicker(0);
            }
        });
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
