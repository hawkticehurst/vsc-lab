// Social Asset - VS Code Release Note Generator
import { toPng } from 'html-to-image';

const STORAGE_KEY = 'vscode-social-asset-state';
const MAX_HISTORY_SIZE = 50;

interface PlatformDimensions {
    width: number;
    height: number;
}

interface ThemeColors {
    bg: string;
    text: string;
    secondary: string;
    pillBg: string;
    pillFg: string;
}

interface FeatureData {
    name: string;
    desc: string;
}

interface ColumnData {
    title: string;
    features: FeatureData[];
}

interface SavedState {
    platform: string;
    theme: string;
    title: string;
    version: string;
    columns: ColumnData[];
}

// Undo/Redo history
let history: SavedState[] = [];
let historyIndex = -1;
let isRestoringState = false;

const platforms: Record<string, PlatformDimensions> = {
    'twitter': { width: 1200, height: 675 },
    'bluesky': { width: 1200, height: 627 },
    'linkedin': { width: 1200, height: 627 },
    'facebook': { width: 1200, height: 630 },
    'youtube': { width: 1280, height: 720 },
};

const themes: Record<string, ThemeColors> = {
    'dark': {
        bg: '#121212',
        text: '#ffffff',
        secondary: '#a0a0a0',
        pillBg: '#ffffff',
        pillFg: '#000000',
    },
    'light': {
        bg: '#ffffff',
        text: '#1a1a1a',
        secondary: '#666666',
        pillBg: '#1a1a1a',
        pillFg: '#ffffff',
    },
};

const defaultState: SavedState = {
    platform: 'twitter',
    theme: 'dark',
    title: 'January Release',
    version: 'v1.109',
    columns: [
        {
            title: 'Unified agent UX',
            features: [
                { name: 'Run parallel subagents.', desc: 'Delegate tasks to multiple subagents in parallel with isolated context.' },
                { name: 'Pick your agents.', desc: 'Your GitHub Copilot subscription now includes Copilot, Claude, and Codex agents. Run them locally or in the cloud.' },
                { name: 'Manage agent sessions.', desc: 'New agents-first experience to track progress, switch providers, and jump between threads.' },
            ],
        },
        {
            title: 'Agent extensibility',
            features: [
                { name: 'Build MCP Apps.', desc: 'Build forms, dashboards, and interactive tools that render inline.' },
                { name: 'Load skills by default. (GA)', desc: 'Reusable capabilities that load on-demand. Extensions can add their own.' },
                { name: 'Share org-level instructions', desc: 'Distribute agent config and instruction files across your GitHub organization.' },
            ],
        },
        {
            title: 'New built-in tools',
            features: [
                { name: 'Debug in the browser.', desc: 'Use the new built-in browser to inspect DOM, network, and console logs.' },
                { name: 'Create Mermaid diagrams.', desc: 'Mermaid diagrams render directly in agent chat responses.' },
                { name: 'Sandbox terminal commands.', desc: 'Execute agent commands in a controlled environment on macOS and Linux.' },
            ],
        },
    ],
};

// Elements
let card: HTMLElement;
let titleEl: HTMLElement;
let versionEl: HTMLElement;
let columns: HTMLElement[];

// Debounce timer for saving
let saveTimeout: number | null = null;

function getCurrentState(): SavedState {
    return {
        platform: (document.getElementById('platformSelect') as HTMLSelectElement)?.value || 'twitter',
        theme: (document.getElementById('themeSelect') as HTMLSelectElement)?.value || 'dark',
        title: titleEl.textContent || '',
        version: versionEl.textContent || '',
        columns: columns.map(col => ({
            title: col.querySelector('.column-title')?.textContent || '',
            features: Array.from(col.querySelectorAll('.feature-item')).map(item => ({
                name: item.querySelector('.feature-name')?.textContent || '',
                desc: item.querySelector('.feature-desc')?.textContent || '',
            })),
        })),
    };
}

function pushToHistory(state: SavedState): void {
    // Remove any future states if we're not at the end of history
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }

    // Add new state
    history.push(JSON.parse(JSON.stringify(state)));
    historyIndex = history.length - 1;

    // Limit history size
    if (history.length > MAX_HISTORY_SIZE) {
        history.shift();
        historyIndex--;
    }
}

function undo(): void {
    if (historyIndex <= 0) return;

    historyIndex--;
    restoreState(history[historyIndex]);
}

function redo(): void {
    if (historyIndex >= history.length - 1) return;

    historyIndex++;
    restoreState(history[historyIndex]);
}

function restoreState(state: SavedState): void {
    isRestoringState = true;

    try {
        // Restore platform
        const platformSelect = document.getElementById('platformSelect') as HTMLSelectElement;
        if (platformSelect && state.platform) {
            platformSelect.value = state.platform;
            const dims = platforms[state.platform];
            if (dims) {
                card.style.width = `${dims.width}px`;
                card.style.height = `${dims.height}px`;
            }
        }

        // Restore theme
        const themeSelect = document.getElementById('themeSelect') as HTMLSelectElement;
        if (themeSelect && state.theme) {
            themeSelect.value = state.theme;
            card.classList.remove('theme-light', 'theme-dark');
            card.classList.add(`theme-${state.theme}`);
            applyColors(themes[state.theme]);
        }

        // Restore title and version
        titleEl.textContent = state.title || '';
        versionEl.textContent = state.version || '';

        // Restore columns
        if (state.columns) {
            state.columns.forEach((colData, i) => {
                const col = columns[i];
                if (!col) return;

                // Set title
                const colTitleEl = col.querySelector('.column-title');
                if (colTitleEl) colTitleEl.textContent = colData.title || '';

                // Clear existing features and add saved ones
                const list = col.querySelector('.feature-list');
                if (list && colData.features) {
                    list.innerHTML = '';
                    colData.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.className = 'feature-item';
                        li.innerHTML = `
                            <button type="button" class="delete-feature-btn" title="Delete feature">×</button>
                            <span class="feature-name editable" contenteditable="true">${escapeHtml(feature.name)}</span>
                            <span class="feature-desc editable" contenteditable="true">${escapeHtml(feature.desc)}</span>
                        `;
                        list.appendChild(li);
                    });
                }
            });
        }

        // Save to localStorage (but don't push to history)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } finally {
        isRestoringState = false;
    }
}

function saveState(): void {
    // Don't save if we're restoring state (undo/redo)
    if (isRestoringState) return;

    // Debounce saves to avoid excessive writes
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const state = getCurrentState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        pushToHistory(state);
    }, 300) as unknown as number;
}

function loadState(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY);
    const state: SavedState = saved ? JSON.parse(saved) : defaultState;

    try {
        // Restore platform
        const platformSelect = document.getElementById('platformSelect') as HTMLSelectElement;
        if (platformSelect && state.platform) {
            platformSelect.value = state.platform;
            const dims = platforms[state.platform];
            if (dims) {
                card.style.width = `${dims.width}px`;
                card.style.height = `${dims.height}px`;
            }
        }

        // Restore theme
        const themeSelect = document.getElementById('themeSelect') as HTMLSelectElement;
        if (themeSelect && state.theme) {
            themeSelect.value = state.theme;
            card.classList.remove('theme-light', 'theme-dark');
            card.classList.add(`theme-${state.theme}`);
        }

        // Restore title and version
        titleEl.textContent = state.title || '';
        versionEl.textContent = state.version || '';

        // Restore columns
        if (state.columns) {
            state.columns.forEach((colData, i) => {
                const col = columns[i];
                if (!col) return;

                // Set title
                const colTitleEl = col.querySelector('.column-title');
                if (colTitleEl) colTitleEl.textContent = colData.title || '';

                // Clear existing features and add saved ones
                const list = col.querySelector('.feature-list');
                if (list && colData.features) {
                    list.innerHTML = '';
                    colData.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.className = 'feature-item';
                        li.innerHTML = `
                            <button type="button" class="delete-feature-btn" title="Delete feature">×</button>
                            <span class="feature-name editable" contenteditable="true">${escapeHtml(feature.name)}</span>
                            <span class="feature-desc editable" contenteditable="true">${escapeHtml(feature.desc)}</span>
                        `;
                        list.appendChild(li);
                    });
                }
            });
        }

        // Initialize history with the loaded state
        history = [JSON.parse(JSON.stringify(state))];
        historyIndex = 0;

        return !!saved;
    } catch {
        return false;
    }
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function init(): void {
    card = document.getElementById('releaseCard')!;
    titleEl = document.getElementById('releaseTitle')!;
    versionEl = document.getElementById('versionPill')!;
    columns = [
        document.getElementById('column1')!,
        document.getElementById('column2')!,
        document.getElementById('column3')!,
    ];

    // Load saved state or defaults
    loadState();

    initPlatformSelector();
    initThemeSelector();
    initInlineEditing();
    initInlineButtons();
    initExportButton();
    initUndoRedo();

    // Apply colors from theme on initial load
    const themeSelect = document.getElementById('themeSelect') as HTMLSelectElement;
    applyColors(themes[themeSelect?.value || 'dark']);

    // Show the card after content is loaded
    card.style.visibility = 'visible';
}

function initPlatformSelector(): void {
    const select = document.getElementById('platformSelect') as HTMLSelectElement;
    if (!select) return;

    function applyDimensions(platform: string): void {
        const dims = platforms[platform];
        if (dims) {
            card.style.width = `${dims.width}px`;
            card.style.height = `${dims.height}px`;
        }
    }

    applyDimensions(select.value);
    select.addEventListener('change', () => {
        applyDimensions(select.value);
        saveState();
    });
}

function initThemeSelector(): void {
    const select = document.getElementById('themeSelect') as HTMLSelectElement;
    if (!select) return;

    function applyTheme(theme: string): void {
        const colors = themes[theme];
        if (!colors) return;

        card.classList.remove('theme-light', 'theme-dark');
        card.classList.add(`theme-${theme}`);

        // Apply colors to card
        applyColors(colors);
        saveState();
    }

    select.addEventListener('change', () => applyTheme(select.value));
}

function applyColors(colors: ThemeColors): void {
    card.style.backgroundColor = colors.bg;

    // Apply text colors
    titleEl.style.color = colors.text;
    document.querySelectorAll('.release-card .column-title, .release-card .feature-name').forEach(el => {
        (el as HTMLElement).style.color = colors.text;
    });

    document.querySelectorAll('.release-card .feature-desc').forEach(el => {
        (el as HTMLElement).style.color = colors.secondary;
    });

    // Apply pill colors
    versionEl.style.backgroundColor = colors.pillBg;
    versionEl.style.color = colors.pillFg;
}

function initInlineEditing(): void {
    // Prevent newlines in contenteditable elements
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const target = e.target as HTMLElement;
            if (target.hasAttribute('contenteditable')) {
                e.preventDefault();
                target.blur();
            }
        }
    });

    // Save on any content edit
    card.addEventListener('input', (e) => {
        const target = e.target as HTMLElement;
        if (target.hasAttribute('contenteditable')) {
            saveState();
        }
    });
}

function initInlineButtons(): void {
    // Handle add feature buttons in graphic
    document.querySelectorAll('.add-feature-inline-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const columnNum = parseInt((e.target as HTMLElement).dataset.column || '1');
            addFeatureToGraphic(columnNum);
        });
    });

    // Handle delete feature buttons (using event delegation)
    card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('delete-feature-btn')) {
            const featureItem = target.closest('.feature-item');
            if (featureItem) {
                featureItem.remove();
                saveState();
            }
        }
    });
}

function initExportButton(): void {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', exportToPng);
    }
}

function initUndoRedo(): void {
    // Setup keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Check for Cmd+Z (Mac) or Ctrl+Z (Windows/Linux)
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modKey = isMac ? e.metaKey : e.ctrlKey;

        if (modKey && e.key === 'z') {
            if (e.shiftKey) {
                // Redo: Cmd+Shift+Z (Mac) or Ctrl+Shift+Z (Windows/Linux)
                e.preventDefault();
                redo();
            } else {
                // Undo: Cmd+Z (Mac) or Ctrl+Z (Windows/Linux)
                e.preventDefault();
                undo();
            }
        }
        // Also support Ctrl+Y for redo on Windows/Linux
        if (!isMac && e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redo();
        }
    });
}

function addFeatureToGraphic(columnNum: number): void {
    const column = columns[columnNum - 1];
    const list = column?.querySelector('.feature-list');
    if (!list) return;

    const li = document.createElement('li');
    li.className = 'feature-item';
    li.innerHTML = `
        <button type="button" class="delete-feature-btn" title="Delete feature">×</button>
        <span class="feature-name editable" contenteditable="true">New feature</span>
        <span class="feature-desc editable" contenteditable="true">Feature description</span>
    `;

    list.appendChild(li);
    const themeSelect = document.getElementById('themeSelect') as HTMLSelectElement;
    applyColors(themes[themeSelect?.value || 'dark']);

    // Focus the new feature name
    const nameEl = li.querySelector('.feature-name') as HTMLElement;
    nameEl?.focus();

    // Select all text
    const range = document.createRange();
    range.selectNodeContents(nameEl);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    saveState();
}

async function exportToPng(): Promise<void> {
    const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
    const originalText = downloadBtn.textContent;

    try {
        downloadBtn.textContent = 'Exporting...';
        downloadBtn.disabled = true;

        // Hide UI elements that shouldn't appear in export
        const addButtons = card.querySelectorAll('.add-feature-inline-btn');
        const deleteButtons = card.querySelectorAll('.delete-feature-btn');
        const editables = card.querySelectorAll('.editable');

        addButtons.forEach(btn => (btn as HTMLElement).style.display = 'none');
        deleteButtons.forEach(btn => (btn as HTMLElement).style.display = 'none');
        editables.forEach(el => {
            (el as HTMLElement).removeAttribute('contenteditable');
            (el as HTMLElement).style.borderColor = 'transparent';
        });

        // Use higher scale factor for crisp export on retina displays
        // Account for device pixel ratio to avoid blurriness
        const dataUrl = await toPng(card, {
            cacheBust: true,
            canvasWidth: 1200,
            canvasHeight: 675,
        });

        // Restore UI elements
        addButtons.forEach(btn => (btn as HTMLElement).style.display = '');
        deleteButtons.forEach(btn => (btn as HTMLElement).style.display = '');
        editables.forEach(el => {
            (el as HTMLElement).setAttribute('contenteditable', 'true');
            (el as HTMLElement).style.borderColor = '';
        });

        // Create download link
        const link = document.createElement('a');
        const platform = (document.getElementById('platformSelect') as HTMLSelectElement)?.value || 'twitter';
        const version = versionEl.textContent?.replace(/[^a-zA-Z0-9]/g, '') || 'release';
        link.download = `vscode-${version}-${platform}.png`;
        link.href = dataUrl;
        link.click();

    } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export image. Please try again.');
    } finally {
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', init);
