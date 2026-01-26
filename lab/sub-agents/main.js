// Sub-agents prototype interactivity

document.addEventListener('DOMContentLoaded', () => {
    initExpandableItems();
    initColorToggle();
    initFixedHeightToggle();
    initResponseToggle();
});

/**
 * Initialize the color toggle checkbox
 */
function initColorToggle() {
    const toggle = document.getElementById('colorToggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            document.body.classList.add('show-colors');
        } else {
            document.body.classList.remove('show-colors');
        }
    });
}

/**
 * Initialize the fixed-height toggle checkbox
 */
function initFixedHeightToggle() {
    const toggle = document.getElementById('fixedHeightToggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            document.body.classList.add('fixed-height');
        } else {
            document.body.classList.remove('fixed-height');
        }
    });
}

/**
 * Initialize the response visibility toggle checkbox
 */
function initResponseToggle() {
    const toggle = document.getElementById('responseToggle');
    if (!toggle) return;

    const writerSubagent = document.getElementById('writerSubagent');
    const writerMetaStatus = document.getElementById('writerMetaStatus');

    const updateState = () => {
        if (toggle.checked) {
            document.body.classList.add('response-visible');

            if (writerSubagent) {
                writerSubagent.classList.remove('in-progress');
                writerSubagent.classList.add('completed');
            }

            if (writerMetaStatus) {
                writerMetaStatus.textContent = 'Completed';
                writerMetaStatus.classList.remove('in-progress');
                writerMetaStatus.classList.add('completed');
            }
        } else {
            document.body.classList.remove('response-visible');

            if (writerSubagent) {
                writerSubagent.classList.add('in-progress');
                writerSubagent.classList.remove('completed');
            }

            if (writerMetaStatus) {
                writerMetaStatus.textContent = 'In progress...';
                writerMetaStatus.classList.add('in-progress');
                writerMetaStatus.classList.remove('completed');
            }
        }
    };

    toggle.addEventListener('change', updateState);
    updateState();
}

/**
 * Initialize expandable tree items
 */
function initExpandableItems() {
    const expandableItems = document.querySelectorAll('.tree-item.expandable, .nested-item.expandable');

    expandableItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleExpand(item);
        });
    });
}

/**
 * Toggle the expanded state of a tree item
 */
function toggleExpand(item) {
    const isExpanded = item.getAttribute('data-expanded') === 'true';
    const newState = !isExpanded;

    item.setAttribute('data-expanded', newState.toString());

    // Find the associated nested content (next sibling)
    const nestedContent = item.nextElementSibling;

    if (nestedContent && (nestedContent.classList.contains('nested-content') || nestedContent.classList.contains('nested-details-content'))) {
        if (newState) {
            nestedContent.classList.add('expanded');
        } else {
            nestedContent.classList.remove('expanded');
        }
    }
}

// Expose utility functions for potential future use
window.SubAgentsPrototype = {
    toggleExpand,
    initExpandableItems
};
