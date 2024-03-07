async function get(endpoint) {
  return await (await fetch(endpoint)).json();
}

function formatDate(timestamp) {
  console.log(timestamp);
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

function timeAgo(timestamp) {
  const intervals = [
    { seconds: 31536000, text: "year" },
    { seconds: 2592000, text: "month" },
    { seconds: 604800, text: "week" },
    { seconds: 86400, text: "day" },
    { seconds: 3600, text: "hour" },
    { seconds: 60, text: "minute" },
  ];

  const now = new Date();
  const elapsed = Math.floor((now - new Date(timestamp)) / 1000);

  if (elapsed < 60) {
    return "New";
  }

  for (let { seconds, text } of intervals) {
    const interval = Math.floor(elapsed / seconds);
    if (interval >= 1) {
      return `${interval} ${text}${interval > 1 ? "s" : ""} ago`;
    }
  }
}

async function copyImageToClipboard(imgId) {
  const img = document.getElementById(imgId);

  // Create an off-screen canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions to match the image
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0);

  // Convert the canvas to a Blob
  canvas.toBlob(async (blob) => {
    try {
      // Create a new ClipboardItem object
      const item = new ClipboardItem({ "image/png": blob });
      // Copy the ClipboardItem to the clipboard
      await navigator.clipboard.write([item]);
    } catch (err) {
      console.error("Failed to copy image: ", err);
    }
  }, "image/png");
}

document.addEventListener("alpine:init", () => {
  Alpine.store("atelier", {
    timeline: [],
    settings: {},
    status: {
      timeline: "INITING",
      settings: "INITING",
    },
    async getTimeline(page = 1, limit = 32) {
      console.log("Fetching page:", page);
      this.status.timeline = "READY";
      const timeline = await get(`/timeline?page=${page}&limit=${limit}`);
      this.status.timeline = "LOADING";
      return timeline;
    },
    async init() {
      this.timeline = await getTimeline();
      this.settings = await get("/settings");

      if (this.settings.verbose) {
        console.info("Store was initiated:", this);
      }

      // TODO: Consider showing a button to refresh the page instead
      // setInterval(async () => {
      //   try {
      //     const data = await get("/timeline");

      //     if (this.timeline.entries.length < data.entries.length) {
      //       this.timeline = data;

      //       if (this.settings.verbose) {
      //         console.info("Timeline was updated", this.timeline);
      //       }
      //     }
      //   } catch (error) {
      //     console.error("Failed to update timeline:", error);
      //   }
      // }, 3000);

      window.addEventListener(
        "scroll",
        async () => {
          if (
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 300
          ) {
            if (this.timeline.page < this.timeline.totalPages) {
              console.log("you're at the bottom of the page");
              const data = await getTimeline(this.timeline.page + 1);

              this.timeline = {
                ...data,
                entries: [...this.timeline.entries, ...data.entries],
              };
            }
          }
        },
        { passive: true }
      );
    },
  });
});
