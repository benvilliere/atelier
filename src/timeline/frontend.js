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

  const now = Date.now() * 1000;
  const then = timestamp * 1000;
  const elapsed = now - then;
  return elapsed;
  if (elapsed < 60) {
    return "just now";
  }

  for (let { seconds, text } of intervals) {
    const interval = Math.floor(elapsed / seconds);
    if (interval >= 1) {
      return `${interval} ${text}${interval > 1 ? "s" : ""} ago`;
    }
  }
}
