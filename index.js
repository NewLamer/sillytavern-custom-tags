let customStyles = {};

// Загрузка стилей из localStorage
function loadStyles() {
  const saved = localStorage.getItem('customTagStyles');
  if (saved) {
    customStyles = JSON.parse(saved);
  }
}

// Применение стилей к странице
function applyStyles() {
  let css = '';
  for (const [tag, style] of Object.entries(customStyles)) {
    css += `.custom-tag.${tag} { background: ${style.bg}; border-left: 4px solid ${style.border}; }\n`;
  }

  let styleTag = document.getElementById('custom-tags-runtime-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'custom-tags-runtime-style';
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = css;
}

// Замена тегов
function transformTags(html) {
  const tags = Object.keys(customStyles);
  let result = html;
  for (const tag of tags) {
    const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'g');
    result = result.replace(regex, `<div class="custom-tag ${tag}">$1</div>`);
  }
  return result;
}

export default {
  async load() {
    console.log("Custom Tags Styler загружен");
    loadStyles();
    applyStyles();
  },

  getSettings() {
    return {
      name: "Custom Tags",
      menuName: "Custom Tags Styler",
      color: "gold",
      html: "settings.html"
    };
  },

  onMessageRendered(data) {
    const { element } = data;
    element.innerHTML = transformTags(element.innerHTML);
  }
};
