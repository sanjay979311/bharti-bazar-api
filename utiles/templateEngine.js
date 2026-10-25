export const tpl = (str = "", data = {}) => {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? "");
};