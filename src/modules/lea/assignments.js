export function optimizeAssignmentsList() {
    // Add debug logging
    console.log('Optimizing assignments list...');
    
    // Find the main assignments table (the outer one)
    const mainTable = document.querySelector('table[width="550"]');
    if (!mainTable) {
        console.log('No main table found');
        return;
    }

    // Find the inner assignments table
    const assignmentsTable = document.querySelector('#tabListeTravEtu');
    if (!assignmentsTable) {
        console.log('No assignments table found');
        return;
    }

    // Create main container
    const pageContainer = document.createElement('div');
    pageContainer.className = 'assignments-page';

    // Move the title elements
    const titleElements = document.querySelectorAll('.TitrePageLigne1, .TitrePageLigne2');
    const titleContainer = document.createElement('div');
    titleContainer.className = 'page-header';
    titleElements.forEach(el => {
        titleContainer.appendChild(el.cloneNode(true));
    });
    pageContainer.appendChild(titleContainer);

    // Create assignments container
    const mainContainer = document.createElement('div');
    mainContainer.className = 'assignments-container';
    
    // Process each category
    const categories = [];
    let currentCategory = null;

    assignmentsTable.querySelectorAll('tr').forEach(row => {
        // Skip header rows
        if (row.querySelector('.EnteteListTabTravauxEtu')) {
            return;
        }

        const categoryTitle = row.querySelector('.TitreCategorie');
        if (categoryTitle) {
            currentCategory = {
                title: categoryTitle.textContent.trim() || 'Assignments',
                assignments: []
            };
            categories.push(currentCategory);
            return;
        }

        const assignmentLink = row.querySelector('a[onclick*="OpenCentre"]');
        if (!assignmentLink) {
            return;
        }

        if (!currentCategory) {
            currentCategory = {
                title: 'Assignments',
                assignments: []
            };
            categories.push(currentCategory);
        }

        const assignmentData = extractAssignmentFromRow(row, assignmentLink);
        if (assignmentData) {
            currentCategory.assignments.push(assignmentData);
        }
    });

    const populatedCategories = categories.filter(category => category.assignments.length > 0);

    // Create the new grid-based interface
    if (populatedCategories.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'assignments-empty-state';
        emptyState.innerHTML = `
            <div class="empty-title">No assignments to display</div>
            <div class="empty-subtitle">Check back later for new assignments.</div>
        `;
        mainContainer.appendChild(emptyState);
    } else {
        populatedCategories.forEach(category => {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';

            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = category.title;
            categoryContainer.appendChild(categoryHeader);

            const assignmentsGrid = document.createElement('div');
            assignmentsGrid.className = 'assignments-grid';

            category.assignments.forEach(assignment => {
                const assignmentCard = document.createElement('div');
                assignmentCard.className = `assignment-card ${assignment.isUnread ? 'unread' : ''} ${assignment.isSubmitted ? 'submitted' : ''}`;

                const cardClickHandler = createCardClickHandler(assignment.onClickAttribute);
                if (cardClickHandler) {
                    assignmentCard.addEventListener('click', cardClickHandler);
                    assignmentCard.addEventListener('keydown', event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            cardClickHandler();
                        }
                    });
                    assignmentCard.setAttribute('role', 'button');
                    assignmentCard.tabIndex = 0;
                    assignmentCard.style.cursor = 'pointer';
                }

                const formattedDueDate = formatDate(assignment.dueDate, assignment.dueText);
                const relativeDueDate = formatRelativeDate(assignment.dueDate);
                const isOverdueAssignment = !assignment.isSubmitted && isOverdue(assignment.dueDate);

                assignmentCard.innerHTML = `
                    <div class="assignment-header">
                        <div class="assignment-title-row">
                            <span class="assignment-title">${assignment.title}</span>
                            ${createStatusIndicators(assignment)}
                        </div>
                        ${assignment.dueText ? `
                            <div class="due-date ${isOverdueAssignment ? 'overdue' : ''}">
                                <span class="due-label">Due:</span>
                                <span class="date">${formattedDueDate}</span>
                                ${!isOverdueAssignment && relativeDueDate ? `
                                    <span class="relative-date-badge">${relativeDueDate}</span>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                    <div class="assignment-details">
                        ${assignment.submissionMethod ? `
                            <div class="submission-info">
                                <span class="label">Submit via:</span>
                                <span class="method">${assignment.submissionMethod}</span>
                            </div>
                        ` : ''}
                        ${assignment.statusLabel !== '-' ? `
                            <div class="status-info">
                                <span class="label">Status:</span>
                                <span class="status ${assignment.isSubmitted ? 'submitted' : ''}">${assignment.statusLabel}</span>
                            </div>
                        ` : ''}
                    </div>
                   
                `;
                assignmentsGrid.appendChild(assignmentCard);
            });

            categoryContainer.appendChild(assignmentsGrid);
            mainContainer.appendChild(categoryContainer);
        });
    }

    pageContainer.appendChild(mainContainer);

    // Replace the entire table with the new container
    const centerElement = document.querySelector('center');
    if (centerElement) {
        // Remove all children from center
        while (centerElement.firstChild) {
            centerElement.removeChild(centerElement.firstChild);
        }
        // Add our new container
        centerElement.appendChild(pageContainer);
    }
}

function extractAssignmentFromRow(row, linkElement) {
    const title = linkElement.textContent ? linkElement.textContent.trim() : '';
    const onClickAttribute = linkElement.getAttribute('onclick') || '';
    const linkMatch = onClickAttribute.match(/OpenCentre\('([^']+)'/);
    const link = linkMatch ? linkMatch[1] : null;

    const cells = Array.from(row.children).filter(cell => cell.tagName === 'TD');
    const dueCell = cells[2] || null;
    const statusCell = cells[3] || null;

    const submissionMethod = dueCell?.querySelector('.RemTrav_Sommaire_ProchainsTravauxDesc')?.textContent?.trim() || null;

    let dueText = null;
    if (dueCell) {
        const primarySpan = Array.from(dueCell.querySelectorAll('span')).find(span => !span.classList.contains('RemTrav_Sommaire_ProchainsTravauxDesc'));
        const rawDueText = primarySpan?.textContent ?? dueCell.textContent ?? '';
        const cleanedDueText = normalizeWhitespace(rawDueText);
        if (cleanedDueText) {
            if (submissionMethod) {
                const normalizedMethod = normalizeWhitespace(submissionMethod);
                dueText = cleanedDueText.replace(normalizedMethod, '').trim();
            } else {
                dueText = cleanedDueText;
            }
        }
    }

    let statusLabel = '-';
    if (statusCell) {
        const normalizedStatus = normalizeWhitespace(statusCell.textContent);
        if (normalizedStatus) {
            statusLabel = normalizedStatus;
        }
    }

    const isSubmitted = /submitted|remise\s*ok|remis/i.test(statusLabel);
    const isUnread = row.querySelector('.CellEnonceNonVisualise img[src*="TravailNonVisualise"]') !== null;
    const dueDate = parseDueDate(dueText);

    if (!title || !link) {
        return null;
    }

    return {
        title,
        link,
        onClickAttribute,
        dueText,
        dueDate,
        submissionMethod,
        statusLabel,
        isSubmitted,
        isUnread
    };
}

function createCardClickHandler(rawOnClick) {
    if (!rawOnClick) {
        return null;
    }

    try {
        const handler = new Function(rawOnClick);
        return () => {
            try {
                const scope = typeof window !== 'undefined' ? window : globalThis;
                handler.call(scope);
            } catch (error) {
                console.error('Failed to execute assignment handler', error);
            }
        };
    } catch (error) {
        console.error('Failed to create assignment handler', error);
        return null;
    }
}

function normalizeWhitespace(value) {
    return typeof value === 'string'
        ? value.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim()
        : '';
}

function parseDueDate(rawText) {
    if (!rawText) {
        return null;
    }

    const sanitized = normalizeWhitespace(rawText);
    if (!sanitized) {
        return null;
    }

    const nativeParsed = new Date(sanitized);
    if (!Number.isNaN(nativeParsed.getTime())) {
        return nativeParsed;
    }

    const normalized = sanitized
        .replace(/([A-Za-z\u00C0-\u017F]+)-(\d{1,2}),/u, '$1 $2,')
        .replace(/\s+at\s+/i, ' ');
    const normalizedParsed = new Date(normalized);
    if (!Number.isNaN(normalizedParsed.getTime())) {
        return normalizedParsed;
    }

    const match = sanitized.match(/([A-Za-z\u00C0-\u017F]+)-?(\d{1,2}),\s*(\d{4})(?:\s+at\s+(\d{1,2})(?::(\d{2}))?(?:\s*(am|pm))?)?/i);
    if (!match) {
        return null;
    }

    const monthToken = normalizeMonthToken(match[1]);
    const monthIndex = monthTokenToIndex(monthToken);
    if (monthIndex === null) {
        return null;
    }

    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    let hour = match[4] ? parseInt(match[4], 10) : 0;
    const minute = match[5] ? parseInt(match[5], 10) : 0;
    const meridiem = match[6] ? match[6].toLowerCase() : null;

    if (meridiem === 'pm' && hour < 12) {
        hour += 12;
    } else if (meridiem === 'am' && hour === 12) {
        hour = 0;
    }

    const parsedDate = new Date(year, monthIndex, day, hour, minute);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function normalizeMonthToken(token) {
    return stripAccents(token).replace(/\./g, '').toLowerCase();
}

function monthTokenToIndex(token) {
    if (!token) {
        return null;
    }

    const monthMap = {
        jan: 0,
        january: 0,
        janv: 0,
        janvier: 0,
        feb: 1,
        february: 1,
        fev: 1,
        fevrier: 1,
        mar: 2,
        march: 2,
        mars: 2,
        apr: 3,
        april: 3,
        avr: 3,
        avril: 3,
        may: 4,
        mai: 4,
        jun: 5,
        june: 5,
        juin: 5,
        jul: 6,
        july: 6,
        juil: 6,
        juillet: 6,
        aug: 7,
        august: 7,
        aou: 7,
        aout: 7,
        sep: 8,
        sept: 8,
        september: 8,
        septembre: 8,
        oct: 9,
        october: 9,
        octobre: 9,
        nov: 10,
        november: 10,
        novembre: 10,
        dec: 11,
        december: 11,
        decembre: 11
    };

    if (token in monthMap) {
        return monthMap[token];
    }

    return null;
}

function stripAccents(value) {
    return value
        ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        : '';
}

function toDate(value) {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isOverdue(dateValue) {
    const dueDate = toDate(dateValue);
    if (!dueDate) {
        return false;
    }

    const now = new Date();
    return dueDate.getTime() < now.getTime();
}

function formatDate(dateValue, fallbackText = '') {
    const date = toDate(dateValue);
    if (!date) {
        return fallbackText;
    }

    const displayDate = new Date(date);
    if (displayDate.getHours() === 0 && displayDate.getMinutes() === 0) {
        displayDate.setHours(23, 59);
    }

    return displayDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function formatRelativeDate(dateValue) {
    const date = toDate(dateValue);
    if (!date) {
        return null;
    }

    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return null;
    }

    if (diffDays === 1) {
        return 'Tomorrow';
    }

    if (diffDays < 7) {
        return `In ${diffDays} days`;
    }

    if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)} weeks`;
    }

    return null;
}

function createStatusIndicators(assignment) {
    return `
        <div class="status-indicators">
            ${assignment.isUnread ? `
                <div class="indicator new-indicator" title="New">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-diamond-plus"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg>
                </div>
            ` : ''}
            ${assignment.isSubmitted ? `
                <div class="indicator submitted-indicator" title="Submitted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m9 12 2 2 4-4"/>
                    </svg>
                </div>
            ` : ''}
            ${!assignment.isSubmitted && isOverdue(assignment.dueDate) ? `
                <div class="indicator overdue-indicator" title="Overdue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock-minus">
                        <circle cx="12" cy="13" r="8"/>
                        <path d="M5 3 2 6"/>
                        <path d="m22 6-3-3"/>
                        <path d="M6.38 18.7 4 21"/>
                        <path d="M17.64 18.67 20 21"/>
                        <path d="M9 13h6"/>
                    </svg>
                </div>
            ` : ''}
        </div>
    `;
}
