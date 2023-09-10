import { MarketItemDto } from "../services";

export type PaginationProps = {
  totalPage: number,
  currentPage: number,
  numberLimit?: number,
  lastIsActive?: boolean,
  firstIsActive?: boolean,
  onChangePage: (page) => void
}

export type MarketItemRowCardProps = {
  item: MarketItemDto,
  onNewBidClick?: (itemId: number) => void,
  onPublishClick?: (itemId: number) => void
}
