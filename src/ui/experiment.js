(function () {
  async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
  }

  function renderTemplate(template, data, itemName) {
    return data
      .map((item) => {
        // Replace placeholders with actual data properties, referencing by itemName.
        return template.replace(/\{(.*?)\}/g, (_, key) => item[key.trim()]);
      })
      .join("");
  }

  async function processElements() {
    const fetchElements = document.querySelectorAll("[\\@fetch]");

    for (const element of fetchElements) {
      const url = element.getAttribute("@fetch");
      const data = await fetchData(url);

      // Find all children (or descendants) of the element that have an @for attribute
      const forElements = element.querySelectorAll("[\\@for]");
      for (const forElement of forElements) {
        const forDirective = forElement.getAttribute("@for");
        if (forDirective) {
          const [itemName, itemsKey] = forDirective.split(" in ");
          const items = data[itemsKey] || data; // Allow for direct array data or object property.
          const template = forElement.innerHTML.trim();

          forElement.innerHTML = renderTemplate(template, items, itemName);
        }
      }
    }
  }

  document.addEventListener("DOMContentLoaded", processElements);
})();
