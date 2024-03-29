async function get(endpoint) {
  return await (await fetch(endpoint)).json();
}

function formatDate(timestamp) {
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
