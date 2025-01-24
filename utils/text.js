export function shortenText(text, maxLength = 60) {
  // Ensure the maxLength is at least 1
  if (maxLength < 1) return "";

  // If the text is already shorter than the maxLength, return it as is
  if (text.length <= maxLength) return text;

  // Find the last space within the maxLength boundary
  let trimmedText = text.substr(0, maxLength);
  let lastSpaceIndex = trimmedText.lastIndexOf(" ");

  // If there is a space, trim at the last space to avoid cutting words
  if (lastSpaceIndex > 0) {
    trimmedText = trimmedText.substr(0, lastSpaceIndex);
  }

  // Add an ellipsis or any other desired indication that text was shortened
  return trimmedText + "...";
}
