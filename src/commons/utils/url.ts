
export const route = (url, arg) => {
  let path = url;
  if (arg && typeof arg === "object" && !!Object.keys(arg).length) {
    Object.entries(arg).forEach(
      ([param, value]) => (path = url.replace(`:${param}`, value))
    );
  }

  return path;
};
