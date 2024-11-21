// Import all Stylus files from the styles directory
const stylusModules = require.context('../styles/', true, /\.styl$/, 'sync');

export function injectStyles() {
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