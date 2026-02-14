function chunkText(text, options = {}) {
  if (typeof text !== "string") {
    throw new Error("chunkText expects a string");
  }

  const chunkSize = Math.min(Number(options.chunkSize) || 800, 2000);
  const overlap = Math.min(Number(options.overlap) || 100, 400);

  if (overlap >= chunkSize) {
    throw new Error("overlap must be smaller than chunkSize");
  }

  const chunks = [];
  let start = 0;
  let safetyCounter = 0;

  const MAX_CHUNKS = 10000;

  while (start < text.length) {
    if (safetyCounter++ > MAX_CHUNKS) {
      throw new Error("Too many chunks generated — aborting");
    }

    const end = Math.min(start + chunkSize, text.length);
    const slice = text.slice(start, end).trim();

    if (slice.length > 0) {
      chunks.push({
        text: slice,
        start,
        end,
      });
    }

    const nextStart = end - overlap;

    if (nextStart <= start) {
      break; // 🔒 FORCE EXIT
    }

    start = nextStart;
  }

  return chunks;
}

module.exports = chunkText ;
