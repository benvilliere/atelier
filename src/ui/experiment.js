(function () {
  async function fetchData(url) {
    console.log(`Fetching data from: ${url}`);
    const response = await fetch(url);
    const data = await response.json();
    console.log(`Data fetched: `, data);
    return data;
  }

  function renderTemplate(template, data, itemName) {
    console.log(`Rendering template for each ${itemName}`);
    console.log("renderTemplate", { template, data, itemName });
    return data
      .map((item) => {
        console.log({ item });
        // Replace placeholders with actual data properties, referencing by itemName.
        return template.replace(/\{(.*?)\}/g, (_, key) => {
          console.log(item.timestamp);
          console.log(`Replacing ${key} with `, item[key.trim()]);
          return item[key.trim()];
        });
      })
      .join("");
  }

  async function processElements() {
    const fetchElements = document.querySelectorAll("[\\@fetch]");
    console.log(
      `Found ${fetchElements.length} elements with @fetch directive.`
    );

    for (const element of fetchElements) {
      const url = element.getAttribute("@fetch");
      const data = await fetchData(url);

      // Find all children (or descendants) of the element that have an @for attribute
      const forElements = element.querySelectorAll("[\\@for]");
      console.log(
        `Found ${forElements.length} elements with @for directive inside fetched element.`
      );

      for (const forElement of forElements) {
        const forDirective = forElement.getAttribute("@for");
        if (forDirective) {
          console.log(`Processing @for directive: ${forDirective}`);
          const [itemName, itemsKey] = forDirective.split(" in ");
          const items = data[itemsKey] || data; // Allow for direct array data or object property.
          console.log(`Items for iteration: `, items);
          const template = forElement.innerHTML.trim();

          forElement.innerHTML = renderTemplate(template, items, itemName);
        }
      }
    }
  }

  document.addEventListener("DOMContentLoaded", processElements);
})();
