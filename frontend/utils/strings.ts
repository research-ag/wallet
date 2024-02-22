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
