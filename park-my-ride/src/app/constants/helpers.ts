export const sentenceCase = (str: string) => {
  const s = str.trim();

  if (!s) return "";

  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};
