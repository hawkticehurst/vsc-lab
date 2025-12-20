<script setup lang='ts'>
import { defineProps, ref, computed } from 'vue';

const props = defineProps({
	id: {
		type: String,
		default: 'tool-confirmation'
	},
	toggleable: {
		type: Boolean,
		default: true
	}
});

const isExpanded = ref(false);
const toggleExpanded = () => {
	if (props.toggleable) {
		isExpanded.value = !isExpanded.value;
	}
};

const showContent = computed(() => props.toggleable ? isExpanded.value : false);

// Animation handlers
const onEnter = (el: Element, done: () => void) => {
	const element = el as HTMLElement;
	// Set initial height to auto to get the full height including expanded content
	element.style.height = 'auto';
	const height = element.offsetHeight + 'px';
	element.style.height = '0px';
	// Force browser to acknowledge the change
	void element.offsetHeight;
	// Set height to auto after transition to allow for dynamic content changes
	element.style.height = height;
	const handleTransitionEnd = () => {
		element.style.height = 'auto';
		done();
	};
	element.addEventListener('transitionend', handleTransitionEnd, { once: true });
};

const onLeave = (el: Element, done: () => void) => {
	const element = el as HTMLElement;
	// Get current height before collapse
	const height = element.offsetHeight + 'px';
	element.style.height = height;
	// Force browser to acknowledge the change
	void element.offsetHeight;
	element.style.height = '0px';
	element.addEventListener('transitionend', done, { once: true });
};
</script>

<template>
	<section class="tool-executed" :class="{ 'non-toggleable': !toggleable }" :id="id">
		<div class="box">
			<div class="tool-executed-header" @click="toggleExpanded" :class="{ 'toggleable': toggleable }">
				<span class="tool-executed-title">
					<template v-if="toggleable">
						<vscode-icon name="chevron-down" :style="{ display: isExpanded ? 'block' : 'none' }"></vscode-icon>
						<vscode-icon name="chevron-right" :style="{ display: !isExpanded ? 'block' : 'none' }"></vscode-icon>
					</template>
					<slot></slot>
				</span>
			</div>
			<transition name="toggle-content" @enter="onEnter" @leave="onLeave">
				<div class="tool-executed-content" v-show="showContent">
					<slot name="content"></slot>
				</div>
			</transition>
			<template v-if="$slots.buttons">
				
			</template>
			<template v-if="$slots.disclaimer">
				<div class="tool-executed-footer">
					<span class="tool-disclaimer">
						<slot name="disclaimer"></slot>
					</span>
					<span class="tool-execution-buttons">
						<slot name="buttons"></slot>
					</span>
				</div>
			</template>
		</div>
	</section>
</template>

<style>
.tool-executed {
	display: flex;
	flex-direction: column;
	gap: 4px;
	width: 575px;
	outline: none;
	display: none;
}

.box {
	background-color: var(--vscode-menu-background);
	padding: 4px;
	border-radius: 8px;
	border: 1px solid var(--vscode-menu-border);
}

.tool-executed.non-toggleable .tool-executed-header {
	background-color: transparent;
	border: none;
}

.tool-executed.non-toggleable .tool-executed-header:hover {
	background-color: transparent;
}

.tool-executed-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-weight: 500;
	padding: 2px;
	border-radius: 4px;
	width: 100%;
}

.tool-executed-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}

.tool-executed-title vscode-icon {
	padding: 0;
}

.tool-executed-header>vscode-icon {
	top: 0px;
}

.tool-executed-header.toggleable {
	cursor: pointer;
}

.tool-executed-header:has(:not(vscode-icon)) {
	padding-left: 8px;
}

.tool-executed-header:hover {
	background-color: var(--vscode-list-hoverBackground);
}

.tool-execution-buttons {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 8px;
}

.tool-executed-content {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 8px;
	overflow: visible;
}

.tool-information {
	display: flex;
	flex-direction: column;
	gap: 8px;
	border-top: solid 1px var(--vscode-input-border);
	padding-top: 16px;
	margin-top: 24px;
}

.tool-executed-footer {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 8px;
	margin-top: 8px;
}

.tool-disclaimer {
	font-size: 14px;
}

/* Animation styles */
.toggle-content-enter-active,
.toggle-content-leave-active {
	transition: height 0.3s ease-in-out;
	overflow: hidden;
	will-change: height;
}

.toggle-content-enter-from,
.toggle-content-leave-to {
	height: 0;
}
</style>