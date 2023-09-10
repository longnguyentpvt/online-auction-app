const PlatformPrefix = "/app";

const UserLoginPath = `${ PlatformPrefix }/user/signin`;

const MarketAppPrefix = `${ PlatformPrefix }/market`;

const MarketItemsPathName = "/items";
const MarketItemsOngoingPage = `${ MarketAppPrefix }${ MarketItemsPathName }/ongoing`;
const MarketItemsEndPage = `${ MarketAppPrefix }${ MarketItemsPathName }/end`;
const MarketMyItemsPage = `${ MarketAppPrefix }${ MarketItemsPathName }/mine`;


export const RoutePath = {
  UserLoginPath,
  MarketAppPrefix,
  MarketItemsPathName,
  MarketItemsOngoingPage,
  MarketItemsEndPage,
  MarketMyItemsPage
}

export const configuration: {
  mainApiHost: string,
  assetPathPrefix: string
} = {
  mainApiHost: process.env.API_HOST,
  assetPathPrefix: process.env.ASSETS_PREFIX
};
