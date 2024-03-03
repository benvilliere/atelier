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
    return data
      .map((item) => {
        return template.replaceAll(/\{(.*?)\}/g, (_, key) => {
          // Adjusted to handle nested properties correctly
          const propertyPath = key.trim().split(".");
          let currentValue = item;
          for (const segment of propertyPath) {
            currentValue = currentValue[segment];
            if (currentValue === undefined) break;
          }
          console.log(`Replacing ${key} with`, currentValue);
          return currentValue || `No ${key}`;
        });
      })
      .join("");
  }

  function attachEventListeners(context) {
    const forms = context.querySelectorAll("form");
    forms.forEach((form) => {
      const submitElements = form.querySelectorAll("[\\@submit]");
      submitElements.forEach((submitElement) => {
        submitElement.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent the form from submitting
          console.log("Custom submit logic executed.");
        });
      });
    });
  }

  async function processElements() {
    const fetchElements = document.querySelectorAll("[\\@fetch]");
    console.log(
      `Found ${fetchElements.length} elements with @fetch directive.`
    );

    for (const element of fetchElements) {
      const url = element.getAttribute("@fetch");
      const data = await fetchData(url);

      const forElements = element.querySelectorAll("[\\@for]");
      console.log(
        `Found ${forElements.length} elements with @for directive inside fetched element.`
      );

      for (const forElement of forElements) {
        const forDirective = forElement.getAttribute("@for");
        if (forDirective) {
          const [itemName, itemsKey] = forDirective.split(" in ");
          const items = data[itemsKey] || data;
          const template = forElement.innerHTML.trim();
          forElement.innerHTML = renderTemplate(template, items, itemName);
          attachEventListeners(forElement);
        }
      }
    }
  }

  document.addEventListener("DOMContentLoaded", processElements);
})();
