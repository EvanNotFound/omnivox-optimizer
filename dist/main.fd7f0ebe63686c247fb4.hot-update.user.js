// ==UserScript==
// @name Omnivox UI Optimizer
// @description A simple user script to improve the UI of Omnivox.
// @version 1.3.16
// @author Evan Luo
// @homepage https://github.com/evannotfound/omnivox-optimizer
// @match *://*.omnivox.ca/*
// @downloadURL https://github.com/evannotfound/omnivox-optimizer/releases/latest/download/omnivox-optimizer.user.js
// @grant GM_xmlhttpRequest
// @license GPL-3.0
// @run-at document-start
// @updateURL https://github.com/evannotfound/omnivox-optimizer/releases/latest/download/omnivox-optimizer.meta.js
// ==/UserScript==

"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdateomnivox_optimizer"]("main",{

/***/ "./src/modules/lea/documents.js":
/*!**************************************!*\
  !*** ./src/modules/lea/documents.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   optimizeCourseDocuments: () => (/* binding */ optimizeCourseDocuments)\n/* harmony export */ });\nfunction optimizeCourseDocuments() {\n    const documentsTable = document.querySelector('#tblDocuments');\n    if (!documentsTable) return;\n\n    const mainContainer = document.createElement('div');\n    mainContainer.className = 'documents-container';\n\n    const centerContainer = document.querySelector(\"#ctl00 > center\");\n\n    // Remove br tags from the center container\n    centerContainer.querySelectorAll('br').forEach(br => {\n        br.remove();\n    });\n\n    // Process each category\n    const categories = documentsTable.querySelectorAll('.CategorieDocument');\n    categories.forEach(category => {\n        // Create category container\n        const categoryContainer = document.createElement('div');\n        categoryContainer.className = 'category-container';\n\n        // Get category title text and create header\n        const categoryTitle = category.querySelector('.DisDoc_TitreCategorie')?.textContent?.trim();\n        if (categoryTitle) {\n            const categoryHeader = document.createElement('div');\n            categoryHeader.className = 'category-header';\n            categoryHeader.textContent = categoryTitle;\n            categoryContainer.appendChild(categoryHeader);\n        }\n\n        // Create grid container for documents\n        const gridContainer = document.createElement('div');\n        gridContainer.className = 'documents-grid';\n        \n        // Get all document rows in this category\n        const documentRows = category.querySelectorAll('.itemDataGrid, .itemDataGridAltern');\n        \n        // Convert each row to a grid item\n        documentRows.forEach(row => {\n            const title = row.querySelector('.lblTitreDocumentDansListe')?.textContent?.trim();\n            const date = row.querySelector('.DocDispo')?.textContent?.trim().replace('since', '').trim();\n            const fileLink = row.querySelector('.colVoirTelecharger a');\n            const fileIcon = row.querySelector('.colVoirTelecharger img');\n            const fileSize = row.querySelector('.colVoirTelecharger')?.textContent?.trim().split('\\n').pop()?.trim();\n            const isUnread = Boolean(row.querySelector('.classeEtoileNouvDoc'));\n            \n            if (!title || !fileLink) return;\n\n            // Extract the visualization URL from the javascript: handler\n            const visualizeUrl = fileLink.href.match(/VisualiseDocument\\.aspx\\?.*?(?=')/)?.[0];\n            \n            const docCard = document.createElement('div');\n            docCard.className = 'document-card';\n\n            const unreadBadge = isUnread\n                ? `<span class=\"doc-unread-indicator\" role=\"status\" aria-label=\"Unread document\"><span class=\"doc-unread-dot\" aria-hidden=\"true\"></span><span class=\"doc-unread-text\">Unread</span></span>`\n                : '';\n\n            docCard.innerHTML = `\n                ${unreadBadge}\n                <div class=\"doc-icon\">\n                    ${fileIcon ? `<img src=\"${fileIcon.src}\" alt=\"File type\">` : ''}\n                </div>\n                <div class=\"doc-info\">\n                    <a href=\"${visualizeUrl || fileLink.href}\" class=\"doc-title\">${title}</a>\n                    <div class=\"doc-meta\">\n                        ${date ? `<span class=\"doc-date\">${date}</span>` : ''}\n                        ${fileSize ? `<span class=\"doc-size\">${fileSize}</span>` : ''}\n                    </div>\n                </div>\n            `;\n\n            gridContainer.appendChild(docCard);\n        });\n\n        categoryContainer.appendChild(gridContainer);\n        mainContainer.appendChild(categoryContainer);\n    });\n\n    // Replace table with new container\n    documentsTable.parentNode.replaceChild(mainContainer, documentsTable);\n}\n\n\n//# sourceURL=webpack://omnivox-optimizer/./src/modules/lea/documents.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("b324bb521d1e75aa2ecb")
/******/ })();
/******/ 
/******/ }
);