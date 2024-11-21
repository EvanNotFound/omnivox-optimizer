// ==UserScript==
// @name         Omnivox UI Optimizer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Simple style improvements for Lea
// @author       Evan Luo
// @match        *://*.omnivox.ca/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      GPL-3.0
// ==/UserScript==


(function() {
    'use strict';

    // Move elements on DOM load
    document.addEventListener('DOMContentLoaded', () => {
        // Move title outside wrapper
        const wrapper = document.querySelector('.classes-wrapper');
        const title = wrapper?.querySelector('h1.classes-titre');
        if (wrapper && title) {
            wrapper.parentNode.insertBefore(title, wrapper);
        }

        // Move "My classes" title outside table
        const menuParent = document.querySelector('.parent-menu-gauche');
        const myClassesTitle = menuParent?.querySelector('.titre-menu-middle');
        if (menuParent && myClassesTitle) {
            // Create new heading element
            const newHeading = document.createElement('h2');
            newHeading.textContent = myClassesTitle.textContent;
            newHeading.className = 'menu-section-title';
            
            // Insert before the first table in parent-menu-gauche
            const firstTable = menuParent.querySelector('table');
            if (firstTable) {
                menuParent.insertBefore(newHeading, firstTable);
                
                // Hide original title row
                const titleRow = myClassesTitle.closest('tr');
                if (titleRow) {
                    titleRow.style.display = 'none';
                }
            }
        }

        // Move right section to menu
        const rightSection = document.querySelector('.section-droite');
        const menuArea = document.querySelector('.td-menu');
        if (rightSection && menuArea) {
            menuArea.appendChild(rightSection);
        }



        // Call the function when the document is ready
        moveCalendarHeader();

        // Remove <br> tags from trBandeau
        const trBandeau = document.querySelector('.trBandeau');
        if (trBandeau) {
            const brTags = trBandeau.getElementsByTagName('br');
            while (brTags.length > 0) {
                brTags[0].remove();
            }
        }



        // Call the function
        removeNbspFromTable();

        setCustomCourseColors();
        
    });




    
    
    GM_addStyle(`



 
    `);

    // Optimize card panel
    GM_addStyle(`

    `);

    GM_addStyle(`

    `);

    // Left menu styles
    GM_addStyle(`

    `);


    // Call the function when the document is ready
    document.addEventListener('DOMContentLoaded', convertMenuToFlex);

    // Tailwind colors
    GM_addStyle(`
    `);








// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', optimizeCourseDocuments);
})();

