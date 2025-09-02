// index.js
export default {
  async load() {
    console.log("Custom Tags Styler загружен");
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
    element.innerHTML = element.innerHTML
      .replace(/<special>(.*?)<\/special>/g, '<div class="custom-tag special">$1</div>');
  }
};
