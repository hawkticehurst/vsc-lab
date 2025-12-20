<script>
import ToggleQuickPickOption from './ToggleQuickPickOption.vue'
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
	name: 'QuickPick',
	components: {
		ToggleQuickPickOption
	},
	setup() {
		const selectedIndex = ref(0);
		const isTextFieldFocused = ref(true);
		const textFieldRef = ref(null);
		const optionsContainerRef = ref(null);
		const quickPickRef = ref(null);
		const headerCheckboxRef = ref(null);

		// Restructured options with groups
		const optionGroups = ref([
			// {
			// 	name: 'GitHub Copilot Chat',
			// 	options: [
			// 		{ label: 'GitHub Copilot Chat', description: '', metadata: 'from extension', checked: true, bold: true },
			// 		{ label: 'Codebase', description: 'References relevant file chunks, symbols, and other information in your codebase.', checked: true },
			// 		{ label: 'Find Usages', description: '', checked: true },
			// 		{ label: 'VS Code API', description: 'Use VS Code API to find references to answer questions about VS Code extension...', checked: true },
			// 		{ label: 'Git Changes', description: '', checked: true },
			// 		{ label: 'Test Failure', description: 'Include information about the last unit test failure.', checked: true },
			// 		{ label: 'Terminal Selection', description: 'The active terminal\'s selection.', checked: true },
			// 		{ label: 'Terminal Last Command', description: 'The active terminal\'s last run command.', checked: true },
			// 	]
			// },
			// {
			// 	name: 'poppy-framework',
			// 	options: [
			// 		{ label: 'MCP Server: poppy-framework', description: '', metadata: 'from your workspace', checked: true, bold: true },
			// 		{ label: 'poppy_state', description: 'Get an example of a Poppy state declaration. Use this to understand how to declare a Poppy state in your code.', checked: true },
			// 		{ label: 'create_poppy_component', description: 'Create a Poppy component. Use this to create a new Poppy component.', checked: true }
			// 	]
			// },
			{
				name: 'filesystem',
				options: [
					{ label: 'MCP Server: filesystem', description: '', metadata: 'from claude_desktop_config.json', checked: true, bold: true },
					{ label: 'read_file', description: 'Read the complete contents of a file from the file system.', checked: true },
					{ label: 'read_multiple_file', description: 'Read the complete contents of multiple files simultaneously.', checked: true },
					{ label: 'write_file', description: 'Create a new file or completely overwrite an existing file with new content.', checked: true },
					{ label: 'edit_file', description: 'Make line based edits to a file.', checked: true },
					{ label: 'create_directory', description: 'Create a new directory or ensure a directory exists.', checked: true },
					{ label: 'list_directory', description: 'Get a detailed list of all files and directories in a specified path.', checked: true },
				]
			},
			{
				name: 'cloudflare',
				options: [
					{ label: 'MCP Server: cloudflare', description: '', metadata: 'from .cursor/mcp.json', checked: true, bold: true },
					{ label: 'r2_list_buckets', description: 'List all R2 buckets in your account.', checked: true },
					{ label: 'r2_create_bucket', description: 'Create a new R2 bucket.', checked: true },
					{ label: 'r2_delete_bucket', description: 'Delete an R2 bucket.', checked: true },
					// { label: 'r2_list_objects', description: 'List objects in an R2 bucket.', checked: true },
					// { label: 'r2_get_object', description: 'Get an object from an R2 bucket.', checked: true },
					// { label: 'r2_put_object', description: 'Put an object into an R2 bucket.', checked: true },
				]
			},
			{
				name: 'Azure',
				options: [
					{ label: 'GitHub Copilot for Azure', description: '', metadata: 'from extension', checked: true, bold: true },
					{ label: 'cost', description: 'Provide detailed cost analysis for Azure services.', checked: true },
					{ label: 'resource', description: 'Get detailed information about a specific Azure resource.', checked: true },
					{ label: 'subscription', description: 'Get detailed information about a specific Azure subscription.', checked: true },
					{ label: 'resource_group', description: 'Get detailed information about a specific Azure resource group.', checked: true },
					{ label: 'location', description: 'Get detailed information about a specific Azure location.', checked: true },
					{ label: 'service', description: 'Get detailed information about a specific Azure service.', checked: true },
				]
			}
		]);

		// Computed property to determine if all options are checked
		const allOptionsChecked = computed(() => {
			return optionGroups.value.every(group =>
				group.options.every(option => option.checked)
			);
		});

		// New computed property for each group to determine if all tools are checked
		const areAllToolsChecked = (groupIndex) => {
			const group = optionGroups.value[groupIndex];
			// Skip the first item (server) and check all tool items
			return group.options.slice(1).every(option => option.checked);
		};

		// Function to toggle all options
		const toggleAllOptions = (checked) => {
			optionGroups.value.forEach(group => {
				group.options.forEach(option => {
					option.checked = checked;
				});
			});
			// Update flattened options
			flattenOptions();
		};

		// Flatten options for navigation
		const flattenedOptions = ref([]);

		// Prepare flattened options array for keyboard navigation
		const flattenOptions = () => {
			const flattened = [];
			optionGroups.value.forEach(group => {
				group.options.forEach(option => {
					flattened.push({
						...option,
						groupName: group.name
					});
				});
			});
			flattenedOptions.value = flattened;
		};

		// Call this initially to set up the flattened options
		flattenOptions();

		// Function to toggle all tools in a group
		const toggleGroupTools = (groupIndex, checked) => {
			const group = optionGroups.value[groupIndex];
			// Start from index 1 to skip the server item
			for (let i = 1; i < group.options.length; i++) {
				group.options[i].checked = checked;
			}
		};

		// Handle option toggling with server-specific logic
		const toggleOption = (groupIndex, optionIndex, checked) => {
			// Store current state to detect if this is the first toggle
			const currentOption = optionGroups.value[groupIndex].options[optionIndex];
			const isFirstToggle = currentOption.checked !== checked;

			// Update the clicked option's state
			currentOption.checked = checked;

			// Only do group toggling for server items (first item in group)
			if (optionIndex === 0) {
				// Toggle all associated tools
				toggleGroupTools(groupIndex, checked);
			} else {
				// For tool items, update the server based on all tool states
				const allToolsChecked = areAllToolsChecked(groupIndex);
				optionGroups.value[groupIndex].options[0].checked = allToolsChecked;
			}

			// Update flattened options to ensure UI reflects changes
			flattenOptions();

			// Update header checkbox based on all options state
			if (headerCheckboxRef.value) {
				headerCheckboxRef.value.checked = allOptionsChecked.value;
			}
		};

		// Handle clicking outside of the quick pick
		const handleClickOutside = (event) => {
			// Check if the click was outside the quick pick
			if (quickPickRef.value && !quickPickRef.value.contains(event.target)) {
				handleEscape(); // Reuse the escape logic for consistency
			}
		};

		// Handle escape key to clear selection/focus
		const handleEscape = () => {
			// Remove focus from any element by focusing and then blurring the container
			if (quickPickRef.value) {
				quickPickRef.value.focus();
				quickPickRef.value.blur();
			}

			// Reset selection state
			isTextFieldFocused.value = false;
			selectedIndex.value = -1; // No option selected
		};

		const handleKeyDown = (event) => {
			// Handle escape key
			if (event.key === 'Escape') {
				event.preventDefault();
				handleEscape();
				return;
			}

			// Handle arrow key navigation
			if (event.key === 'ArrowDown') {
				event.preventDefault();

				if (isTextFieldFocused.value) {
					// Move focus from text field to options
					isTextFieldFocused.value = false;
					selectedIndex.value = 0;
					// Explicitly blur the text field
					textFieldRef.value?.blur();
				} else if (selectedIndex.value === flattenedOptions.value.length - 1) {
					// If at the last option, circle back to text field
					isTextFieldFocused.value = true;
					textFieldRef.value?.focus();
				} else {
					// Move to next option
					selectedIndex.value++;
				}
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();

				if (isTextFieldFocused.value) {
					// Move from text field to last option
					isTextFieldFocused.value = false;
					selectedIndex.value = flattenedOptions.value.length - 1;
					// Explicitly blur the text field
					textFieldRef.value?.blur();
				} else if (selectedIndex.value === 0) {
					// Move from first option back to text field
					isTextFieldFocused.value = true;
					textFieldRef.value?.focus();
				} else {
					// Move to previous option
					selectedIndex.value--;
				}
			} else if (event.key === ' ' && !isTextFieldFocused.value && selectedIndex.value >= 0) {
				// Toggle the currently selected option when space is pressed
				event.preventDefault();

				// Find which group and option this is
				let currentFlatOption = flattenedOptions.value[selectedIndex.value];

				// Find the option in the original structure and toggle it
				for (let groupIndex = 0; groupIndex < optionGroups.value.length; groupIndex++) {
					const group = optionGroups.value[groupIndex];
					for (let optionIndex = 0; optionIndex < group.options.length; optionIndex++) {
						const option = group.options[optionIndex];
						if (option.label === currentFlatOption.label && option.description === currentFlatOption.description) {
							// Toggle the option with our enhanced toggle function
							toggleOption(groupIndex, optionIndex, !option.checked);
							return;
						}
					}
				}
			}
		};

		const handleTextFieldFocus = () => {
			isTextFieldFocused.value = true;
		};

		const handleContainerClick = (event) => {
			// Prevent clicks on the container from stealing focus
			if (event.target === optionsContainerRef.value) {
				event.preventDefault();
			}
		};

		onMounted(() => {
			// Add keydown and click listeners to the document
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('mousedown', handleClickOutside);

			// Focus the text field initially
			setTimeout(() => {
				textFieldRef.value?.focus();

				// Set initial state of header checkbox
				if (headerCheckboxRef.value) {
					headerCheckboxRef.value.checked = allOptionsChecked.value;
				}
			}, 0);
		});

		onBeforeUnmount(() => {
			// Clean up all event listeners
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousedown', handleClickOutside);
		});

		return {
			selectedIndex,
			optionGroups,
			flattenedOptions,
			isTextFieldFocused,
			textFieldRef,
			optionsContainerRef,
			quickPickRef,
			headerCheckboxRef,
			handleTextFieldFocus,
			handleContainerClick,
			toggleOption,
			toggleAllOptions,
			allOptionsChecked
		};
	}
});
</script>

<template>
	<section class="quick-pick" ref="quickPickRef">
		<div class="quick-pick-header">
			<vscode-checkbox ref="headerCheckboxRef" v-model="allOptionsChecked"
				@click="toggleAllOptions(!allOptionsChecked)"></vscode-checkbox>
			<vscode-text-field ref="textFieldRef" placeholder="Select tools that are available to chat"
				@focus="handleTextFieldFocus"></vscode-text-field>
			<vscode-button>OK</vscode-button>
		</div>
		<div class="quick-pick-options" ref="optionsContainerRef" @click="handleContainerClick">
			<template v-for="(group, groupIndex) in optionGroups" :key="groupIndex">
				<!-- Group options -->
				<div class="option-group">
					<ToggleQuickPickOption v-for="(option, optionIndex) in group.options" :key="optionIndex"
						:selected="!isTextFieldFocused && flattenedOptions.findIndex(o => o.label === option.label && o.description === option.description) === selectedIndex"
						:checked="option.checked" :bold="option.bold" :is-server="optionIndex === 0"
						:class="{ 'indented-option': optionIndex > 0 }"
						@toggle="checked => toggleOption(groupIndex, optionIndex, checked)">
						<span>{{ option.label }}</span>
						<template #description>
							<span>{{ option.description }}</span>
						</template>
						<template v-if="option.metadata" #metadata>
							<span>{{ option.metadata }}</span>
						</template>
					</ToggleQuickPickOption>
				</div>
			</template>
		</div>
	</section>
</template>

<style>
.quick-pick {
	background-color: var(--vscode-menu-background);
	padding: 8px;
	border-radius: 8px;
	border: 1px solid var(--vscode-menu-border);
	width: 700px;
	height: 500px;
	display: flex;
	flex-direction: column;
	outline: none;
}

.quick-pick-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 6px;
	position: sticky;
	top: 0;
	background-color: var(--vscode-menu-background);
	z-index: 10;
	padding-bottom: 8px;
}

.quick-pick-header>vscode-text-field {
	flex-grow: 1;
}

.quick-pick-options {
	display: flex;
	flex-direction: column;
	gap: 0;
	overflow-y: auto;
	padding: 0 2px;
}

.option-group {
	display: flex;
	flex-direction: column;
	padding: 4px 0;
	border-bottom: solid 1px var(--vscode-menu-border);
}

.option-group:last-child {
	border-bottom: none;
}

/* Add indentation to all options except the first in each group */
.indented-option {
	padding-left: 20px;
}
</style>