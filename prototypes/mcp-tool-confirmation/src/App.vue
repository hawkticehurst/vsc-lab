<script setup lang="ts">
import { ref, onMounted } from 'vue';
import "@vscode-elements/elements/dist/vscode-button/index.js";
import "@vscode-elements/elements/dist/vscode-checkbox/index.js";
import "@vscode-elements/elements/dist/vscode-textfield/index.js";
import "@vscode-elements/elements/dist/vscode-icon/index.js";
import ToolConfirmation from './components/ToolConfirmation.vue';
import CodeBlock from './components/CodeBlock.vue';
import Message from './components/Message.vue';
import Chat from './components/Chat.vue';
import ChatDetails from './components/ChatDetails.vue';
import ReadMore from './components/ReadMore.vue';
import SplitButton from './components/SplitButton.vue';

const isDarkTheme = ref(true);

function toggleTheme(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  isDarkTheme.value = checkbox.checked;
  document.documentElement.classList.toggle('light-theme', !isDarkTheme.value);
  document.documentElement.classList.toggle('dark-theme', isDarkTheme.value);
}

onMounted(() => {
  // Set initial theme
  document.documentElement.classList.add('dark-theme');
});

function show(element: HTMLElement) {
  element.style.display = 'flex';
}

function hide(element: HTMLElement) {
  element.style.display = 'none';
}

function showTodo(element: HTMLElement, message: string) {
  const p = document.createElement('p');
  p.textContent = message;
  element.insertAdjacentElement('afterend', p);
}

function showFirstTimeDialog() {
  const confirmation = document.getElementById('first-time-warning');
  if (confirmation) {
    show(confirmation);
  }
}

function showFirstTimeConfirmation() {
  const firstTimeConfirmation = document.getElementById('first-time-warning');
  if (firstTimeConfirmation) {
    if (firstTimeConfirmation.style.display === 'flex') {
      const toolExecuted = document.getElementById('first-time-confirm');
      if (toolExecuted) {
        show(toolExecuted);
      }
      hide(firstTimeConfirmation);
    }
  }
}

function showListAllowedDirsDialog() {
  const confirmation = document.getElementById('list-allowed-directories');
  if (confirmation) {
    show(confirmation);
  }
  showFirstTimeConfirmation();
}

function showListAllowedDirsConfirmation() {
  const confirmation = document.getElementById('list-allowed-directories');
  if (confirmation) {
    const toolExecuted = document.getElementById('list-allowed-directories-confirm');

    if (toolExecuted) {
      show(toolExecuted);
    }
    hide(confirmation);
  }
  showListAllowedConfirmationMessage();
  showListDirsDialog();
}

function showListAllowedConfirmationMessage() {
  const confirmation = document.getElementById('list-allowed-directories-confirm');
  if (confirmation) {
    const message = document.getElementById('list-allowed-directories-confirm-message');
    if (message) {
      show(message);
    }
  }
}

function showListDirsDialog() {
  const confirmation = document.getElementById('list-directories');
  if (confirmation) {
    show(confirmation);
  }
}

function showListDirsConfirmation() {
  const confirmation = document.getElementById('list-directories');
  if (confirmation) {
    const toolExecuted = document.getElementById('list-directories-confirm');

    if (toolExecuted) {
      show(toolExecuted);
    }
    hide(confirmation);
  }
  showListDirsConfirmationMessage();
}

function showListDirsConfirmationMessage() {
  const confirmation = document.getElementById('list-directories-confirm');
  if (confirmation) {
    const message = document.getElementById('list-directories-confirm-message');
    if (message) {
      show(message);
    }
  }
}

function cancelFirstTimeDialog() {
  const confirmation = document.getElementById('first-time-warning');
  if (confirmation) {
    showTodo(confirmation, '[TODO: Server Usage Denial UI]');
    hide(confirmation);
  }
}

function cancelListAllowedDirsDialog() {
  const confirmation = document.getElementById('list-allowed-directories');
  if (confirmation) {
    showTodo(confirmation, '[TODO: Tool Cancelled UI]');
    hide(confirmation);
  }
}

function cancelListDirsDialog() {
  const confirmation = document.getElementById('list-directories');
  if (confirmation) {
    showTodo(confirmation, '[TODO: Tool Cancelled UI]');
    hide(confirmation);
  }
}

const listAllowedInput = `{}`;
const listAllowedOutput = `{}

Allowed directories:
/Users/hawk/Desktop
/Users/hawk/Downloads
/Users/hawk/Pictures
/Users/hawk/Videos
/Users/hawk/Documents
/Users/hawk/Desktop/Screenshots
/Users/hawk/Documents/Programming
/Users/hawk/Documents/Programming/vscode
/Users/hawk/Documents/Programming/mcp
/Users/hawk/Applications`;

const listDirsInput = `{
  "path": "/Users/hawk/Desktop"
}`;
const listDirsOutput = `{
  "path": "/Users/hawk/Desktop"
}

[FILE] .DS_Store
[FILE] .localized
[DIR] april-website
[DIR] screenshots
[DIR] temp-1
[DIR] temp-2
[DIR] temp-3
[DIR] temp-4
[DIR] temp-5
[DIR] temp-6
[DIR] temp-7
[DIR] temp-8
[DIR] temp-9
[DIR] temp-10
[DIR] temp-11
[DIR] temp-12
[DIR] temp-13
[DIR] temp-14
[DIR] temp-15`
</script>

<template>
  <div class="theme-toggle">
    <vscode-checkbox label="Toggle theme" id="theme-toggle" :checked="isDarkTheme"
      @change="toggleTheme"></vscode-checkbox>
  </div>
  <!-- <details class="proposed-changes">
    <summary>Proposed Changes</summary>
    <ol>
      <li>Add a confirmation for the first time a new MCP server is used.</li>
      <ul>
        <li>Goal: Make it *very* clear that a new MCP server is about to be used and get explicit permission to move
          forward.</li>
        <li>Goal: Prominently display the security implications of using the MCP server early.</li>
        <li>Bonus: Showing the fully security warning early means we can clean up individual tool call confirmations.
        </li>
      </ul>
      <li>Run tool confirmation: Prominently display source server.</li>
      <ul>
        <li>Goal: Make it clear which server the tool is coming from. Previously it was easy to miss.</li>
      </ul>
      <li>Run tool confirmation: Explicitly label tool input.</li>
      <ul>
        <li>Goal: Clearly indicate that included code snippets represent the tool input.</li>
      </ul>
      <li>Run tool confirmation: Clean up security warning copy.</li>
      <ul>
        <li>Since we moved security language to the initial confirmation dialog, we can streamline the language used in
          subsequent confirmations.</li>
      </ul>
      <li>TODO: More to come... this demo is still WIP</li>
    </ol>
  </details> -->
  <section class="chat-thread">
    <Message>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span
          style="display: block; width: 30px; height: 30px; background-color: var(--vscode-descriptionForeground); border-radius: 50%;"></span>
        <p style="font-weight: bold; font-size: 1.1rem;">hawkticehurst</p>
      </div>
      <p>Can you tell me what files are in my desktop folder?</p>
    </Message>
    <Message>
      <p style="font-weight: bold; font-size: 1.1rem;">GitHub Copilot</p>
      <p>Let me help you check the contents of your desktop folder. I'll first check which directories are allowed and
        then list the contents of the desktop folder if it's accessible.</p>
    </Message>
    <ToolConfirmation :id="'first-time-warning'">
      <p class="tool-confirmation-first-time-title">
        <vscode-icon name="warning"></vscode-icon>The <code class="snippet">filesystem</code> MCP server is being
        used for the first time.
      </p>
      <p>
        Do you trust "filesystem"? Executing its tools may pose risks. Proceed only if you trust the server.
      </p>
      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <SplitButton @click="showListAllowedDirsDialog">
          Continue
          <template #menu>
            <p>Allow in this Session</p>
            <p>Allow in this Workspace</p>
            <p>Always Allow</p>
          </template>
        </SplitButton>
        <vscode-button @click="cancelFirstTimeDialog" secondary>Cancel</vscode-button>
      </div>
    </ToolConfirmation>
    <ChatDetails :id="'first-time-confirm'" :toggleable="false">
      <template #default>
        <p class="tool-executed-title"
          style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <span>Confirmed permission to use the <code class="snippet">filesystem</code> MCP server</span>
          <vscode-icon name="check"
            style="color: var(--vscode-debugIcon-startForeground); padding-right: 5px;"></vscode-icon>
        </p>
      </template>
    </ChatDetails>
    <ChatDetails :id="'list-allowed-directories'" :toggleable="true">
      <template #default>
        <p class="tool-executed-title">
          <span>Run <code class="snippet">list_allowed_directories</code></span>
        </p>
      </template>
      <template #buttons>
        <div style="display: flex; gap: 8px;">
          <SplitButton @click="showListAllowedDirsConfirmation">
            Continue
            <template #menu>
              <p>Allow in this Session</p>
              <p>Allow in this Workspace</p>
              <p>Always Allow</p>
            </template>
          </SplitButton>
          <vscode-button @click="cancelListAllowedDirsDialog" secondary>Cancel</vscode-button>
        </div>
      </template>
      <template #content>
        <p>This tool is from the <a href="#">filesystem</a> MCP server.</p>
        <p style="font-weight: bold; margin-top: 12px;">Input:</p>
        <CodeBlock lang='json' :code="listAllowedInput" :theme="{ light: 'light-plus', dark: 'dark-plus' }"></CodeBlock>
        <ReadMore>
          <p style="font-weight: bold;">Tool Description:</p>
          <p>
            Returns the list of directories that this server is allowed to access. Use this to understand which
            directories are available before trying to access files.
          </p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus non optio similique necessitatibus neque,
            est iure ratione officia voluptatum explicabo totam tenetur! Odio aliquid quaerat placeat minima quos! Amet
            sequi laboriosam ducimus repellat sed distinctio asperiores repudiandae nihil? Quasi, eligendi?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit culpa corrupti, iusto ad fugit, ex pariatur
            reprehenderit consequatur veniam minus non at architecto accusamus nulla. Et ratione veniam eligendi id
            architecto doloremque tempore sint tempora soluta deserunt officia nesciunt modi pariatur ut autem
            necessitatibus, recusandae ipsum corporis, minima eius, accusantium ullam! Minima, facere. Laudantium
            impedit facilis possimus, quo natus voluptatem officiis vero, atque dicta dolore excepturi repudiandae
            veniam nisi odio voluptatum delectus quisquam ratione placeat assumenda sit.</p>
        </ReadMore>
      </template>
      <template #disclaimer>
        <p>
          Carefully review the proposed action and input.
        </p>
      </template>
    </ChatDetails>
    <ChatDetails :id="'list-allowed-directories-confirm'" :toggleable="true">
      <template #default>
        <p class="tool-executed-title"
          style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <span>Ran <code class="snippet">list_allowed_directories</code></span>
          <vscode-icon name="check" style="color: var(--vscode-debugIcon-startForeground);"></vscode-icon>
        </p>
      </template>
      <template #content>
        <p>This tool is from the <a href="#">filesystem</a> MCP server.</p>
        <p style="font-weight: bold; margin-top: 12px;">Input:</p>
        <CodeBlock lang='json' :code="listAllowedInput" :theme="{ light: 'light-plus', dark: 'dark-plus' }"></CodeBlock>
        <p style="font-weight: bold;">Output:</p>
        <CodeBlock :expandable="true" lang='json' :code="listAllowedOutput" :theme="{ light: 'light-plus', dark: 'dark-plus' }">
        </CodeBlock>
        <ReadMore>
          <p style="font-weight: bold;">Tool Description:</p>
          <p>
            Returns the list of directories that this server is allowed to access. Use this to understand which
            directories are available before trying to access files.
          </p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus non optio similique necessitatibus neque,
            est iure ratione officia voluptatum explicabo totam tenetur! Odio aliquid quaerat placeat minima quos! Amet
            sequi laboriosam ducimus repellat sed distinctio asperiores repudiandae nihil? Quasi, eligendi?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit culpa corrupti, iusto ad fugit, ex pariatur
            reprehenderit consequatur veniam minus non at architecto accusamus nulla. Et ratione veniam eligendi id
            architecto doloremque tempore sint tempora soluta deserunt officia nesciunt modi pariatur ut autem
            necessitatibus, recusandae ipsum corporis, minima eius, accusantium ullam! Minima, facere. Laudantium
            impedit facilis possimus, quo natus voluptatem officiis vero, atque dicta dolore excepturi repudiandae
            veniam nisi odio voluptatum delectus quisquam ratione placeat assumenda sit.</p>
        </ReadMore>
      </template>
    </ChatDetails>
    <Message :id="'list-allowed-directories-confirm-message'">
      <p>Great, I have access to the desktop folder. I'll now list the contents of that folder.</p>
    </Message>
    <ChatDetails :id="'list-directories'">
      <template #default>
        <p class="tool-executed-title">
          <span>Run <code class="snippet">list_directories</code></span>
        </p>
      </template>
      <template #buttons>
        <div style="display: flex; gap: 8px;">
          <SplitButton @click="showListDirsConfirmation">
            Continue
            <template #menu>
              <p>Allow in this Session</p>
              <p>Allow in this Workspace</p>
              <p>Always Allow</p>
            </template>
          </SplitButton>
          <vscode-button @click="cancelListDirsDialog" secondary>Cancel</vscode-button>
        </div>
      </template>
      <template #content>
        <p>This tool is from the <a href="#">filesystem</a> MCP server.</p>
        <p style="font-weight: bold; margin-top: 12px;">Input:</p>
        <CodeBlock lang='json' :code="listDirsInput" :theme="{ light: 'light-plus', dark: 'dark-plus' }"></CodeBlock>
        <ReadMore>
          <p style="font-weight: bold;">Tool Description:</p>
          <p>
            Get a detailed listing of all files and directories in a specified path. Results clearly distinguish between
            files and directories with [FILE] and [DIR] prefixes. This tool is essential for understanding directory
            structure and finding specific files within a directory. Only works within allowed directories.
          </p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus non optio similique necessitatibus neque,
            est iure ratione officia voluptatum explicabo totam tenetur! Odio aliquid quaerat placeat minima quos! Amet
            sequi laboriosam ducimus repellat sed distinctio asperiores repudiandae nihil? Quasi, eligendi?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit culpa corrupti, iusto ad fugit, ex pariatur
            reprehenderit consequatur veniam minus non at architecto accusamus nulla. Et ratione veniam eligendi id
            architecto doloremque tempore sint tempora soluta deserunt officia nesciunt modi pariatur ut autem
            necessitatibus, recusandae ipsum corporis, minima eius, accusantium ullam! Minima, facere. Laudantium
            impedit facilis possimus, quo natus voluptatem officiis vero, atque dicta dolore excepturi repudiandae
            veniam nisi odio voluptatum delectus quisquam ratione placeat assumenda sit.</p>
        </ReadMore>
      </template>
      <template #disclaimer>
        <p>
          <vscode-icon name="info"></vscode-icon> Carefully review the proposed action and input.
        </p>
      </template>
    </ChatDetails>
    <ChatDetails :id="'list-directories-confirm'" :toggleable="true">
      <template #default>
        <p class="tool-executed-title"
          style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <span>Ran <code class="snippet">list_directories</code></span>
          <vscode-icon name="check" style="color: var(--vscode-debugIcon-startForeground);"></vscode-icon>
        </p>
      </template>
      <template #content>
        <p>This tool is from the <a href="#">filesystem</a> MCP server.</p>
        <p style="font-weight: bold; margin-top: 12px;">Input:</p>
        <CodeBlock lang='json' :code="listDirsInput" :theme="{ light: 'light-plus', dark: 'dark-plus' }"></CodeBlock>
        <p style="font-weight: bold;">Output:</p>
        <CodeBlock :expandable="true" lang='json' :code="listDirsOutput" :theme="{ light: 'light-plus', dark: 'dark-plus' }">
        </CodeBlock>
        <ReadMore>
          <p style="font-weight: bold;">Tool Description:</p>
          <p>
            Get a detailed listing of all files and directories in a specified path. Results clearly distinguish between
            files and directories with [FILE] and [DIR] prefixes. This tool is essential for understanding directory
            structure and finding specific files within a directory. Only works within allowed directories.
          </p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus non optio similique necessitatibus neque,
            est iure ratione officia voluptatum explicabo totam tenetur! Odio aliquid quaerat placeat minima quos! Amet
            sequi laboriosam ducimus repellat sed distinctio asperiores repudiandae nihil? Quasi, eligendi?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit culpa corrupti, iusto ad fugit, ex pariatur
            reprehenderit consequatur veniam minus non at architecto accusamus nulla. Et ratione veniam eligendi id
            architecto doloremque tempore sint tempora soluta deserunt officia nesciunt modi pariatur ut autem
            necessitatibus, recusandae ipsum corporis, minima eius, accusantium ullam! Minima, facere. Laudantium
            impedit facilis possimus, quo natus voluptatem officiis vero, atque dicta dolore excepturi repudiandae
            veniam nisi odio voluptatum delectus quisquam ratione placeat assumenda sit.</p>
        </ReadMore>
      </template>
    </ChatDetails>
    <Message :id="'list-directories-confirm-message'">
      <p>Your desktop contains the following items:</p>
      <ol>
        <li>A hidden file: <code class="snippet">.DS_Store</code></li>
        <li>Another hidden file: <code class="snippet">.localized</code></li>
        <li>A folder named <code class="snippet">april-website</code></li>
        <li>A folder named <code class="snippet">screenshots</code></li>
        <li>Fifteen folders named <code class="snippet">temp-1</code> to <code class="snippet">temp-15</code></li>
      </ol>
      <p>Let me know if you'd like to explore any of these further!</p>
    </Message>
    <Chat>
      <vscode-textfield value="I'm a fake prompt. Click submit."></vscode-textfield>
      <vscode-button @click="showFirstTimeDialog">Submit (first timer)</vscode-button>
      <vscode-button @click="showListAllowedDirsDialog">Submit</vscode-button>
    </Chat>
  </section>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
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

details.proposed-changes {
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

details.proposed-changes summary {
  cursor: pointer;
  user-select: none;
  font-weight: bold;
}

details.proposed-changes ul {
  padding-left: 20px;
}

details.proposed-changes ul li,
details.proposed-changes ol li {
  margin-bottom: 2px;
}

details.proposed-changes ul li ul {
  list-style: disc;
  padding-left: 20px;
}

details.proposed-changes ul li ul li {
  margin-bottom: 0;
}

.chat-thread {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 575px;
  gap: 1.5rem;
  margin-top: 40px;
  overflow: scroll;
  height: 87vh;
  padding-bottom: 2rem;
}

#list-allowed-directories-confirm-message,
#list-directories-confirm-message {
  display: none;
}
</style>