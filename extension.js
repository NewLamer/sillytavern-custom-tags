// Функция замены пользовательских тегов
function transformCustomTags(html) {
    const tagMap = {
        'special': 'special',
        'note': 'note',
        'warn': 'warning',
        'secret': 'secret'
    };

    let result = html;
    for (const [tag, className] of Object.entries(tagMap)) {
        const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'g');
        result = result.replace(regex, `<div class="custom-tag ${className}">$1</div>`);
    }
    return result;
}

// Применение к сообщениям
document.addEventListener('message-rendered', (event) => {
    const el = event.detail.element;
    el.innerHTML = transformCustomTags(el.innerHTML);
});

// Загрузка пользовательских стилей
window.addEventListener('load', () => {
    const savedStyles = localStorage.getItem('customTagStyles');
    if (savedStyles) {
        const styleTag = document.createElement('style');
        styleTag.id = 'custom-tags-styles';
        styleTag.textContent = JSON.parse(savedStyles);
        document.head.appendChild(styleTag);
    }
});