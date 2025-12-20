<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['click']);
const isMenuVisible = ref(false);

// Toggle the menu visibility
const toggleMenu = () => {
	isMenuVisible.value = !isMenuVisible.value;
};

// Handle primary button click
const handleClick = () => {
	emit('click');
};
</script>

<template>
	<div class="split-button">
		<vscode-button class="split-button-primary" @click="handleClick">
			<slot></slot>
		</vscode-button>
		<div class="split-button-divider">
			<div class="split-button-line"></div>
		</div>
		<vscode-button class="split-button-secondary" @click="toggleMenu">
			<vscode-icon name="chevron-down"></vscode-icon>
		</vscode-button>
		<div class="split-button-menu" v-if="isMenuVisible">
			<slot name="menu"></slot>
		</div>
	</div>
</template>

<style>
.split-button {
	display: flex;
	align-items: center;
	position: relative;
}

.split-button vscode-button:focus {
	outline: none;
}

.split-button-primary {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border-right: none;
}

.split-button-secondary {
	border-left: none;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	height: 100%;
	display: grid;
	place-items: center;
	padding: 0 8px;
}

.split-button-secondary vscode-icon {
	margin: 0;
}

.split-button-divider {
	border-top: 1px solid var(--vscode-button-border);
	border-bottom: 1px solid var(--vscode-button-border);
	background-color: var(--vscode-button-background);
	height: 100%;
	display: grid;
	place-items: center;
	padding: 4px 0;
}

.split-button-line {
	width: 1px;
	height: 100%;
	background-color: var(--vscode-button-separator);
}

.split-button-menu {
	position: absolute;
	top: 110%;
	left: 72%;
	width: max-content;
	background: var(--vscode-menu-background);
	border: 1px solid var(--vscode-menu-border);
	border-radius: 4px;
	padding: 4px;
	z-index: 999;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.split-button-menu > p {
	margin: 0;
	padding: 0px 8px;
	line-height: 1.5;
	border-radius: 4px;
}

.split-button-menu > p:hover {
	background-color: var(--vscode-menu-selectionBackground);
	cursor: pointer;
}
</style>