// Import all Stylus files from the styles directory
const stylusModules = require.context('../styles/', true, /\.styl$/, 'sync');

export function injectStyles() {
    const styles = stylusModules.keys()
        .map(key => {
            const module = stylusModules(key);
            // Extract CSS between backticks using regex
            const cssMatch = module.default.match(/`([^`]+)`/);
            return cssMatch ? cssMatch[1] : '';
        })
        .join('\n');

    if (styles) {
        GM_addStyle(styles);
    }
}