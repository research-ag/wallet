export function toTitleCase(title: string | undefined) {
  if (!title) return title;

  return title?.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

export function middleTruncation(text: string | undefined, startSize: number, endSize: number) {
  if (!text) return "-";
  if (startSize + endSize >= text.length) return text;
  const startText = text.substring(0, startSize);
  const endText = text.substring(text.length - endSize, text.length);
  return `${startText}...${endText}`;
}

export const getFirstNFrom = (address: string, digits: number) => {
  return `${address.slice(0, digits).toUpperCase()}`;
};

export const getFirstNChars = (str: string, digits: number) => {
  if (str?.length > digits) return `${str.slice(0, digits)}...`;
  else return str;
};

export const getInitialFromName = (name: string, length: number) => {
  if (name.length === 0) {
    return "";
  } else {
    const names = name.split(" ");
    let initials = "";
    names.map((nm) => {
      if (nm.trim().length > 0) initials = initials + nm.trim()[0];
    });
    return initials.toUpperCase().slice(0, length);
  }
};

export const removeLeadingZeros = (text: string): string => text.replace(/^0+/, "");

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
  return text.replace(/\s+/g, " ").trim();
}

export function removeExtraSpaces(text: string): string {
  return text.replace(/\s+/g, " ");
}
