<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
	name: 'ToggleQuickPickOption',
	props: {
		selected: {
			type: Boolean,
			default: false
		},
		checked: {
			type: Boolean,
			default: false
		},
		bold: {
			type: Boolean,
			default: false
		},
		isServer: {
			type: Boolean,
			default: false
		}
	},
	emits: ['toggle'],
	setup(props, { emit }) {
		const checkboxRef = ref(null);

		// Keep local state in sync with prop
		watch(() => props.checked, (newValue) => {
			if (checkboxRef.value) {
				checkboxRef.value.checked = newValue;
			}
		});

		// Handle click on the option item - this now passes the isServer information
		const toggleCheckbox = () => {
			emit('toggle', !props.checked);
		};

		// Handle the checkbox's direct change event
		const handleCheckboxChange = (event) => {
			event.stopPropagation();
			// Emit the toggle with the new value
			emit('toggle', event.target.checked);
		};

		return {
			checkboxRef,
			toggleCheckbox,
			handleCheckboxChange
		};
	}
});
</script>

<template>
	<section class="quick-pick-option" :class="{ 'selected': selected, 'server-option': isServer }"
		@click="toggleCheckbox">
		<vscode-checkbox ref="checkboxRef" :checked="checked" @click.stop @change="handleCheckboxChange"></vscode-checkbox>
		<div class="quick-pick-option-content">
			<div class="option-label" :class="{ 'bold': bold }">
				<slot></slot>
			</div>
			<div class="option-description">
				<slot name="description"></slot>
			</div>
		</div>
		<div class="quick-pick-option-metadata">
			<slot name="metadata"></slot>
			<vscode-button v-if="isServer && selected" appearance="icon">
				<vscode-icon name="settings-gear"></vscode-icon>
			</vscode-button>
		</div>
	</section>
</template>

<style>
.quick-pick-option {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 2px 6px;
	border-radius: 4px;
	background-color: var(--vscode-menu-background);
	color: var(--vscode-menu-foreground);
	border: 1px solid transparent;
	cursor: pointer;
}

.quick-pick-option:hover {
	/* This background color variable should not be changed */
	background-color: var(--vscode-menu-separatorBackground);
}

.quick-pick-option.selected .quick-pick-option-metadata {
	color: var(--vscode-menu-foreground);
}

.quick-pick-option.selected {
	background-color: var(--vscode-inputOption-activeBackground);
}

.quick-pick-option-content {
	flex-grow: 1;
	display: flex;
	flex-direction: row;
	align-items: baseline;
	gap: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	user-select: none;
}

.option-label {
	font-weight: 500;
	width: max-content;
	white-space: nowrap;
}

.option-label.bold {
	font-weight: 500;
}

.option-description {
	font-size: 0.9em;
	color: var(--vscode-descriptionForeground);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.quick-pick-option-metadata {
	color: light-dark(var(--vscode-list-deemphasizedForeground), var(--vscode-focusBorder));
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 8px;
}
</style>