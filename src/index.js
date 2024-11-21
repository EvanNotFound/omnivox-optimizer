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

(function () {
    'use strict';
  
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Omnivox UI Optimizer loaded');

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
    });

    // Inject styles here since it uses GM_addStyle
    injectStyles();
})();
