import chatSessionsData from "./chat-sessions-data.json";
import { initChatSessions, hideChatSessions, showChatSessions } from "./chat-sessions.js";
import { fileCodeExamples } from "./code.js";
import { initMonacoEditor, setEditorContent } from "./monaco.js";
import { initPickerMenus } from "./picker-menus.js";
import { projectData, getActiveFile, getFileCode } from "./projects.js";
// Import component styles via virtual module - Vite processes CSS nesting
import "virtual:html-components.css";

// Lightweight client logic for the VS Code hero editor tab UI.
// Handles clicking and keyboard navigation between <tab-item> elements
// and shows the corresponding <editor-area>. Adds accessibility roles
// and states dynamically (tablist, tab, tabpanel, aria-selected, hidden).

function initVsCodeHeroTabs() {
	const tabBar = /** @type {HTMLElement|null} */ (
		document.querySelector("vs-code[hero-editor] tab-bar")
	);
	if (!tabBar) return; // Nothing to do if hero editor not present

	/** @type {HTMLElement[]} */
	const allTabItems = Array.from(tabBar.querySelectorAll("vs-code[hero-editor] tab-item")).filter(
		(el) => el instanceof HTMLElement,
	);
	/** @type {HTMLElement[]} */
	const editorAreas = Array.from(
		document.querySelectorAll("vs-code[hero-editor] editor-area"),
	).filter((el) => el instanceof HTMLElement);

	// Helper: derive key for a tab-item to match editor-area[file="..."]
	const getTabKey = (tab) => {
		const typeAttr = tab.getAttribute("type");
		if (typeAttr && typeAttr !== "fill-end") return typeAttr.trim();
		const filenameEl = tab.querySelector("vs-code[hero-editor] .filename");
		if (filenameEl) return filenameEl.textContent.trim();
		return null;
	};

	// Prepare tabs: assign dataset key, roles, and IDs for aria controls
	allTabItems.forEach((tab, idx) => {
		if (tab.getAttribute("type") === "fill-end") return; // skip filler
		const key = getTabKey(tab);
		if (!key) return;
		// @ts-ignore - dataset exists on HTMLElement in runtime environment
		tab.dataset.editorKey = key;
		tab.setAttribute("role", "tab");
		if (!tab.id) tab.id = `hero-tab-${key.replace(/[^a-zA-Z0-9_-]/g, "-")}-${idx}`;
		tab.setAttribute("tabindex", tab.hasAttribute("active") ? "0" : "-1");
		tab.setAttribute("aria-selected", tab.hasAttribute("active") ? "true" : "false");
	});
	tabBar.setAttribute("role", "tablist");

	// Prepare editor areas: map by file attribute
	editorAreas.forEach((area) => {
		const fileKey = area.getAttribute("file");
		area.setAttribute("role", "tabpanel");
		// Link area with its tab via aria-labelledby if tab exists
		const matchingTab = allTabItems.find((t) => {
			// @ts-ignore
			return t.dataset.editorKey === fileKey;
		});
		if (matchingTab) {
			area.setAttribute("aria-labelledby", matchingTab.id);
		}
	});

	// Determine initial active tab (first with active attr or first real tab)
	let activeTab = allTabItems.find(
		(t) => t.hasAttribute("active") && t.getAttribute("type") !== "fill-end",
	);
	if (!activeTab) activeTab = allTabItems.find((t) => t.getAttribute("type") !== "fill-end");

	const setActive = (nextTab) => {
		if (!nextTab || nextTab === activeTab) return;
		if (nextTab.getAttribute("type") === "fill-end") return;
		// Update tab states
		allTabItems.forEach((tab) => {
			if (tab.getAttribute("type") === "fill-end") return;
			const isActive = tab === nextTab;
			if (isActive) {
				tab.setAttribute("active", "");
				tab.setAttribute("aria-selected", "true");
				tab.setAttribute("tabindex", "0");
			} else {
				tab.removeAttribute("active");
				tab.setAttribute("aria-selected", "false");
				tab.setAttribute("tabindex", "-1");
			}
		});
		// Show matching editor-area; hide others
		// @ts-ignore
		const key = nextTab.dataset.editorKey;
		editorAreas.forEach((area) => {
			const shouldShow = area.getAttribute("file") === key;
			if (shouldShow) {
				area.removeAttribute("hidden");
			} else {
				area.setAttribute("hidden", "");
			}
		});
		activeTab = nextTab;
	};

	// Initial hide/show based on activeTab
	if (activeTab) setActive(activeTab);

	// Click handling
	tabBar.addEventListener("click", (e) => {
		const target = /** @type {HTMLElement|null} */ (
			e.target instanceof HTMLElement ? e.target : null
		);
		// Ignore clicks on close icon - let initTabBarInteraction handle those
		if (target && target.closest(".close-icon")) return;
		const tab = target ? target.closest("tab-item") : null;
		if (!(tab instanceof HTMLElement)) return;
		if (tab.getAttribute("type") === "fill-end") return;
		setActive(tab);
		tab.focus();
	});

	// Keyboard navigation (Left/Right/Home/End)
	tabBar.addEventListener("keydown", (e) => {
		const ev = /** @type {KeyboardEvent} */ (e);
		const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
		if (!keys.includes(ev.key)) return;
		const focusableTabs = allTabItems.filter((t) => t.getAttribute("type") !== "fill-end");
		const activeEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const currentTab = activeEl && activeEl.closest ? activeEl.closest("tab-item") : null;
		const ct = currentTab instanceof HTMLElement ? currentTab : null;
		const currentIndex = ct ? focusableTabs.indexOf(ct) : 0;
		let nextIndex = currentIndex;
		if (ev.key === "ArrowLeft")
			nextIndex = (currentIndex - 1 + focusableTabs.length) % focusableTabs.length;
		if (ev.key === "ArrowRight") nextIndex = (currentIndex + 1) % focusableTabs.length;
		if (ev.key === "Home") nextIndex = 0;
		if (ev.key === "End") nextIndex = focusableTabs.length - 1;
		const nextTab = focusableTabs[nextIndex];
		if (nextTab) {
			ev.preventDefault();
			setActive(nextTab);
			nextTab.focus();
		}
	});

	// Delegate session container click -> activate cloud agent tab
	document.addEventListener("click", (e) => {
		const target = e.target instanceof HTMLElement ? e.target : null;
		if (!target) return;
		const container = target.closest("agent-session-item-container");
		if (!container) return;
		const delegateTab = allTabItems.find(
			(t) => t.getAttribute("type") === "delegate-to-cloud-agent",
		);
		if (delegateTab) {
			setActive(delegateTab);
			delegateTab.focus();
		}
	});
}

// Initialize resize functionality for secondary sidebar
function initSecondarySidebarResize() {
	const secondarySidebar = document.querySelector("secondary-side-bar");
	const mainArea = document.querySelector(".main-area");

	if (!secondarySidebar || !mainArea) return;

	let isResizing = false;
	let startX = 0;
	let startWidth = 0;
	const RESIZE_HANDLE_WIDTH = 6;

	// Track mouse position to show/hide hover state on resize handle
	secondarySidebar.addEventListener("mousemove", (e) => {
		if (isResizing) return;
		const rect = secondarySidebar.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			secondarySidebar.classList.add("resize-hover");
		} else {
			secondarySidebar.classList.remove("resize-hover");
		}
	});

	secondarySidebar.addEventListener("mouseleave", () => {
		if (!isResizing) {
			secondarySidebar.classList.remove("resize-hover");
		}
	});

	// Handle mousedown on the resize handle (the ::before pseudo-element area)
	secondarySidebar.addEventListener("mousedown", (e) => {
		// Check if click is in the resize handle area (left 6px of the sidebar)
		const rect = secondarySidebar.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			isResizing = true;
			startX = e.clientX;
			startWidth = secondarySidebar.getBoundingClientRect().width;
			secondarySidebar.classList.add("resizing");
			document.body.style.cursor = "ew-resize";
			document.body.style.userSelect = "none";
			e.preventDefault();
		}
	});

	document.addEventListener("mousemove", (e) => {
		if (!isResizing) return;

		const deltaX = startX - e.clientX;
		const newWidth = startWidth + deltaX;

		// Set min and max width constraints
		const minWidth = 200;
		const maxWidth = window.innerWidth * 0.6;

		if (newWidth >= minWidth && newWidth <= maxWidth) {
			// Update the grid template columns to reflect the new width
			const vsCode = document.querySelector("vs-code");
			const layout = vsCode?.getAttribute("layout");

			if (layout === "right-sidebar") {
				mainArea.style.gridTemplateColumns = `1fr ${newWidth}px`;
			} else {
				// Default layout with both sidebars
				mainArea.style.gridTemplateColumns = `20% 1fr ${newWidth}px`;
			}
		}
	});

	document.addEventListener("mouseup", () => {
		if (isResizing) {
			isResizing = false;
			secondarySidebar.classList.remove("resizing");
			secondarySidebar.classList.remove("resize-hover");
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}
	});
}

// Initialize resize functionality for primary sidebar
function initPrimarySidebarResize() {
	const primarySidebar = document.querySelector("primary-side-bar");
	const mainArea = document.querySelector(".main-area");
	const vsCode = document.querySelector("vs-code");
	const floatingChatInput = document.querySelector("floating-chat-input");

	if (!primarySidebar || !mainArea) return;

	let isResizing = false;
	let startX = 0;
	let startWidth = 0;
	const RESIZE_HANDLE_WIDTH = 6;

	// Track mouse position to show/hide hover state on resize handle
	primarySidebar.addEventListener("mousemove", (e) => {
		if (isResizing) return;
		const rect = primarySidebar.getBoundingClientRect();
		const offsetX = rect.right - e.clientX;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			primarySidebar.classList.add("resize-hover");
		} else {
			primarySidebar.classList.remove("resize-hover");
		}
	});

	primarySidebar.addEventListener("mouseleave", () => {
		if (!isResizing) {
			primarySidebar.classList.remove("resize-hover");
		}
	});

	// Handle mousedown on the resize handle (the ::after pseudo-element area)
	primarySidebar.addEventListener("mousedown", (e) => {
		// Check if click is in the resize handle area (right 6px of the sidebar)
		const rect = primarySidebar.getBoundingClientRect();
		const offsetX = rect.right - e.clientX;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			isResizing = true;
			startX = e.clientX;
			startWidth = primarySidebar.getBoundingClientRect().width;
			primarySidebar.classList.add("resizing");
			document.body.style.cursor = "ew-resize";
			document.body.style.userSelect = "none";
			e.preventDefault();
		}
	});

	document.addEventListener("mousemove", (e) => {
		if (!isResizing) return;

		const deltaX = e.clientX - startX;
		const newWidth = startWidth + deltaX;

		// Check if we're in State 4 (expanded chat mode)
		const isState4 = floatingChatInput && floatingChatInput.getAttribute("data-state") === "4" && !floatingChatInput.hidden;

		// Set min and max width constraints
		const minWidth = isState4 ? 48 : 150;
		const maxWidth = isState4 ? 300 : window.innerWidth * 0.4;
		const expandThreshold = 100; // Width threshold to show sidebar content

		if (newWidth >= minWidth && newWidth <= maxWidth) {
			// In State 4, use CSS custom property for grid template
			if (isState4) {
				vsCode.style.setProperty("--state4-sidebar-width", `${newWidth}px`);
				// Show/hide sidebar content based on width
				if (newWidth > expandThreshold) {
					primarySidebar.classList.add("expanded");
				} else {
					primarySidebar.classList.remove("expanded");
				}
			}
			// Update the sidebar width directly
			primarySidebar.style.width = `${newWidth}px`;
		}
	});

	document.addEventListener("mouseup", () => {
		if (isResizing) {
			isResizing = false;
			primarySidebar.classList.remove("resizing");
			primarySidebar.classList.remove("resize-hover");
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}
	});
}

// Initialize resize functionality for terminal panel (vertical)
function initTerminalPanelResize() {
	const terminalPanel = document.querySelector("terminal-panel");

	if (!terminalPanel) return;

	let isResizing = false;
	let startY = 0;
	let startHeight = 0;
	const RESIZE_HANDLE_HEIGHT = 6;

	// Track mouse position to show/hide hover state on resize handle
	terminalPanel.addEventListener("mousemove", (e) => {
		if (isResizing) return;
		const rect = terminalPanel.getBoundingClientRect();
		const offsetY = e.clientY - rect.top;

		if (offsetY <= RESIZE_HANDLE_HEIGHT) {
			terminalPanel.classList.add("resize-hover");
		} else {
			terminalPanel.classList.remove("resize-hover");
		}
	});

	terminalPanel.addEventListener("mouseleave", () => {
		if (!isResizing) {
			terminalPanel.classList.remove("resize-hover");
		}
	});

	// Handle mousedown on the resize handle (the ::before pseudo-element area)
	terminalPanel.addEventListener("mousedown", (e) => {
		// Check if click is in the resize handle area (top 6px of the panel)
		const rect = terminalPanel.getBoundingClientRect();
		const offsetY = e.clientY - rect.top;

		if (offsetY <= RESIZE_HANDLE_HEIGHT) {
			isResizing = true;
			startY = e.clientY;
			startHeight = terminalPanel.getBoundingClientRect().height;
			terminalPanel.classList.add("resizing");
			document.body.style.cursor = "ns-resize";
			document.body.style.userSelect = "none";
			e.preventDefault();
		}
	});

	document.addEventListener("mousemove", (e) => {
		if (!isResizing) return;

		// Dragging up increases height, dragging down decreases height
		const deltaY = startY - e.clientY;
		const newHeight = startHeight + deltaY;

		// Set min and max height constraints
		const minHeight = 100;
		const maxHeight = window.innerHeight * 0.6;

		if (newHeight >= minHeight && newHeight <= maxHeight) {
			terminalPanel.style.height = `${newHeight}px`;
		}
	});

	document.addEventListener("mouseup", () => {
		if (isResizing) {
			isResizing = false;
			terminalPanel.classList.remove("resizing");
			terminalPanel.classList.remove("resize-hover");
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}
	});
}

// Initialize resize functionality for chat-sessions panels (session-list, chat-thread, results-panel)
function initChatSessionsResize() {
	const chatSessions = document.querySelector("chat-sessions");
	if (!chatSessions) return;

	const sessionList = chatSessions.querySelector("session-list");
	const chatThread = chatSessions.querySelector("chat-thread");
	const resultsPanel = chatSessions.querySelector("results-panel");

	if (!sessionList || !chatThread || !resultsPanel) return;

	const RESIZE_HANDLE_WIDTH = 6;

	// --- Session List Resize (right edge) ---
	let isResizingSessionList = false;
	let sessionListStartX = 0;
	let sessionListStartWidth = 0;

	sessionList.addEventListener("mousemove", (e) => {
		if (isResizingSessionList) return;
		const rect = sessionList.getBoundingClientRect();
		const offsetX = rect.right - e.clientX;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			sessionList.classList.add("resize-hover");
		} else {
			sessionList.classList.remove("resize-hover");
		}
	});

	sessionList.addEventListener("mouseleave", () => {
		if (!isResizingSessionList) {
			sessionList.classList.remove("resize-hover");
		}
	});

	sessionList.addEventListener("mousedown", (e) => {
		const rect = sessionList.getBoundingClientRect();
		const offsetX = rect.right - e.clientX;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			isResizingSessionList = true;
			sessionListStartX = e.clientX;
			sessionListStartWidth = rect.width;
			sessionList.classList.add("resizing");
			document.body.style.cursor = "ew-resize";
			document.body.style.userSelect = "none";
			e.preventDefault();
		}
	});

	// --- Results Panel Resize (left edge) ---
	let isResizingResultsPanel = false;
	let resultsPanelStartX = 0;
	let resultsPanelStartWidth = 0;

	resultsPanel.addEventListener("mousemove", (e) => {
		if (isResizingResultsPanel) return;
		const rect = resultsPanel.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			resultsPanel.classList.add("resize-hover");
		} else {
			resultsPanel.classList.remove("resize-hover");
		}
	});

	resultsPanel.addEventListener("mouseleave", () => {
		if (!isResizingResultsPanel) {
			resultsPanel.classList.remove("resize-hover");
		}
	});

	resultsPanel.addEventListener("mousedown", (e) => {
		const rect = resultsPanel.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			isResizingResultsPanel = true;
			resultsPanelStartX = e.clientX;
			resultsPanelStartWidth = rect.width;
			resultsPanel.classList.add("resizing");
			document.body.style.cursor = "ew-resize";
			document.body.style.userSelect = "none";
			e.preventDefault();
		}
	});

	// --- Chat Thread Resize (right edge, between chat-thread and results-panel) ---
	let isResizingChatThread = false;
	let chatThreadStartX = 0;
	let chatThreadStartWidth = 0;
	let resultsPanelStartWidthForChatThread = 0;

	chatThread.addEventListener("mousemove", (e) => {
		if (isResizingChatThread) return;
		const rect = chatThread.getBoundingClientRect();
		const offsetX = rect.right - e.clientX;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			chatThread.classList.add("resize-hover");
		} else {
			chatThread.classList.remove("resize-hover");
		}
	});

	chatThread.addEventListener("mouseleave", () => {
		if (!isResizingChatThread) {
			chatThread.classList.remove("resize-hover");
		}
	});

	chatThread.addEventListener("mousedown", (e) => {
		const rect = chatThread.getBoundingClientRect();
		const offsetX = rect.right - e.clientX;

		if (offsetX <= RESIZE_HANDLE_WIDTH) {
			isResizingChatThread = true;
			chatThreadStartX = e.clientX;
			chatThreadStartWidth = rect.width;
			resultsPanelStartWidthForChatThread = resultsPanel.getBoundingClientRect().width;
			chatThread.classList.add("resizing");
			document.body.style.cursor = "ew-resize";
			document.body.style.userSelect = "none";
			e.preventDefault();
		}
	});

	// --- Global mousemove handler for all resize operations ---
	document.addEventListener("mousemove", (e) => {
		const chatSessionsRect = chatSessions.getBoundingClientRect();
		const minWidth = 180;
		const minChatThreadWidth = 200;
		const minResultsWidth = 250;

		if (isResizingSessionList) {
			const deltaX = e.clientX - sessionListStartX;
			const newWidth = sessionListStartWidth + deltaX;
			const maxWidth = chatSessionsRect.width * 0.4;

			if (newWidth >= minWidth && newWidth <= maxWidth) {
				sessionList.style.width = `${newWidth}px`;
			}
		}

		if (isResizingResultsPanel) {
			const deltaX = resultsPanelStartX - e.clientX;
			const newWidth = resultsPanelStartWidth + deltaX;
			const maxWidth = chatSessionsRect.width * 0.6;

			if (newWidth >= minResultsWidth && newWidth <= maxWidth) {
				resultsPanel.style.width = `${newWidth}px`;
			}
		}

		if (isResizingChatThread) {
			const deltaX = e.clientX - chatThreadStartX;
			// Expand chat thread = shrink results panel
			const newResultsWidth = resultsPanelStartWidthForChatThread - deltaX;
			const maxResultsWidth = chatSessionsRect.width * 0.6;

			if (newResultsWidth >= minResultsWidth && newResultsWidth <= maxResultsWidth) {
				resultsPanel.style.width = `${newResultsWidth}px`;
			}
		}
	});

	// --- Global mouseup handler to end all resize operations ---
	document.addEventListener("mouseup", () => {
		if (isResizingSessionList) {
			isResizingSessionList = false;
			sessionList.classList.remove("resizing");
			sessionList.classList.remove("resize-hover");
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}

		if (isResizingResultsPanel) {
			isResizingResultsPanel = false;
			resultsPanel.classList.remove("resizing");
			resultsPanel.classList.remove("resize-hover");
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}

		if (isResizingChatThread) {
			isResizingChatThread = false;
			chatThread.classList.remove("resizing");
			chatThread.classList.remove("resize-hover");
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}
	});
}

// Initialize tree view collapsible folder behavior
function initTreeViewCollapse() {
	const treeView = document.querySelector("tree-view");
	if (!treeView) return;

	treeView.addEventListener("click", (e) => {
		const target = e.target instanceof HTMLElement ? e.target : null;
		if (!target) return;

		const folderItem = target.closest("tree-item[folder]");
		if (!(folderItem instanceof HTMLElement)) return;

		// Toggle open state
		const isOpen = folderItem.hasAttribute("open");
		if (isOpen) {
			folderItem.removeAttribute("open");
		} else {
			folderItem.setAttribute("open", "");
		}

		// Get the indent level of this folder
		const folderIndent = parseInt(folderItem.getAttribute("indent") || "0", 10);

		// Find all subsequent tree-items that are children of this folder
		let sibling = folderItem.nextElementSibling;
		while (sibling && sibling instanceof HTMLElement && sibling.tagName === "TREE-ITEM") {
			const siblingIndent = parseInt(sibling.getAttribute("indent") || "0", 10);

			// Stop if we reach an item at the same or lower indent level (not a child)
			if (siblingIndent <= folderIndent) break;

			// Toggle visibility based on open state
			if (isOpen) {
				// Closing: hide all children
				sibling.setAttribute("hidden", "");
			} else {
				// Opening: show direct children, but respect nested folder states
				// First, check if any parent folder between this and the folder is closed
				let shouldShow = true;
				let checkSibling = folderItem.nextElementSibling;
				while (checkSibling && checkSibling !== sibling && checkSibling instanceof HTMLElement) {
					const checkIndent = parseInt(checkSibling.getAttribute("indent") || "0", 10);
					if (
						checkSibling.hasAttribute("folder") &&
						!checkSibling.hasAttribute("open") &&
						checkIndent < siblingIndent &&
						checkIndent >= folderIndent
					) {
						shouldShow = false;
						break;
					}
					checkSibling = checkSibling.nextElementSibling;
				}
				if (shouldShow) {
					sibling.removeAttribute("hidden");
				}
			}

			sibling = sibling.nextElementSibling;
		}
	});
}

// Initialize tree view file click behavior to open files in editor
function initTreeViewFileClick() {
	const treeView = document.querySelector("tree-view");
	if (!treeView) return;

	treeView.addEventListener("click", (e) => {
		const target = e.target instanceof HTMLElement ? e.target : null;
		if (!target) return;

		// Only handle clicks on file items (not folders)
		const treeItem = target.closest("tree-item:not([folder])");
		if (!(treeItem instanceof HTMLElement)) return;

		// Get the filename from the tree item
		const fileNameEl = treeItem.querySelector(".file-name");
		if (!fileNameEl) return;
		const fileName = fileNameEl.textContent.trim();

		// Check if we have code for this file
		if (!fileCodeExamples[fileName]) return;

		// Update tree view active state
		const allTreeItems = treeView.querySelectorAll("tree-item");
		allTreeItems.forEach((item) => item.removeAttribute("active"));
		treeItem.setAttribute("active", "");

		// Open file in tab bar (add if not present) and set as active
		openFileInTabBar(fileName);

		// Update editor content
		setEditorContent(fileName);
	});
}

// Helper function to create a tab item element
function createTabItem(fileName) {
	const tabItem = document.createElement("tab-item");
	tabItem.innerHTML = `
    <span class="filename">${fileName}</span>
    <span class="close-icon">
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M12.1465 5.14652C12.3418 4.95127 12.6583 4.95126 12.8535 5.14652C13.0487 5.34179 13.0488 5.65831 12.8535 5.85355L9.70705 9.00004L12.8535 12.1465C13.0488 12.3418 13.0488 12.6583 12.8535 12.8536C12.6583 13.0488 12.3418 13.0488 12.1465 12.8536L9.00002 9.70707L5.85354 12.8536C5.6583 13.0488 5.34177 13.0488 5.14651 12.8536C4.95125 12.6583 4.95125 12.3418 5.14651 12.1465L8.29299 9.00004L5.14651 5.85355C4.95125 5.6583 4.95126 5.34179 5.14651 5.14652C5.34177 4.95126 5.65828 4.95126 5.85354 5.14652L9.00002 8.29301L12.1465 5.14652Z" />
      </svg>
    </span>
  `;
	return tabItem;
}

// Helper function to open a file in the tab bar
function openFileInTabBar(fileName) {
	const tabBar = document.querySelector("editor-well tab-bar");
	if (!tabBar) return;

	// Check if file is already in tab bar
	const existingTab = Array.from(tabBar.querySelectorAll("tab-item:not([type='fill-end'])")).find(
		(tab) => {
			const filenameEl = tab.querySelector(".filename");
			return filenameEl && filenameEl.textContent.trim() === fileName;
		},
	);

	if (existingTab) {
		// File already in tab bar, just activate it
		setActiveTab(existingTab);
	} else {
		// Create new tab and add before the add button (tab-action)
		const newTab = createTabItem(fileName);
		const addButton = tabBar.querySelector("tab-action");
		if (addButton) {
			tabBar.insertBefore(newTab, addButton);
		} else {
			// Fallback to fill-end if no add button exists
			const fillEnd = tabBar.querySelector('tab-item[type="fill-end"]');
			if (fillEnd) {
				tabBar.insertBefore(newTab, fillEnd);
			} else {
				tabBar.appendChild(newTab);
			}
		}
		setActiveTab(newTab);
	}
}

// Helper function to set active tab
function setActiveTab(tabToActivate) {
	const tabBar = document.querySelector("editor-well tab-bar");
	if (!tabBar || !tabToActivate) return;

	// Remove active from all tabs
	const allTabs = tabBar.querySelectorAll("tab-item:not([type='fill-end'])");
	allTabs.forEach((tab) => tab.removeAttribute("active"));

	// Set new active tab
	tabToActivate.setAttribute("active", "");

	// Update tree view to highlight the corresponding file
	const fileName = tabToActivate.querySelector(".filename")?.textContent.trim();
	if (fileName) {
		updateTreeViewActiveFile(fileName);
	}
}

// Helper function to update tree view active state based on filename
function updateTreeViewActiveFile(fileName) {
	const treeView = document.querySelector("tree-view");
	if (!treeView) return;

	const allTreeItems = treeView.querySelectorAll("tree-item");
	allTreeItems.forEach((item) => {
		const fileNameEl = item.querySelector(".file-name");
		if (fileNameEl && fileNameEl.textContent.trim() === fileName) {
			item.setAttribute("active", "");
		} else {
			item.removeAttribute("active");
		}
	});
}

// SVG icons for tree view rendering
const TREE_ICONS = {
	chevron: `<svg class="chevron-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<path d="M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z"/>
	</svg>`,
	folder: `<svg class="file-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<path d="M2 4.5V6H5.58579C5.71839 6 5.84557 5.94732 5.93934 5.85355L7.29289 4.5L5.93934 3.14645C5.84557 3.05268 5.71839 3 5.58579 3H3.5C2.67157 3 2 3.67157 2 4.5ZM1 4.5C1 3.11929 2.11929 2 3.5 2H5.58579C5.98361 2 6.36514 2.15804 6.64645 2.43934L8.20711 4H12.5C13.8807 4 15 5.11929 15 6.5V11.5C15 12.8807 13.8807 14 12.5 14H3.5C2.11929 14 1 12.8807 1 11.5V4.5ZM2 7V11.5C2 12.3284 2.67157 13 3.5 13H12.5C13.3284 13 14 12.3284 14 11.5V6.5C14 5.67157 13.3284 5 12.5 5H8.20711L6.64645 6.56066C6.36514 6.84197 5.98361 7 5.58579 7H2Z"/>
	</svg>`,
	file: `<svg class="file-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<path d="M5 1C3.89543 1 3 1.89543 3 3V13C3 14.1046 3.89543 15 5 15H11C12.1046 15 13 14.1046 13 13V5.41421C13 5.01639 12.842 4.63486 12.5607 4.35355L9.64645 1.43934C9.36514 1.15804 8.98361 1 8.58579 1H5ZM4 3C4 2.44772 4.44772 2 5 2H8V4.5C8 5.32843 8.67157 6 9.5 6H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V3ZM11.7929 5H9.5C9.22386 5 9 4.77614 9 4.5V2.20711L11.7929 5Z"/>
	</svg>`,
};

/**
 * Recursively render a tree item (file or folder) and its children
 * @param {Object} item - The tree item to render
 * @param {number} indent - Current indentation level
 * @returns {string} HTML string for the tree item and its children
 */
function renderTreeItem(item, indent = 0) {
	const indentAttr = indent > 0 ? `indent="${indent}"` : "";
	const isFolder = item.type === "folder";
	const openAttr = isFolder && item.open ? "open" : "";
	const folderAttr = isFolder ? "folder" : "";
	const activeAttr = item.active ? "active" : "";
	const codeFileAttr = item.codeFile ? `data-code-file="${item.codeFile}"` : "";

	let html = "";

	if (isFolder) {
		html += `<tree-item ${folderAttr} ${openAttr} ${indentAttr}>
			${TREE_ICONS.chevron}
			${TREE_ICONS.folder}
			<span class="folder-name">${item.name}</span>
		</tree-item>`;

		// Render children
		if (item.children && item.children.length > 0) {
			const childHidden = !item.open ? "hidden" : "";
			for (const child of item.children) {
				// Children are hidden if parent folder is closed
				const childHtml = renderTreeItem(child, indent + 1);
				if (!item.open) {
					// Add hidden attribute to closed folder children
					html += childHtml.replace("<tree-item", `<tree-item ${childHidden}`);
				} else {
					html += childHtml;
				}
			}
		}
	} else {
		html += `<tree-item ${indentAttr} ${activeAttr} ${codeFileAttr}>
			${TREE_ICONS.file}
			<span class="file-name">${item.name}</span>
		</tree-item>`;
	}

	return html;
}

/**
 * Render the tree view for a given project
 * @param {string} projectId - The project ID to render the tree for
 */
export function renderTreeView(projectId) {
	const treeView = document.querySelector("tree-view");
	if (!treeView) return;

	const project = chatSessionsData.projects.find((p) => p.id === projectId);
	if (!project || !project.fileTree) return;

	let html = "";
	for (const item of project.fileTree) {
		html += renderTreeItem(item, 0);
	}

	treeView.innerHTML = html;
}

/**
 * Get the current project ID (defaults to first project)
 */
function getCurrentProjectId() {
	// Check if there's an active fullscreen tab
	const activeTab = document.querySelector("fullscreen-tab[active]");
	if (activeTab && activeTab.dataset.projectId) {
		return activeTab.dataset.projectId;
	}
	// Default to first project
	return chatSessionsData.projects[0]?.id || "img-service";
}

// Initialize tab bar click and close behavior
function initTabBarInteraction() {
	const tabBar = document.querySelector("editor-well tab-bar");
	if (!tabBar) return;

	tabBar.addEventListener("click", (e) => {
		const target = e.target instanceof HTMLElement ? e.target : null;
		if (!target) return;

		// Check if clicking the close icon
		const closeIcon = target.closest(".close-icon");
		if (closeIcon) {
			e.stopPropagation();
			e.preventDefault();
			const tabItem = closeIcon.closest("tab-item");
			if (tabItem instanceof HTMLElement) {
				closeTab(tabItem);
			}
			return;
		}

		// Check if clicking a tab item
		const tabItem = target.closest("tab-item:not([type='fill-end'])");
		if (tabItem instanceof HTMLElement) {
			const fileName = tabItem.querySelector(".filename")?.textContent.trim();
			if (fileName && fileCodeExamples[fileName]) {
				setActiveTab(tabItem);
				setEditorContent(fileName);
			}
		}
	});
}

// Helper function to close a tab
function closeTab(tabToClose) {
	const tabBar = document.querySelector("editor-well tab-bar");
	if (!tabBar || !tabToClose) return;

	const isActive = tabToClose.hasAttribute("active");
	const allTabs = Array.from(tabBar.querySelectorAll("tab-item:not([type='fill-end'])"));
	const tabIndex = allTabs.indexOf(tabToClose);

	// Remove the tab
	tabToClose.remove();

	// If the closed tab was active, activate another tab
	if (isActive) {
		const remainingTabs = Array.from(tabBar.querySelectorAll("tab-item:not([type='fill-end'])"));
		if (remainingTabs.length > 0) {
			// Try to activate the tab at the same position, or the last one
			const newActiveIndex = Math.min(tabIndex, remainingTabs.length - 1);
			const newActiveTab = remainingTabs[newActiveIndex];
			if (newActiveTab instanceof HTMLElement) {
				setActiveTab(newActiveTab);
				const fileName = newActiveTab.querySelector(".filename")?.textContent.trim();
				if (fileName && fileCodeExamples[fileName]) {
					setEditorContent(fileName);
				}
			}
		}
	}
}

// Initialize results file item expand/collapse toggle in chat-sessions panel
function initResultsFileItemToggle() {
	const resultsPanel = document.querySelector("results-panel");
	if (!resultsPanel) return;

	resultsPanel.addEventListener("click", (e) => {
		// Handle both HTMLElement and SVGElement targets
		const target = e.target instanceof Element ? e.target : null;
		if (!target) return;

		// Check if clicking on a file header or the expand icon
		const fileHeader = target.closest("results-file-header");
		const expandIcon = target.closest(".expand-icon");

		if (!fileHeader && !expandIcon) return;

		// Find the parent results-file-item
		const fileItem = (fileHeader || expandIcon)?.closest("results-file-item");
		if (!(fileItem instanceof HTMLElement)) return;

		// Toggle expanded state
		const isExpanded = fileItem.hasAttribute("expanded");
		if (isExpanded) {
			fileItem.removeAttribute("expanded");
		} else {
			fileItem.setAttribute("expanded", "");
		}
	});
}

// Initialize changed files widget expand/collapse toggle in chat thread
function initChangedFilesWidgetToggle() {
	const chatThread = document.querySelector("chat-thread");
	if (!chatThread) return;

	chatThread.addEventListener("click", (e) => {
		// Handle both HTMLElement and SVGElement targets
		const target = e.target instanceof Element ? e.target : null;
		if (!target) return;

		// Check if clicking on a changed-file-header or its children
		const fileHeader = target.closest("changed-file-header");
		if (!fileHeader) return;

		// Find the parent changed-file-item
		const fileItem = fileHeader.closest("changed-file-item");
		if (!(fileItem instanceof HTMLElement)) return;

		// Toggle expanded state
		const isExpanded = fileItem.hasAttribute("expanded");
		if (isExpanded) {
			fileItem.removeAttribute("expanded");
		} else {
			fileItem.setAttribute("expanded", "");
		}
	});
}

// Initialize collapse/expand all button in results panel
function initCollapseAllButton() {
	const resultsPanel = document.querySelector("results-panel");
	if (!resultsPanel) return;

	const collapseButton = resultsPanel.querySelector("collapse-button");
	if (!collapseButton) return;

	collapseButton.addEventListener("click", () => {
		const fileItems = resultsPanel.querySelectorAll("results-file-item");
		if (fileItems.length === 0) return;

		// Check if any items are currently expanded
		const hasExpandedItems = Array.from(fileItems).some((item) => item.hasAttribute("expanded"));

		// Toggle all items: if any are expanded, collapse all; otherwise expand all
		fileItems.forEach((item) => {
			if (hasExpandedItems) {
				item.removeAttribute("expanded");
			} else {
				item.setAttribute("expanded", "");
			}
		});

		// Update button text based on new state
		const textNode = Array.from(collapseButton.childNodes).find(
			(node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
		);
		if (textNode) {
			textNode.textContent = hasExpandedItems
				? "\n\t\t\t\t\t\tExpand all\n\t\t\t\t\t"
				: "\n\t\t\t\t\t\tCollapse all\n\t\t\t\t\t";
		}

		// Update icon rotation to indicate state
		const svg = collapseButton.querySelector("svg");
		if (svg) {
			svg.style.transform = hasExpandedItems ? "rotate(180deg)" : "";
		}
	});
}

// Initialize toggle for primary sidebar visibility via layout-left top bar icon
function initSessionListToggle() {
	const layoutLeftIcon = document.querySelector("top-bar-icon.layout-left");
	const primarySidebar = document.querySelector("primary-side-bar");

	if (!layoutLeftIcon || !primarySidebar) return;

	layoutLeftIcon.addEventListener("click", () => {
		primarySidebar.classList.toggle("collapsed");
	});
}

// Initialize toggle for chat-sessions visibility via chat-sessions top bar icon
function initChatSessionsToggle() {
	const chatSessionsIcon = document.querySelector("top-bar-icon.chat-sessions");
	const chatSessions = document.querySelector("chat-sessions");

	if (!chatSessionsIcon || !chatSessions) return;

	chatSessionsIcon.addEventListener("click", () => {
		const isHidden = chatSessions.hasAttribute("hidden");
		if (isHidden) {
			showChatSessions();
		} else {
			hideChatSessions();
		}
	});
}

// Initialize handler for "Open in Editor" events from chat-sessions
function initOpenInEditorHandler() {
	document.addEventListener("open-file-in-editor", (e) => {
		const { fileName } = e.detail;
		if (!fileName || !fileCodeExamples[fileName]) return;

		// Hide chat sessions view
		hideChatSessions();

		// Open file in tab bar and set as active
		openFileInTabBar(fileName);

		// Update editor content
		setEditorContent(fileName);

		// Update tree view to highlight the file
		updateTreeViewActiveFile(fileName);
	});
}

// Initialize handler for project switch events from chat-sessions
function initProjectSwitchHandler() {
	document.addEventListener("project-switched", (e) => {
		const { projectId } = e.detail;
		if (!projectId) return;

		// Re-render the tree view for the new project
		renderTreeView(projectId);

		// Find the first file with code and set it as active
		const project = chatSessionsData.projects.find((p) => p.id === projectId);
		if (project && project.fileTree) {
			const firstFileWithCode = findFirstFileWithCode(project.fileTree);
			if (firstFileWithCode && fileCodeExamples[firstFileWithCode]) {
				// Clear all tabs and add the new file
				clearAllTabs();
				openFileInTabBar(firstFileWithCode);
				setEditorContent(firstFileWithCode);
				updateTreeViewActiveFile(firstFileWithCode);
			}
		}
	});
}

/**
 * Find the first file in the tree that has a codeFile property
 * @param {Array} items - Array of tree items to search
 * @returns {string|null} The codeFile name of the first file found, or null
 */
function findFirstFileWithCode(items) {
	for (const item of items) {
		if (item.type === "file" && item.codeFile) {
			return item.codeFile;
		}
		if (item.type === "folder" && item.children) {
			const found = findFirstFileWithCode(item.children);
			if (found) return found;
		}
	}
	return null;
}

/**
 * Clear all tabs from the tab bar
 */
function clearAllTabs() {
	const tabBar = document.querySelector("editor-well tab-bar");
	if (!tabBar) return;

	const allTabs = tabBar.querySelectorAll("tab-item:not([type='fill-end'])");
	allTabs.forEach((tab) => tab.remove());
}

function formatCountLabel(count, singular, plural) {
	return `${count} ${count === 1 ? singular : plural}`;
}

function updateFloatingChatWorkspaceCounts() {
	const floatingChatInput = document.querySelector("floating-chat-input");
	const sessionsIndicator = document.getElementById("sessions-indicator");
	if (!floatingChatInput || !sessionsIndicator) return;

	const workspacePills = Array.from(floatingChatInput.querySelectorAll("workspace-pill"));
	const projectCounts = new Map(
		chatSessionsData.projects.map((project) => [project.id, project.sessions?.length ?? 0]),
	);

	workspacePills.forEach((pill) => {
		const workspaceId = pill.getAttribute("data-workspace") || "";
		const sessionCount = projectCounts.get(workspaceId) ?? 0;

		let badge = pill.querySelector(".session-badge");
		if (sessionCount === 0) {
			if (badge) badge.remove();
			return;
		}

		if (!badge) {
			badge = document.createElement("span");
			badge.className = "session-badge";
			const workspaceName = pill.querySelector(".workspace-name");
			if (workspaceName) {
				workspaceName.insertAdjacentElement("afterend", badge);
			} else {
				pill.appendChild(badge);
			}
		}

		badge.textContent = String(sessionCount);
	});

	const totalSessions = chatSessionsData.projects.reduce(
		(total, project) => total + (project.sessions?.length ?? 0),
		0,
	);
	const workspaceCount = workspacePills.length;
	const sessionCountEl = sessionsIndicator.querySelector(".session-count");
	if (sessionCountEl) {
		const sessionLabel = formatCountLabel(totalSessions, "active session", "active sessions");
		const workspaceLabel = formatCountLabel(workspaceCount, "workspace", "workspaces");
		sessionCountEl.textContent = `${sessionLabel} · ${workspaceLabel}`;
	}
}

// Initialize floating chat input toggle and workspace switching
function initFloatingChatInput() {
	const sessionsIndicator = document.getElementById("sessions-indicator");
	const floatingChatInput = document.querySelector("floating-chat-input");

	if (!sessionsIndicator || !floatingChatInput) return;

	updateFloatingChatWorkspaceCounts();

	// Helper: Get current state
	const getState = () => parseInt(floatingChatInput.getAttribute("data-state") || "1", 10);

	// Helper: Set state
	const setState = (state) => {
		floatingChatInput.setAttribute("data-state", String(state));
	};

	// Helper: Close floating chat and reset state
	const closeFloatingChat = () => {
		// Add closing class to trigger slide-down + fade animation
		floatingChatInput.classList.add("closing");
		sessionsIndicator.removeAttribute("expanded");

		// Wait for animation to complete before hiding
		setTimeout(() => {
			floatingChatInput.setAttribute("hidden", "");
			floatingChatInput.classList.remove("closing");
			// Reset to State 1 after close animation
			setState(1);
		}, 250);
	};

	// Helper: Render session picker list for a workspace
	const renderSessionPicker = (workspaceId) => {
		const sessionPickerList = floatingChatInput.querySelector("session-picker-list");
		const pickerTitle = floatingChatInput.querySelector(".picker-title");
		if (!sessionPickerList) return;

		const project = chatSessionsData.projects.find((p) => p.id === workspaceId);
		if (!project || !project.sessions) {
			sessionPickerList.innerHTML =
				'<div style="padding: 16px; color: var(--vscode-foreground-secondary); font-size: 13px;">No active sessions</div>';
			return;
		}

		// Update title
		if (pickerTitle) {
			pickerTitle.textContent = "Workspace Chat Sessions";
		}

		sessionPickerList.innerHTML = project.sessions
			.map(
				(session) => `
			<picker-session-item data-session-id="${session.id}" data-workspace-id="${workspaceId}">
				<span class="session-icon">
					<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
						<path d="M1 2.75C1 1.784 1.784 1 2.75 1H10.25C10.664 1 11 1.336 11 1.75C11 2.164 10.664 2.5 10.25 2.5H2.75C2.612 2.5 2.5 2.612 2.5 2.75V10.25C2.5 10.664 2.164 11 1.75 11C1.336 11 1 10.664 1 10.25V2.75ZM4 5.75C4 4.784 4.784 4 5.75 4H13.25C14.216 4 15 4.784 15 5.75V13.25C15 14.216 14.216 15 13.25 15H5.75C4.784 15 4 14.216 4 13.25V5.75ZM5.75 5.5C5.612 5.5 5.5 5.612 5.5 5.75V13.25C5.5 13.388 5.612 13.5 5.75 13.5H13.25C13.388 13.5 13.5 13.388 13.5 13.25V5.75C13.5 5.612 13.388 5.5 13.25 5.5H5.75Z"/>
					</svg>
				</span>
				<span class="session-info">
					<span class="session-title">${session.title}</span>
					<span class="session-meta">
						<span class="time-ago">${session.meta.timeAgo}</span>
						<span class="stats">
							<span class="additions">+${session.meta.additions}</span>
							<span class="deletions">-${session.meta.deletions}</span>
						</span>
					</span>
				</span>
			</picker-session-item>
		`,
			)
			.join("");
	};

	// Helper: Render session detail
	const renderSessionDetail = (workspaceId, sessionId) => {
		const detailContent = floatingChatInput.querySelector("session-detail-content");
		const detailTitle = floatingChatInput.querySelector(".detail-title");
		if (!detailContent) return;

		const project = chatSessionsData.projects.find((p) => p.id === workspaceId);
		if (!project) return;

		const session = project.sessions?.find((s) => s.id === sessionId);
		if (!session) return;

		// Update title
		if (detailTitle) {
			detailTitle.textContent = session.title;
		}

		// Build thread preview HTML (limited items)
		let html = `<detail-prompt>${session.prompt}</detail-prompt>`;

		const threadItems = session.thread || [];
		const maxItems = 6; // Limit displayed items

		threadItems.slice(0, maxItems).forEach((item) => {
			switch (item.type) {
				case "response":
					html += `<detail-response>${item.content}</detail-response>`;
					break;
				case "status":
					html += `
						<detail-status>
							<svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
								<path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM7.25 4.75C7.25 4.33579 7.58579 4 8 4C8.41421 4 8.75 4.33579 8.75 4.75V8.25C8.75 8.66421 8.41421 9 8 9C7.58579 9 7.25 8.66421 7.25 8.25V4.75ZM8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94772 7.44772 9.5 8 9.5C8.55228 9.5 9 9.94772 9 10.5C9 11.0523 8.55228 11.5 8 11.5Z"/>
							</svg>
							${item.content}
						</detail-status>
					`;
					break;
				case "file-edit":
					html += `
						<detail-file-change>
							<span class="file-name">${item.fileName}</span>
							<span class="file-stats">
								<span class="additions">+${item.additions}</span>
								<span class="deletions">-${item.deletions}</span>
							</span>
						</detail-file-change>
					`;
					break;
			}
		});

		if (threadItems.length > maxItems) {
			html += `<div style="padding: 6px 0; font-size: 12px; color: var(--vscode-foreground-secondary);">+ ${threadItems.length - maxItems} more items...</div>`;
		}

		detailContent.innerHTML = html;
	};

	// Helper: Render embedded session list for State 4
	const renderEmbeddedSessionList = (workspaceId) => {
		const sessionListItems = floatingChatInput.querySelector(
			"embedded-session-list session-list-items",
		);
		if (!sessionListItems) return;

		const project = chatSessionsData.projects.find((p) => p.id === workspaceId);
		if (!project || !project.sessions) {
			sessionListItems.innerHTML =
				'<div style="padding: 16px; color: var(--vscode-foreground-secondary); font-size: 13px;">No active sessions</div>';
			return;
		}

		sessionListItems.innerHTML = project.sessions
			.map(
				(session, index) => `
			<session-item data-session-id="${session.id}" data-workspace-id="${workspaceId}" ${index === 0 ? "active" : ""}>
				<session-item-icon>
					<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
						<path d="M1 2.75C1 1.784 1.784 1 2.75 1H10.25C10.664 1 11 1.336 11 1.75C11 2.164 10.664 2.5 10.25 2.5H2.75C2.612 2.5 2.5 2.612 2.5 2.75V10.25C2.5 10.664 2.164 11 1.75 11C1.336 11 1 10.664 1 10.25V2.75ZM4 5.75C4 4.784 4.784 4 5.75 4H13.25C14.216 4 15 4.784 15 5.75V13.25C15 14.216 14.216 15 13.25 15H5.75C4.784 15 4 14.216 4 13.25V5.75ZM5.75 5.5C5.612 5.5 5.5 5.612 5.5 5.75V13.25C5.5 13.388 5.612 13.5 5.75 13.5H13.25C13.388 13.5 13.5 13.388 13.5 13.25V5.75C13.5 5.612 13.388 5.5 13.25 5.5H5.75Z"/>
					</svg>
				</session-item-icon>
				<session-item-content>
					<session-item-title>${session.title}</session-item-title>
					<session-item-meta>
						<span class="time-ago">${session.meta.timeAgo}</span>
						<span class="additions">+${session.meta.additions}</span>
						<span class="deletions">-${session.meta.deletions}</span>
					</session-item-meta>
				</session-item-content>
			</session-item>
		`,
			)
			.join("");

		// Render first session's thread by default
		if (project.sessions.length > 0) {
			renderEmbeddedChatThread(workspaceId, project.sessions[0].id);
		}
	};

	// SVG Icons for chat thread
	const ICONS = {
		checkmark: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
			<path d="M13.6572 3.13573C13.8583 2.9465 14.175 2.95614 14.3643 3.15722C14.5535 3.35831 14.5438 3.675 14.3428 3.86425L5.84277 11.8642C5.64597 12.0494 5.33756 12.0446 5.14648 11.8535L1.64648 8.35351C1.45121 8.15824 1.45121 7.84174 1.64648 7.64647C1.84174 7.45121 2.15825 7.45121 2.35351 7.64647L5.50976 10.8027L13.6572 3.13573Z"/>
		</svg>`,
		expandIcon: `<svg class="expand-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
			<path d="M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z"/>
		</svg>`,
		fileIcon: `<svg class="file-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
			<path d="M5 1C3.89543 1 3 1.89543 3 3V13C3 14.1046 3.89543 15 5 15H11C12.1046 15 13 14.1046 13 13V5.41421C13 5.01639 12.842 4.63486 12.5607 4.35355L9.64645 1.43934C9.36514 1.15804 8.98361 1 8.58579 1H5ZM4 3C4 2.44772 4.44772 2 5 2H8V4.5C8 5.32843 8.67157 6 9.5 6H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V3ZM11.7929 5H9.5C9.22386 5 9 4.77614 9 4.5V2.20711L11.7929 5Z"/>
		</svg>`,
	};

	// Helper: Render a thread item with proper chat elements
	const renderThreadItem = (item) => {
		switch (item.type) {
			case "response":
				return `<chat-response>${item.content}</chat-response>`;
			case "status":
				return `<chat-response-status>${ICONS.checkmark}${item.content}</chat-response-status>`;
			case "file-edit":
				return `<chat-response-file>
					${ICONS.checkmark}
					Edited 
					<span>
						${item.fileName} <apply-patch-number type="add">+${item.additions}</apply-patch-number>
						<apply-patch-number type="remove">-${item.deletions}</apply-patch-number>
					</span>
				</chat-response-file>`;
			case "response-list":
				let listHtml = "<chat-response><ul>";
				item.items.forEach((listItem) => {
					if (listItem.file) {
						listHtml += `<li><chat-response-file><span>${listItem.file}</span></chat-response-file>: ${listItem.description}</li>`;
					} else if (listItem.text) {
						listHtml += `<li>${listItem.text}</li>`;
					}
				});
				listHtml += "</ul></chat-response>";
				return listHtml;
			default:
				return "";
		}
	};

	// Helper: Render embedded chat thread for State 4
	const renderEmbeddedChatThread = (workspaceId, sessionId) => {
		const threadContent = floatingChatInput.querySelector("embedded-thread-content");
		if (!threadContent) return;

		const project = chatSessionsData.projects.find((p) => p.id === workspaceId);
		if (!project) return;

		const session = project.sessions?.find((s) => s.id === sessionId);
		if (!session) return;

		// Build full thread HTML using proper chat elements
		let html = "";

		// Check if session uses the new multi-prompt format
		if (session.prompts && Array.isArray(session.prompts)) {
			session.prompts.forEach((promptData) => {
				html += `<chat-prompt>${promptData.prompt}</chat-prompt>`;
				promptData.thread.forEach((item) => {
					html += renderThreadItem(item);
				});
			});
		} else {
			// Handle legacy single-prompt format
			html += `<chat-prompt>${session.prompt}</chat-prompt>`;
			const threadItems = session.thread || [];
			threadItems.forEach((item) => {
				html += renderThreadItem(item);
			});
		}

		threadContent.innerHTML = html;

		// Also render the results panel
		renderEmbeddedResultsPanel(workspaceId, sessionId);
	};

	// Helper: Render embedded results panel for State 4
	const renderEmbeddedResultsPanel = (workspaceId, sessionId) => {
		const resultsPanelContent = floatingChatInput.querySelector("results-panel-content");
		if (!resultsPanelContent) return;

		const project = chatSessionsData.projects.find((p) => p.id === workspaceId);
		if (!project) return;

		const session = project.sessions?.find((s) => s.id === sessionId);
		if (!session || !session.changedFiles) return;

		let html = "";

		session.changedFiles.forEach((file) => {
			const hasCodeFile = file.codeFile ? `data-code-file="${file.codeFile}"` : "";
			html += `
				<results-file-item expanded ${hasCodeFile}>
					<results-file-header>
						${ICONS.expandIcon}
						${ICONS.fileIcon}
						<span class="file-path">${file.filePath}</span>
						<span class="file-stats">
							<span class="additions">+${file.additions}</span>
							<span class="deletions">-${file.deletions}</span>
						</span>
					</results-file-header>
					<results-file-diff>
						${file.diff
							.map(
								(line) =>
									`<diff-line type="${line.type}"><line-number>${line.lineNumber}</line-number><line-content>${escapeHtml(line.content)}</line-content></diff-line>`,
							)
							.join("")}
					</results-file-diff>
				</results-file-item>
			`;
		});

		resultsPanelContent.innerHTML = html;
	};

	// Helper: Escape HTML entities
	const escapeHtml = (text) => {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	};

	// Toggle floating chat input when clicking sessions indicator
	sessionsIndicator.addEventListener("click", (e) => {
		e.stopPropagation();
		const isHidden = floatingChatInput.hasAttribute("hidden");

		if (isHidden) {
			floatingChatInput.removeAttribute("hidden");
			sessionsIndicator.setAttribute("expanded", "");
			setState(1);
		} else {
			closeFloatingChat();
		}
	});

	// Close on Escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && !floatingChatInput.hasAttribute("hidden")) {
			const currentState = getState();

			if (currentState === 4) {
				// Go back to State 2 from full canvas
				const workspaceId = floatingChatInput.getAttribute("data-current-workspace");
				if (workspaceId) {
					renderSessionPicker(workspaceId);
				}
				setState(2);
			} else if (currentState === 3) {
				// Go back to State 2
				setState(2);
			} else if (currentState === 2) {
				// Go back to State 1
				setState(1);
			} else {
				// Close completely from State 1
				closeFloatingChat();
			}
		}
	});

	// Handle clicks inside floating chat input
	floatingChatInput.addEventListener("click", (e) => {
		const target = e.target instanceof Element ? e.target : null;
		if (!target) return;

		// Handle view-sessions-icon click (chevron) - shows session list without switching workspace
		const viewSessionsIcon = target.closest(".view-sessions-icon");
		if (viewSessionsIcon) {
			e.stopPropagation();

			const workspacePill = viewSessionsIcon.closest("workspace-pill");
			if (workspacePill) {
				// Update active state
				const allPills = floatingChatInput.querySelectorAll("workspace-pill");
				allPills.forEach((p) => p.removeAttribute("active"));
				workspacePill.setAttribute("active", "");

				const workspaceId = workspacePill.getAttribute("data-workspace");
				if (workspaceId) {
					floatingChatInput.setAttribute("data-current-workspace", workspaceId);

					// Update cmd-palette-button text in top-bar
					const workspaceName = workspacePill.querySelector(".workspace-name")?.textContent || workspaceId;
					const cmdPaletteButton = document.querySelector("cmd-palette-button");
					if (cmdPaletteButton) {
						// Preserve the search icon SVG and update only the text
						const svgIcon = cmdPaletteButton.querySelector("svg");
						cmdPaletteButton.textContent = "";
						if (svgIcon) {
							cmdPaletteButton.appendChild(svgIcon);
						}
						cmdPaletteButton.appendChild(document.createTextNode(workspaceName));
					}

					renderSessionPicker(workspaceId);
					setState(2);
				}
			}
			return;
		}

		// Handle workspace pill click (body only, not chevron) - switches workspace only
		const workspacePill = target.closest("workspace-pill");
		if (workspacePill && !target.closest(".view-sessions-icon")) {
			e.stopPropagation();

			// Update active state
			const allPills = floatingChatInput.querySelectorAll("workspace-pill");
			allPills.forEach((p) => p.removeAttribute("active"));
			workspacePill.setAttribute("active", "");

			// Get workspace ID
			const workspaceId = workspacePill.getAttribute("data-workspace");
			if (workspaceId) {
				// Store current workspace
				floatingChatInput.setAttribute("data-current-workspace", workspaceId);

				// Update cmd-palette-button text in top-bar
				const workspaceName = workspacePill.querySelector(".workspace-name")?.textContent || workspaceId;
				const cmdPaletteButton = document.querySelector("cmd-palette-button");
				if (cmdPaletteButton) {
					// Preserve the search icon SVG and update only the text
					const svgIcon = cmdPaletteButton.querySelector("svg");
					cmdPaletteButton.textContent = "";
					if (svgIcon) {
						cmdPaletteButton.appendChild(svgIcon);
					}
					cmdPaletteButton.appendChild(document.createTextNode(workspaceName));
				}

				// Trigger project switch for code editor (but don't open session picker)
				const project = chatSessionsData.projects.find((p) => p.id === workspaceId);
				if (project) {
					document.dispatchEvent(
						new CustomEvent("project-switched", { detail: { projectId: workspaceId } }),
					);
					renderTreeView(workspaceId);
				}
			}
			return;
		}

		// Handle session item click in State 2 - transitions to State 3
		const sessionItem = target.closest("picker-session-item");
		if (sessionItem) {
			e.stopPropagation();

			const sessionId = sessionItem.getAttribute("data-session-id");
			const workspaceId = sessionItem.getAttribute("data-workspace-id");

			if (sessionId && workspaceId) {
				floatingChatInput.setAttribute("data-current-session", sessionId);
				renderSessionDetail(workspaceId, sessionId);
				setState(3);
			}
			return;
		}

		// Handle embedded session item click in State 4
		const embeddedSessionItem = target.closest("embedded-session-list session-item");
		if (embeddedSessionItem) {
			e.stopPropagation();

			// Update active state
			const allItems = floatingChatInput.querySelectorAll("embedded-session-list session-item");
			allItems.forEach((item) => item.removeAttribute("active"));
			embeddedSessionItem.setAttribute("active", "");

			const sessionId = embeddedSessionItem.getAttribute("data-session-id");
			const workspaceId = embeddedSessionItem.getAttribute("data-workspace-id");

			if (sessionId && workspaceId) {
				floatingChatInput.setAttribute("data-current-session", sessionId);
				renderEmbeddedChatThread(workspaceId, sessionId);
			}
			return;
		}

		// Handle embedded results panel file item toggle
		const embeddedResultsFileHeader = target.closest("embedded-results-panel results-file-header");
		const embeddedExpandIcon = target.closest("embedded-results-panel .expand-icon");
		if (embeddedResultsFileHeader || embeddedExpandIcon) {
			e.stopPropagation();
			const fileItem = (embeddedResultsFileHeader || embeddedExpandIcon)?.closest(
				"results-file-item",
			);
			if (fileItem instanceof HTMLElement) {
				const isExpanded = fileItem.hasAttribute("expanded");
				if (isExpanded) {
					fileItem.removeAttribute("expanded");
				} else {
					fileItem.setAttribute("expanded", "");
				}
			}
			return;
		}

		// Handle session picker back button - go to State 1
		const pickerBackButton = target.closest(".session-picker-back");
		if (pickerBackButton) {
			e.stopPropagation();
			setState(1);
			return;
		}

		// Handle session detail back button - go to State 2
		const detailBackButton = target.closest(".session-detail-back");
		if (detailBackButton) {
			e.stopPropagation();
			const workspaceId = floatingChatInput.getAttribute("data-current-workspace");
			if (workspaceId) {
				renderSessionPicker(workspaceId);
			}
			setState(2);
			return;
		}

		// Handle expand to canvas button - State 4 with animation
		const expandButton = target.closest("expand-canvas-button");
		if (expandButton) {
			e.stopPropagation();
			const workspaceId = floatingChatInput.getAttribute("data-current-workspace");
			if (workspaceId) {
				// Get the current bounding rect before state change
				const container = floatingChatInput.querySelector("floating-chat-container");
				const startRect = container.getBoundingClientRect();
				const vsCode = document.querySelector("vs-code");
				const vsCodeRect = vsCode.getBoundingClientRect();

				// Calculate start position relative to vs-code container
				const startTop = startRect.top - vsCodeRect.top;
				const startLeft = startRect.left - vsCodeRect.left;
				const startWidth = startRect.width;
				const startHeight = startRect.height;

				// Set CSS custom properties for animation start position
				floatingChatInput.style.setProperty("--expand-start-top", `${startTop}px`);
				floatingChatInput.style.setProperty("--expand-start-left", `${startLeft}px`);
				floatingChatInput.style.setProperty("--expand-start-width", `${startWidth}px`);
				floatingChatInput.style.setProperty("--expand-start-height", `${startHeight}px`);

				// Add expanding class for animation
				floatingChatInput.classList.add("expanding-to-canvas");

				// Render content
				renderEmbeddedSessionList(workspaceId);

				// Trigger state change
				setState(4);

				// Remove animation class after transition completes
				setTimeout(() => {
					floatingChatInput.classList.remove("expanding-to-canvas");
				}, 450);
			}
			return;
		}

		// Handle collapse canvas button - return to State 2 with animation
		const collapseButton = target.closest("collapse-canvas-button");
		if (collapseButton) {
			e.stopPropagation();
			const workspaceId = floatingChatInput.getAttribute("data-current-workspace");
			if (workspaceId) {
				// Add collapsing class for animation
				floatingChatInput.classList.add("collapsing-from-canvas");

				// Wait for collapse animation to mostly complete, then change state
				setTimeout(() => {
					setState(2);
					// Render session picker for the new state
					renderSessionPicker(workspaceId);

					// Clean up animation class after state change
					setTimeout(() => {
						floatingChatInput.classList.remove("collapsing-from-canvas");
					}, 50);
				}, 250);
			}
			return;
		}

		// Handle new session button - opens workspace picker
		const newSessionBtn = target.closest("new-session-button");
		if (newSessionBtn) {
			e.stopPropagation();
			// Open the workspace picker instead of going to State 4
			showWorkspacePicker();
			return;
		}
	});

	// Initialize resize functionality for embedded panels in State 4
	initEmbeddedPanelsResize();

	function initEmbeddedPanelsResize() {
		const sessionList = floatingChatInput.querySelector("embedded-session-list");
		const chatThread = floatingChatInput.querySelector("embedded-chat-thread");
		const resultsPanel = floatingChatInput.querySelector("embedded-results-panel");

		if (!sessionList || !chatThread || !resultsPanel) return;

		const RESIZE_HANDLE_WIDTH = 6;

		// --- Embedded Session List Resize (right edge) ---
		let isResizingSessionList = false;
		let sessionListStartX = 0;
		let sessionListStartWidth = 0;

		sessionList.addEventListener("mousemove", (e) => {
			if (isResizingSessionList) return;
			const rect = sessionList.getBoundingClientRect();
			const offsetX = rect.right - e.clientX;

			if (offsetX <= RESIZE_HANDLE_WIDTH) {
				sessionList.classList.add("resize-hover");
			} else {
				sessionList.classList.remove("resize-hover");
			}
		});

		sessionList.addEventListener("mouseleave", () => {
			if (!isResizingSessionList) {
				sessionList.classList.remove("resize-hover");
			}
		});

		sessionList.addEventListener("mousedown", (e) => {
			const rect = sessionList.getBoundingClientRect();
			const offsetX = rect.right - e.clientX;

			if (offsetX <= RESIZE_HANDLE_WIDTH) {
				isResizingSessionList = true;
				sessionListStartX = e.clientX;
				sessionListStartWidth = rect.width;
				sessionList.classList.add("resizing");
				document.body.style.cursor = "ew-resize";
				document.body.style.userSelect = "none";
				e.preventDefault();
			}
		});

		// --- Embedded Results Panel Resize (left edge) ---
		let isResizingResultsPanel = false;
		let resultsPanelStartX = 0;
		let resultsPanelStartWidth = 0;

		resultsPanel.addEventListener("mousemove", (e) => {
			if (isResizingResultsPanel) return;
			const rect = resultsPanel.getBoundingClientRect();
			const offsetX = e.clientX - rect.left;

			if (offsetX <= RESIZE_HANDLE_WIDTH) {
				resultsPanel.classList.add("resize-hover");
			} else {
				resultsPanel.classList.remove("resize-hover");
			}
		});

		resultsPanel.addEventListener("mouseleave", () => {
			if (!isResizingResultsPanel) {
				resultsPanel.classList.remove("resize-hover");
			}
		});

		resultsPanel.addEventListener("mousedown", (e) => {
			const rect = resultsPanel.getBoundingClientRect();
			const offsetX = e.clientX - rect.left;

			if (offsetX <= RESIZE_HANDLE_WIDTH) {
				isResizingResultsPanel = true;
				resultsPanelStartX = e.clientX;
				resultsPanelStartWidth = rect.width;
				resultsPanel.classList.add("resizing");
				document.body.style.cursor = "ew-resize";
				document.body.style.userSelect = "none";
				e.preventDefault();
			}
		});

		// --- Embedded Chat Thread Resize (right edge, between chat-thread and results-panel) ---
		let isResizingChatThread = false;
		let chatThreadStartX = 0;
		let resultsPanelStartWidthForChatThread = 0;

		chatThread.addEventListener("mousemove", (e) => {
			if (isResizingChatThread) return;
			const rect = chatThread.getBoundingClientRect();
			const offsetX = rect.right - e.clientX;

			if (offsetX <= RESIZE_HANDLE_WIDTH) {
				chatThread.classList.add("resize-hover");
			} else {
				chatThread.classList.remove("resize-hover");
			}
		});

		chatThread.addEventListener("mouseleave", () => {
			if (!isResizingChatThread) {
				chatThread.classList.remove("resize-hover");
			}
		});

		chatThread.addEventListener("mousedown", (e) => {
			const rect = chatThread.getBoundingClientRect();
			const offsetX = rect.right - e.clientX;

			if (offsetX <= RESIZE_HANDLE_WIDTH) {
				isResizingChatThread = true;
				chatThreadStartX = e.clientX;
				resultsPanelStartWidthForChatThread = resultsPanel.getBoundingClientRect().width;
				chatThread.classList.add("resizing");
				document.body.style.cursor = "ew-resize";
				document.body.style.userSelect = "none";
				e.preventDefault();
			}
		});

		// --- Global mousemove handler for all embedded resize operations ---
		document.addEventListener("mousemove", (e) => {
			const containerRect = floatingChatInput.getBoundingClientRect();
			const minWidth = 180;
			const minChatThreadWidth = 200;
			const minResultsWidth = 250;

			if (isResizingSessionList) {
				const deltaX = e.clientX - sessionListStartX;
				const newWidth = sessionListStartWidth + deltaX;
				const maxWidth = containerRect.width * 0.4;

				if (newWidth >= minWidth && newWidth <= maxWidth) {
					sessionList.style.width = `${newWidth}px`;
				}
			}

			if (isResizingResultsPanel) {
				const deltaX = resultsPanelStartX - e.clientX;
				const newWidth = resultsPanelStartWidth + deltaX;
				const maxWidth = containerRect.width * 0.6;

				if (newWidth >= minResultsWidth && newWidth <= maxWidth) {
					resultsPanel.style.width = `${newWidth}px`;
				}
			}

			if (isResizingChatThread) {
				const deltaX = e.clientX - chatThreadStartX;
				// Expand chat thread = shrink results panel
				const newResultsWidth = resultsPanelStartWidthForChatThread - deltaX;
				const maxResultsWidth = containerRect.width * 0.6;

				if (newResultsWidth >= minResultsWidth && newResultsWidth <= maxResultsWidth) {
					resultsPanel.style.width = `${newResultsWidth}px`;
				}
			}
		});

		// --- Global mouseup handler to end all embedded resize operations ---
		document.addEventListener("mouseup", () => {
			if (isResizingSessionList) {
				isResizingSessionList = false;
				sessionList.classList.remove("resizing");
				sessionList.classList.remove("resize-hover");
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			}

			if (isResizingResultsPanel) {
				isResizingResultsPanel = false;
				resultsPanel.classList.remove("resizing");
				resultsPanel.classList.remove("resize-hover");
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			}

			if (isResizingChatThread) {
				isResizingChatThread = false;
				chatThread.classList.remove("resizing");
				chatThread.classList.remove("resize-hover");
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			}
		});
	}

	// Initialize resize functionality for floating chat input right edge (between chat and editor in State 4)
	initFloatingChatEditorResize();

	function initFloatingChatEditorResize() {
		const vsCode = document.querySelector("vs-code");
		const editorWell = document.querySelector("editor-well");
		if (!floatingChatInput || !editorWell || !vsCode) return;

		const RESIZE_HANDLE_WIDTH = 6;
		let isResizingEditor = false;
		let startX = 0;
		let startEditorWidth = 0;

		// Track mouse position on floating chat input right edge
		floatingChatInput.addEventListener("mousemove", (e) => {
			const state = floatingChatInput.getAttribute("data-state");
			if (state !== "4" || floatingChatInput.hidden || isResizingEditor) return;

			const rect = floatingChatInput.getBoundingClientRect();
			const offsetX = rect.right - e.clientX;

			if (offsetX <= RESIZE_HANDLE_WIDTH) {
				floatingChatInput.classList.add("resize-hover");
			} else {
				floatingChatInput.classList.remove("resize-hover");
			}
		});

		floatingChatInput.addEventListener("mouseleave", () => {
			if (!isResizingEditor) {
				floatingChatInput.classList.remove("resize-hover");
			}
		});

		floatingChatInput.addEventListener("mousedown", (e) => {
			const state = floatingChatInput.getAttribute("data-state");
			if (state !== "4" || floatingChatInput.hidden) return;

			const rect = floatingChatInput.getBoundingClientRect();
			const offsetX = rect.right - e.clientX;

			if (offsetX <= RESIZE_HANDLE_WIDTH) {
				isResizingEditor = true;
				startX = e.clientX;
				startEditorWidth = editorWell.getBoundingClientRect().width;
				floatingChatInput.classList.add("resizing");
				document.body.style.cursor = "ew-resize";
				document.body.style.userSelect = "none";
				e.preventDefault();
			}
		});

		document.addEventListener("mousemove", (e) => {
			if (!isResizingEditor) return;

			const deltaX = startX - e.clientX; // Moving left increases editor width
			const newEditorWidth = startEditorWidth + deltaX;

			const mainArea = document.querySelector(".main-area");
			const mainAreaWidth = mainArea ? mainArea.getBoundingClientRect().width : window.innerWidth;

			// Set min and max width constraints for editor
			const minEditorWidth = 200;
			const maxEditorWidth = mainAreaWidth * 0.6;

			if (newEditorWidth >= minEditorWidth && newEditorWidth <= maxEditorWidth) {
				// Convert to percentage for grid template
				const editorPercent = (newEditorWidth / mainAreaWidth) * 100;
				vsCode.style.setProperty("--state4-editor-width", `${editorPercent}%`);
			}
		});

		document.addEventListener("mouseup", () => {
			if (isResizingEditor) {
				isResizingEditor = false;
				floatingChatInput.classList.remove("resizing");
				floatingChatInput.classList.remove("resize-hover");
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			}
		});
	}
}

initVsCodeHeroTabs();
initMonacoEditor();
initSecondarySidebarResize();
initPrimarySidebarResize();
initTerminalPanelResize();
initChatSessionsResize();
initCollapseAllButton();
initTreeViewCollapse();
initTreeViewFileClick();
initTabBarInteraction();
initPickerMenus();
initChatSessions();
initSessionListToggle();
initOpenInEditorHandler();
initProjectSwitchHandler();
initFloatingChatInput();
initFloatingInputRowAnimation();
initBackgroundAgentPicker();

// Render the initial tree view for the default project
renderTreeView(getCurrentProjectId());

// Initialize floating input row focus/blur animation with hover detection
function initFloatingInputRowAnimation() {
	const floatingInputRow = document.querySelector("floating-input-row");
	const inputField = floatingInputRow?.querySelector("input-field input");

	if (!floatingInputRow || !inputField) return;

	let isHovered = false;
	let isInteractingWithMenu = false;

	const hasOpenMenu = () => Boolean(floatingInputRow.querySelector(".picker-menu.open"));

	const shouldKeepExpanded = () =>
		inputField.value.trim() !== "" || isHovered || isInteractingWithMenu || hasOpenMenu();

	// Handle focus - show input-actions row
	inputField.addEventListener("focus", () => {
		floatingInputRow.classList.add("expanded");
	});

	// Handle blur - hide input-actions row only if input is empty AND not hovering
	inputField.addEventListener("blur", () => {
		// Small delay to allow hover state to be checked
		setTimeout(() => {
			if (!shouldKeepExpanded()) {
				floatingInputRow.classList.remove("expanded");
				floatingInputRow.classList.remove("has-content");
			}
		}, 100);
	});

	// Handle input - track if there's content
	inputField.addEventListener("input", () => {
		if (inputField.value.trim() !== "") {
			floatingInputRow.classList.add("has-content");
		} else {
			floatingInputRow.classList.remove("has-content");
		}
	});

	// Handle mouse enter - track hover state
	floatingInputRow.addEventListener("mouseenter", () => {
		isHovered = true;
	});

	// Handle mouse leave - hide input-actions if empty and not focused
	floatingInputRow.addEventListener("mouseleave", () => {
		isHovered = false;
		// Only collapse if input is empty and not focused
		if (document.activeElement !== inputField && !shouldKeepExpanded()) {
			floatingInputRow.classList.remove("expanded");
			floatingInputRow.classList.remove("has-content");
		}
	});

	// Keep input actions open when interacting with dropdown menus
	floatingInputRow.addEventListener("pointerdown", (e) => {
		const target = e.target instanceof Element ? e.target : null;
		if (target && target.closest(".picker-menu")) {
			isInteractingWithMenu = true;
			floatingInputRow.classList.add("expanded");
		}
	});

	document.addEventListener("pointerup", () => {
		if (isInteractingWithMenu) {
			setTimeout(() => {
				isInteractingWithMenu = false;
			}, 0);
		}
	});
}

function initBackgroundAgentPicker() {
	const chatTypeContainers = Array.from(
		document.querySelectorAll(".chat-type-container"),
	);

	if (!chatTypeContainers.length) return;

	const updateVisibility = (container, value) => {
		const backgroundAgentContainer = container
			.closest("input-actions, chat-config-bar")
			?.querySelector(".background-agent-container");
		if (!backgroundAgentContainer) return;

		if (value === "Background") {
			backgroundAgentContainer.removeAttribute("hidden");
		} else {
			backgroundAgentContainer.setAttribute("hidden", "");
		}
	};

	chatTypeContainers.forEach((container) => {
		const chatTypePicker = container.querySelector("chat-type");
		const initialValue = chatTypePicker?.childNodes[0]?.textContent?.trim() || "";
		updateVisibility(container, initialValue);

		chatTypePicker?.addEventListener("picker-change", (e) => {
			const value = e.detail?.value || "";
			updateVisibility(container, value);
		});
	});
}

// ====================================================
// Workspace Picker (macOS Finder Style)
// ====================================================
function initWorkspacePicker() {
	const workspacePicker = document.querySelector("workspace-picker");
	if (!workspacePicker) return;

	const backdrop = workspacePicker.querySelector("workspace-picker-backdrop");
	const cancelBtn = workspacePicker.querySelector(".cancel-btn");
	const openBtn = workspacePicker.querySelector(".open-btn");
	const folderItems = workspacePicker.querySelectorAll("folder-item");
	const sidebarItems = workspacePicker.querySelectorAll("sidebar-item");
	const finderFiles = workspacePicker.querySelector("finder-files");
	const toolbarTitle = workspacePicker.querySelector("toolbar-title");
	const breadcrumb = workspacePicker.querySelector("finder-breadcrumb");
	const viewButtons = workspacePicker.querySelectorAll("view-button");
	const searchInput = workspacePicker.querySelector("toolbar-search input");

	let selectedFolder = null;

	// Close picker when clicking backdrop
	backdrop?.addEventListener("click", () => {
		hideWorkspacePicker();
	});

	// Close picker when clicking cancel
	cancelBtn?.addEventListener("click", () => {
		hideWorkspacePicker();
	});

	// Handle Escape key to close
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && !workspacePicker.hasAttribute("hidden")) {
			hideWorkspacePicker();
		}
	});

	// Folder selection
	folderItems.forEach((folder) => {
		folder.addEventListener("click", () => {
			// Remove selection from all folders
			folderItems.forEach((f) => f.removeAttribute("selected"));
			// Select clicked folder
			folder.setAttribute("selected", "");
			selectedFolder = folder.getAttribute("data-path");
			// Enable open button
			openBtn?.removeAttribute("disabled");
		});

		// Double-click to open
		folder.addEventListener("dblclick", () => {
			if (selectedFolder) {
				openWorkspace(selectedFolder);
			}
		});
	});

	// Sidebar navigation
	sidebarItems.forEach((item) => {
		item.addEventListener("click", () => {
			// Update active state
			sidebarItems.forEach((i) => i.removeAttribute("active"));
			item.setAttribute("active", "");

			// Update title and breadcrumb
			const location = item.getAttribute("data-location");
			const label = item.querySelector(".sidebar-label")?.textContent || "Recents";
			if (toolbarTitle) toolbarTitle.textContent = label;
			if (breadcrumb) {
				breadcrumb.innerHTML = `<breadcrumb-item>${label}</breadcrumb-item>`;
			}

			// Clear selection
			folderItems.forEach((f) => f.removeAttribute("selected"));
			selectedFolder = null;
			openBtn?.setAttribute("disabled", "");
		});
	});

	// View toggle (icon/list)
	viewButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			viewButtons.forEach((b) => b.removeAttribute("active"));
			btn.setAttribute("active", "");

			if (btn.classList.contains("list-view")) {
				finderFiles?.classList.add("list-view");
			} else {
				finderFiles?.classList.remove("list-view");
			}
		});
	});

	// Search filtering
	searchInput?.addEventListener("input", (e) => {
		const query = e.target.value.toLowerCase();
		folderItems.forEach((folder) => {
			const name = folder.querySelector("folder-name")?.textContent?.toLowerCase() || "";
			const meta = folder.querySelector("folder-meta")?.textContent?.toLowerCase() || "";
			if (name.includes(query) || meta.includes(query)) {
				folder.style.display = "";
			} else {
				folder.style.display = "none";
			}
		});
	});

	// Open button handler
	openBtn?.addEventListener("click", () => {
		if (selectedFolder) {
			openWorkspace(selectedFolder);
		}
	});
}

function showWorkspacePicker() {
	const workspacePicker = document.querySelector("workspace-picker");
	if (!workspacePicker) return;

	workspacePicker.removeAttribute("hidden");

	// Reset state
	const openBtn = workspacePicker.querySelector(".open-btn");
	const folderItems = workspacePicker.querySelectorAll("folder-item");
	folderItems.forEach((f) => f.removeAttribute("selected"));
	openBtn?.setAttribute("disabled", "");

	// Focus search input
	setTimeout(() => {
		const searchInput = workspacePicker.querySelector("toolbar-search input");
		searchInput?.focus();
	}, 100);
}

function hideWorkspacePicker() {
	const workspacePicker = document.querySelector("workspace-picker");
	if (!workspacePicker) return;

	workspacePicker.classList.add("closing");
	setTimeout(() => {
		workspacePicker.setAttribute("hidden", "");
		workspacePicker.classList.remove("closing");
	}, 200);
}

function openWorkspace(path) {
	// Simulate opening a workspace in VS Code
	console.log("Opening workspace:", path);

	// Get folder name from path
	const folderName = path.split("/").pop();

	// Update command palette button text
	const cmdPaletteButton = document.querySelector("cmd-palette-button");
	if (cmdPaletteButton) {
		// The button has SVG + text node, we need to update the text node
		const textNodes = Array.from(cmdPaletteButton.childNodes).filter(
			node => node.nodeType === Node.TEXT_NODE
		);
		if (textNodes.length > 0) {
			// Update the last text node (the one after the SVG)
			textNodes[textNodes.length - 1].textContent = folderName;
		}
	}

	// Load project data for tree view and editor
	const project = projectData[folderName];
	if (project) {
		// Load all project files into fileCodeExamples so tree item clicks work
		for (const [filename, fileData] of Object.entries(project.files)) {
			fileCodeExamples[filename] = fileData;
		}

		// Update tree view
		const treeView = document.querySelector("tree-view");
		if (treeView) {
			treeView.innerHTML = renderProjectTreeView(project);
		}

		// Update editor with active file
		const activeFileName = getActiveFile(folderName);
		if (activeFileName) {
			const fileData = getFileCode(folderName, activeFileName);
			if (fileData) {
				// Update tab bar - remove existing tabs and add new one
				const tabBar = document.querySelector("editor-well tab-bar");
				if (tabBar) {
					// Remove all existing file tabs (keep only fill-end and tab-action)
					const existingTabs = tabBar.querySelectorAll("tab-item:not([type='fill-end'])");
					existingTabs.forEach(tab => tab.remove());

					// Create new active tab
					const newTab = document.createElement("tab-item");
					newTab.setAttribute("active", "");
					newTab.innerHTML = `
						<span class="filename">${activeFileName}</span>
						<span class="close-icon">
							<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
								<path d="M12.1465 5.14652C12.3418 4.95127 12.6583 4.95126 12.8535 5.14652C13.0487 5.34179 13.0488 5.65831 12.8535 5.85355L9.70705 9.00004L12.8535 12.1465C13.0488 12.3418 13.0488 12.6583 12.8535 12.8536C12.6583 13.0488 12.3418 13.0488 12.1465 12.8536L9.00002 9.70707L5.85354 12.8536C5.6583 13.0488 5.34177 13.0488 5.14651 12.8536C4.95125 12.6583 4.95125 12.3418 5.14651 12.1465L8.29299 9.00004L5.14651 5.85355C4.95125 5.6583 4.95126 5.34179 5.14651 5.14652C5.34177 4.95126 5.65828 4.95126 5.85354 5.14652L9.00002 8.29301L12.1465 5.14652Z" />
							</svg>
						</span>
					`;

					// Insert at the beginning of the tab bar
					const fillEnd = tabBar.querySelector('[type="fill-end"]');
					if (fillEnd) {
						tabBar.insertBefore(newTab, fillEnd);
					} else {
						tabBar.prepend(newTab);
					}
				}

				// Update Monaco editor
				setEditorContent(activeFileName);
			}
		}
	}

	// Add a new workspace pill to the floating chat input
	const workspaceRow = document.querySelector("floating-chat-input workspace-row");
	if (workspaceRow) {
		// Check if workspace pill already exists
		const existingPill = workspaceRow.querySelector(`workspace-pill[data-workspace="${folderName}"]`);
		if (!existingPill) {
			// Create new workspace pill
			const newPill = document.createElement("workspace-pill");
			newPill.setAttribute("data-workspace", folderName);
			newPill.innerHTML = `
				<span class="workspace-name">${folderName}</span>
				<span class="view-sessions-icon" title="View sessions">
					<svg width="12" height="12" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
						<path d="M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z"/>
					</svg>
				</span>
			`;

			// Insert before the new-session-button
			const newSessionBtn = workspaceRow.querySelector("new-session-button");
			workspaceRow.insertBefore(newPill, newSessionBtn);

			// Remove active from other pills and set new one as active
			workspaceRow.querySelectorAll("workspace-pill").forEach((p) => p.removeAttribute("active"));
			newPill.setAttribute("active", "");
		}
	}

	updateFloatingChatWorkspaceCounts();

	// Close the workspace picker
	hideWorkspacePicker();
}

/**
 * Render tree view HTML for a project from projectData
 * @param {Object} project - The project data object
 * @returns {string} HTML string for the tree view
 */
function renderProjectTreeView(project) {
	let html = "";
	for (const item of project.tree) {
		const indentAttr = item.indent > 0 ? `indent="${item.indent}"` : "";
		const isFolder = item.type === "folder";
		const openAttr = isFolder && item.open ? "open" : "";
		const folderAttr = isFolder ? "folder" : "";
		const activeAttr = item.active ? "active" : "";

		if (isFolder) {
			html += `<tree-item ${folderAttr} ${openAttr} ${indentAttr}>
				${TREE_ICONS.chevron}
				${TREE_ICONS.folder}
				<span class="folder-name">${item.name}</span>
			</tree-item>`;
		} else {
			html += `<tree-item ${indentAttr} ${activeAttr}>
				${TREE_ICONS.file}
				<span class="file-name">${item.name}</span>
			</tree-item>`;
		}
	}
	return html;
}

// Initialize workspace picker
initWorkspacePicker();
