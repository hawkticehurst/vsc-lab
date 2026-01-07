// Initialize picker menus for mode and model pickers
// Uses class-based visibility toggle for dropdown menus

export function initPickerMenus() {
	const modePickerContainer = document.querySelector('.mode-picker-container');
	const modelPickerContainer = document.querySelector('.model-picker-container');

	if (!modePickerContainer && !modelPickerContainer) return;

	// Setup mode picker
	if (modePickerContainer) {
		const modePicker = modePickerContainer.querySelector('mode-picker');
		const modeMenu = modePickerContainer.querySelector('.mode-picker-menu');

		if (modePicker && modeMenu) {
			setupPickerMenu(modePicker, modeMenu, (option) => {
				const label = option.querySelector('option-label')?.textContent;
				if (label) {
					// Update the picker text (keep the SVG chevron)
					const svg = modePicker.querySelector('svg');
					modePicker.textContent = '';
					modePicker.append(label + ' ', svg);
				}
			});
		}
	}

	// Setup model picker
	if (modelPickerContainer) {
		const modelPicker = modelPickerContainer.querySelector('model-picker');
		const modelMenu = modelPickerContainer.querySelector('.model-picker-menu');

		if (modelPicker && modelMenu) {
			setupPickerMenu(modelPicker, modelMenu, (option) => {
				const label = option.querySelector('option-label')?.textContent;
				if (label) {
					// Update the picker text (keep the SVG chevron)
					const svg = modelPicker.querySelector('svg');
					modelPicker.textContent = '';
					modelPicker.append(label + ' ', svg);
				}
			});
		}
	}
}

function setupPickerMenu(picker, menu, onSelect) {
	// Toggle menu on picker click
	picker.addEventListener('click', (e) => {
		e.stopPropagation();
		const isOpen = menu.classList.contains('open');
		
		// Close any other open menus first
		document.querySelectorAll('.picker-menu.open').forEach(m => {
			if (m !== menu) m.classList.remove('open');
		});
		
		// Toggle this menu
		menu.classList.toggle('open', !isOpen);
	});

	// Handle option selection
	menu.addEventListener('click', (e) => {
		const option = e.target.closest('menu-option');
		if (!option) return;

		// Update selected state
		menu.querySelectorAll('menu-option').forEach(opt => {
			opt.removeAttribute('selected');
		});
		option.setAttribute('selected', '');

		// Call the onSelect callback
		onSelect(option);

		// Close the menu
		menu.classList.remove('open');
	});

	// Close menu when clicking outside
	document.addEventListener('click', (e) => {
		if (!menu.contains(e.target) && !picker.contains(e.target)) {
			menu.classList.remove('open');
		}
	});

	// Close menu on Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			menu.classList.remove('open');
		}
	});
}
