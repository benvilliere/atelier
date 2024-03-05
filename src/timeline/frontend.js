function formatDate(timestamp) {
  console.log(timestamp);
  const date = new Date(timestamp);
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
  const then = new Date(timestamp);
  const elapsed = now * 1000 - then * 1000;
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
