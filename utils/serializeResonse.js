export const serializeCoinApi = (blockchains, providers) => {
  const serializedArray = [];
  blockchains.map((chain) => {
    const serializedItem = {
      eucId: chain.eucId,
      name: chain.name,
      nodeProviders: [],
      apiProviders: [],
    };

    providers.map((provider) => {
      if (provider.blockchain === chain.eucId && provider.nodeProviders) {
        serializedItem.nodeProviders.push(...provider.nodeProviders);
      }
      if (provider.blockchain === chain.eucId && provider.apiProviders) {
        serializedItem.apiProviders.push(...provider.apiProviders);
      }
    });

    serializedArray.push(serializedItem);
  });

  console.log("blockchains", blockchains);
  console.log("providers", providers);
  return serializedArray;
};
