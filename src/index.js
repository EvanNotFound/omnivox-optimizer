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

function logScriptInfo() {
    console.group("Script Information");
    
    // Create styled console log
    const styles = [
        'color: #2ecc71',
        'font-size: 14px',
        'font-weight: bold',
        'padding: 8px',
        'border-radius: 4px'
    ].join(';');

    console.log('%cOmnivox UI Optimizer', styles);
    console.log('Version:', GM_info.script.version);
    console.log('Author:', GM_info.script.author);
    console.log('Homepage:', GM_info.script.homepage);
    console.log('Description:', GM_info.script.description);
    console.groupEnd();
}

(function () {
    'use strict';
  
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Omnivox UI Optimizer loaded');
        logScriptInfo();

        // Inject styles
        injectStyles();

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


})();
