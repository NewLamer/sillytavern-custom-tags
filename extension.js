// extension.js
export default {
  // Вызывается при загрузке расширения
  async load() {
    console.log("Custom Tags Styler загружен");
  },

  // Опционально: добавить вкладку в настройки
  getSettings() {
    return {
      name: "Custom Tags",
      menuName: "Custom Tags Styler",
      color: "gold",
      html: "settings.html"
    };
  },

  // Опционально: обработка сообщений
  onMessageRendered(data) {
    const { element } = data;
    element.innerHTML = element.innerHTML
      .replace(/<special>(.*?)<\/special>/g, '<div class="custom-tag special">$1</div>');
  }
};
