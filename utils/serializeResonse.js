export const serializeCoinApi = (blockchains, providers) => {
  const serializedArray = [];
  blockchains.map((chain) => {
    const serializedItem = {
      eucId: chain.eucId,
      name: chain.name,
      providersList: [],
    };

    providers.map((provider) => {
      console.log(provider);
      if (provider.blockchain === chain.eucId && provider.nodeProviders) {
        const value = [...provider.nodeProviders];
        serializedItem.providersList.push(value);
      }
      if (provider.blockchain === chain.eucId && provider.apiProviders) {
        serializedItem.providersList.push(...provider.apiProviders);
      }
    });

    serializedArray.push(serializedItem);
  });

  console.log("blockchains", blockchains);
  console.log("providers", providers);
  return serializedArray;
};
