let tagList = JSON.parse(localStorage.getItem('customTagStyles') || '{}');

function renderTagInputs() {
  const container = document.getElementById('tag-settings');
  container.innerHTML = '';
  for (const [tag, style] of Object.entries(tagList)) {
    const div = document.createElement('div');
    div.innerHTML = `
      <label>Тег: <input type="text" value="${tag}" data-key="${tag}" class="tag-name"></label>
      <label>Фон: <input type="color" value="${style.bg}" data-tag="${tag}" data-prop="bg"></label>
      <label>Рамка: <input type="color" value="${style.border}" data-tag="${tag}" data-prop="border"></label>
      <button onclick="deleteTag('${tag}')">Удалить</button>
    `;
    container.appendChild(div);
  }
}

function deleteTag(tag) {
  delete tagList[tag];
  renderTagInputs();
}

document.getElementById('add-tag').addEventListener('click', () => {
  const newTag = prompt("Введите имя нового тега:");
  if (newTag && !tagList[newTag]) {
    tagList[newTag] = { bg: '#ffffff', border: '#cccccc' };
    renderTagInputs();
  }
});

document.getElementById('save-settings').addEventListener('click', () => {
  // Сохраняем переименованные теги
  const newTagList = {};
  document.querySelectorAll('.tag-name').forEach(input => {
    const oldKey = input.dataset.key;
    const newKey = input.value.trim();
    if (newKey && newKey !== oldKey) {
      newTagList[newKey] = tagList[oldKey];
      delete tagList[oldKey];
    } else if (newKey) {
      newTagList[newKey] = tagList[oldKey];
    }
  });

  // Сохраняем цвета
  document.querySelectorAll('input[data-prop]').forEach(input => {
    const tag = input.dataset.tag;
    const prop = input.dataset.prop;
    const value = input.value;
    if (newTagList[tag]) {
      newTagList[tag][prop] = value;
    }
  });

  tagList = newTagList;
  localStorage.setItem('customTagStyles', JSON.stringify(tagList));
  window.postMessage({ type: 'reloadCustomTags' }, '*');
  alert("Стили сохранены!");
});

document.getElementById('reset-settings').addEventListener('click', () => {
  if (confirm("Сбросить все настройки?")) {
    tagList = {};
    localStorage.removeItem('customTagStyles');
    renderTagInputs();
    window.postMessage({ type: 'reloadCustomTags' }, '*');
  }
});

document.getElementById('apply-preset').addEventListener('click', () => {
  const preset = document.getElementById('preset-select').value;
  if (presets[preset]) {
    tagList = { ...presets[preset] };
    renderTagInputs();
  }
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'reloadCustomTags') {
    location.reload();
  }
});

renderTagInputs();
