export function optimizeCourseDocuments() {
    const documentsTable = document.querySelector('#tblDocuments');
    if (!documentsTable) return;

    const mainContainer = document.createElement('div');
    mainContainer.className = 'documents-container';

    const centerContainer = document.querySelector("#ctl00 > center");

    // Remove br tags from the center container
    centerContainer.querySelectorAll('br').forEach(br => {
        br.remove();
    });

    // Process each category
    const categories = documentsTable.querySelectorAll('.CategorieDocument');
    categories.forEach(category => {
        // Create category container
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';

        // Get category title text and create header
        const categoryTitle = category.querySelector('.DisDoc_TitreCategorie')?.textContent?.trim();
        if (categoryTitle) {
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = categoryTitle;
            categoryContainer.appendChild(categoryHeader);
        }

        // Create grid container for documents
        const gridContainer = document.createElement('div');
        gridContainer.className = 'documents-grid';
        
        // Get all document rows in this category
        const documentRows = category.querySelectorAll('.itemDataGrid, .itemDataGridAltern');
        
        // Convert each row to a grid item
        documentRows.forEach(row => {
            const title = row.querySelector('.lblTitreDocumentDansListe')?.textContent?.trim();
            // Remove "since" from the date string
            const date = row.querySelector('.DocDispo')?.textContent?.trim().replace('since', '').trim();
            const fileLink = row.querySelector('.colVoirTelecharger a');
            const fileIcon = row.querySelector('.colVoirTelecharger img');
            const fileSize = row.querySelector('.colVoirTelecharger')?.textContent?.trim().split('\n').pop()?.trim();
            
            if (!title || !fileLink) return;

            const docCard = document.createElement('div');
            docCard.className = 'document-card';
            docCard.innerHTML = `
                <div class="doc-icon">
                    ${fileIcon ? `<img src="${fileIcon.src}" alt="File type">` : ''}
                </div>
                <div class="doc-info">
                    <a href="${fileLink.href}" target="_blank" class="doc-title">${title}</a>
                    <div class="doc-meta">
                        ${date ? `<span class="doc-date">${date}</span>` : ''}
                        ${fileSize ? `<span class="doc-size">${fileSize}</span>` : ''}
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

    // Add the necessary styles
    GM_addStyle(`

    `);
}