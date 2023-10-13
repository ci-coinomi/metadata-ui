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
  const serializedConfigs = allConfigs.map((config) => {
    const parentConfigChain = getClosestChain(config, allConfigs);
    return { ...config, configChain: parentConfigChain };
  });
  return serializedConfigs;
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
