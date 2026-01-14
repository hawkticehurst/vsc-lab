// Initialize picker menus for mode and model pickers
// Uses class-based visibility toggle for dropdown menus

export function initPickerMenus() {
	const modePickerContainers = Array.from(document.querySelectorAll('.mode-picker-container'));
	const modelPickerContainers = Array.from(document.querySelectorAll('.model-picker-container'));
	const chatTypeContainers = Array.from(document.querySelectorAll('.chat-type-container'));
	const backgroundAgentContainers = Array.from(
		document.querySelectorAll('.background-agent-container'),
	);

	if (
		!modePickerContainers.length &&
		!modelPickerContainers.length &&
		!chatTypeContainers.length &&
		!backgroundAgentContainers.length
	) {
		return;
	}

	const initContainer = (container, pickerSelector, menuSelector) => {
		const picker = container.querySelector(pickerSelector);
		const menu = container.querySelector(menuSelector);

		if (!picker || !menu) return;

		setupPickerMenu(picker, menu, (option) => {
			const label = option.querySelector('option-label')?.textContent;
			if (label) {
				const svg = picker.querySelector('svg');
				picker.textContent = '';
				picker.append(label + ' ', svg);
			}
		});
	};

	modePickerContainers.forEach((container) =>
		initContainer(container, 'mode-picker', '.mode-picker-menu'),
	);
	modelPickerContainers.forEach((container) =>
		initContainer(container, 'model-picker', '.model-picker-menu'),
	);
	chatTypeContainers.forEach((container) =>
		initContainer(container, 'chat-type', '.chat-type-menu'),
	);
	backgroundAgentContainers.forEach((container) =>
		initContainer(container, 'background-agent', '.background-agent-menu'),
	);
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

		const label = option.querySelector('option-label')?.textContent?.trim();

		// Update selected state
		menu.querySelectorAll('menu-option').forEach(opt => {
			opt.removeAttribute('selected');
		});
		option.setAttribute('selected', '');

		// Call the onSelect callback
		onSelect(option);

		if (label) {
			picker.dispatchEvent(
				new CustomEvent('picker-change', {
					detail: { value: label },
				}),
			);
		}

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
