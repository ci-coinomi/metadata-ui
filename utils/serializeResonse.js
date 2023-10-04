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
