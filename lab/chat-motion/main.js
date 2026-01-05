// Simulated AI response tokens (mimicking streaming from an LLM)
const aiResponseText = `I'd be happy to help you create a React component for a todo list! Here's a simple but functional implementation:

\`\`\`typescript
import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: input,
        completed: false
      }]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  return (
    <div className="todo-list">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

This component includes:

• **State management** with useState for todos and input
• **TypeScript interfaces** for type safety
• **Add functionality** to create new todos
• **Toggle completion** by clicking checkboxes
• **Clean UI** with input field and button

Would you like me to add more features like delete, edit, or filtering?`;

// Parse response into tokens (words and special characters)
function tokenize(text) {
	const tokens = [];
	let currentToken = "";
	let inCodeBlock = false;
	let codeBlockContent = "";

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const nextChar = text[i + 1];
		const nextNextChar = text[i + 2];

		// Check for code block start/end
		if (char === "`" && nextChar === "`" && nextNextChar === "`") {
			if (!inCodeBlock) {
				// Push any pending token before code block
				if (currentToken) {
					tokens.push({ type: "text", content: currentToken });
					currentToken = "";
				}
				inCodeBlock = true;
				i += 2; // Skip the backticks
				// Find the language identifier
				let lang = "";
				while (i + 1 < text.length && text[i + 1] !== "\n") {
					i++;
					lang += text[i];
				}
				tokens.push({ type: "code-start", lang: lang.trim() });
			} else {
				// End of code block
				if (codeBlockContent) {
					tokens.push({ type: "code", content: codeBlockContent });
					codeBlockContent = "";
				}
				tokens.push({ type: "code-end" });
				inCodeBlock = false;
				i += 2; // Skip the backticks
			}
			continue;
		}

		if (inCodeBlock) {
			codeBlockContent += char;
			continue;
		}

		// Regular text tokenization
		if (char === " ") {
			if (currentToken) {
				tokens.push({ type: "text", content: currentToken });
				currentToken = "";
			}
			tokens.push({ type: "space", content: " " });
		} else if (char === "\n") {
			if (currentToken) {
				tokens.push({ type: "text", content: currentToken });
				currentToken = "";
			}
			tokens.push({ type: "newline", content: "\n" });
		} else if (/[.,!?;:'"()\[\]{}]/.test(char)) {
			if (currentToken) {
				tokens.push({ type: "text", content: currentToken });
				currentToken = "";
			}
			tokens.push({ type: "punctuation", content: char });
		} else {
			currentToken += char;
		}
	}

	if (currentToken) {
		tokens.push({ type: "text", content: currentToken });
	}

	return tokens;
}

// Tokenize code with syntax highlighting
function tokenizeCode(code) {
	const tokens = [];
	const keywords = [
		"import",
		"export",
		"function",
		"const",
		"let",
		"var",
		"return",
		"if",
		"else",
		"interface",
		"type",
		"from",
		"default",
		"new",
		"true",
		"false",
		"null",
		"undefined",
	];
	const types = ["React", "useState", "Todo", "number", "string", "boolean"];

	let current = "";
	let inString = false;
	let stringChar = "";

	for (let i = 0; i < code.length; i++) {
		const char = code[i];

		// Handle strings
		if ((char === '"' || char === "'" || char === "`") && !inString) {
			if (current) {
				tokens.push(classifyToken(current, keywords, types));
				current = "";
			}
			inString = true;
			stringChar = char;
			current = char;
			continue;
		}

		if (inString) {
			current += char;
			if (char === stringChar && code[i - 1] !== "\\") {
				tokens.push({ type: "string", content: current, class: "code-string" });
				current = "";
				inString = false;
			}
			continue;
		}

		// Handle spaces and newlines
		if (char === " " || char === "\n" || char === "\t") {
			if (current) {
				tokens.push(classifyToken(current, keywords, types));
				current = "";
			}
			tokens.push({ type: "whitespace", content: char });
			continue;
		}

		// Handle brackets and operators
		if (/[{}()\[\]<>:;,=+\-*/.?!&|]/.test(char)) {
			if (current) {
				tokens.push(classifyToken(current, keywords, types));
				current = "";
			}
			tokens.push({
				type: "operator",
				content: char,
				class: /[{}()\[\]<>]/.test(char) ? "code-bracket" : "code-operator",
			});
			continue;
		}

		current += char;
	}

	if (current) {
		tokens.push(classifyToken(current, keywords, types));
	}

	return tokens;
}

function classifyToken(token, keywords, types) {
	if (keywords.includes(token)) {
		return { type: "keyword", content: token, class: "code-keyword" };
	}
	if (types.includes(token)) {
		return { type: "type", content: token, class: "code-type" };
	}
	if (/^\d+$/.test(token)) {
		return { type: "number", content: token, class: "code-number" };
	}
	if (/^[a-z][a-zA-Z]*$/.test(token) && token.length > 2) {
		return { type: "identifier", content: token, class: "code-function" };
	}
	return { type: "text", content: token };
}

// Helper to normalize items: collapse consecutive newlines and remove leading/trailing newlines
function normalizeItems(items) {
	const result = [];
	let lastWasNewline = true; // Start true to skip leading newlines
	let lastWasCodeEnd = false;

	for (const item of items) {
		if (item.type === "code-start" || item.type === "code-end") {
			result.push(item);
			lastWasNewline = true; // Treat code boundaries like newlines for collapsing
			lastWasCodeEnd = item.type === "code-end";
		} else if (item.type === "newline") {
			// Skip if we already had a newline (or at start/after code block)
			if (!lastWasNewline) {
				result.push(item);
				lastWasNewline = true;
			}
			lastWasCodeEnd = false;
		} else {
			result.push(item);
			lastWasNewline = false;
			lastWasCodeEnd = false;
		}
	}

	// Remove trailing newlines
	while (result.length > 0 && result[result.length - 1].type === "newline") {
		result.pop();
	}

	return result;
}

// Animation implementations
class AnimationEngine {
	constructor(container) {
		this.container = container;
		this.tokens = tokenize(aiResponseText);
		this.currentAnimation = "fade";
		this.animationTimeouts = [];
		this.isAnimating = false;
		this.scrollContainer = document.getElementById("chatContent");
		this.isUserScrolling = false;
		this.scrollTimeout = null;

		// Smooth scroll animation state
		this.scrollAnimationId = null;
		this.targetScrollTop = 0;
		this.lastScrollTime = 0;

		// Track user scroll interaction
		this.scrollContainer.addEventListener("scroll", () => {
			// Check if user scrolled away from bottom
			const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer;
			const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

			// If user scrolls up while animating, stop auto-scroll
			if (this.isAnimating && !isAtBottom) {
				this.isUserScrolling = true;
			}

			// If user scrolls back to bottom, resume auto-scroll
			if (isAtBottom) {
				this.isUserScrolling = false;
			}
		});

		// Start the continuous scroll animation loop
		this.startScrollLoop();
	}

	// Continuous scroll animation loop for smooth following
	startScrollLoop() {
		const scrollLoop = (timestamp) => {
			if (this.isAnimating && !this.isUserScrolling) {
				const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer;
				const maxScroll = scrollHeight - clientHeight;

				// Only auto-scroll if we're near the bottom (within 150px) or at the start
				const isNearBottom = maxScroll - scrollTop < 150;
				const isAtStart = scrollTop < 50;

				if ((isNearBottom || isAtStart) && maxScroll > 0) {
					// Set target to the bottom
					this.targetScrollTop = maxScroll;

					// Calculate the distance to travel
					const distance = this.targetScrollTop - scrollTop;

					// Use an easing approach: move a percentage of the remaining distance each frame
					// This creates smooth deceleration as we approach the target
					const easingFactor = 0.15; // Adjust for faster/slower following (0.1-0.2 works well)
					const minStep = 1; // Minimum pixels to move to avoid getting stuck

					if (Math.abs(distance) > 0.5) {
						const step = Math.max(minStep, distance * easingFactor);
						this.scrollContainer.scrollTop = scrollTop + step;
					}
				}
			}

			this.scrollAnimationId = requestAnimationFrame(scrollLoop);
		};

		this.scrollAnimationId = requestAnimationFrame(scrollLoop);
	}

	// Stop the scroll animation loop
	stopScrollLoop() {
		if (this.scrollAnimationId) {
			cancelAnimationFrame(this.scrollAnimationId);
			this.scrollAnimationId = null;
		}
	}

	// Notify the scroll system that content has changed (called after adding tokens)
	autoScroll() {
		// The scroll loop handles everything continuously,
		// but we can use this to signal that content was added
		// This is now essentially a no-op since the loop handles it,
		// but we keep the method for API compatibility
	}

	setAnimation(type) {
		this.currentAnimation = type;
	}

	stop() {
		this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
		this.animationTimeouts = [];
		this.isAnimating = false;
		this.isUserScrolling = false;
		// Note: We don't stop the scroll loop here since it's persistent
		// and will just idle when isAnimating is false
	}

	start() {
		this.stop();
		this.container.innerHTML = "";
		this.container.className = `chat-meta animation-${this.currentAnimation}`;
		this.isAnimating = true;

		switch (this.currentAnimation) {
			case "fade":
				this.animateWithCSS(18, 5);
				break;
			case "rise":
				this.animateWithCSS(18, 5);
				break;
			case "drop":
				this.animateWithCSS(20, 5);
				break;
			case "blur":
				this.animateWithCSS(20, 5);
				break;
			case "scale":
				this.animateWithCSS(20, 5);
				break;
			case "slide":
				this.animateWithCSS(16, 4);
				break;
			case "reveal":
				this.animateWithCSS(14, 4);
				break;
			case "unfold":
				this.animateWithCSS(14, 4);
				break;
			case "drift":
				this.animateWithCSS(20, 5);
				break;
			case "expand":
				this.animateWithCSS(18, 5);
				break;
			case "line":
				this.animateLineByLine();
				break;
			case "line-rise":
				this.animateLineByLine("rise");
				break;
			case "line-slide":
				this.animateLineByLine("slide");
				break;
			case "line-blur":
				this.animateLineByLine("blur");
				break;
			case "line-scale":
				this.animateLineByLine("scale");
				break;
			case "line-expand":
				this.animateLineByLine("expand");
				break;
			case "line-reveal":
				this.animateLineByLine("reveal");
				break;
		}
	}

	// Generic CSS animation method - adds elements progressively for dynamic height
	animateWithCSS(baseDelay, spaceDelay) {
		let currentContainer = document.createElement("p");
		currentContainer.className = "chat-details";
		this.container.appendChild(currentContainer);

		// Track the current code block for smooth height animation
		let currentCodeBlock = null;
		let codeBlockWrapper = null;

		// Helper function to smoothly update code block height
		// Add a buffer to stay ahead of content so tokens aren't clipped during transition
		const LINE_HEIGHT_BUFFER = 24; // roughly one line of code
		function updateCodeBlockHeight() {
			if (currentCodeBlock && codeBlockWrapper) {
				const contentHeight = codeBlockWrapper.scrollHeight;
				currentCodeBlock.style.height = contentHeight + LINE_HEIGHT_BUFFER + "px";
			}
		}

		// Build flat list of items to add
		const items = [];

		for (const token of this.tokens) {
			if (token.type === "code-start") {
				items.push({ type: "code-start" });
			} else if (token.type === "code-end") {
				items.push({ type: "code-end" });
			} else if (token.type === "code") {
				const codeTokens = tokenizeCode(token.content);
				for (const codeToken of codeTokens) {
					items.push({
						type: "code-token",
						content: codeToken.content,
						class: codeToken.class || "",
						isWhitespace: codeToken.type === "whitespace",
					});
				}
			} else if (token.type === "newline") {
				items.push({ type: "newline" });
			} else if (token.type === "space") {
				items.push({ type: "space", content: token.content });
			} else {
				items.push({
					type: "word",
					content: token.content,
				});
			}
		}

		// Normalize items: collapse consecutive newlines and remove leading/trailing newlines
		const normalizedItems = normalizeItems(items);

		let itemIndex = 0;
		let inCodeBlock = false;
		const self = this;

		function addNext() {
			if (!self.isAnimating || itemIndex >= normalizedItems.length) {
				return;
			}

			const item = normalizedItems[itemIndex];
			itemIndex++;

			if (item.type === "code-start") {
				const codeBlock = document.createElement("div");
				codeBlock.className = "code-block";
				// Create inner wrapper for measuring content height
				const wrapper = document.createElement("div");
				wrapper.className = "code-block-content";
				codeBlock.appendChild(wrapper);
				self.container.appendChild(codeBlock);
				currentContainer = wrapper;
				currentCodeBlock = codeBlock;
				codeBlockWrapper = wrapper;
				// Set initial height to 0 and animate from there
				codeBlock.style.height = "0px";
				// Force a reflow so the initial height is registered before we start animating
				codeBlock.offsetHeight;
				inCodeBlock = true;
				self.autoScroll();
				self.animationTimeouts.push(setTimeout(addNext, 5));
				return;
			}

			if (item.type === "code-end") {
				// Smoothly settle to final height, then remove constraint
				if (currentCodeBlock && codeBlockWrapper) {
					const finalHeight = codeBlockWrapper.scrollHeight;
					currentCodeBlock.style.height = finalHeight + "px";
					// After transition completes, switch to auto
					const block = currentCodeBlock;
					setTimeout(() => {
						block.style.height = "auto";
					}, 150); // match CSS transition duration
				}
				currentCodeBlock = null;
				codeBlockWrapper = null;
				const newParagraph = document.createElement("p");
				newParagraph.className = "chat-details";
				self.container.appendChild(newParagraph);
				currentContainer = newParagraph;
				inCodeBlock = false;
				self.autoScroll();
				self.animationTimeouts.push(setTimeout(addNext, 5));
				return;
			}

			if (item.type === "newline") {
				if (inCodeBlock) {
					// Use text node for code block newlines (works with white-space: pre-wrap)
					currentContainer.appendChild(document.createTextNode("\n"));
					// Update height smoothly after newline
					updateCodeBlockHeight();
				} else {
					currentContainer.appendChild(document.createElement("br"));
				}
				self.autoScroll();
				self.animationTimeouts.push(setTimeout(addNext, 5));
				return;
			}

			if (item.type === "code-token") {
				if (item.isWhitespace) {
					// Whitespace in code: use text node (like typewriter)
					currentContainer.appendChild(document.createTextNode(item.content));
					// Update height if whitespace contains newline
					if (item.content.includes("\n")) {
						updateCodeBlockHeight();
					}
					self.autoScroll();
					self.animationTimeouts.push(setTimeout(addNext, 3));
				} else {
					// Non-whitespace code token: use animated span
					const span = document.createElement("span");
					span.className = `token code-token-anim ${item.class}`;
					span.textContent = item.content;
					currentContainer.appendChild(span);
					// Update height after adding content
					updateCodeBlockHeight();
					self.autoScroll();
					self.animationTimeouts.push(setTimeout(addNext, baseDelay));
				}
				return;
			}

			if (item.type === "space") {
				// Add space as a text node so it renders properly
				currentContainer.appendChild(document.createTextNode(item.content));
				self.animationTimeouts.push(setTimeout(addNext, spaceDelay));
				return;
			}

			// Word token - create animated span
			const span = document.createElement("span");
			span.className = "token";
			span.textContent = item.content;
			currentContainer.appendChild(span);

			self.autoScroll();

			self.animationTimeouts.push(setTimeout(addNext, baseDelay));
		}

		addNext();
	}

	// Line-by-line animation with buffering for smooth playback
	animateLineByLine(variant = "fade") {
		const BUFFER_TIME = 800; // ms to wait before starting animation (build up buffer)
		const TOKEN_STREAM_DELAY = 12; // ms between tokens arriving in buffer (simulated streaming)
		const LINE_DISPLAY_DELAY = 120; // ms between displaying each line
		const lineVariantClass = `line-${variant}`; // CSS class for the animation variant

		// Build flat list of items from tokens, converting consecutive newlines to paragraph-breaks
		const items = [];
		let consecutiveNewlines = 0;

		for (const token of this.tokens) {
			if (token.type === "code-start") {
				consecutiveNewlines = 0;
				items.push({ type: "code-start" });
			} else if (token.type === "code-end") {
				consecutiveNewlines = 0;
				items.push({ type: "code-end" });
			} else if (token.type === "code") {
				consecutiveNewlines = 0;
				const codeTokens = tokenizeCode(token.content);
				for (const codeToken of codeTokens) {
					items.push({
						type: "code-token",
						content: codeToken.content,
						class: codeToken.class || "",
						isWhitespace: codeToken.type === "whitespace",
					});
				}
			} else if (token.type === "newline") {
				consecutiveNewlines++;
				if (consecutiveNewlines === 1) {
					items.push({ type: "newline" });
				} else if (consecutiveNewlines === 2) {
					// Two newlines = paragraph break (replace the previous newline)
					items.pop(); // Remove the single newline we added
					items.push({ type: "paragraph-break" });
				}
				// Ignore additional consecutive newlines beyond 2
			} else if (token.type === "space") {
				consecutiveNewlines = 0;
				items.push({ type: "space", content: token.content });
			} else {
				consecutiveNewlines = 0;
				items.push({ type: "word", content: token.content });
			}
		}

		// Group items into lines
		const lines = [];
		let currentLine = [];
		let inCodeBlock = false;

		for (const item of items) {
			if (item.type === "code-start") {
				// Push current line if it has content
				if (currentLine.length > 0) {
					lines.push({ items: currentLine, isCode: false });
					currentLine = [];
				}
				lines.push({ type: "code-start" });
				inCodeBlock = true;
			} else if (item.type === "code-end") {
				// Push current code line if it has content
				if (currentLine.length > 0) {
					lines.push({ items: currentLine, isCode: true });
					currentLine = [];
				}
				lines.push({ type: "code-end" });
				inCodeBlock = false;
			} else if (item.type === "paragraph-break") {
				// Push current line and add paragraph break
				if (currentLine.length > 0) {
					lines.push({ items: currentLine, isCode: false });
					currentLine = [];
				}
				lines.push({ type: "paragraph-break" });
			} else if (item.type === "newline" || (item.type === "code-token" && item.content === "\n")) {
				// End of line
				lines.push({ items: currentLine, isCode: inCodeBlock });
				currentLine = [];
			} else if (item.type === "code-token" && item.isWhitespace && item.content.includes("\n")) {
				// Whitespace with newline - split it
				const parts = item.content.split("\n");
				for (let i = 0; i < parts.length; i++) {
					if (parts[i]) {
						currentLine.push({ ...item, content: parts[i] });
					}
					if (i < parts.length - 1) {
						lines.push({ items: currentLine, isCode: inCodeBlock });
						currentLine = [];
					}
				}
			} else {
				currentLine.push(item);
			}
		}

		// Push any remaining content
		if (currentLine.length > 0) {
			lines.push({ items: currentLine, isCode: inCodeBlock });
		}

		// Filter out empty lines (lines with no items) except for special types
		const filteredLines = lines.filter(
			(line) =>
				line.type === "code-start" ||
				line.type === "code-end" ||
				line.type === "paragraph-break" ||
				(line.items && line.items.length > 0),
		);

		// Buffer state - simulates tokens streaming in ahead of display
		let bufferedLineIndex = 0;
		let displayedLineIndex = 0;
		const self = this;

		// DOM elements
		let currentContainer = document.createElement("p");
		currentContainer.className = "chat-details";
		this.container.appendChild(currentContainer);

		let currentCodeBlock = null;
		let codeBlockWrapper = null;

		// Helper function to smoothly update code block height
		const LINE_HEIGHT_BUFFER = 24; // roughly one line of code
		function updateCodeBlockHeight() {
			if (currentCodeBlock && codeBlockWrapper) {
				const contentHeight = codeBlockWrapper.scrollHeight;
				currentCodeBlock.style.height = contentHeight + LINE_HEIGHT_BUFFER + "px";
			}
		}

		// Simulate token streaming into buffer
		function streamToBuffer() {
			if (!self.isAnimating || bufferedLineIndex >= filteredLines.length) return;

			bufferedLineIndex++;

			// Calculate delay based on line content (more tokens = more time)
			const line = filteredLines[bufferedLineIndex - 1];
			let tokenCount = 1;
			if (line.items) {
				tokenCount = line.items.length || 1;
			}

			const delay = TOKEN_STREAM_DELAY * Math.min(tokenCount, 20);
			self.animationTimeouts.push(setTimeout(streamToBuffer, delay));
		}

		// Display lines from buffer
		function displayNextLine() {
			if (!self.isAnimating) return;

			// Wait if buffer is empty (display caught up to stream)
			if (displayedLineIndex >= bufferedLineIndex) {
				if (bufferedLineIndex < filteredLines.length) {
					// Buffer is behind, wait a bit
					self.animationTimeouts.push(setTimeout(displayNextLine, 50));
				}
				return;
			}

			if (displayedLineIndex >= filteredLines.length) return;

			const line = filteredLines[displayedLineIndex];
			displayedLineIndex++;

			if (line.type === "code-start") {
				const codeBlock = document.createElement("div");
				codeBlock.className = "code-block line-code-block";
				const wrapper = document.createElement("div");
				wrapper.className = "code-block-content";
				codeBlock.appendChild(wrapper);
				self.container.appendChild(codeBlock);
				currentContainer = wrapper;
				currentCodeBlock = codeBlock;
				codeBlockWrapper = wrapper;
				// Set initial height to 0 and animate from there
				codeBlock.style.height = "0px";
				// Force a reflow so the initial height is registered before we start animating
				codeBlock.offsetHeight;
				self.autoScroll();
				self.animationTimeouts.push(setTimeout(displayNextLine, LINE_DISPLAY_DELAY / 2));
				return;
			}

			if (line.type === "paragraph-break") {
				// Start a new paragraph
				const newParagraph = document.createElement("p");
				newParagraph.className = "chat-details";
				self.container.appendChild(newParagraph);
				currentContainer = newParagraph;
				self.autoScroll();
				self.animationTimeouts.push(setTimeout(displayNextLine, LINE_DISPLAY_DELAY / 2));
				return;
			}

			if (line.type === "code-end") {
				// Smoothly settle to final height, then remove constraint
				if (currentCodeBlock && codeBlockWrapper) {
					const finalHeight = codeBlockWrapper.scrollHeight;
					currentCodeBlock.style.height = finalHeight + "px";
					// After transition completes, switch to auto
					const block = currentCodeBlock;
					setTimeout(() => {
						block.style.height = "auto";
					}, 150); // match CSS transition duration
				}
				currentCodeBlock = null;
				codeBlockWrapper = null;
				const newParagraph = document.createElement("p");
				newParagraph.className = "chat-details";
				self.container.appendChild(newParagraph);
				currentContainer = newParagraph;
				self.autoScroll();
				self.animationTimeouts.push(setTimeout(displayNextLine, LINE_DISPLAY_DELAY / 2));
				return;
			}

			// Create line container
			const lineSpan = document.createElement("span");
			lineSpan.className = `line-animate ${lineVariantClass}`;

			// Build line content
			for (const item of line.items) {
				if (item.type === "code-token") {
					if (item.isWhitespace) {
						lineSpan.appendChild(document.createTextNode(item.content));
					} else {
						const span = document.createElement("span");
						span.className = item.class;
						span.textContent = item.content;
						lineSpan.appendChild(span);
					}
				} else if (item.type === "space") {
					lineSpan.appendChild(document.createTextNode(item.content));
				} else if (item.type === "word") {
					const span = document.createElement("span");
					span.textContent = item.content;
					lineSpan.appendChild(span);
				}
			}

			// Add newline for code blocks only (regular text uses display:block on .line-animate)
			if (line.isCode) {
				currentContainer.appendChild(lineSpan);
				if (displayedLineIndex < filteredLines.length) {
					const nextLine = filteredLines[displayedLineIndex];
					if (nextLine.type !== "code-end") {
						currentContainer.appendChild(document.createTextNode("\n"));
					}
				}
				// Smoothly update code block height
				updateCodeBlockHeight();
			} else {
				currentContainer.appendChild(lineSpan);
				// No <br> needed - .line-animate has display:block
			}

			self.autoScroll();

			// Calculate adaptive delay based on buffer fullness
			const bufferSize = bufferedLineIndex - displayedLineIndex;
			let delay = LINE_DISPLAY_DELAY;

			// If buffer is getting low, slow down slightly
			if (bufferSize < 3 && displayedLineIndex < filteredLines.length - 3) {
				delay = LINE_DISPLAY_DELAY * 1.5;
			}
			// If buffer is very full, speed up slightly
			else if (bufferSize > 10) {
				delay = LINE_DISPLAY_DELAY * 0.8;
			}

			self.animationTimeouts.push(setTimeout(displayNextLine, delay));
		}

		// Start streaming tokens to buffer immediately
		streamToBuffer();

		// Start displaying after buffer builds up
		this.animationTimeouts.push(setTimeout(displayNextLine, BUFFER_TIME));
	}

	// Typewriter - character by character with syntax highlighting
	animateTypewriter() {
		let currentContainer = document.createElement("p");
		currentContainer.className = "chat-details";
		this.container.appendChild(currentContainer);

		const cursor = document.createElement("span");
		cursor.className = "typing-cursor";

		let currentTextSpan = document.createElement("span");
		currentContainer.appendChild(currentTextSpan);
		currentContainer.appendChild(cursor);

		// Build a flat list of characters with metadata
		const chars = [];

		for (const token of this.tokens) {
			if (token.type === "code-start") {
				chars.push({ type: "code-start" });
			} else if (token.type === "code-end") {
				chars.push({ type: "code-end" });
			} else if (token.type === "code") {
				// Tokenize code for syntax highlighting
				const codeTokens = tokenizeCode(token.content);
				for (const codeToken of codeTokens) {
					chars.push({
						type: "code-token",
						content: codeToken.content,
						class: codeToken.class || "",
					});
				}
			} else if (token.type === "newline") {
				chars.push({ type: "newline" });
			} else {
				chars.push({ type: "char", content: token.content });
			}
		}

		// Normalize chars: collapse consecutive newlines and remove leading/trailing newlines
		const normalizedChars = normalizeItems(chars);

		let charIndex = 0;
		let inCodeBlock = false;
		const self = this;

		function typeNext() {
			if (!self.isAnimating || charIndex >= normalizedChars.length) {
				cursor.remove();
				return;
			}

			const char = normalizedChars[charIndex];
			charIndex++;

			if (char.type === "code-start") {
				cursor.remove();
				const codeBlock = document.createElement("div");
				codeBlock.className = "code-block";
				self.container.appendChild(codeBlock);
				currentContainer = codeBlock;
				codeBlock.appendChild(cursor);
				inCodeBlock = true;
				self.animationTimeouts.push(setTimeout(typeNext, 10));
				return;
			}

			if (char.type === "code-end") {
				cursor.remove();
				const newParagraph = document.createElement("p");
				newParagraph.className = "chat-details";
				self.container.appendChild(newParagraph);
				currentContainer = newParagraph;
				currentTextSpan = document.createElement("span");
				newParagraph.appendChild(currentTextSpan);
				newParagraph.appendChild(cursor);
				inCodeBlock = false;
				self.animationTimeouts.push(setTimeout(typeNext, 10));
				return;
			}

			if (char.type === "newline") {
				if (inCodeBlock) {
					cursor.remove();
					currentContainer.appendChild(document.createTextNode("\n"));
					currentContainer.appendChild(cursor);
				} else {
					cursor.remove();
					currentContainer.appendChild(document.createElement("br"));
					currentTextSpan = document.createElement("span");
					currentContainer.appendChild(currentTextSpan);
					currentContainer.appendChild(cursor);
				}
				self.animationTimeouts.push(setTimeout(typeNext, 10));
				return;
			}

			if (char.type === "code-token") {
				// Insert code token with syntax highlighting
				cursor.remove();
				const span = document.createElement("span");
				span.className = char.class;
				span.textContent = char.content;
				currentContainer.appendChild(span);
				currentContainer.appendChild(cursor);

				const delay = char.content.trim() === "" ? 3 : Math.random() * 10 + 5;
				self.animationTimeouts.push(setTimeout(typeNext, delay));
				return;
			}

			// Regular text character
			cursor.remove();
			currentTextSpan.textContent += char.content;
			currentContainer.appendChild(cursor);

			const delay = Math.random() * 15 + 8;
			self.animationTimeouts.push(setTimeout(typeNext, delay));
		}

		typeNext();
	}
}

// Animation descriptions
const animationDescriptions = {
	fade: {
		name: "Fade",
		desc: "Pure opacity transition from transparent to visible. Clean and minimal. · 300ms · ease",
	},
	rise: {
		name: "Rise",
		desc: "Words move upward 6px while fading in. Subtle vertical entrance. · 400ms · ease-out",
	},
	drop: {
		name: "Drop",
		desc: "Words drop from above with a small bounce at the end. · 450ms · spring easing",
	},
	blur: {
		name: "Blur",
		desc: "Words start blurred and sharpen into focus. Camera rack focus effect. · 450ms · blur 3px→0",
	},
	scale: {
		name: "Scale",
		desc: "Words grow from 70% to full size with deceleration. · 400ms · ease-out",
	},
	slide: {
		name: "Slide",
		desc: "Words slide in 8px from the left while fading in. Horizontal entrance. · 300ms",
	},
	reveal: {
		name: "Reveal",
		desc: "Clip-path wipe from left to right. No fade or blur—pure reveal. · 300ms",
	},
	unfold: {
		name: "Unfold",
		desc: "Vertical clip-path reveal from bottom to top. Words emerge upward. · 400ms",
	},
	drift: {
		name: "Drift",
		desc: "Words float up with slight rotation, overshoot, then settle. · 600ms · expo-out",
	},
	expand: {
		name: "Expand",
		desc: "Letter-spacing expands from -0.05em to 0. Typography-focused. · 350ms",
	},
	line: {
		name: "Line",
		desc: "Buffered line-by-line reveal. Waits 800ms to build a token buffer, then displays complete lines while streaming continues ahead. Adaptive pacing: slows when buffer is low (<3 lines), speeds up when full (>10 lines). No pauses mid-line. · 120ms/line",
	},
	"line-rise": {
		name: "Line Rise",
		desc: "Buffered line-by-line with upward slide. Each line rises 8px while fading in. Combines smooth line pacing with vertical motion. · 120ms/line · 300ms animation",
	},
	"line-slide": {
		name: "Line Slide",
		desc: "Buffered line-by-line with horizontal slide. Each line slides in 12px from the left. Typewriter-like horizontal entrance. · 120ms/line · 250ms animation",
	},
	"line-blur": {
		name: "Line Blur",
		desc: "Buffered line-by-line with blur focus. Each line starts blurred and sharpens into view. Cinematic rack focus effect. · 120ms/line · 350ms animation",
	},
	"line-scale": {
		name: "Line Scale",
		desc: "Buffered line-by-line with scale. Each line grows from 85% to full size. Subtle zoom entrance. · 120ms/line · 300ms animation",
	},
	"line-expand": {
		name: "Line Expand",
		desc: "Buffered line-by-line with letter-spacing. Each line expands from compressed text. Typography-focused reveal. · 120ms/line · 300ms animation",
	},
	"line-reveal": {
		name: "Line Reveal",
		desc: "Buffered line-by-line with clip-path wipe. Each line reveals left-to-right with no fade. Clean horizontal wipe. · 120ms/line · 250ms animation",
	},
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
	const animatedContent = document.getElementById("animatedContent");
	const engine = new AnimationEngine(animatedContent);

	// Animation toggle buttons
	const toggleButtons = document.querySelectorAll(".animation-toggle");
	const animationName = document.getElementById("animationName");
	const animationText = document.getElementById("animationText");

	function updateDescription(animationType) {
		const desc = animationDescriptions[animationType];
		if (desc) {
			animationName.textContent = desc.name;
			animationText.textContent = desc.desc;
		}
	}

	toggleButtons.forEach((button) => {
		button.addEventListener("click", () => {
			toggleButtons.forEach((b) => b.classList.remove("active"));
			button.classList.add("active");
			const animationType = button.dataset.animation;
			engine.setAnimation(animationType);
			updateDescription(animationType);
			engine.start();
		});
	});

	// Restart button
	document.getElementById("restartBtn").addEventListener("click", () => {
		engine.start();
	});

	// Start with default animation
	engine.start();
});
