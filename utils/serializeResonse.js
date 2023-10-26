export const serializeCoinApi = (blockchains, providers) => {
  if (!blockchains || !providers) return [];
  return blockchains.map((chain) => {
    const { eucId, name } = chain;

    const blockchainProviders = providers.filter(
      (provider) => provider.blockchain === eucId,
    );

    const nodeProviders = blockchainProviders.flatMap((provider) =>
      provider.nodeProviders.map((nestedProvider) => nestedProvider.name),
    );

    const apiProviders = blockchainProviders.flatMap((provider) =>
      provider.apiProviders.map((nestedProvider) => nestedProvider.name),
    );

    return {
      eucId,
      name,
      nodeProviders,
      apiProviders,
    };
  });
};

export const serializeConfigs = (allConfigs) => {
  return allConfigs.map((config) => {
    /**
     * Deleting top level apiVersion field from configFile.
     */
    const fileObject = JSON.parse(config.configFile);
    if (fileObject.apiVersion) delete fileObject.apiVersion;
    const newConfigFile = JSON.stringify(fileObject);
    config.configFile = newConfigFile;

    /**
     * Adding configChain field with information about closest blockchain parent.
     */
    const parentConfigChain = getClosestChain(config, allConfigs);
    if (!parentConfigChain) {
      return { ...config, configChain: null };
    }

    const shortChainName = parentConfigChain.configName.replace(
      /^blockchain_/,
      "",
    );
    const closestChainObject = {
      ...parentConfigChain,
      shortChainName,
    };

    return { ...config, configChain: closestChainObject };
  });
};

const getClosestChain = (config, allConfigs, depth = 0) => {
  if (depth > 100) {
    return "Infinite circle error";
  }

  if (config.configType === "BLOCKCHAIN") {
    return config;
  }

  const fullConfigObject = allConfigs.find(
    (item) => item.configId === config.configId,
  );

  if (fullConfigObject.parentConfig) {
    return getClosestChain(
      fullConfigObject.parentConfig,
      allConfigs,
      depth + 1,
    );
  }
};
