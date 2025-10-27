// Import all Stylus files from the styles directory
const stylusModules = require.context('../styles/', true, /\.styl$/, 'sync');

export function injectStyles() {
    // Add font preconnect links
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://fonts.googleapis.com';
    
    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = 'anonymous';
    
    const fontStylesheet = document.createElement('link');
    fontStylesheet.rel = 'stylesheet';
    fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap';

    // Append font links to head
    document.head.appendChild(preconnectGoogle);
    document.head.appendChild(preconnectGstatic);
    document.head.appendChild(fontStylesheet);

    // Add Tailwind CSS Play CDN
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';
    document.head.appendChild(tailwindScript);

    // Remove problematic rules from Tailwind's default styles
    tailwindScript.addEventListener('load', () => {
        const styleTags = document.head.querySelectorAll('style');
        if (styleTags.length > 0) {
            const lastStyleTag = styleTags[styleTags.length - 1];
            if (lastStyleTag.textContent) {
                // Remove the box-sizing reset that breaks existing styles
                lastStyleTag.textContent = lastStyleTag.textContent.replace(
                    /\*,\s*::after,\s*::before,\s*::backdrop,\s*::file-selector-button\s*\{[^}]*box-sizing:\s*border-box;[^}]*\}/g,
                    ''
                );
                // Remove problematic img/video max-width rules
                lastStyleTag.textContent = lastStyleTag.textContent.replace(
                    /img,\s*video\s*\{[^}]*max-width:\s*100%;[^}]*height:\s*auto;[^}]*\}/g,
                    ''
                );
            }
        }
    });

    // Original style injection code
    const styles = stylusModules.keys()
        .map(key => {
            const module = stylusModules(key);
            const cssMatch = module.default.match(/`([^`]+)`/);
            return cssMatch ? cssMatch[1] : '';
        })
        .join('\n');

    if (styles) {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
}