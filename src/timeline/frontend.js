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

async function getTimeline(page = 1, limit = 32) {
  console.log("Fetching page:", page);
  return await get(`/timeline?page=${page}&limit=${limit}`);
}

document.addEventListener("alpine:init", () => {
  Alpine.store("atelier", {
    timeline: [],
    settings: {},
    newEntries: 0,
    fetchingMoreEntries: false,
    getNewEntriesAmount() {
      return this.newEntries;
    },
    async loadNewEntries() {
      const fresh = await getTimeline();
      this.timeline.entries = [
        fresh.entries.slice(this.newEntries),
        ...this.timelien.entries,
      ];
      this.newEntries = 0;
    },
    async init() {
      this.timeline = await getTimeline();
      this.settings = await get("/settings");

      if (this.settings.verbose) {
        console.info("Store was initiated:", this);
      }

      setInterval(async () => {
        try {
          const data = await getTimeline();

          if (data.total > this.timeline.total) {
            this.newEntries = data.total - this.timeline.total;
            window.scrollTo(0, 0);
          }
        } catch (error) {
          console.error("Failed to update timeline:", error);
        }
      }, 3000);

      window.addEventListener(
        "scroll",
        async () => {
          if (this.fetchingMoreEntries) {
            return;
          }

          if (
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 300
          ) {
            if (this.timeline.page < this.timeline.totalPages) {
              console.log("you're at the bottom of the page");

              this.fetchingMoreEntries = true;

              const data = await getTimeline(this.timeline.page + 1);

              this.timeline = {
                ...data,
                entries: [...this.timeline.entries, ...data.entries],
              };

              this.fetchingMoreEntries = false;
            }
          }
        },
        { passive: true }
      );
    },
  });
});
