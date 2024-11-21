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

async function checkForUpdates() {
    try {
        // Use GM_xmlhttpRequest instead of fetch
        GM_xmlhttpRequest({
            method: 'GET',
            url: GM_info.script.updateURL,
            onload: function(response) {
                if (response.status === 200) {
                    const text = response.responseText;
                    // Extract version from meta.js
                    const versionMatch = text.match(/@version\s+([^\s]+)/);
                    if (versionMatch) {
                        const latestVersion = versionMatch[1];
                        const currentVersion = GM_info.script.version;
                        
                        if (latestVersion !== currentVersion) {
                            console.group("Update Available");
                            console.log(
                                `%cA new version (${latestVersion}) is available! You are running version ${currentVersion}.\nVisit ${GM_info.script.homepage} to update.`,
                                'color: #e67e22; font-weight: bold;'
                            );
                            console.groupEnd();
                        }
                    }
                }
            },
            onerror: function(error) {
                console.warn('Failed to check for updates:', error);
            }
        });
    } catch (error) {
        console.warn('Failed to check for updates:', error);
    }
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

        // Check for updates
        checkForUpdates();

    });


})();
