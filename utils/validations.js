export const validateUniqueFields = ({
  fileData,
  fields,
  editingConfig,
  storedConfigList,
}) => {
  if (!fields.every((key) => fileData[key] !== undefined)) {
    return {
      isValid: true,
    };
  }

  const duplicates = new Set();
  const currentId = editingConfig?.configId;

  for (const cfg of storedConfigList) {
    if (cfg.configId === currentId) continue;
    if (!cfg.configFile) continue;

    let parsed;
    try {
      parsed = JSON.parse(cfg.configFile);
    } catch {
      continue;
    }

    for (const key of fields) {
      if (!duplicates.has(key) && parsed[key] === fileData[key]) {
        duplicates.add(key);
      }
    }

    if (duplicates.size === fields.length) break;
  }

  if (duplicates.size > 0) {
    const list = Array.from(duplicates).join(", ");
    const plural = duplicates.size > 1 ? "s" : "";
    return {
      isValid: false,
      errorMessage: `Field${plural} "${list}" must be unique`,
    };
  }

  return {
    isValid: true,
  };
};
