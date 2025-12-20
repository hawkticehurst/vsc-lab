import { initMonacoEditor } from "./monaco.js";

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
  const allTabItems = Array.from(
    tabBar.querySelectorAll("vs-code[hero-editor] tab-item")
  ).filter((el) => el instanceof HTMLElement);
  /** @type {HTMLElement[]} */
  const editorAreas = Array.from(
    document.querySelectorAll("vs-code[hero-editor] editor-area")
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
    if (!tab.id)
      tab.id = `hero-tab-${key.replace(/[^a-zA-Z0-9_-]/g, "-")}-${idx}`;
    tab.setAttribute("tabindex", tab.hasAttribute("active") ? "0" : "-1");
    tab.setAttribute(
      "aria-selected",
      tab.hasAttribute("active") ? "true" : "false"
    );
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
    (t) => t.hasAttribute("active") && t.getAttribute("type") !== "fill-end"
  );
  if (!activeTab)
    activeTab = allTabItems.find((t) => t.getAttribute("type") !== "fill-end");

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
    const focusableTabs = allTabItems.filter(
      (t) => t.getAttribute("type") !== "fill-end"
    );
    const activeEl =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const currentTab =
      activeEl && activeEl.closest ? activeEl.closest("tab-item") : null;
    const ct = currentTab instanceof HTMLElement ? currentTab : null;
    const currentIndex = ct ? focusableTabs.indexOf(ct) : 0;
    let nextIndex = currentIndex;
    if (ev.key === "ArrowLeft")
      nextIndex =
        (currentIndex - 1 + focusableTabs.length) % focusableTabs.length;
    if (ev.key === "ArrowRight")
      nextIndex = (currentIndex + 1) % focusableTabs.length;
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
      (t) => t.getAttribute("type") === "delegate-to-cloud-agent"
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

initVsCodeHeroTabs();
initMonacoEditor();
initSecondarySidebarResize();
