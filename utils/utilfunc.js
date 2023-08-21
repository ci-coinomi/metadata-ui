export const createEmptyConfigFileClone = (configFile) => {
  const obj = JSON.parse(configFile);

  const processValue = (value, key) => {
    if (key === "@type") {
      return value;
    } else if (typeof value === "boolean") {
      return false;
    } else if (typeof value === "number") {
      return 0;
    } else if (typeof value === "string") {
      return "";
    } else if (Array.isArray(value)) {
      return [""];
    } else if (typeof value === "object" && value !== null) {
      /* eslint-disable-next-line prefer-const */
      for (let key in value) {
        value[key] = processValue(value[key], key);
      }
      return value;
    } else {
      return value;
    }
  };

  const processedObj = processValue(obj);
  const processedJSONString = JSON.stringify(processedObj);
  return processedJSONString;
};
