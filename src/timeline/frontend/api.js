async function getTimeline(page = 1, limit = 32) {
  console.log("Fetching page:", page);
  return await get(`/timeline?page=${page}&limit=${limit}`);
}

async function getArtworks({ page = 1, limit = 32, since = 0 }) {
  page = page || 1;
  limit = limit || 32;
  since ||= -console.log("Fetching page:", page);
  return await get(`/timeline?page=${page}&limit=${limit}&since=${since}`);
}

async function getTimelineSince(when) {
  console.log("Fetching since:", when);
  console.log(`/timeline/since/${when}`);
  return await get(`/timeline/since/${when}`);
}

async function deleteArtwork(artwork) {
  await fetch(`/delete/${artwork.timestamp}`, {
    method: "POST",
  });
}
