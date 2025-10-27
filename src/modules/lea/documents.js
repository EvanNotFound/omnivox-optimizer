export function optimizeCourseDocuments() {
	const documentsTable = document.querySelector("#tblDocuments");
	if (!documentsTable) return;

	const mainContainer = document.createElement("div");
	mainContainer.className = "documents-container";

	const centerContainer = document.querySelector("#ctl00 > center");

	// Remove br tags from the center container
	centerContainer.querySelectorAll("br").forEach((br) => {
		br.remove();
	});

	// Process each category
	const categories = documentsTable.querySelectorAll(".CategorieDocument");
	categories.forEach((category) => {
		// Create category container
		const categoryContainer = document.createElement("div");
		categoryContainer.className = "category-container";

		// Get category title text and create header
		const categoryTitle = category
			.querySelector(".DisDoc_TitreCategorie")
			?.textContent?.trim();
		if (categoryTitle) {
			const categoryHeader = document.createElement("div");
			categoryHeader.className = "category-header";
			categoryHeader.textContent = categoryTitle;
			categoryContainer.appendChild(categoryHeader);
		}

		// Create grid container for documents
		const gridContainer = document.createElement("div");
		gridContainer.className = "documents-grid";

		// Get all document rows in this category
		const documentRows = category.querySelectorAll(
			".itemDataGrid, .itemDataGridAltern"
		);

		// Convert each row to a grid item
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

			// Extract the visualization URL from the javascript: handler
			const visualizeUrl = fileLink.href.match(
				/VisualiseDocument\.aspx\?.*?(?=')/
			)?.[0];

			const docCard = document.createElement("a");
			docCard.href = visualizeUrl || fileLink.href;
			docCard.className = "flex flex-col items-start justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm shadow-neutral-100 transition-all duration-200 relative hover:-translate-y-0.5 hover:border-neutral-300 no-underline group";

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

			gridContainer.appendChild(docCard);
		});

		categoryContainer.appendChild(gridContainer);
		mainContainer.appendChild(categoryContainer);
	});

	// Replace table with new container
	documentsTable.parentNode.replaceChild(mainContainer, documentsTable);
}
