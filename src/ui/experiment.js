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
        // The template is expected to use {timestamp} instead of {item.timestamp} given the data structure
        return template.replaceAll(/\{(.*?)\}/g, (_, key) => {
          console.log(`Key before processing: ${key}`);
          // Remove 'item.' prefix if exists because we use direct key names like 'timestamp'
          const strippedKey = key.replace(`${itemName}.`, "").trim();
          console.log(`Stripped key: ${strippedKey}`, item[strippedKey]);
          console.log(`Replacing ${key} with `, item[strippedKey]);
          return item[strippedKey] || "";
        });
      })
      .join("");
  }

  async function processElements() {
    // Handle @fetch directive
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

    // Handle @show directives
    const showElements = document.querySelectorAll("[\\@show]");
    console.log(
      `Found ${showElements.length} elements with @for directive inside fetched element.`
    );
    showElements.forEach((element) => {
      const show = element.getAttribute("@show");
      if (show === "" || eval(show) === false) {
        element.remove();
        console.log("Removed:", element);
      }
    });

    // Handle @submit directive
    const submitDirectives = document.querySelectorAll("[\\@submit]");
    submitDirectives.forEach((button) => {
      const form = button.closest("form"); // Find the parent form
      if (form) {
        form.addEventListener("submit", async (event) => {
          event.preventDefault(); // Prevent the form from submitting
          const method = event.target.method || "get";
          const action = event.target.action;

          const res = await fetch(action, {
            method,
            headers: {
              "Content-Type": "application/json", // Specify the content type
            },
          });
          await res.json();
          const then = button.getAttribute("@then");
          eval(then.replace(`this`, `button`));
        });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", processElements);
})();
