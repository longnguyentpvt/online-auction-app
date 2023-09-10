import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";

import FixedHeader from "components/fixed-header";
import Pagination from "components/pagination";
import MarketItemRowCard from "components/market-item-row-card";
import NewBidModal from "components/modals/new-bid-modal";
import AddItemModal from "components/modals/add-item-modal";
import PublishItemModal from "components/modals/publish-confirm-modal";

import useLocale from "hooks/useLocale";
import useUserAccount from "hooks/useUserAccount";

import { getItems } from "services/market";

import { ItemStatus, MarketItemDto } from "types/services";
import { RoutePath } from "data";

type MarketPageParam = {
  itemStatus: ItemStatus
};

const noRecords = 12;

function MarketPage(): ReactElement {
  const { itemStatus } = useParams<MarketPageParam>();

  const [page, setPage] = useState(0);
  const [noPages, setNoPages] = useState(1);
  const [currentTime, setCurrentTime] = useState(moment().valueOf());
  const [marketItems, setMarketItems] = useState<MarketItemDto[]>([]);

  const [selectedBidItem, setSelectedBidItem] = useState(0);

  const [
    addItemModalOpen,
    setAddItemModalOpen
  ] = useState(false);

  const [selectedPublishItem, setSelectedPublishItem] = useState(0);

  const [translations] = useLocale();
  const [, syncInfo] = useUserAccount();
  const navigate = useNavigate();

  const _isMounted = useRef<boolean>(false);

  const previosCallTimeRef = useRef<number>(0);

  const onPageChange = (newPageNo): void => {
    setPage(newPageNo);
  };

  const onNewBidClick = (itemId: number): void => {
    setSelectedBidItem(itemId);
  };
  const closeBidModal = (): void => {
    setSelectedBidItem(0);
  }
  const onNewBidSuccess = (): void => {
    setCurrentTime(moment().valueOf());
    syncInfo();
    closeBidModal();
  }

  const onPublishClick = (itemId: number): void => {
    setSelectedPublishItem(itemId);
  };
  const closePublishModal = (): void => {
    setSelectedPublishItem(0);
  }
  const onPublishSuccess = (): void => {
    setCurrentTime(moment().valueOf());
    closePublishModal();
  }

  const toggleAddItemModalOpen = () => {
    setAddItemModalOpen(prevState => !prevState);
  };
  const onNewItemSuccess = () => {
    toggleAddItemModalOpen();

    if (itemStatus !== "mine") {
      navigate(RoutePath.MarketMyItemsPage);
    } else {
      setCurrentTime(moment().valueOf());
    }
  }

  useEffect(() => {
    setPage(1);
    setCurrentTime(moment().valueOf());
  }, [itemStatus]);

  useEffect(() => {
    setMarketItems([]);

    if (page < 1) {
      setNoPages(1);
      return;
    }

    previosCallTimeRef.current = currentTime;
    getItems(itemStatus, page, noRecords)
      .then((result) => {
        const {
          data
        } = result;

        if (!!data) {
          const {
            noPages: newNoPages,
            data: newItems
          } = data;

          if (page > newNoPages) {
            setPage(!!newNoPages ? newNoPages : 1);
          } else {
            setMarketItems(newItems);
          }
          setNoPages(newNoPages);
        }
      });
  }, [page, currentTime]);

  const currentTimeOutFlag = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    _isMounted.current = true;

    const checkInterval = () => {
      const nowMm = moment();
      if (nowMm.diff(moment(previosCallTimeRef.current), "seconds") >= 60) {
        setCurrentTime(nowMm.valueOf());
      }

      setNextCheck();
    };

    const setNextCheck = () => {
      if (currentTimeOutFlag.current) {
        clearTimeout(currentTimeOutFlag.current);
      }

      currentTimeOutFlag.current = setTimeout(() => {
        checkInterval();
      }, 5000);
    };

    setNextCheck();
    return () => {
      _isMounted.current = false;
      clearTimeout(currentTimeOutFlag.current);
    }
  }, []);

  const newBidModalOpen = selectedBidItem > 0;
  const publishModalOpen = selectedPublishItem > 0;

  return (
    <>
      <FixedHeader/>

      <div className="main-body has-fixed-header">
        <Container>
          <div className="pt-4 pb-4">
            {
              itemStatus === "mine" && (
                <div className="pb-3">
                  <Button color="primary" onClick={ toggleAddItemModalOpen }>
                    { translations("page.market.btn.additem") }
                  </Button>
                </div>
              )
            }

            <Row className="g-4">
              {
                marketItems.map((marketItem: MarketItemDto): ReactElement => {
                  const {
                    id
                  } = marketItem;

                  return (
                    <Col key={ id } xs={ 12 }>
                      <MarketItemRowCard
                        item={ marketItem }
                        onNewBidClick={ onNewBidClick }
                        onPublishClick={ onPublishClick }/>
                    </Col>
                  )
                })
              }
            </Row>

            <div className="pt-4">
              <Pagination
                onChangePage={ onPageChange }
                currentPage={ page }
                totalPage={ noPages }
                numberLimit={ 3 }
                lastIsActive={ true }
                firstIsActive={ true }/>
            </div>
          </div>
        </Container>
      </div>

      <NewBidModal
        itemId={ selectedBidItem }
        isOpen={ newBidModalOpen }
        onSuccess={ onNewBidSuccess }
        cancel={ closeBidModal }/>

      <PublishItemModal
        itemId={ selectedPublishItem }
        isOpen={ publishModalOpen }
        cancel={ closePublishModal }
        onSuccess={ onPublishSuccess }/>

      <AddItemModal
        onSuccess={ onNewItemSuccess }
        isOpen={ addItemModalOpen }
        cancel={ toggleAddItemModalOpen }/>
    </>
  )
}

export default MarketPage;
