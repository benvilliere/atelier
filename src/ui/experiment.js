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
          const strippedKey = key.replace(`${itemName}.`, "").trim();
          return item[strippedKey] || "";
        });
      })
      .join("");
  }

  function attachEventListeners(context) {
    // Find all forms within the given context
    const forms = context.querySelectorAll("form");
    forms.forEach((form) => {
      // Find elements within the form that have an @submit directive
      const submitElements = form.querySelectorAll("[\\@submit]");
      submitElements.forEach((submitElement) => {
        submitElement.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent the default form submission
          // You can add your custom submit logic here
          console.log(form);
          console.log("Form submission prevented and custom logic executed.");
          // If you want to manually submit the form, you can call form.submit();
          // Or if you want to call a specific function, you could do something like:
          // const actionName = submitElement.getAttribute('@submit');
          // window[actionName] && window[actionName](e, form);
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
          // Attach event listeners after rendering the template
          attachEventListeners(forElement);
        }
      }
    }
  }

  document.addEventListener("DOMContentLoaded", processElements);
})();
