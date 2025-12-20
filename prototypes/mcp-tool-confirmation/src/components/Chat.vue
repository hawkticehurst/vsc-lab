<template>
	<section class="chat">
		<slot></slot>
	</section>
</template>

<style>
.chat {
	background-color: var(--vscode-menu-background);
	padding: 12px;
	border-radius: 8px;
	border: 1px solid var(--vscode-menu-border);
	display: flex;
	flex-direction: row;
	gap: 16px;
	outline: none;
	position: absolute;
	bottom: 20px;
	transform: translateX(-50%);
	left: 50%;
}
</style>