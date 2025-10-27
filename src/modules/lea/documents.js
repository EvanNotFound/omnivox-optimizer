export function optimizeCourseDocuments() {
	const documentsTable = document.querySelector("#tblDocuments");
	if (!documentsTable) return;

	const resolveDocumentUrl = (anchor) => {
		if (!anchor) return null;
		const hrefAttr = anchor.getAttribute("href") || "";
		const patterns = [
			/'(Visualise(?:Document|Video)\.aspx[^']*)'/i,
			/"(Visualise(?:Document|Video)\.aspx[^"]*)"/i,
			/(Visualise(?:Document|Video)\.aspx[^'"]*)/i,
		];

		for (const pattern of patterns) {
			const match = hrefAttr.match(pattern);
			if (match?.[1]) return match[1];
		}

		if (hrefAttr && !hrefAttr.startsWith("javascript:")) {
			return hrefAttr;
		}

		return null;
	};

	const toAbsoluteUrl = (url) => {
		if (!url) return null;
		try {
			return new URL(url, window.location.href).toString();
		} catch {
			return null;
		}
	};

	const createButton = (className) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = className;
		return button;
	};

	const setButtonInteractiveState = (button, disabled) => {
		button.disabled = disabled;
		button.classList.toggle("is-active", !disabled);
	};

	const mainContainer = document.createElement("div");
	mainContainer.className = "documents-container";

	const centerContainer = document.querySelector("#ctl00 > center");

	centerContainer?.querySelectorAll("br").forEach((br) => {
		br.remove();
	});

	const allEntries = [];

	const markEntryRemote = async (entry) => {
		if (!entry.isUnread) return;

		if (entry.viewUrl) {
			try {
				await fetch(entry.viewUrl, { credentials: "include" });
			} catch (error) {
				console.warn("Unable to mark document as read automatically", error);
			}
		}

		entry.markLocal();
	};

	const categories = documentsTable.querySelectorAll(".CategorieDocument");

	categories.forEach((category) => {
		const categoryContainer = document.createElement("div");
		categoryContainer.className = "category-container";

		const categoryHeader = document.createElement("div");
		categoryHeader.className = "category-header flex items-center justify-between gap-3 flex-wrap";

		const categoryTitle =
			category.querySelector(".DisDoc_TitreCategorie")?.textContent?.trim() ||
			"Documents";

		const headerTitle = document.createElement("span");
		headerTitle.className = "text-left";
		headerTitle.textContent = categoryTitle;
		categoryHeader.appendChild(headerTitle);
        
		categoryContainer.appendChild(categoryHeader);

		const gridContainer = document.createElement("div");
		gridContainer.className = "documents-grid";

		const documentRows = category.querySelectorAll(
			".itemDataGrid, .itemDataGridAltern"
		);

		const docEntries = [];

		documentRows.forEach((row) => {
			const title = row
				.querySelector(".lblTitreDocumentDansListe")
				?.textContent?.trim();
			const date = row
				.querySelector(".DocDispo")
				?.textContent?.trim()
				.replace("since", "")
				.trim();
			const fileLink = row.querySelector(".colVoirTelecharger a");
			const fileIcon = row.querySelector(".colVoirTelecharger img");
			const fileSize = row
				.querySelector(".colVoirTelecharger")
				?.textContent?.trim()
				.split("\n")
				.pop()
				?.trim();
			const isUnread = Boolean(row.querySelector(".classeEtoileNouvDoc"));

			if (!title || !fileLink) return;

			const originalHref = fileLink.getAttribute("href") || "";
			const originalTarget = fileLink.getAttribute("target") || "";

			const viewUrl = resolveDocumentUrl(fileLink);
			const absoluteViewUrl = toAbsoluteUrl(viewUrl);

			const fallbackUrl =
				originalHref && !originalHref.toLowerCase().startsWith("javascript:")
					? fileLink.href
					: null;

			const docCard = document.createElement("a");
			docCard.className =
				"flex flex-col items-start gap-4 justify-between p-4 bg-white rounded-xl border border-neutral-200 shadow-sm shadow-neutral-100 transition-all duration-200 relative hover:-translate-y-0.5 hover:border-neutral-300 no-underline group";

			const cardHref = absoluteViewUrl || fallbackUrl || "#";
			docCard.href = cardHref;

			if (originalTarget) {
				docCard.target = originalTarget;
				if (originalTarget === "_blank") {
					docCard.rel = "noopener noreferrer";
				}
			}

			const unreadBadge = isUnread
				? `<span class="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold text-red-600 tracking-wide leading-none whitespace-nowrap rounded-full bg-red-800/5 px-2 py-1" role="status" aria-label="Unread document">
					<span class="uppercase">Unread</span>
					<span class="w-2 h-2 rounded-full bg-red-600" aria-hidden="true"></span>
				</span>`
				: "";

			docCard.innerHTML = `
				<div class="flex flex-col gap-4">
					${unreadBadge}
					<div class="flex-shrink-0 w-6 h-6 flex items-center justify-center">
						${fileIcon ? `<img src="${fileIcon.src}" alt="File type" class="w-6 h-6 object-contain">` : ""}
					</div>

				</div>
				<div class="w-full flex flex-col gap-2">
                    <div class="text-base font-semibold text-slate-900 no-underline tracking-tight leading-tight text-left group-hover:text-red-800 text-neutral-600">${title}</div>
					<div class="flex justify-between items-center w-full">
						${date ? `<span class="text-xs text-neutral-500">${date}</span>` : ""}
						${fileSize ? `<span class="text-xs text-neutral-500">${fileSize}</span>` : ""}
					</div>
				</div>
			`;

			const entry = {
				card: docCard,
				viewUrl: absoluteViewUrl,
				isUnread,
				listeners: new Set(),
			};

			entry.markLocal = () => {
				if (!entry.isUnread) return;
				entry.isUnread = false;
				const indicator = entry.card.querySelector('[role="status"]');
				if (indicator) indicator.remove();
				entry.listeners.forEach((listener) => listener(entry));
			};

			entry.addListener = (listener) => {
				if (typeof listener === "function") {
					entry.listeners.add(listener);
				}
			};

			docCard.addEventListener("click", (event) => {
				if (!absoluteViewUrl && originalHref.toLowerCase().startsWith("javascript:")) {
					event.preventDefault();
					try {
						// eslint-disable-next-line no-eval
						window.eval(originalHref.replace(/^javascript:/i, ""));
					} catch (error) {
						console.warn("Unable to trigger document handler", error);
					}
				}

				window.requestAnimationFrame(() => entry.markLocal());
			});

			docEntries.push(entry);
			allEntries.push(entry);
			gridContainer.appendChild(docCard);
		});

		if (docEntries.length) {
			const actions = document.createElement("div");
			actions.className = "category-actions";

			const readAllButton = createButton("category-read-all");
			readAllButton.textContent = "Mark all read";
			setButtonInteractiveState(readAllButton, true);

			const updateCategoryButton = () => {
				if (readAllButton.dataset.state === "busy") return;

				const unreadCount = docEntries.filter((entry) => entry.isUnread).length;
				if (!unreadCount) {
					setButtonInteractiveState(readAllButton, true);
					readAllButton.textContent = "All read";
					return;
				}

				setButtonInteractiveState(readAllButton, false);
				readAllButton.textContent =
					unreadCount === docEntries.length
						? `Mark all read (${unreadCount})`
						: `Mark as read (${unreadCount})`;
			};

			readAllButton.addEventListener("click", async () => {
				const unreadEntries = docEntries.filter((entry) => entry.isUnread);
				if (!unreadEntries.length) return;

				readAllButton.dataset.state = "busy";
				setButtonInteractiveState(readAllButton, true);
				readAllButton.textContent = "Marking…";

				for (const entry of unreadEntries) {
					// eslint-disable-next-line no-await-in-loop
					await markEntryRemote(entry);
				}

				delete readAllButton.dataset.state;
				updateCategoryButton();
			});

			docEntries.forEach((entry) => entry.addListener(updateCategoryButton));
			updateCategoryButton();

			actions.appendChild(readAllButton);
			categoryHeader.appendChild(actions);
		}

		categoryContainer.appendChild(gridContainer);
		mainContainer.appendChild(categoryContainer);
	});

	if (allEntries.length) {
		const readAllButton = createButton("documents-read-all");
		readAllButton.textContent = "Mark all read";
		setButtonInteractiveState(readAllButton, true);

		const updateToolbarButton = () => {
			if (readAllButton.dataset.state === "busy") return;

			const unreadCount = allEntries.filter((entry) => entry.isUnread).length;
			if (!unreadCount) {
				setButtonInteractiveState(readAllButton, true);
				readAllButton.textContent = "All read";
				return;
			}

			setButtonInteractiveState(readAllButton, false);
			readAllButton.textContent = `Mark all read (${unreadCount})`;
		};

		readAllButton.addEventListener("click", async () => {
			const unreadEntries = allEntries.filter((entry) => entry.isUnread);
			if (!unreadEntries.length) return;

			readAllButton.dataset.state = "busy";
			setButtonInteractiveState(readAllButton, true);
			readAllButton.textContent = "Marking…";

			for (const entry of unreadEntries) {
				// eslint-disable-next-line no-await-in-loop
				await markEntryRemote(entry);
			}

			delete readAllButton.dataset.state;
			updateToolbarButton();
		});

		allEntries.forEach((entry) => entry.addListener(updateToolbarButton));
		updateToolbarButton();

		const pageTitleLine = document.querySelector(".TitrePageLigne1");
		if (pageTitleLine) {
			pageTitleLine.classList.add("documents-page-title");
			const inlineControls = document.createElement("span");
			inlineControls.className = "documents-toolbar-inline";
			inlineControls.appendChild(readAllButton);
			pageTitleLine.appendChild(inlineControls);
		} else {
			const toolbar = document.createElement("div");
			toolbar.className = "documents-toolbar";
			toolbar.appendChild(readAllButton);
			mainContainer.insertBefore(toolbar, mainContainer.firstChild);
		}
	}

	// Replace table with new container
	documentsTable.parentNode.replaceChild(mainContainer, documentsTable);
}
