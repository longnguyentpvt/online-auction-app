import moment from "moment-timezone";

import { newItemBidApi, newMarketItemApi, publishMarketItemApi, retrieveListItemsApi } from "apis";
import { getInfo } from "model/user-account";

import { ApiErrorCode, ApiResponse, ItemBidResponse, ItemsListingResponse, MarketItemApiResponse } from "types/apis";
import {
  BidError,
  BidStatus,
  DataWithPaging,
  DefaultError,
  ItemBidDto,
  ItemStatus,
  MarketItemDto,
  NewItemError,
  PublishItemError,
  ResultWithError
} from "types/services";

export const getItems = async (
  itemStatus: ItemStatus,
  page: number,
  noRecords: number
): Promise<ResultWithError<DataWithPaging<MarketItemDto>, DefaultError>> => {
  let owner: "me" | null = null;
  let filterStatus: "ongoing" | "end" | null = null;
  if ("mine" === itemStatus) {
    owner = "me";
  } else {
    filterStatus = itemStatus;
  }

  const {
    data,
    errorCode
  }: ApiResponse<ItemsListingResponse> = await retrieveListItemsApi(owner, page, noRecords, filterStatus);

  if (!errorCode) {
    const {
      items,
      count
    } = data;

    const {
      id: userId
    } = getInfo();

    const dtos = items.map((item: MarketItemApiResponse): MarketItemDto => {
      const {
        id,
        ownerId,
        name,
        startPrice,
        currentBidPrice,
        released,
        createdDateTime,
        publishedDateTime,
        endDateTime
      } = item;

      return {
        id,
        ownerId,
        name,
        startPrice,
        currentBidPrice,
        released,
        mine: ownerId === userId,
        createdDateTime: createdDateTime ? moment(createdDateTime) : null,
        publishedDateTime: publishedDateTime ? moment(publishedDateTime) : null,
        endDateTime: endDateTime ? moment(endDateTime) : null
      };
    });
    const noPages = Math.ceil(count / noRecords);

    return {
      data: {
        data: dtos,
        noPages
      }
    };
  } else {
    return { errors: [DefaultError.Unknown] }
  }
}

export const itemBid = async (
  itemId: number,
  price: number
): Promise<ResultWithError<ItemBidDto, BidError>> => {
  if (isNaN(price)) return { errors: [BidError.InvalidPrice] };

  const {
    data,
    errorCode
  }: ApiResponse<ItemBidResponse> = await newItemBidApi(itemId, price * 100);

  if (!!errorCode) {
    switch (errorCode) {
      case ApiErrorCode.OVER_LIMIT:
        return { errors: [BidError.ExceedTime] };
      case ApiErrorCode.INSUFFICIENT_BALANCE:
        return { errors: [BidError.InsufficientBalance] };
      case ApiErrorCode.INVALID_DATA:
        return { errors: [BidError.InvalidPrice] };
      default:
        return { errors: [BidError.InvalidItem] };
    }
  } else {
    const {
      id,
      bidderId,
      itemId,
      price,
      status,
      createdDateTime
    } = data;

    if (status === BidStatus.Failed)
      return { errors: [BidError.ExceedTime] };

    return {
      data: {
        id,
        bidderId,
        itemId,
        price,
        status,
        createdDateTime: moment(createdDateTime)
      }
    }
  }
}

export const addItem = async (name: string): Promise<ResultWithError<MarketItemDto, NewItemError>> => {
  if (!name) return { errors: [NewItemError.InvalidName] };

  const {
    data,
    errorCode
  }: ApiResponse<MarketItemApiResponse> = await newMarketItemApi(name);

  if (!!errorCode) {
    switch (errorCode) {
      case ApiErrorCode.INVALID_DATA:
        return { errors: [NewItemError.InvalidName] };
      default:
        return { errors: [NewItemError.Unknown] };
    }
  } else {
    const {
      id: userId
    } = getInfo();

    const {
      id,
      ownerId,
      name,
      startPrice,
      currentBidPrice,
      released,
      createdDateTime,
      publishedDateTime,
      endDateTime
    } = data;

    return {
      data : {
        id,
        ownerId,
        name,
        startPrice,
        currentBidPrice,
        released,
        mine: ownerId === userId,
        createdDateTime: createdDateTime ? moment(createdDateTime) : null,
        publishedDateTime: publishedDateTime ? moment(publishedDateTime) : null,
        endDateTime: endDateTime ? moment(endDateTime) : null
      }
    };
  }
}

export const publishItem = async (
  itemId: number,
  startPrice: number,
  duration: number
): Promise<ResultWithError<MarketItemDto, PublishItemError>> => {
  if (isNaN(startPrice)) return { errors: [PublishItemError.InvalidPrice] };
  if (isNaN(duration) || duration < 1) return { errors: [PublishItemError.InvalidDuration] };

  const {
    data,
    errorCode
  }: ApiResponse<MarketItemDto> = await publishMarketItemApi(itemId, startPrice * 100, duration);

  if (!!errorCode) {
    switch (errorCode) {
      case ApiErrorCode.INVALID_DATA:
        return { errors: [PublishItemError.InvalidDuration, PublishItemError.InvalidPrice] };
      default:
        return { errors: [PublishItemError.Unknown] };
    }
  } else {
    const {
      id: userId
    } = getInfo();

    const {
      id,
      ownerId,
      name,
      startPrice,
      currentBidPrice,
      released,
      createdDateTime,
      publishedDateTime,
      endDateTime
    } = data;

    return {
      data : {
        id,
        ownerId,
        name,
        startPrice,
        currentBidPrice,
        released,
        mine: ownerId === userId,
        createdDateTime: createdDateTime ? moment(createdDateTime) : null,
        publishedDateTime: publishedDateTime ? moment(publishedDateTime) : null,
        endDateTime: endDateTime ? moment(endDateTime) : null
      }
    };
  }
}
