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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   optimizeCourseDocuments: () => (/* binding */ optimizeCourseDocuments)\n/* harmony export */ });\nfunction optimizeCourseDocuments() {\n\tconst documentsTable = document.querySelector(\"#tblDocuments\");\n\tif (!documentsTable) return;\n\n\tconst mainContainer = document.createElement(\"div\");\n\tmainContainer.className = \"documents-container\";\n\n\tconst centerContainer = document.querySelector(\"#ctl00 > center\");\n\n\t// Remove br tags from the center container\n\tcenterContainer.querySelectorAll(\"br\").forEach((br) => {\n\t\tbr.remove();\n\t});\n\n\t// Process each category\n\tconst categories = documentsTable.querySelectorAll(\".CategorieDocument\");\n\tcategories.forEach((category) => {\n\t\t// Create category container\n\t\tconst categoryContainer = document.createElement(\"div\");\n\t\tcategoryContainer.className = \"category-container\";\n\n\t\t// Get category title text and create header\n\t\tconst categoryTitle = category\n\t\t\t.querySelector(\".DisDoc_TitreCategorie\")\n\t\t\t?.textContent?.trim();\n\t\tif (categoryTitle) {\n\t\t\tconst categoryHeader = document.createElement(\"div\");\n\t\t\tcategoryHeader.className = \"category-header\";\n\t\t\tcategoryHeader.textContent = categoryTitle;\n\t\t\tcategoryContainer.appendChild(categoryHeader);\n\t\t}\n\n\t\t// Create grid container for documents\n\t\tconst gridContainer = document.createElement(\"div\");\n\t\tgridContainer.className = \"documents-grid\";\n\n\t\t// Get all document rows in this category\n\t\tconst documentRows = category.querySelectorAll(\n\t\t\t\".itemDataGrid, .itemDataGridAltern\"\n\t\t);\n\n\t\t// Convert each row to a grid item\n\t\tdocumentRows.forEach((row) => {\n\t\t\tconst title = row\n\t\t\t\t.querySelector(\".lblTitreDocumentDansListe\")\n\t\t\t\t?.textContent?.trim();\n\t\t\tconst date = row\n\t\t\t\t.querySelector(\".DocDispo\")\n\t\t\t\t?.textContent?.trim()\n\t\t\t\t.replace(\"since\", \"\")\n\t\t\t\t.trim();\n\t\t\tconst fileLink = row.querySelector(\".colVoirTelecharger a\");\n\t\t\tconst fileIcon = row.querySelector(\".colVoirTelecharger img\");\n\t\t\tconst fileSize = row\n\t\t\t\t.querySelector(\".colVoirTelecharger\")\n\t\t\t\t?.textContent?.trim()\n\t\t\t\t.split(\"\\n\")\n\t\t\t\t.pop()\n\t\t\t\t?.trim();\n\t\t\tconst isUnread = Boolean(row.querySelector(\".classeEtoileNouvDoc\"));\n\n\t\t\tif (!title || !fileLink) return;\n\n\t\t\t// Extract the visualization URL from the javascript: handler\n\t\t\tconst visualizeUrl = fileLink.href.match(\n\t\t\t\t/VisualiseDocument\\.aspx\\?.*?(?=')/\n\t\t\t)?.[0];\n\n\t\t\tconst docCard = document.createElement(\"a\");\n\t\t\tdocCard.href = visualizeUrl || fileLink.href;\n\t\t\tdocCard.className = \"flex flex-col items-start justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm shadow-neutral-100 transition-all duration-200 relative hover:-translate-y-0.5 hover:border-neutral-300 no-underline group\";\n\n\t\t\tconst unreadBadge = isUnread\n\t\t\t\t? `<span class=\"absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold text-red-600 tracking-wide leading-none whitespace-nowrap rounded-full bg-red-800/5 px-2 py-1\" role=\"status\" aria-label=\"Unread document\">\n\t\t\t\t\t<span class=\"uppercase\">Unread</span>\n\t\t\t\t\t<span class=\"w-2 h-2 rounded-full bg-red-600\" aria-hidden=\"true\"></span>\n\t\t\t\t</span>`\n\t\t\t\t: \"\";\n\n\t\t\tdocCard.innerHTML = `\n\t\t\t\t<div class=\"flex flex-col gap-4\">\n\t\t\t\t\t${unreadBadge}\n\t\t\t\t\t<div class=\"flex-shrink-0 w-6 h-6 flex items-center justify-center\">\n\t\t\t\t\t\t${fileIcon ? `<img src=\"${fileIcon.src}\" alt=\"File type\" class=\"w-6 h-6 object-contain\">` : \"\"}\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t\t<div class=\"w-full flex flex-col gap-2\">\n                    <div class=\"text-base font-semibold text-slate-900 no-underline tracking-tight leading-tight text-left group-hover:text-red-800 text-neutral-600\">${title}</div>\n\t\t\t\t\t<div class=\"flex justify-between items-center w-full\">\n\t\t\t\t\t\t${date ? `<span class=\"text-xs text-neutral-500\">${date}</span>` : \"\"}\n\t\t\t\t\t\t${fileSize ? `<span class=\"text-xs text-neutral-500\">${fileSize}</span>` : \"\"}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t`;\n\n\t\t\tgridContainer.appendChild(docCard);\n\t\t});\n\n\t\tcategoryContainer.appendChild(gridContainer);\n\t\tmainContainer.appendChild(categoryContainer);\n\t});\n\n\t// Replace table with new container\n\tdocumentsTable.parentNode.replaceChild(mainContainer, documentsTable);\n}\n\n\n//# sourceURL=webpack://omnivox-optimizer/./src/modules/lea/documents.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("fb73906264f2057e36b8")
/******/ })();
/******/ 
/******/ }
);