export const isString = (val) => {
  return ["string"].includes(val);
};

export const isNumber = (val) => {
  return ["integer", "number"].includes(val);
};

export const isBoolean = (val) => {
  return ["boolean"].includes(val);
};

export const isDate = (val) => {
  return ["date", "date-time"].includes(val);
};

export const toPascalCase = (input) => {
  return input
    .replace(/[_\-\s]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

export const toPascalWithSpace = (input) => {
  return input
    .replace(/[_\-\s]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const toKebabCase = (input) => {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
};
