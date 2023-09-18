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

export const cleared = (data) => {
  return JSON.parse(JSON.stringify(data));
};

export const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const areObjectsEqual = (obj1, obj2) => {
  // Are objects equal, with rule when '123' === 123
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    if (!areObjectsEqual(obj1[key], obj2[key])) {
      if (Number(obj1[key]) !== Number(obj2[key])) {
        return false;
      }
    }
  }

  return true;
};
