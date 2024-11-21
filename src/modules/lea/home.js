// Function to remove &nbsp; from table text
export function removeNbspFromTable() {
	const cgSelectTable = document.querySelector(".cgSelect-table");
	if (cgSelectTable) {
		// Get all text nodes in the table
		const walker = document.createTreeWalker(
			cgSelectTable,
			NodeFilter.SHOW_TEXT,
			null,
			false
		);

		let node;
		while ((node = walker.nextNode())) {
			// Replace &nbsp; with regular space
			node.textContent = node.textContent.replace(/\u00A0/g, " ").trim();
		}
	}
}

// Function to move the Calendar header
export function moveCalendarHeader() {
	// Find the calendar header element
	const calendarLink = document.querySelector(".dlsCal");

	// Find the target section-droite div
	const sectionDroite = document.querySelector(".section-droite");

	if (calendarLink && sectionDroite) {
		// Create a new div to hold the calendar header
		const newHeader = document.createElement("div");
		newHeader.className = "calendar-header";
		newHeader.style.cssText =
			"padding: 10px; font-size: 16px; font-weight: bold;";

		// Move the calendar link to the new header
		newHeader.appendChild(calendarLink);

		// Insert the new header at the beginning of section-droite
		sectionDroite.insertBefore(newHeader, sectionDroite.firstChild);
	}
}

export function convertMenuToFlex() {
	// Find the main menu table
	const menuTable = document.querySelector(".tblMenuStyleXPDeuxNiveaux");
	if (!menuTable) return;

	// Create new flex container
	const flexMenu = document.createElement("div");
	flexMenu.className = "flex-menu";

	// Get all menu items (tr elements with class trMenuPrincipal)
	const menuItems = menuTable.querySelectorAll(".trMenuPrincipal");

	menuItems.forEach((item) => {
		// Create container for menu item
		const menuItem = document.createElement("div");
		menuItem.className = "flex-menu-item";

		// Get the link and submenu
		const link = item.querySelector("a");
		const submenu = item.querySelector(".divContenuMenu");

		if (link) {
			// Clone the link to preserve event listeners
			const newLink = link.cloneNode(true);
			menuItem.appendChild(newLink);
		}

		if (submenu) {
			// Create flex submenu
			const flexSubmenu = document.createElement("div");
			flexSubmenu.className = "flex-submenu";

			// Get all submenu links
			const submenuLinks = submenu.querySelectorAll("a");
			submenuLinks.forEach((subLink) => {
				const subItem = document.createElement("div");
				subItem.className = "flex-submenu-item";
				const newSubLink = subLink.cloneNode(true);
				subItem.appendChild(newSubLink);
				flexSubmenu.appendChild(subItem);
			});

			menuItem.appendChild(flexSubmenu);
		}

		flexMenu.appendChild(menuItem);
	});

	// Replace original table with flex menu
	menuTable.parentNode.replaceChild(flexMenu, menuTable);
}

export function setCustomCourseColors() {
	// Default colors if none are set
	const defaultColors = {
		// "201-SF5-RE": "#df8e1d", // Discrete Math
		// "201-SN2-RE": "#d20f39", // Calculus
		// "345-101-MQ": "#40a02b", // Humanities
		// "420-SF1-RE": "#04a5e5", // Programming
		// "602-101-MQ": "#fe640b", // French
		// "603-101-MQ": "#ea76cb", // English
	};

	const storedColors = JSON.parse(localStorage.getItem("courseColors") || "{}");
	const courseColors = { ...defaultColors, ...storedColors };

	// Apply colors to each course card
	document.querySelectorAll(".card-panel-header").forEach((header) => {
		const titleElement = header.querySelector(".card-panel-title");
		if (!titleElement) return;

		const courseCode = Object.keys(courseColors).find((code) =>
			titleElement.textContent.trim().startsWith(code)
		);

		if (courseCode) {
			header.style.backgroundColor = courseColors[courseCode];
		}
	});

	return courseColors;
}

// Function to move title outside wrapper
export function moveElementsOutsideWrapper() {
	const wrapper = document.querySelector(".classes-wrapper");
	const title = wrapper?.querySelector("h1.classes-titre");
	if (wrapper && title) {
		wrapper.parentNode.insertBefore(title, wrapper);
	}
}

// Function to move "My classes" title
export function moveMyClassesTitle() {
	const menuParent = document.querySelector(".parent-menu-gauche");
	const myClassesTitle = menuParent?.querySelector(".titre-menu-middle");
	if (menuParent && myClassesTitle) {
		const newHeading = document.createElement("h2");
		newHeading.textContent = myClassesTitle.textContent;
		newHeading.className = "menu-section-title";

		const firstTable = menuParent.querySelector("table");
		if (firstTable) {
			menuParent.insertBefore(newHeading, firstTable);
			const titleRow = myClassesTitle.closest("tr");
			if (titleRow) {
				titleRow.style.display = "none";
			}
		}
	}
}

// Function to move right section
export function moveRightSection() {
	const rightSection = document.querySelector(".section-droite");
	const menuArea = document.querySelector(".td-menu");
	if (rightSection && menuArea) {
		menuArea.appendChild(rightSection);
	}
}

// Function to remove br tags
export function removeBrTags() {
	const trBandeau = document.querySelector(".trBandeau");
	if (trBandeau) {
		const brTags = trBandeau.getElementsByTagName("br");
		while (brTags.length > 0) {
			brTags[0].remove();
		}
	}
}
