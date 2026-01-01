import { fileCodeExamples } from "./code.js";
import { initMonacoEditor, setEditorContent } from "./monaco.js";
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

		// Set min and max width constraints
		const minWidth = 150;
		const maxWidth = window.innerWidth * 0.4;

		if (newWidth >= minWidth && newWidth <= maxWidth) {
			// Update the grid template columns to reflect the new width
			const vsCode = document.querySelector("vs-code");
			const layout = vsCode?.getAttribute("layout");
			const secondarySidebar = document.querySelector("secondary-side-bar");
			const secondaryWidth = secondarySidebar ? secondarySidebar.getBoundingClientRect().width : 0;

			if (layout === "left-sidebar") {
				mainArea.style.gridTemplateColumns = `${newWidth}px 1fr`;
			} else {
				// Default layout with both sidebars
				mainArea.style.gridTemplateColumns = `${newWidth}px 1fr ${secondaryWidth}px`;
			}
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
		// Create new tab and add before fill-end
		const newTab = createTabItem(fileName);
		const fillEnd = tabBar.querySelector('tab-item[type="fill-end"]');
		if (fillEnd) {
			tabBar.insertBefore(newTab, fillEnd);
		} else {
			tabBar.appendChild(newTab);
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

initVsCodeHeroTabs();
initMonacoEditor();
initSecondarySidebarResize();
initPrimarySidebarResize();
initTreeViewCollapse();
initTreeViewFileClick();
initTabBarInteraction();
