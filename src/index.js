import { injectStyles } from './modules/styles';
import { 
    moveCalendarHeader,
    removeNbspFromTable,
    convertMenuToFlex,
    setCustomCourseColors,
    moveElementsOutsideWrapper,
    moveMyClassesTitle,
    moveRightSection,
    removeBrTags
} from './modules/lea/home';
import { optimizeCourseDocuments } from './modules/lea/documents';
import { optimizeAssignmentsList } from './modules/lea/assignments';
import { logScriptInfo, checkForUpdates } from './modules/console';



(function () {
    'use strict';
  
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Omnivox UI Optimizer loaded');
        logScriptInfo();

        // Inject styles
        injectStyles();

        const currentUrl = window.location.href;
        console.log('Current URL:', currentUrl);

        // Call all home.js functions
        removeNbspFromTable();
        moveCalendarHeader();
        convertMenuToFlex();
        setCustomCourseColors();
        moveElementsOutsideWrapper();
        moveMyClassesTitle();
        moveRightSection();
        removeBrTags();

        // Optimize documents page
        optimizeCourseDocuments();


        // Optimize assignments page
        if (currentUrl.includes('ListeTravauxEtu.aspx') || currentUrl.includes('travaux')) {
            console.log('Assignments page detected');
            optimizeAssignmentsList();
        }

        // Check for updates
        checkForUpdates();

    });


})();
