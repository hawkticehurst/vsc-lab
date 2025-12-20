<script setup lang='ts'>
import { defineProps } from 'vue';
defineProps({
	id: {
		type: String,
		default: 'tool-confirmation'
	}
});
</script>
<!-- 
<p>
	<vscode-icon name="info"></vscode-icon>This tool is from 'filesystem' (MCP Server). Note that MCP servers or
	malicious conversation content may attempt to misuse 'Code - Insiders' through tools. Please carefully review any requested actions.
</p>
-->
<!-- <details>
			<summary>Run <code class="snippet">list_allowed_directories</code></summary>
			<div class="tool-confirmation__content">
				<p>This tool is from <code class="snippet">filesystem</code> (MCP Server).</p>
				<p>
					Returns the list of directories that this server is allowed to access. Use this to understand which
					directories
					are available before trying to access files.
				</p>
				<CodeBlock lang='typescript' :code="code" :theme="{
					light: 'light-plus',
					dark: 'dark-plus'
				}"></CodeBlock>
				<p>
					<vscode-icon name="info"></vscode-icon> Note that MCP servers or
					malicious conversation content may attempt to misuse 'Code - Insiders' through tools. Please carefully review
					any requested actions.
				</p>
			</div>
		</details> -->
<template>
	<section class="tool-confirmation" :id="id">
		<slot></slot>
	</section>
</template>
<style>
.tool-confirmation {
	background-color: var(--vscode-menu-background);
	padding: 8px 12px 12px 12px;
	border-radius: 8px;
	border: 1px solid var(--vscode-menu-border);
	width: 575px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	outline: none;
	display: none;
}

.tool-confirmation__content {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 16px;
}

.tool-confirmation .tool-details {
	width: 100%;
	background-color: var(--vscode-menu-background);
	border: none;
	padding: 0;
	border-radius: 0;
	position: relative;
	z-index: 10;
}

.tool-confirmation .tool-details summary {
	font-weight: 700;
	cursor: pointer;
}

.tool-confirmation .tool-details summary:focus-visible {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: 0px;
	width: fit-content;
}

.tool-confirmation-first-time-title {
	font-weight: 700;
}
</style>