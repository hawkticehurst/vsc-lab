// Chat Sessions Dynamic Rendering Module
// Handles rendering chat session data from JSON and managing session switching

import chatSessionsData from "./chat-sessions-data.json";

// SVG Icons used throughout the chat sessions UI
const ICONS = {
	checkmark: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<path d="M13.6572 3.13573C13.8583 2.9465 14.175 2.95614 14.3643 3.15722C14.5535 3.35831 14.5438 3.675 14.3428 3.86425L5.84277 11.8642C5.64597 12.0494 5.33756 12.0446 5.14648 11.8535L1.64648 8.35351C1.45121 8.15824 1.45121 7.84174 1.64648 7.64647C1.84174 7.45121 2.15825 7.45121 2.35351 7.64647L5.50976 10.8027L13.6572 3.13573Z"/>
	</svg>`,
	chevron: `<svg class="chevron-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<path d="M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z"/>
	</svg>`,
	expandIcon: `<svg class="expand-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<path d="M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z"/>
	</svg>`,
	fileIcon: `<svg class="file-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<path d="M5 1C3.89543 1 3 1.89543 3 3V13C3 14.1046 3.89543 15 5 15H11C12.1046 15 13 14.1046 13 13V5.41421C13 5.01639 12.842 4.63486 12.5607 4.35355L9.64645 1.43934C9.36514 1.15804 8.98361 1 8.58579 1H5ZM4 3C4 2.44772 4.44772 2 5 2H8V4.5C8 5.32843 8.67157 6 9.5 6H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V3ZM11.7929 5H9.5C9.22386 5 9 4.77614 9 4.5V2.20711L11.7929 5Z"/>
	</svg>`,
	openInEditor: `<svg class="open-in-editor-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<path d="M1.5 1H6V2H2V14H14V10H15V14.5L14.5 15H1.5L1 14.5V1.5L1.5 1Z"/>
		<path d="M15 1.5V8H14V2.707L7.243 9.464L6.536 8.757L13.293 2H8V1H14.5L15 1.5Z"/>
	</svg>`,
};

// State management
let currentProjectId = null;
let currentSessionId = null;
let selectedSessionIds = new Set(); // For multi-select support
let resultsPanelVisible = false; // Track results panel visibility state

// Per-project layout state: { projectId: { splitViewSessionIds: [], currentSessionId: string | null } }
const projectLayoutState = new Map();

/**
 * Initialize the chat sessions component
 */
export function initChatSessions() {
	const chatSessions = document.querySelector("chat-sessions");
	if (!chatSessions) return;

	// Get first project as default
	const projects = chatSessionsData.projects;
	if (projects.length > 0) {
		currentProjectId = projects[0].id;
		const sessions = projects[0].sessions;
		if (sessions.length > 0) {
			// Render session list but show empty state by default
			renderSessionList(chatSessions, sessions);
			showEmptyState(chatSessions);
		}
	}

	// Set up click handlers (only once, using event delegation)
	initSessionItemClicks(chatSessions);
	initChangedFilesWidgetToggle(chatSessions);
	initResultsFileItemToggle(chatSessions);
	initFullscreenTabClicks();
	initResultsPanelToggle(chatSessions);
	initNewSessionAction(chatSessions);
	initOpenInEditorClicks(chatSessions);
}

/**
 * Switch to a different project by ID
 */
export function switchProject(projectId) {
	if (projectId === currentProjectId) return;

	const project = chatSessionsData.projects.find((p) => p.id === projectId);
	if (!project) return;

	const chatSessions = document.querySelector("chat-sessions");
	if (!chatSessions) return;

	// Save current project's layout state before switching
	if (currentProjectId) {
		saveProjectLayoutState(chatSessions);
	}

	currentProjectId = projectId;
	selectedSessionIds.clear(); // Clear multi-select when switching projects

	const sessions = project.sessions;
	if (sessions.length > 0) {
		renderSessionList(chatSessions, sessions);

		// Restore the new project's layout state
		const savedState = projectLayoutState.get(projectId);

		if (savedState && savedState.splitViewSessionIds.length >= 2) {
			// Restore split view with saved session IDs
			const sessionsToShow = savedState.splitViewSessionIds
				.map((id) => sessions.find((s) => s.id === id))
				.filter(Boolean);

			if (sessionsToShow.length >= 2) {
				renderSplitViewForSessions(chatSessions, sessionsToShow);
			} else {
				// Sessions no longer exist, show first session
				exitSplitView(chatSessions);
				currentSessionId = sessions[0].id;
				renderSession(chatSessions, sessions[0]);
			}
		} else if (savedState && savedState.currentSessionId) {
			// Restore single session view
			exitSplitView(chatSessions);
			const session = sessions.find((s) => s.id === savedState.currentSessionId);
			if (session) {
				currentSessionId = session.id;
				renderSession(chatSessions, session);
			} else {
				currentSessionId = sessions[0].id;
				renderSession(chatSessions, sessions[0]);
			}
		} else {
			// No saved state, show empty state
			exitSplitView(chatSessions);
			showEmptyState(chatSessions);
		}
	}

	// Update fullscreen tabs active state
	updateFullscreenTabsActiveState(projectId);

	// Dispatch event for other modules to respond to project switch
	document.dispatchEvent(
		new CustomEvent("project-switched", {
			detail: { projectId },
		}),
	);
}

/**
 * Save the current project's layout state
 */
function saveProjectLayoutState(container) {
	if (!currentProjectId) return;

	const chatThread = container.querySelector("chat-thread");
	const isInSplitView = chatThread && chatThread.hasAttribute("split-view");

	if (isInSplitView) {
		// Get session IDs from split view panes
		const panes = container.querySelectorAll("split-view-pane");
		const sessionIds = Array.from(panes)
			.map((pane) => pane.dataset.sessionId)
			.filter(Boolean);

		projectLayoutState.set(currentProjectId, {
			splitViewSessionIds: sessionIds,
			currentSessionId: null,
		});
	} else {
		projectLayoutState.set(currentProjectId, {
			splitViewSessionIds: [],
			currentSessionId: currentSessionId,
		});
	}
}

/**
 * Update the active state of fullscreen tabs
 */
function updateFullscreenTabsActiveState(projectId) {
	const tabs = document.querySelectorAll("fullscreen-tab[data-project-id]");
	tabs.forEach((tab) => {
		if (tab.dataset.projectId === projectId) {
			tab.setAttribute("active", "");
		} else {
			tab.removeAttribute("active");
		}
	});
}

/**
 * Initialize click handlers for fullscreen tabs
 */
function initFullscreenTabClicks() {
	const tabContainer = document.querySelector(".top-bar-fullscreen-tabs");
	if (!tabContainer) return;

	tabContainer.addEventListener("click", (e) => {
		const target = e.target instanceof HTMLElement ? e.target : null;
		if (!target) return;

		const tab = target.closest("fullscreen-tab");
		if (!(tab instanceof HTMLElement)) return;

		const projectId = tab.dataset.projectId;
		if (projectId) {
			switchProject(projectId);
		}
	});
}

/**
 * Render the session list in the left panel
 */
function renderSessionList(container, sessions) {
	const sessionListItems = container.querySelector("session-list-items");
	if (!sessionListItems) return;

	sessionListItems.innerHTML = sessions
		.map(
			(session) => `
		<session-item data-session-id="${session.id}" ${session.id === currentSessionId ? "active" : ""}>
			<session-item-icon></session-item-icon>
			<session-item-content>
				<session-item-title>${session.title}</session-item-title>
				<session-item-meta>
					<span class="stats">${session.meta.filesChanged} files changed</span>
					<span class="additions">+${session.meta.additions}</span>
					<span class="deletions">-${session.meta.deletions}</span>
					<span>${session.meta.timeAgo}</span>
				</session-item-meta>
			</session-item-content>
		</session-item>
	`,
		)
		.join("");
}

/**
 * Set up click handlers for session items
 */
function initSessionItemClicks(container) {
	const sessionListItems = container.querySelector("session-list-items");
	if (!sessionListItems) return;

	sessionListItems.addEventListener("click", (e) => {
		const target = e.target instanceof HTMLElement ? e.target : null;
		if (!target) return;

		const sessionItem = target.closest("session-item");
		if (!(sessionItem instanceof HTMLElement)) return;

		const sessionId = sessionItem.dataset.sessionId;
		if (!sessionId) return;

		// Check for multi-select modifier (Cmd on Mac, Ctrl on Windows/Linux, or Shift)
		const isMultiSelectClick = e.metaKey || e.ctrlKey || e.shiftKey;

		if (isMultiSelectClick) {
			// Toggle selection of this session
			if (selectedSessionIds.has(sessionId)) {
				selectedSessionIds.delete(sessionId);
				sessionItem.removeAttribute("selected");
			} else {
				selectedSessionIds.add(sessionId);
				sessionItem.setAttribute("selected", "");
			}

			// If we have multiple selections and user clicks on a selected item without modifier,
			// that will be handled by the else branch on next click (to open split view)
		} else {
			// Regular click - check if clicking on a selected item to open split view
			if (selectedSessionIds.size > 0 && selectedSessionIds.has(sessionId)) {
				// Open split view with all selected sessions
				openSplitView(container);
				return;
			}

			// Clear multi-select and single select this session
			selectedSessionIds.clear();
			const allItems = sessionListItems.querySelectorAll("session-item");
			allItems.forEach((item) => {
				item.removeAttribute("active");
				item.removeAttribute("selected");
			});
			sessionItem.setAttribute("active", "");

			// Find and render the selected session from current project
			const currentProject = chatSessionsData.projects.find((p) => p.id === currentProjectId);
			if (!currentProject) return;

			const session = currentProject.sessions.find((s) => s.id === sessionId);
			if (session) {
				currentSessionId = sessionId;
				renderSession(container, session);
			}
		}
	});
}

/**
 * Render a session's content (chat thread, changed files widget, and results panel)
 */
function renderSession(container, session) {
	// Exit split view mode if active
	exitSplitView(container);

	// Restore results panel visibility state
	const resultsPanel = container.querySelector("results-panel");
	if (resultsPanel) {
		if (resultsPanelVisible) {
			resultsPanel.removeAttribute("hidden");
		} else {
			resultsPanel.setAttribute("hidden", "");
		}
	}

	renderChatThread(container, session);
	renderResultsPanel(container, session);
}

/**
 * Open split view with all selected sessions
 */
function openSplitView(container) {
	if (selectedSessionIds.size < 2) return;

	const currentProject = chatSessionsData.projects.find((p) => p.id === currentProjectId);
	if (!currentProject) return;

	const selectedSessions = Array.from(selectedSessionIds)
		.map((id) => currentProject.sessions.find((s) => s.id === id))
		.filter(Boolean);

	if (selectedSessions.length < 2) return;

	// Clear current session since we're in split view mode
	currentSessionId = null;

	// Hide the results panel in split view
	const resultsPanel = container.querySelector("results-panel");
	if (resultsPanel) {
		resultsPanel.setAttribute("hidden", "");
	}

	// Add split-view attribute to chat-thread for CSS styling
	const chatThread = container.querySelector("chat-thread");
	if (chatThread) {
		chatThread.setAttribute("split-view", "");
	}

	// Render split view
	renderSplitView(container, selectedSessions);

	// Clear selections after opening split view
	selectedSessionIds.clear();
	const allItems = container.querySelectorAll("session-item");
	allItems.forEach((item) => item.removeAttribute("selected"));
}

/**
 * Render split view for given sessions (used when switching projects)
 */
function renderSplitViewForSessions(container, sessions) {
	if (sessions.length < 2) return;

	// Clear current session since we're in split view mode
	currentSessionId = null;

	// Hide the results panel in split view
	const resultsPanel = container.querySelector("results-panel");
	if (resultsPanel) {
		resultsPanel.setAttribute("hidden", "");
	}

	// Add split-view attribute to chat-thread for CSS styling
	const chatThread = container.querySelector("chat-thread");
	if (chatThread) {
		chatThread.setAttribute("split-view", "");
	}

	// Render split view
	renderSplitView(container, sessions);
}

/**
 * Exit split view mode
 */
function exitSplitView(container) {
	const chatThread = container.querySelector("chat-thread");
	if (chatThread) {
		chatThread.removeAttribute("split-view");
	}
}

/**
 * Render multiple sessions in split view
 */
function renderSplitView(container, sessions) {
	const chatThreadContent = container.querySelector("chat-thread-content");
	if (!chatThreadContent) return;

	let html = "<split-view-container>";

	sessions.forEach((session, index) => {
		html += `<split-view-pane data-session-id="${session.id}">`;
		html += `<split-view-header>
			<span class="split-view-title">${session.title}</span>
			<button class="split-view-close" title="Close">
				<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
					<path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"/>
				</svg>
			</button>
		</split-view-header>`;
		html += `<split-view-content>`;
		html += renderSessionContent(session);
		html += `</split-view-content>`;
		html += renderSplitViewChatInput();
		html += `</split-view-pane>`;

		// Add separator between panes (not after the last one)
		if (index < sessions.length - 1) {
			html += "<split-view-separator></split-view-separator>";
		}
	});

	html += "</split-view-container>";
	chatThreadContent.innerHTML = html;

	// Initialize resize handlers for split view panes
	initSplitViewResize(container);
	// Initialize close button handlers
	initSplitViewCloseButtons(container);
}

/**
 * Render the chat input for split view panes
 */
function renderSplitViewChatInput() {
	return `<split-view-input>
		<context-bar>
			<add-context-button>
				<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
					<path d="M2.2832 7.97549C2.2832 8.25149 2.5072 8.47549 2.7832 8.47549C2.9112 8.47549 3.0392 8.42649 3.1372 8.32949L7.7322 3.73249C8.2202 3.24449 8.8602 3.00049 9.5002 3.00049C10.8812 3.00049 12.0002 4.11949 12.0002 5.50049C12.0002 6.14049 11.7562 6.78049 11.2682 7.26849L5.9652 12.5715C5.7702 12.7665 5.5142 12.8645 5.2582 12.8645C4.7062 12.8645 4.2582 12.4165 4.2582 11.8645C4.2582 11.6085 4.3562 11.3525 4.5512 11.1575L9.8542 5.85449C9.9522 5.75649 10.0002 5.62849 10.0002 5.50049C10.0002 5.22449 9.7762 5.00049 9.5002 5.00049C9.3722 5.00049 9.2442 5.04949 9.1462 5.14649L3.8432 10.4505C3.4522 10.8415 3.2572 11.3525 3.2572 11.8645C3.2572 12.9695 4.1522 13.8645 5.2572 13.8645C5.7692 13.8645 6.2812 13.6695 6.6712 13.2785L11.9742 7.97549C12.6572 7.29249 12.9992 6.39649 12.9992 5.50049C12.9992 3.56749 11.4322 2.00049 9.4992 2.00049C8.6032 2.00049 7.7082 2.34249 7.0242 3.02549L2.4292 7.62149C2.3312 7.71949 2.2832 7.84749 2.2832 7.97549Z"/>
				</svg>
			</add-context-button>
		</context-bar>
		<static-text-area placeholder>Ask a follow up...</static-text-area>
		<chat-config-bar>
			<section class="chat-pickers">
				<mode-picker>
					Build
					<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
						<path d="M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z"/>
					</svg>
				</mode-picker>
				<model-picker>
					Claude Opus 4.5
					<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
						<path d="M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z"/>
					</svg>
				</model-picker>
			</section>
			<section class="chat-actions">
				<submit-local>
					<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
						<path d="M1.17683 1.11898C1.32953 0.989634 1.54464 0.963786 1.72363 1.05328L14.7236 7.55328C14.893 7.63797 15 7.8111 15 8.00049C15 8.18987 14.893 8.36301 14.7236 8.4477L1.72363 14.9477C1.54464 15.0372 1.32953 15.0113 1.17683 14.882C1.02414 14.7526 0.96328 14.5447 1.02213 14.3534L2.97688 8.00049L1.02213 1.64754C0.96328 1.45627 1.02414 1.24833 1.17683 1.11898ZM3.8693 8.50049L2.32155 13.5307L13.382 8.00049L2.32155 2.47027L3.8693 7.50049H9.50001C9.77615 7.50049 10 7.72435 10 8.00049C10 8.27663 9.77615 8.50049 9.50001 8.50049H3.8693Z"/>
					</svg>
				</submit-local>
			</section>
		</chat-config-bar>
	</split-view-input>`;
}

/**
 * Initialize resize handlers for split view separators
 */
function initSplitViewResize(container) {
	const splitViewContainer = container.querySelector("split-view-container");
	if (!splitViewContainer) return;

	const separators = splitViewContainer.querySelectorAll("split-view-separator");

	separators.forEach((separator) => {
		let isResizing = false;
		let startX = 0;
		let prevPane = null;
		let nextPane = null;
		let prevPaneStartWidth = 0;
		let nextPaneStartWidth = 0;

		separator.addEventListener("mousedown", (e) => {
			isResizing = true;
			startX = e.clientX;
			prevPane = separator.previousElementSibling;
			nextPane = separator.nextElementSibling;

			if (prevPane && nextPane) {
				prevPaneStartWidth = prevPane.getBoundingClientRect().width;
				nextPaneStartWidth = nextPane.getBoundingClientRect().width;
			}

			separator.classList.add("resizing");
			document.body.style.cursor = "ew-resize";
			document.body.style.userSelect = "none";
			e.preventDefault();
		});

		const onMouseMove = (e) => {
			if (!isResizing || !prevPane || !nextPane) return;

			const deltaX = e.clientX - startX;
			const minWidth = 200;

			const newPrevWidth = prevPaneStartWidth + deltaX;
			const newNextWidth = nextPaneStartWidth - deltaX;

			if (newPrevWidth >= minWidth && newNextWidth >= minWidth) {
				prevPane.style.flex = `0 0 ${newPrevWidth}px`;
				nextPane.style.flex = `0 0 ${newNextWidth}px`;
			}
		};

		const onMouseUp = () => {
			if (isResizing) {
				isResizing = false;
				separator.classList.remove("resizing");
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			}
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	});
}

/**
 * Initialize close button handlers for split view panes
 */
function initSplitViewCloseButtons(container) {
	const splitViewContainer = container.querySelector("split-view-container");
	if (!splitViewContainer) return;

	splitViewContainer.addEventListener("click", (e) => {
		const target = e.target instanceof Element ? e.target : null;
		if (!target) return;

		const closeButton = target.closest(".split-view-close");
		if (!closeButton) return;

		const pane = closeButton.closest("split-view-pane");
		if (!(pane instanceof HTMLElement)) return;

		const allPanes = splitViewContainer.querySelectorAll("split-view-pane");

		// If this is the last pane, exit split view entirely
		if (allPanes.length <= 1) {
			showEmptyState(container);
			return;
		}

		// Remove the pane and its adjacent separator
		const prevSeparator = pane.previousElementSibling;
		const nextSeparator = pane.nextElementSibling;

		// Remove the separator (prefer the one before, or after if first pane)
		if (prevSeparator && prevSeparator.tagName === "SPLIT-VIEW-SEPARATOR") {
			prevSeparator.remove();
		} else if (nextSeparator && nextSeparator.tagName === "SPLIT-VIEW-SEPARATOR") {
			nextSeparator.remove();
		}

		// Remove the pane
		pane.remove();

		// Reset flex on remaining panes to distribute evenly
		const remainingPanes = splitViewContainer.querySelectorAll("split-view-pane");
		remainingPanes.forEach((p) => {
			p.style.flex = "1";
		});
	});
}

/**
 * Render session content (for both single and split view)
 */
function renderSessionContent(session) {
	let html = "";

	// Check if session uses the new multi-prompt format
	if (session.prompts && Array.isArray(session.prompts)) {
		// Handle multi-prompt sessions
		session.prompts.forEach((promptData) => {
			html += `<chat-prompt>${promptData.prompt}</chat-prompt>`;

			promptData.thread.forEach((item) => {
				html += renderThreadItem(item);
			});

			// Add changed files widget for this prompt if it has changed files
			if (promptData.changedFiles && promptData.changedFiles.length > 0) {
				html += renderChangedFilesWidget(promptData.changedFiles);
			}
		});
	} else {
		// Handle legacy single-prompt format
		html += `<chat-prompt>${session.prompt}</chat-prompt>`;

		session.thread.forEach((item) => {
			html += renderThreadItem(item);
		});

		// Add the changed files widget at the end
		html += renderChangedFilesWidget(session.changedFiles);
	}

	return html;
}

/**
 * Render the chat thread content
 */
function renderChatThread(container, session) {
	const chatThreadContent = container.querySelector("chat-thread-content");
	if (!chatThreadContent) return;

	chatThreadContent.innerHTML = renderSessionContent(session);
}

/**
 * Render a single thread item based on its type
 */
function renderThreadItem(item) {
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
			return renderResponseList(item.items);

		default:
			return "";
	}
}

/**
 * Render a response list (with files or plain text items)
 */
function renderResponseList(items) {
	let html = "<chat-response><ul>";

	items.forEach((item) => {
		if (item.file) {
			html += `<li><chat-response-file><span>${item.file}</span></chat-response-file>: ${item.description}</li>`;
			if (item.subItems) {
				html += "<ul>";
				item.subItems.forEach((subItem) => {
					html += `<li>${subItem}</li>`;
				});
				html += "</ul>";
			}
		} else if (item.text) {
			html += `<li>${item.text}</li>`;
		}
	});

	html += "</ul></chat-response>";
	return html;
}

/**
 * Render the changed files widget shown inline in the chat thread
 */
function renderChangedFilesWidget(changedFiles) {
	let html = "<changed-files-widget>";

	changedFiles.forEach((file) => {
		html += `
			<changed-file-item>
				<changed-file-header>
					${ICONS.chevron}
					<changed-file-name>${file.fileName}</changed-file-name>
					<changed-file-stats>
						<span class="additions">+${file.additions}</span>
						<span class="deletions">-${file.deletions}</span>
					</changed-file-stats>
				</changed-file-header>
				<changed-file-diff>
					${renderDiffLines(file.diff)}
				</changed-file-diff>
			</changed-file-item>
		`;
	});

	html += "</changed-files-widget>";
	return html;
}

/**
 * Render diff lines for a file
 */
function renderDiffLines(diff) {
	return diff
		.map(
			(line) =>
				`<diff-line type="${line.type}"><line-number>${line.lineNumber}</line-number><line-content>${escapeHtml(line.content)}</line-content></diff-line>`,
		)
		.join("");
}

/**
 * Render the results panel on the right side
 */
function renderResultsPanel(container, session) {
	const resultsPanelContent = container.querySelector("results-panel-content");
	if (!resultsPanelContent) return;

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
					${file.codeFile ? `<button class="open-in-editor-btn" title="Open in editor">${ICONS.openInEditor}</button>` : ""}
				</results-file-header>
				<results-file-diff>
					${renderDiffLines(file.diff)}
				</results-file-diff>
			</results-file-item>
		`;
	});

	resultsPanelContent.innerHTML = html;
}

/**
 * Initialize changed files widget toggle behavior using event delegation
 */
function initChangedFilesWidgetToggle(container) {
	const chatThread = container.querySelector("chat-thread");
	if (!chatThread) return;

	chatThread.addEventListener("click", (e) => {
		const target = e.target instanceof Element ? e.target : null;
		if (!target) return;

		// Handle clicks on the header or the chevron icon
		const fileHeader = target.closest("changed-file-header");
		if (!fileHeader) return;

		const fileItem = fileHeader.closest("changed-file-item");
		if (!(fileItem instanceof HTMLElement)) return;

		const isExpanded = fileItem.hasAttribute("expanded");
		if (isExpanded) {
			fileItem.removeAttribute("expanded");
		} else {
			fileItem.setAttribute("expanded", "");
		}
	});
}

/**
 * Initialize results file item toggle behavior using event delegation
 */
function initResultsFileItemToggle(container) {
	const resultsPanel = container.querySelector("results-panel");
	if (!resultsPanel) return;

	resultsPanel.addEventListener("click", (e) => {
		const target = e.target instanceof Element ? e.target : null;
		if (!target) return;

		// Check if clicking on a file header or the expand icon
		const fileHeader = target.closest("results-file-header");
		const expandIcon = target.closest(".expand-icon");

		if (!fileHeader && !expandIcon) return;

		// Find the parent results-file-item
		const fileItem = (fileHeader || expandIcon)?.closest("results-file-item");
		if (!(fileItem instanceof HTMLElement)) return;

		const isExpanded = fileItem.hasAttribute("expanded");
		if (isExpanded) {
			fileItem.removeAttribute("expanded");
		} else {
			fileItem.setAttribute("expanded", "");
		}
	});
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}

/**
 * Get the current session data
 */
export function getCurrentSession() {
	const currentProject = chatSessionsData.projects.find((p) => p.id === currentProjectId);
	if (!currentProject) return null;
	return currentProject.sessions.find((s) => s.id === currentSessionId);
}

/**
 * Get all sessions for the current project
 */
export function getAllSessions() {
	const currentProject = chatSessionsData.projects.find((p) => p.id === currentProjectId);
	return currentProject ? currentProject.sessions : [];
}

/**
 * Get all projects
 */
export function getAllProjects() {
	return chatSessionsData.projects;
}

/**
 * Get the current project ID
 */
export function getCurrentProjectId() {
	return currentProjectId;
}

/**
 * Initialize results panel toggle via layout-right icon in top bar
 */
function initResultsPanelToggle(container) {
	const layoutRightIcon = document.querySelector("top-bar-icon.layout-right");
	const resultsPanel = container.querySelector("results-panel");
	if (!layoutRightIcon || !resultsPanel) return;

	layoutRightIcon.addEventListener("click", () => {
		toggleResultsPanel(container);
	});
}

/**
 * Toggle the results panel visibility
 */
function toggleResultsPanel(container) {
	const resultsPanel = container.querySelector("results-panel");
	if (!resultsPanel) return;

	const isHidden = resultsPanel.hasAttribute("hidden");
	if (isHidden) {
		resultsPanel.removeAttribute("hidden");
		resultsPanelVisible = true;
	} else {
		resultsPanel.setAttribute("hidden", "");
		resultsPanelVisible = false;
	}
}

/**
 * Initialize the new session action (+ icon in session list header)
 */
function initNewSessionAction(container) {
	const sessionListActions = container.querySelector("session-list-actions");
	if (!sessionListActions) return;

	const actionIcon = sessionListActions.querySelector("action-icon");
	if (!actionIcon) return;

	actionIcon.addEventListener("click", () => {
		showEmptyState(container);
	});
}

/**
 * Show the empty state (new session) view
 */
function showEmptyState(container) {
	// Clear current session selection
	currentSessionId = null;

	// Clear multi-select
	selectedSessionIds.clear();

	// Remove active and selected state from all session items
	const sessionItems = container.querySelectorAll("session-item");
	sessionItems.forEach((item) => {
		item.removeAttribute("active");
		item.removeAttribute("selected");
	});

	// Exit split view mode
	exitSplitView(container);

	// Hide results panel and clear its content
	const resultsPanel = container.querySelector("results-panel");
	if (resultsPanel) {
		resultsPanel.setAttribute("hidden", "");
		const resultsPanelContent = resultsPanel.querySelector("results-panel-content");
		if (resultsPanelContent) {
			resultsPanelContent.innerHTML = "";
		}
	}

	// Render empty state in chat thread
	renderEmptyState(container);
}

/**
 * Render the empty state content in the chat thread
 */
function renderEmptyState(container) {
	const chatThreadContent = container.querySelector("chat-thread-content");
	if (!chatThreadContent) return;

	chatThreadContent.innerHTML = `
		<empty-state>
			<empty-state-title>New Chat Session</empty-state-title>
			<empty-state-disclaimer>
				<p>AI responses may be inaccurate.</p>
				<p>If handling customer data, disable telemetry.</p>
			</empty-state-disclaimer>
		</empty-state>
	`;
}

/**
 * Initialize click handlers for "Open in Editor" buttons
 */
function initOpenInEditorClicks(container) {
	const resultsPanel = container.querySelector("results-panel");
	if (!resultsPanel) return;

	resultsPanel.addEventListener("click", (e) => {
		const target = e.target instanceof Element ? e.target : null;
		if (!target) return;

		// Check if clicking on the open-in-editor button or its children
		const openButton = target.closest(".open-in-editor-btn");
		if (!openButton) return;

		e.stopPropagation(); // Prevent expand/collapse toggle

		// Find the parent results-file-item to get the code file
		const fileItem = openButton.closest("results-file-item");
		if (!(fileItem instanceof HTMLElement)) return;

		const codeFile = fileItem.dataset.codeFile;
		if (!codeFile) return;

		// Dispatch a custom event that main.js will listen for
		const event = new CustomEvent("open-file-in-editor", {
			bubbles: true,
			detail: { fileName: codeFile },
		});
		container.dispatchEvent(event);
	});
}

/**
 * Hide the chat sessions view
 */
export function hideChatSessions() {
	const chatSessions = document.querySelector("chat-sessions");
	if (chatSessions) {
		chatSessions.setAttribute("hidden", "");
	}
}

/**
 * Show the chat sessions view
 */
export function showChatSessions() {
	const chatSessions = document.querySelector("chat-sessions");
	if (chatSessions) {
		chatSessions.removeAttribute("hidden");
	}
}
