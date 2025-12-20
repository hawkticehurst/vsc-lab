<script setup lang="ts">
import QuickPick from './components/QuickPick.vue'
import "@vscode-elements/elements/dist/vscode-icon/index.js";
import { provideVSCodeDesignSystem, allComponents } from "@vscode/webview-ui-toolkit";
import { ref, onMounted } from 'vue';

provideVSCodeDesignSystem().register(allComponents);

const isDarkTheme = ref(true);

function toggleTheme(event: Event) {
  console.log('Theme toggled');
  const checkbox = event.target as HTMLInputElement;
  isDarkTheme.value = checkbox.checked;
  document.documentElement.classList.toggle('light-theme', !isDarkTheme.value);
  document.documentElement.classList.toggle('dark-theme', isDarkTheme.value);
}

onMounted(() => {
  // Set initial theme
  document.documentElement.classList.add('dark-theme');

  // Override Webview UI Toolkit CSS variables applied to the body
  // Set timeout to ensure the CSS variables are applied after the toolkit styles
  setTimeout(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.setProperty('--foreground', 'var(--vscode-foreground)');
      body.style.setProperty('--background', 'var(--vscode-panel-background)');
      body.style.setProperty('--focus-border', 'var(--vscode-focusBorder)');
      body.style.setProperty('--button-border', 'var(--vscode-button-border)');
      body.style.setProperty('--button-primary-background', 'var(--vscode-button-background)');
      body.style.setProperty('--button-primary-hover-background', 'var(--vscode-button-hoverBackground)');
      body.style.setProperty('--checkbox-background', 'var(--vscode-checkbox-background)');
      body.style.setProperty('--checkbox-foreground', 'var(--vscode-checkbox-foreground)');
      body.style.setProperty('--checkbox-border', 'var(--vscode-checkbox-border)');
      body.style.setProperty('--dropdown-background', 'var(--vscode-dropdown-background)');
      body.style.setProperty('--dropdown-foreground', 'var(--vscode-dropdown-foreground)');
      body.style.setProperty('--dropdown-border', 'var(--vscode-dropdown-border)');
      body.style.setProperty('--input-background', 'var(--vscode-input-background)');
    }
  }, 100);
});
</script>

<template>
  <div class="theme-toggle">
    <vscode-checkbox id="theme-toggle" :checked="isDarkTheme" @change="toggleTheme"></vscode-checkbox>
    <label for="theme-toggle">Toggle Theme</label>
  </div>
  <details>
    <summary>Proposed Changes</summary>
    <ol>
      <li>Change checkbox style to match checkboxes from Settings page</li>
      <ul>
        <li>Goal: Reduce visual noise and better match editor theming</li>
        <li>Goal: Let's the color of server contribution source / server state text stand out</li>
      </ul>
      <li>Remove icons and indent tool list items</li>
      <ul>
        <li>Goal: Reduce visual noise</li>
        <li>Goal: Improve the ability to distinguish servers and tools via stronger visual hierarchy</li>
      </ul>
      <li>Prefix server names with "MCP Server:"</li>
      <ul>
        <li>Note: Also demoed "MCP Extension:" – might be the wrong term but the idea is that there can be variations on the prefix name used</li>
        <li>Goal: Provide extra information to distinguish between servers and tools</li>
        <li>Goal: Reduce density of information on the right side of server list items</li>
      </ul>
      <li>Prefix all MCP contribution sources with "From"</li>
      <ul>
        <li>Goal: Makes it more clear that a server is *coming from* somewhere</li>
        <li>Example: "Claude Desktop" vs "From Claude Desktop"</li>
        <li>Bonus: Improves visual consistency / mental parse-ability of contribution sources text</li>
      </ul>
      <li>Suggestion: Add a contribution source label and server status to GitHub Copilot Chat server</li>
      <ul>
        <li>Goal: Improves consistency across all MCP contribution sources copy</li>
        <li>Note: "Built In" might be the wrong term – consider revising for clarity/accuracy</li>
      </ul>
    </ol>
  </details>
  <QuickPick />
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-weight: 500;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  user-select: none;
}

.theme-toggle label {
  cursor: pointer;
}

details {
  position: absolute;
  top: 20px;
  left: 20px;
  max-width: 800px;
  background: var(--vscode-editor-background);
  border: solid 1px var(--vscode-checkbox-border);
  padding: 10px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 1.1rem;
  z-index: 1000;
}
details summary {
  cursor: pointer;
  user-select: none;
  font-weight: bold;
}
details ul {
  padding-left: 20px;
}
details ul li,
details ol li {
  margin-bottom: 2px;
}
details ul li ul {
  list-style: disc;
  padding-left: 20px;
}
details ul li ul li {
  margin-bottom: 0;
}
</style>