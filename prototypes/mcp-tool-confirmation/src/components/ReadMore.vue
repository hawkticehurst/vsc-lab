<script setup lang="ts">
import { ref } from 'vue';

const expanded = ref(false);

const toggleExpand = () => {
	expanded.value = !expanded.value;
};
</script>

<template>
	<div class="read-more" :class="{ expanded }">
		<div class="content">
			<slot></slot>
		</div>
		<span @click="toggleExpand" class="read-more-button">{{ expanded ? 'See less' : 'See more' }}</span>
	</div>
</template>

<style>
.read-more {
	display: flex;
	flex-direction: column;
	gap: 8px;
	/* border-top: solid 1px var(--vscode-input-border); */
	/* padding-top: 16px; */
	margin-top: 12px;
	cursor: pointer;
	position: relative;
}

.read-more .content {
	display: flex;
	flex-direction: column;
	gap: 8px;
	height: 3.5rem;
	overflow: hidden;
	/* text-overflow: ellipsis; */
	transition: all 0.3s ease-in-out;
}

.read-more.expanded .content {
	height: auto;
}

.read-more-button {
	color: var(--vscode-textLink-foreground);
	font-size: 0.9em;
}

/* .read-more:not(.expanded) .content {
	-webkit-line-clamp: 2;
	line-clamp: 2;
	display: -webkit-box;
	-webkit-box-orient: vertical;
} */
</style>