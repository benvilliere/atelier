async function getTimeline(page = 1, limit = 32) {
  console.log("Fetching page:", page);
  return await get(`/timeline?page=${page}&limit=${limit}`);
}

async function getTimelineSince(when) {
  console.log("Fetching since:", when);
  return await get(`/timeline/since/${when}`);
}

async function deleteArtwork(artwork) {
  await fetch(`/delete/${artwork.timestamp}`, {
    method: "POST",
  });
}
