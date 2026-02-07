export const removeSuffix = (str: string, suffix: string): string => {
  return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str;
};
