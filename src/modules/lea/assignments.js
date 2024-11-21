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
    
    // Process each row to group assignments by category
    assignmentsTable.querySelectorAll('tr').forEach(row => {
        const categoryTitle = row.querySelector('.TitreCategorie');
        if (categoryTitle) {
            if (currentCategory) {
                categories.push(currentCategory);
            }
            currentCategory = {
                title: categoryTitle.textContent.trim(),
                assignments: []
            };
        } else {
            const assignment = row.querySelector('.LigneListTrav1, .LigneListTrav2');
            if (assignment && currentCategory) {
                const title = row.querySelector('a')?.textContent?.trim();
                const link = row.querySelector('a')?.getAttribute('onclick')?.match(/OpenCentre\('([^']+)'/)?.[1];
                const date = row.querySelector('span')?.textContent?.trim();
                const submissionMethod = row.querySelector('.RemTrav_Sommaire_ProchainsTravauxDesc')?.textContent?.trim();
                
                // Update status extraction to look at the correct column and check for submission info
                const statusCell = row.querySelector('td[colspan="4"]');
                const submissionLink = statusCell?.querySelector('a');
                const status = submissionLink ? 'Submitted' : '-';
                const isUnread = row.querySelector('.CellEnonceNonVisualise img[src*="TravailNonVisualise"]') !== null;
                
                if (title && link) {
                    currentCategory.assignments.push({
                        title,
                        link,
                        date,
                        submissionMethod,
                        status,
                        isUnread
                    });
                }
            }
        }
    });
    
    if (currentCategory) {
        categories.push(currentCategory);
    }

    // Create the new grid-based interface
    categories.forEach(category => {
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
            assignmentCard.className = `assignment-card ${assignment.isUnread ? 'unread' : ''} ${assignment.status === 'Submitted' ? 'submitted' : ''}`;
            
            // Extract the actual URL from the onclick handler
            const cleanLink = assignment.link.replace(/^OpenCentre\('([^']+)'.*$/, '$1');
            
            // Add click handler to the entire card
            assignmentCard.onclick = () => {
                OpenCentre(cleanLink, 'DepotTravailPopup', 'toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=yes,scrollbars=yes', 700, 780, true);
            };
            assignmentCard.style.cursor = 'pointer'; // Add pointer cursor to indicate clickability
            
            assignmentCard.innerHTML = `
                <div class="assignment-header">
                    <div class="assignment-title-row">
                        <span class="assignment-title">${assignment.title}</span>
                        ${createStatusIndicators(assignment)}
                    </div>
                    ${assignment.date ? `
                        <div class="due-date ${!assignment.status.includes('Submitted') && isOverdue(assignment.date) ? 'overdue' : ''}">
                            <span class="due-label">Due:</span>
                            <span class="date">${formatDate(assignment.date)}</span>
                            ${!isOverdue(assignment.date) && formatRelativeDate(assignment.date) ? `
                                <span class="relative-date-badge">${formatRelativeDate(assignment.date)}</span>
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
                    ${assignment.status !== '-' ? `
                        <div class="status-info">
                            <span class="label">Status:</span>
                            <span class="status ${assignment.status.includes('Submitted') ? 'submitted' : ''}">${assignment.status}</span>
                        </div>
                    ` : ''}
                </div>
               
            `;
            assignmentsGrid.appendChild(assignmentCard);
        });

        categoryContainer.appendChild(assignmentsGrid);
        mainContainer.appendChild(categoryContainer);
    });

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

function isOverdue(dateStr) {
    const dueDate = new Date(dateStr);
    const now = new Date();
    // Don't mark as overdue if it's within 24 hours of now (to handle same-day deadlines better)
    return dueDate < now;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function formatRelativeDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Only return relative dates for upcoming assignments
    if (diffDays <= 0) return null;
    
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
    
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
            ${assignment.status.includes('Submitted') ? `
                <div class="indicator submitted-indicator" title="Submitted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m9 12 2 2 4-4"/>
                    </svg>
                </div>
            ` : ''}
            ${!assignment.status.includes('Submitted') && isOverdue(assignment.date) ? `
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
