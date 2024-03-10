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

async function getTimelineSince(when) {
  console.log("Fetching since:", when);
  return await get(`/timeline/since/${when}`);
}

document.addEventListener("alpine:init", () => {
  Alpine.store("atelier", {
    timeline: {
      entries: [],
    },
    settings: {},
    newEntries: 0,
    showNewEntriesPill: false,
    fetchingMoreEntries: false,
    async init() {
      this.timeline = await getTimeline();
      this.settings = await get("/settings");

      if (this.settings.verbose) {
        console.info("Store was initiated:", this);
      }

      setInterval(async () => {
        await this.loadNewEntries();
      }, 3000);

      window.addEventListener(
        "scroll",
        async () => {
          await this.infiniteScroll();
        },
        { passive: true }
      );
    },
    async loadNewEntries() {
      console.log("loading new entries");
      const fresh = await getTimelineSince(this.timeline.entries[0].timestamp);

      if (fresh.entries.length > 0) {
        this.newEntries += fresh.entries.length;

        const entries = [...fresh.entries, ...this.timeline.entries];

        this.timeline = {
          ...this.timeline,
          entries: entries,
          total: entries.length,
          // totalPages: Math.ceil(entries.length / limit),
        };

        // Show only if not viewing the top of the page
        // this.showNewEntriesPill =
        //   window.scrollY >
        //   document.getElementById("atelier-card-1").clientHeight;
        this.showNewEntriesPill = true;
      }
    },
    async infiniteScroll() {
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
    async delete(entry) {
      await fetch(`/delete/${entry.timestamp}`, {
        method: "POST",
      });
    },
  });
});
