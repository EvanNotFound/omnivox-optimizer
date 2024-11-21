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

        // Function to move the Calendar header
        function moveCalendarHeader() {
            // Find the calendar header element
            const calendarLink = document.querySelector('.dlsCal');
            
            // Find the target section-droite div
            const sectionDroite = document.querySelector('.section-droite');
            
            if (calendarLink && sectionDroite) {
                // Create a new div to hold the calendar header
                const newHeader = document.createElement('div');
                newHeader.className = 'calendar-header';
                newHeader.style.cssText = 'padding: 10px; font-size: 16px; font-weight: bold;';
                
                // Move the calendar link to the new header
                newHeader.appendChild(calendarLink);
                
                // Insert the new header at the beginning of section-droite
                sectionDroite.insertBefore(newHeader, sectionDroite.firstChild);
            }
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

        // Function to remove &nbsp; from table text
        function removeNbspFromTable() {
            const cgSelectTable = document.querySelector('.cgSelect-table');
            if (cgSelectTable) {
                // Get all text nodes in the table
                const walker = document.createTreeWalker(
                    cgSelectTable,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                let node;
                while (node = walker.nextNode()) {
                    // Replace &nbsp; with regular space
                    node.textContent = node.textContent.replace(/\u00A0/g, ' ').trim();
                }
            }
        }

        // Call the function
        removeNbspFromTable();

        setCustomCourseColors();
        
    });


    function convertMenuToFlex() {
        // Find the main menu table
        const menuTable = document.querySelector('.tblMenuStyleXPDeuxNiveaux');
        if (!menuTable) return;

        // Create new flex container
        const flexMenu = document.createElement('div');
        flexMenu.className = 'flex-menu';

        // Get all menu items (tr elements with class trMenuPrincipal)
        const menuItems = menuTable.querySelectorAll('.trMenuPrincipal');

        menuItems.forEach(item => {
            // Create container for menu item
            const menuItem = document.createElement('div');
            menuItem.className = 'flex-menu-item';

            // Get the link and submenu
            const link = item.querySelector('a');
            const submenu = item.querySelector('.divContenuMenu');

            if (link) {
                // Clone the link to preserve event listeners
                const newLink = link.cloneNode(true);
                menuItem.appendChild(newLink);
            }

            if (submenu) {
                // Create flex submenu
                const flexSubmenu = document.createElement('div');
                flexSubmenu.className = 'flex-submenu';

                // Get all submenu links
                const submenuLinks = submenu.querySelectorAll('a');
                submenuLinks.forEach(subLink => {
                    const subItem = document.createElement('div');
                    subItem.className = 'flex-submenu-item';
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

        // Add the necessary styles
        GM_addStyle(`
            .flex-menu {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 8px;
            }

            .flex-menu-item {
                position: relative;
            }

            .flex-menu-item > a {
                display: block;
                padding: 8px 16px;
                text-decoration: none;
                color: inherit;
                border-radius: 4px;
                transition: background-color 0.2s ease;
                text-align: left !important;
            }

            .flex-menu-item > a:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }

            .flex-submenu {
                display: none;
                position: absolute;
                left: 50%;
                top: 0;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                min-width: 200px;
                z-index: 999999999999999999999999999 !important;
            }

            .flex-menu-item:hover .flex-submenu {
                display: flex;
                flex-direction: column;
                gap: 2px;
                padding: 4px;
            }

            .flex-submenu-item a {
                display: block;
                padding: 8px 16px;
                text-decoration: none;
                color: inherit;
                border-radius: 4px;
                transition: background-color 0.2s ease;
                white-space: nowrap;
            }

            .flex-submenu-item a:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
        `);
    }

    function setCustomCourseColors() {
        // Default colors if none are set
        const defaultColors = {
            '201-SF5-RE': '#df8e1d', // Discrete Math
            '201-SN2-RE': '#d20f39', // Calculus
            '345-101-MQ': '#40a02b', // Humanities
            '420-SF1-RE': '#04a5e5', // Programming
            '602-101-MQ': '#fe640b', // French
            '603-101-MQ': '#ea76cb'  // English
        };
    
        const storedColors = JSON.parse(localStorage.getItem('courseColors') || '{}');
        const courseColors = { ...defaultColors, ...storedColors };
    
        // Apply colors to each course card
        document.querySelectorAll('.card-panel-header').forEach(header => {
            const titleElement = header.querySelector('.card-panel-title');
            if (!titleElement) return;
    
            const courseCode = Object.keys(courseColors).find(code => 
                titleElement.textContent.trim().startsWith(code)
            );
            
            if (courseCode) {
                header.style.backgroundColor = courseColors[courseCode];
            }
        });
    
        return courseColors;
    }

    
    
    GM_addStyle(`
        /* Basic improvements */
        body {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            background: hsl(var(--neutral-100));
            -webkit-font-smoothing: antialiased;
        }

        /* Font */
        .infoCGNoCours, .infoCGNomCours, .infoCGTous, .infoCGNoGroupe, .om a, .om a:link, .om a:visited, .om a:active {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;§
        }

        header.lea #headerImage {
            background-image: url('https://assets.ohevan.com/img/d7418ab98f310ba3fd14214d7b11771f.jpg') !important;
            background-size: cover !important;
            background-position: center !important;
        }

        /* Remove background images */
        [style*="accueil_cal_bot2.jpg"],
        [style*="accueil_cal_tile.jpg"],
        [style*="accueil_cal_top5.jpg"],
        [style*="accueil_cal_top1.jpg"],
        [style*="accueil_cal_top2.jpg"],
        [style*="accueil_mio_top3.jpg"] {
            background-image: none !important;
        }

        /* Hide decorative images */
        img[src*="accueil_cal_top4.jpg"] {
            display: none !important;
        }

        /* Remove left margin from right section */
        .descSection > span:first-child {
            margin-left: 0 !important;
        }

        .dlsCal {
            top: 0 !important;
        }

        /* Title styling */
        h1.classes-titre {
            padding: 0 !important;
            margin-top: 1rem !important;
        }

        .section-centre {
            display: flex !important;
            flex-direction: column !important;
            gap: 0.5rem !important;
            padding: 1rem 2rem !important;
        }

        /* Classes wrapper flex layout */
        .classes-wrapper.materialize-wrapper {
            display: flex !important;
            flex-wrap: wrap !important;
            width: 100% !important;
            gap: 20px !important;
            padding: 20px !important;
            margin: 0 auto !important;
            max-width: 1400px !important;
            padding: 0 !important;
        }

        /* Make course cards flex items */
        .classes-wrapper.materialize-wrapper > * {
            flex: 1 1 300px !important;
            min-width: 300px !important;
            max-width: 400px !important;
            margin: 0 !important;
        }

        /* Improve main content area and right section in menu */
        .td-menu {
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 10px;
        }

        .section-droite {
            margin-top: 20px !important;
            border-top: 1px solid #e0e0e0 !important;
            padding-top: 20px !important;
            height: 25vh !important;
            overflow-y: auto !important;
        }

        /* Hide unnecessary decorative elements */
        img[src*="/cvir/UI/Theme/Lea_Defaut/Images/"],
        .table-plug-skytech,
        .UnInstantClassVirtuelle {
            display: none !important;
        }

        /* Improve course links */
        .contenuMenuGroupeLEASelectV3estdMenuV2 {
            background: white !important;
            padding: 10px !important;
            margin: 5px 0 !important;
            border-radius: 4px !important;
            border: 1px solid #e0e0e0 !important;
            transition: background-color 0.2s !important;
        }

        .contenuMenuGroupeLEASelectV3estdMenuV2:hover {
            background: #f8f9fa !important;
        }

        #cntFormulaire_mioInfoTile,
        #cntFormulaire_leaInfoTile {
            display: none !important;
        }
            
        /* Optimize sidebar container */
        .trBandeau > td:first-child {
            padding: 0 16px !important;
        }

        .trBandeau {
            position: sticky !important;
            top: 56px !important;
        }

        /* Lea and Mio buttons */
        #region-raccourcis-services-skytech {
            padding: 20px 0 !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 16px !important;
            justify-content: center !important;
            margin: 0 !important;
        }

        #region-raccourcis-services-skytech .raccourci {
            padding: 1rem !important;
            background: white !important;
            border-radius: 12px !important;
            border: 1px solid #e0e0e0 !important;
            transition: all 0.2s ease !important;
            text-decoration: none !important;
            min-width: 120px !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 8px !important;
            box-shadow: 0 1px 2px 0 hsl(var(--neutral-100)) !important;
        }

        #region-raccourcis-services-skytech .raccourci:hover {
            background: #f8f9fa !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
        }

        #region-raccourcis-services-skytech .svg-icon {
            width: 24px !important;
            height: 24px !important;
            opacity: 0.8 !important;
            border-radius: 4px !important;
            margin: 0 !important;
            padding: 0.5rem !important;
        }

        #region-raccourcis-services-skytech .titre {
            font-weight: 500 !important;
            color: #2c3e50 !important;
            padding: 0 !important;
        }

        #region-raccourcis-services-skytech .raccourci .svg-icon {
            box-shadow: 0 0 0 1px hsl(var(--neutral-200)) !important;
        }

 
    `);

    // Optimize card panel
    GM_addStyle(`
        .card-panel.section-spacing {
            box-shadow: 0 1px 2px 0 hsl(var(--neutral-200)) !important;
            border: 1px solid hsl(var(--neutral-300)) !important;
        }
    `);

    GM_addStyle(`
        .cvirContenuCVIR {
            padding: 0 !important;
        }
    `);

    // Left menu styles
    GM_addStyle(`
           /* Optimize left menu */
        .parent-menu-gauche {
            padding: 0 !important;
            margin: 0 !important;
        }

        .menu-section-title {
            padding: 10px 0 !important;
            text-align: left !important;
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            color: #4a951f;
        }

        .trMenuPrincipal > td:first-child {
            padding: 0 !important;
        }

        .infoCGNoCours {
            font-size: 1.2rem;
            letter-spacing: -0.02em;
        }

        .cgSelect,
        .cgBg {
            background-image: none !important;
        }

        .cgBg div {
            margin: 0 !important;
        }

        .cgSelect {
            margin: 0.5rem 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background: hsl(var(--neutral-50)) !important;
            padding: 0.5rem 0 !important;
            border-radius: 0.5rem !important;
        }

        .cgSelect table {
            margin: 0 !important;
        }

        /* Remove text shadow effect in cgSelect */
        .cgSelect font,
        .cvirLienCoursShadow font {
            display: none !important;
        }

        /* Adjust the original text styling */
        .cgSelect a,
        .cvirLienCoursShadow {
            position: static !important;
            left: 0 !important;
            color: #2c3e50 !important;  /* Or any color you prefer */
            font-weight: 500 !important;
        }

        /* Semester selector styling improvements */
        .cgSelect {
            background: white !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            padding: 12px 16px !important;
            margin: 8px 0 !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
        }

        .cgSelect-table {
            width: 100% !important;
        }

        /* Style the semester and class selection links */
        .cgSelect a {
            color: #2c3e50 !important;
            font-size: 15px !important;
            font-weight: 500 !important;
            text-decoration: none !important;
            transition: color 0.2s ease !important;
        }

        .cgSelect a:hover {
            color: #4a951f !important; /* Green accent color on hover */
        }

        /* Remove the text shadow effect more cleanly */
        .cgSelect font {
            display: none !important;
        }

        /* Adjust spacing between semester and class selection */
        .cgSelect td {
            padding: 0 8px !important;
        }

        /* Add subtle separator between semester and class selection */
        .cgSelect td:last-child {
            border-left: 1px solid #e0e0e0 !important;
            padding-left: 16px !important;
        }

        body > table:nth-child(8) > tbody > tr.trBandeau > td.td-menu > div.parent-menu-gauche > table:nth-child(2) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(2) {
            text-align: center !important;
            padding: 0 !important;
        }


        #divChoixCoursGroupeCoursMenuV2,
        #tblChoixCoursGroupeSession {
            margin-top: 1.1rem !important;
        }

        /* Menu items base styles and hover effect */
        .tdMenuNonSelectionneMesClasses a, .tdMenuNonSelectionneMesClasses span,
        .tdMenuNonSelectionneSeulMesClasses a, .tdMenuNonSelectionneSeulMesClasses span,
        .tdMenuNonSelectionneMesServices a, .tdMenuNonSelectionneMesServices span,
        .tdMenuNonSelectionneSeulMesServices a, .tdMenuNonSelectionneSeulMesServices span,
        .tdMenuSelectionneMesClasses a, .tdMenuSelectionneMesClasses span,
        .tdMenuSelectionneSeulMesClasses a, .tdMenuSelectionneSeulMesClasses span,
        .tdMenuSelectionneMesServices a, .tdMenuSelectionneMesServices span,
        .tdMenuSelectionneSeulMesServices a, .tdMenuSelectionneSeulMesServices span,
        .tdMenuNonAccessibleMesClasses a, .tdMenuNonAccessibleMesClasses span,
        .tdMenuNonAccessibleMesServices a, .tdMenuNonAccessibleMesServices span,
        .tdMenuNonSelectionneSeulAssi a, .tdMenuNonSelectionneSeulAssi span,
        .tdMenuNonSelectionneAssisPedMenu a, .tdMenuNonSelectionneAssisPedMenu span,
        .tdMenuSelectionneSeulAssi a, .tdMenuSelectionneSeulAssi span,
        .tdMenuSelectionneAssisPedMenu a, .tdMenuSelectionneAssisPedMenu span {
            padding: 0.5rem 0px !important;
            transition: background-color 0.2s ease !important;
            display: block !important;
            border-radius: 0.5rem !important;
        }

        /* Hover effect */
        .tdMenuNonSelectionneMesClasses a:hover, .tdMenuNonSelectionneSeulMesClasses a:hover,
        .tdMenuNonSelectionneMesServices a:hover, .tdMenuNonSelectionneSeulMesServices a:hover,
        .tdMenuSelectionneMesClasses a:hover, .tdMenuSelectionneSeulMesClasses a:hover,
        .tdMenuSelectionneMesServices a:hover, .tdMenuSelectionneSeulMesServices a:hover,
        .tdMenuNonAccessibleMesClasses a:hover, .tdMenuNonAccessibleMesServices a:hover,
        .tdMenuNonSelectionneSeulAssi a:hover, .tdMenuNonSelectionneAssisPedMenu a:hover,
        .tdMenuSelectionneSeulAssi a:hover, .tdMenuSelectionneAssisPedMenu a:hover {
            background-color: rgba(0, 0, 0, 0.05) !important;
        }

        .sousMenuTable, .sousMenuTable table {

        }

        .tdMenuNonSelectionneMesClasses, .tdMenuNonSelectionneSeulMesClasses {
            background-image: none !important;  
        }

        /* Hide "My services" table */
        body > table:nth-child(8) > tbody > tr.trBandeau > td.td-menu > div.parent-menu-gauche > table:nth-child(5),
        body > table:nth-child(8) > tbody > tr.trBandeau > td.td-menu > div.parent-menu-gauche > table:nth-child(6) {
            display: none !important;
        }

        /* Optimize calendar section */
        .descSection > span:first-child {
            padding-right: 0 !important;
        }
    `);


    // Call the function when the document is ready
    document.addEventListener('DOMContentLoaded', convertMenuToFlex);

    // Tailwind colors
    GM_addStyle(`
        :root {
        /* Slate */
        --slate-50: 210 40% 98%;
        --slate-100: 210 40% 96.1%;
        --slate-200: 214.3 31.8% 91.4%;
        --slate-300: 212.7 26.8% 83.9%;
        --slate-400: 215 20.2% 65.1%;
        --slate-500: 215.4 16.3% 46.9%;
        --slate-600: 215.3 19.3% 34.5%;
        --slate-700: 215.3 25% 26.7%;
        --slate-800: 217.2 32.6% 17.5%;
        --slate-900: 222.2 47.4% 11.2%;
        --slate-950: 228.6 84% 4.9%;

        /* Gray */
        --gray-50: 210 20% 98%;
        --gray-100: 220 14.3% 95.9%;
        --gray-200: 220 13% 91%;
        --gray-300: 216 12.2% 83.9%;
        --gray-400: 217.9 10.6% 64.9%;
        --gray-500: 220 8.9% 46.1%;
        --gray-600: 215 13.8% 34.1%;
        --gray-700: 216.9 19.1% 26.7%;
        --gray-800: 215 27.9% 16.9%;
        --gray-900: 220.9 39.3% 11%;
        --gray-950: 224 71.4% 4.1%;

        /* Zinc */
        --zinc-50: 0 0% 98%;
        --zinc-100: 240 4.8% 95.9%;
        --zinc-200: 240 5.9% 90%;
        --zinc-300: 240 4.9% 83.9%;
        --zinc-400: 240 5% 64.9%;
        --zinc-500: 240 3.8% 46.1%;
        --zinc-600: 240 5.2% 33.9%;
        --zinc-700: 240 5.3% 26.1%;
        --zinc-800: 240 3.7% 15.9%;
        --zinc-900: 240 5.9% 10%;
        --zinc-950: 240 10% 3.9%;

        /* Neutral */
        --neutral-50: 0 0% 98%;
        --neutral-100: 0 0% 96.1%;
        --neutral-200: 0 0% 89.8%;
        --neutral-300: 0 0% 83.1%;
        --neutral-400: 0 0% 63.9%;
        --neutral-500: 0 0% 45.1%;
        --neutral-600: 0 0% 32.2%;
        --neutral-700: 0 0% 25.1%;
        --neutral-800: 0 0% 14.9%;
        --neutral-900: 0 0% 9%;
        --neutral-950: 0 0% 3.9%;

        /* Stone */
        --stone-50: 60 9.1% 97.8%;
        --stone-100: 60 4.8% 95.9%;
        --stone-200: 20 5.9% 90%;
        --stone-300: 24 5.7% 82.9%;
        --stone-400: 24 5.4% 63.9%;
        --stone-500: 25 5.3% 44.7%;
        --stone-600: 33.3 5.5% 32.4%;
        --stone-700: 30 6.3% 25.1%;
        --stone-800: 12 6.5% 15.1%;
        --stone-900: 24 9.8% 10%;
        --stone-950: 20 14.3% 4.1%;

        /* Red */
        --red-50: 0 85.7% 97.3%;
        --red-100: 0 93.3% 94.1%;
        --red-200: 0 96.3% 89.4%;
        --red-300: 0 93.5% 81.8%;
        --red-400: 0 90.6% 70.8%;
        --red-500: 0 84.2% 60.2%;
        --red-600: 0 72.2% 50.6%;
        --red-700: 0 73.7% 41.8%;
        --red-800: 0 70% 35.3%;
        --red-900: 0 62.8% 30.6%;
        --red-950: 0 74.7% 15.5%;

        /* Orange */
        --orange-50: 33.3 100% 96.5%;
        --orange-100: 34.3 100% 91.8%;
        --orange-200: 32.1 97.7% 83.1%;
        --orange-300: 30.7 97.2% 72.4%;
        --orange-400: 27 96% 61%;
        --orange-500: 24.6 95% 53.1%;
        --orange-600: 20.5 90.2% 48.2%;
        --orange-700: 17.5 88.3% 40.4%;
        --orange-800: 15 79.1% 33.7%;
        --orange-900: 15.3 74.6% 27.8%;
        --orange-950: 13 81.1% 14.5%;

        /* Amber */
        --amber-50: 48 100% 96.1%;
        --amber-100: 48 96.5% 88.8%;
        --amber-200: 48 96.6% 76.7%;
        --amber-300: 45.9 96.7% 64.5%;
        --amber-400: 43.3 96.4% 56.3%;
        --amber-500: 37.7 92.1% 50.2%;
        --amber-600: 32.1 94.6% 43.7%;
        --amber-700: 26 90.5% 37.1%;
        --amber-800: 22.7 82.5% 31.4%;
        --amber-900: 21.7 77.8% 26.5%;
        --amber-950: 20.9 91.7% 14.1%;

        /* Yellow */
        --yellow-50: 54.5 91.7% 95.3%;
        --yellow-100: 54.9 96.7% 88%;
        --yellow-200: 52.8 98.3% 76.9%;
        --yellow-300: 50.4 97.8% 63.5%;
        --yellow-400: 47.9 95.8% 53.1%;
        --yellow-500: 45.4 93.4% 47.5%;
        --yellow-600: 40.6 96.1% 40.4%;
        --yellow-700: 35.5 91.7% 32.9%;
        --yellow-800: 31.8 81% 28.8%;
        --yellow-900: 28.4 72.5% 25.7%;
        --yellow-950: 26 83.3% 14.1%;

        /* Lime */
        --lime-50: 78.3 92% 95.1%;
        --lime-100: 79.6 89.1% 89.2%;
        --lime-200: 80.9 88.5% 79.6%;
        --lime-300: 82 84.5% 67.1%;
        --lime-400: 82.7 78% 55.5%;
        --lime-500: 83.7 80.5% 44.3%;
        --lime-600: 84.8 85.2% 34.5%;
        --lime-700: 85.9 78.4% 27.3%;
        --lime-800: 86.3 69% 22.7%;
        --lime-900: 87.6 61.2% 20.2%;
        --lime-950: 89.3 80.4% 10%;

        /* Green */
        --green-50: 138.5 76.5% 96.7%;
        --green-100: 140.6 84.2% 92.5%;
        --green-200: 141 78.9% 85.1%;
        --green-300: 141.7 76.6% 73.1%;
        --green-400: 141.9 69.2% 58%;
        --green-500: 142.1 70.6% 45.3%;
        --green-600: 142.1 76.2% 36.3%;
        --green-700: 142.4 71.8% 29.2%;
        --green-800: 142.8 64.2% 24.1%;
        --green-900: 143.8 61.2% 20.2%;
        --green-950: 144.9 80.4% 10%;

        /* Emerald */
        --emerald-50: 151.8 81% 95.9%;
        --emerald-100: 149.3 80.4% 90%;
        --emerald-200: 152.4 76% 80.4%;
        --emerald-300: 156.2 71.6% 66.9%;
        --emerald-400: 158.1 64.4% 51.6%;
        --emerald-500: 160.1 84.1% 39.4%;
        --emerald-600: 161.4 93.5% 30.4%;
        --emerald-700: 162.9 93.5% 24.3%;
        --emerald-800: 163.1 88.1% 19.8%;
        --emerald-900: 164.2 85.7% 16.5%;
        --emerald-950: 165.7 91.3% 9%;

        /* Teal */
        --teal-50: 166.2 76.5% 96.7%;
        --teal-100: 167.2 85.5% 89.2%;
        --teal-200: 168.4 83.8% 78.2%;
        --teal-300: 170.6 76.9% 64.3%;
        --teal-400: 172.5 66% 50.4%;
        --teal-500: 173.4 80.4% 40%;
        --teal-600: 174.7 83.9% 31.6%;
        --teal-700: 175.3 77.4% 26.1%;
        --teal-800: 176.1 69.4% 21.8%;
        --teal-900: 175.9 60.8% 19%;
        --teal-950: 178.6 84.3% 10%;

        /* Cyan */
        --cyan-50: 183.2 100% 96.3%;
        --cyan-100: 185.1 95.9% 90.4%;
        --cyan-200: 186.2 93.5% 81.8%;
        --cyan-300: 187 92.4% 69%;
        --cyan-400: 187.9 85.7% 53.3%;
        --cyan-500: 188.7 94.5% 42.7%;
        --cyan-600: 191.6 91.4% 36.5%;
        --cyan-700: 192.9 82.3% 31%;
        --cyan-800: 194.4 69.6% 27.1%;
        --cyan-900: 196.4 63.6% 23.7%;
        --cyan-950: 197 78.9% 14.9%;

        /* Sky */
        --sky-50: 204 100% 97.1%;
        --sky-100: 204 93.8% 93.7%;
        --sky-200: 200.6 94.4% 86.1%;
        --sky-300: 199.4 95.5% 73.9%;
        --sky-400: 198.4 93.2% 59.6%;
        --sky-500: 198.6 88.7% 48.4%;
        --sky-600: 200.4 98% 39.4%;
        --sky-700: 201.3 96.3% 32.2%;
        --sky-800: 201 90% 27.5%;
        --sky-900: 202 80.3% 23.9%;
        --sky-950: 204 80.2% 15.9%;

        /* Blue */
        --blue-50: 213.8 100% 96.9%;
        --blue-100: 214.3 94.6% 92.7%;
        --blue-200: 213.3 96.9% 87.3%;
        --blue-300: 211.7 96.4% 78.4%;
        --blue-400: 213.1 93.9% 67.8%;
        --blue-500: 217.2 91.2% 59.8%;
        --blue-600: 221.2 83.2% 53.3%;
        --blue-700: 224.3 76.3% 48%;
        --blue-800: 225.9 70.7% 40.2%;
        --blue-900: 224.4 64.3% 32.9%;
        --blue-950: 226.2 57% 21%;

        /* Indigo */
        --indigo-50: 225.9 100% 96.7%;
        --indigo-100: 226.5 100% 93.9%;
        --indigo-200: 228 96.5% 88.8%;
        --indigo-300: 229.7 93.5% 81.8%;
        --indigo-400: 234.5 89.5% 73.9%;
        --indigo-500: 238.7 83.5% 66.7%;
        --indigo-600: 243.4 75.4% 58.6%;
        --indigo-700: 244.5 57.9% 50.6%;
        --indigo-800: 243.7 54.5% 41.4%;
        --indigo-900: 242.2 47.4% 34.3%;
        --indigo-950: 243.8 47.1% 20%;

        /* Violet */
        --violet-50: 250 100% 97.6%;
        --violet-100: 251.4 91.3% 95.5%;
        --violet-200: 250.5 95.2% 91.8%;
        --violet-300: 252.5 94.7% 85.1%;
        --violet-400: 255.1 91.7% 76.3%;
        --violet-500: 258.3 89.5% 66.3%;
        --violet-600: 262.1 83.3% 57.8%;
        --violet-700: 263.4 70% 50.4%;
        --violet-800: 263.4 69.3% 42.2%;
        --violet-900: 263.5 67.4% 34.9%;
        --violet-950: 261.2 72.6% 22.9%;

        /* Purple */
        --purple-50: 270 100% 98%;
        --purple-100: 268.7 100% 95.5%;
        --purple-200: 268.6 100% 91.8%;
        --purple-300: 269.2 97.4% 85.1%;
        --purple-400: 270 95.2% 75.3%;
        --purple-500: 270.7 91% 65.1%;
        --purple-600: 271.5 81.3% 55.9%;
        --purple-700: 272.1 71.7% 47.1%;
        --purple-800: 272.9 67.2% 39.4%;
        --purple-900: 273.6 65.6% 32%;
        --purple-950: 273.5 86.9% 21%;

        /* Fuchsia */
        --fuchsia-50: 289.1 100% 97.8%;
        --fuchsia-100: 287 100% 95.5%;
        --fuchsia-200: 288.3 95.8% 90.6%;
        --fuchsia-300: 291.1 93.1% 82.9%;
        --fuchsia-400: 292 91.4% 72.5%;
        --fuchsia-500: 292.2 84.1% 60.6%;
        --fuchsia-600: 293.4 69.5% 48.8%;
        --fuchsia-700: 294.7 72.4% 39.8%;
        --fuchsia-800: 295.4 70.2% 32.9%;
        --fuchsia-900: 296.7 63.6% 28%;
        --fuchsia-950: 296.8 90.2% 16.1%;

        /* Pink */
        --pink-50: 327.3 73.3% 97.1%;
        --pink-100: 325.7 77.8% 94.7%;
        --pink-200: 325.9 84.6% 89.8%;
        --pink-300: 327.4 87.1% 81.8%;
        --pink-400: 328.6 85.5% 70.2%;
        --pink-500: 330.4 81.2% 60.4%;
        --pink-600: 333.3 71.4% 50.6%;
        --pink-700: 335.1 77.6% 42%;
        --pink-800: 335.8 74.4% 35.3%;
        --pink-900: 335.9 69% 30.4%;
        --pink-950: 336.2 83.9% 17.1%;

        /* Rose */
        --rose-50: 355.7 100% 97.3%;
        --rose-100: 355.6 100% 94.7%;
        --rose-200: 352.7 96.1% 90%;
        --rose-300: 352.6 95.7% 81.8%;
        --rose-400: 351.3 94.5% 71.4%;
        --rose-500: 349.7 89.2% 60.2%;
        --rose-600: 346.8 77.2% 49.8%;
        --rose-700: 345.3 82.7% 40.8%;
        --rose-800: 343.4 79.7% 34.7%;
        --rose-900: 341.5 75.5% 30.4%;
        --rose-950: 343.1 87.7% 15.9%;
        }
    `);






    // Add this after the existing GM_addStyle calls
GM_addStyle(`
    .customize-popup {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 9999999;
        min-width: 300px;
    }

    .customize-popup h2 {
        margin: 0 0 15px 0;
        font-size: 18px;
        color: #2c3e50;
    }

    .customize-popup input {
        width: 100%;
        padding: 8px;
        margin-bottom: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
    }

    .customize-popup .buttons {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }

    .customize-popup button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .customize-popup .save-btn {
        background: #4a951f;
        color: white;
    }

    .customize-popup .cancel-btn {
        background: #e0e0e0;
    }

    .customize-popup button:hover {
        opacity: 0.9;
    }

    .popup-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999998;
    }
`);

function optimizeCourseDocuments() {
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
        #ctl00 > center {
            padding: 1rem !important;
        }

        .documents-container {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            max-width: 100%;
            margin: 0 auto;
        }

        .category-container {
            border: 1px solid hsl(var(--neutral-200));
            border-radius: 8px;
            overflow: hidden;
        }

        .category-header {
            background: white;
            border-bottom: 1px solid hsl(var(--neutral-200));
            padding: 1rem;
            font-weight: 600;
            color: hsl(var(--slate-900));
            font-size: 1.1rem;
        }

        .documents-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
            padding: 1rem;
            background: hsl(var(--neutral-50));
        }

        .document-card {
            display: flex;
            align-items: start;
            gap: 1rem;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            border: 1px solid hsl(var(--neutral-200));
            box-shadow: 0 1px 2px 0 hsl(var(--neutral-100));
            transition: all 0.2s ease;
        }

        .document-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border-color: hsl(var(--neutral-300));
        }

        .doc-icon {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .doc-icon img {
            width: 24px;
            height: 24px;
            object-fit: contain;
        }

        .doc-info {
            flex: 1;
            min-width: 0;
        }

        .doc-title {
            display: block;
            font-size: 0.9rem;
            font-weight: 500;
            color: hsl(var(--slate-900));
            text-decoration: none;
            margin-bottom: 0.5rem;
            line-height: 1.4;
            text-align: left;
        }

        .doc-title:hover {
            color: hsl(var(--slate-700));
        }

        .doc-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.8rem;
            color: hsl(var(--slate-500));
        }

        .doc-date, .doc-size {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .doc-date::before {
            content: "📅";
            font-size: 0.9em;
        }

        .doc-size::before {
            content: "📁";
            font-size: 0.9em;
        }

        body > table:nth-child(8) > tbody > tr.trBandeau > td:nth-child(2),
        #tblExplicationsEtudiant,
        #ctl00 > center > table:nth-child(4) {
            display: none;
        }

        .TitrePageLigne1 {
            text-align: left;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }

        .TitrePageLigne2 {
            font-size: 1rem;
            color: hsl(var(--zinc-400));
            text-align: left;
            margin-bottom: 1rem;
        }
    `);
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', optimizeCourseDocuments);
})();

