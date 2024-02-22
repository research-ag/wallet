export function toTitleCase(title: string | undefined) {
  if (!title) return title;

  return title?.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

export function middleTruncation(text: string | undefined, startSize: number, endSize: number) {
  if (!text) return text;
  const startText = text.substring(0, startSize);
  const endText = text.substring(text.length - endSize, text.length);
  return `${startText}...${endText}`;
}

export function removeLeadingSpaces(text: string) {
  return text.replace(/^\s+/, "");
}

export function removeTailingSpaces(text: string) {
  return text.replace(/\s+$/, "");
}

export function removeBetweenSpaces(text: string) {
  return text.replace(/\s{2,}/g, " ");
}

export function removeTailingAndLeadingSpaces(text: string) {
  return text.replace(/^\s+|\s+$/g, "");
}

export function removeTailingAndLeadingSpacesBetween(text: string) {
  const chunks = text.split(" ");
  const cleanedChunks = chunks.filter((chunk) => chunk.trim() !== "");
  return cleanedChunks.join(" ");
}
