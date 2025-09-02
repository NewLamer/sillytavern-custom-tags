// settings.js
(function () {
    const defaultTags = {
        'special': { bg: '#fff3cd', border: '#ffc107' },
        'note': { bg: '#d1ecf1', border: '#0dcaf0' },
        'warn': { bg: '#f8d7da', border: '#dc3545' },
        'secret': { bg: '#e2e3e5', border: '#6c757d' }
    };

    let currentTags = {};

    function loadSettings() {
        try {
            const saved = localStorage.getItem('CustomTagsStyler_Tags');
            currentTags = saved ? JSON.parse(saved) : { ...defaultTags };
        } catch (e) {
            console.error('Failed to load settings:', e);
            currentTags = { ...defaultTags };
        }
        renderTagList();
    }

    function saveSettings() {
        try {
            localStorage.setItem('CustomTagsStyler_Tags', JSON.stringify(currentTags));
            // Notify the main extension script about the update
            window.postMessage({ type: 'customTagsStyler_update', tags: currentTags }, '*');
            alert('Настройки сохранены!');
        } catch (e) {
            console.error('Failed to save settings:', e);
            alert('Ошибка при сохранении настроек.');
        }
    }

    function resetSettings() {
        if (confirm('Вы уверены, что хотите сбросить настройки к стандартным?')) {
            currentTags = { ...defaultTags };
            renderTagList();
            saveSettings(); // Save and notify
        }
    }

    function renderTagList() {
        const container = document.getElementById('tag-list');
        container.innerHTML = '';

        for (const [tagName, style] of Object.entries(currentTags)) {
            const tagDiv = document.createElement('div');
            tagDiv.className = 'tag-setting-item';
            tagDiv.innerHTML = `
                <label>Тег: <input type="text" class="tag-name" value="${tagName}" data-original="${tagName}"></label>
                <label>Фон: <input type="color" class="tag-bg" value="${style.bg}"></label>
                <label>Рамка: <input type="color" class="tag-border" value="${style.border}"></label>
                <button class="remove-tag-btn" data-tag="${tagName}">Удалить</button>
                <hr>
            `;
            container.appendChild(tagDiv);
        }

        // Add event listeners to new elements
        document.querySelectorAll('.remove-tag-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const tagToRemove = this.getAttribute('data-tag');
                delete currentTags[tagToRemove];
                renderTagList(); // Re-render
            });
        });
    }

    function addNewTag() {
        const newTagName = prompt('Введите имя нового тега (без <>):');
        if (newTagName && newTagName.trim() !== '' && !currentTags[newTagName]) {
            currentTags[newTagName] = { bg: '#ffffff', border: '#000000' };
            renderTagList();
        } else if (currentTags[newTagName]) {
             alert('Тег с таким именем уже существует.');
        }
    }

    // --- Event Listeners ---
    document.addEventListener('DOMContentLoaded', () => {
        loadSettings();

        document.getElementById('save-settings-btn')?.addEventListener('click', saveSettings);
        document.getElementById('reset-settings-btn')?.addEventListener('click', resetSettings);
        document.getElementById('add-tag-btn')?.addEventListener('click', addNewTag);
    });

    // --- Collect settings from UI before saving ---
    document.getElementById('save-settings-btn')?.addEventListener('click', function (e) {
         e.preventDefault(); // Prevent default form submission if it's inside a form
         const newTags = {};
         document.querySelectorAll('.tag-setting-item').forEach(item => {
             const nameInput = item.querySelector('.tag-name');
             const originalName = nameInput.getAttribute('data-original');
             const newName = nameInput.value.trim();
             const bgColor = item.querySelector('.tag-bg').value;
             const borderColor = item.querySelector('.tag-border').value;

             if (newName) {
                 // Handle renaming: remove old key if name changed
                 if (originalName !== newName) {
                     delete currentTags[originalName];
                 }
                 newTags[newName] = { bg: bgColor, border: borderColor };
             }
             // If name is empty, we effectively delete it by not adding it back
         });
         currentTags = newTags;
         saveSettings();
    });

})();
