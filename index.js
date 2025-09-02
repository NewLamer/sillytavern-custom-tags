(function () {
    const extensionName = 'Custom Tags Styler';
    const defaultTags = {
        'special': { bg: '#fff3cd', border: '#ffc107' },
        'note': { bg: '#d1ecf1', border: '#0dcaf0' },
        'warn': { bg: '#f8d7da', border: '#dc3545' },
        'secret': { bg: '#e2e3e5', border: '#6c757d' }
    };
    let userTags = {}; // Will be loaded from settings

    function loadUserTags() {
        try {
            const saved = localStorage.getItem('CustomTagsStyler_Tags');
            userTags = saved ? JSON.parse(saved) : defaultTags;
        } catch (e) {
            console.error('Failed to load custom tags settings:', e);
            userTags = defaultTags;
        }
    }

    function applyStyles() {
        let css = '';
        for (const [tagName, style] of Object.entries(userTags)) {
            css += `
                .custom-tag-${tagName} {
                    background: ${style.bg};
                    border-left: 4px solid ${style.border};
                    padding: 10px;
                    margin: 8px 0;
                    border-radius: 4px;
                    font-family: sans-serif;
                }
            `;
        }

        // Remove old style tag if exists
        const oldStyle = document.getElementById('custom-tags-styler-css');
        if (oldStyle) oldStyle.remove();

        // Add new style tag
        const styleTag = document.createElement('style');
        styleTag.id = 'custom-tags-styler-css';
        styleTag.textContent = css;
        document.head.appendChild(styleTag);
    }

    function transformTags(html) {
        let result = html;
        for (const tagName of Object.keys(userTags)) {
            const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, 'g');
            result = result.replace(regex, `<div class="custom-tag-${tagName}">$1</div>`);
        }
        return result;
    }

    // Event listener for message rendering
    document.addEventListener('messageRendered', (event) => {
        const { name, chat, mes } = event.detail;
        if (!mes || !mes.mes) return;
        // Transform the message content
        mes.mes = transformTags(mes.mes);
    });

    // Load settings and apply styles on startup
    loadUserTags();
    applyStyles();

    // Listen for settings updates from the settings panel
    window.addEventListener('message', (event) => {
        if (event.data.type === 'customTagsStyler_update') {
            userTags = event.data.tags;
            applyStyles();
        }
    });

})();