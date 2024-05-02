export function toTitleCase(title: string | undefined) {
  if (!title) return title;

  return title?.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

export function middleTruncation(text: string | undefined, startSize: number, endSize: number) {
  if (!text) return "-";
  const startText = text.substring(0, startSize);
  const endText = text.substring(text.length - endSize, text.length);
  return `${startText}...${endText}`;
}

/**
 * This function is used to clean the text by removing extra spaces and new lines.
 *
 * Example:
 *
 * - cleanAlphanumericString("   text  ") => "text"
 * - cleanAlphanumericString("text") => "text"
 * - cleanAlphanumericString("   text    text    text   ") => "text text text"
 * - cleanAlphanumericString("   text    text    text") => "text text text"
 * - cleanAlphanumericString(" ") => ""
 * - cleanAlphanumericString("text ") => "text" 
 *
 * @param text
 * @returns string
 */
export function cleanAlphanumeric(text: string): string {
  if (text === " ") return "";
  return text.replace(/\s+/g, " ");
}
