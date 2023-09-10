import React, { ReactElement, memo } from "react";
import moment from "moment-timezone";

import { MarketItemRowCardProps } from "types/components";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import { formatPrice } from "utils/pricing";

function MarketItemRowCard(props: MarketItemRowCardProps): ReactElement {
  const {
    item: marketItem,
    onNewBidClick,
    onPublishClick
  } = props;

  const {
    id,
    name,
    currentBidPrice,
    released,
    endDateTime,
    mine
  } = marketItem;

  const bidClick = (): void => {
    onNewBidClick && onNewBidClick(id);
  }
  const publishClick = (): void => {
    onPublishClick && onPublishClick(id);
  }

  let statusStr = endDateTime ? endDateTime.format("DD-MM-YYYY HH:mm") : "";
  let statusColor = "text-gray-600";
  let ableToBid = true;
  let isDraft = false;
  if (!endDateTime) {
    statusStr = "Draft";
    statusColor = "text-primary";
    isDraft = true;
  } else if (released) {
    statusColor = "text-success";
    statusStr = "Item Released";
    ableToBid = false;
  } else if (endDateTime.isSameOrBefore(moment())) {
    statusColor = "text-danger";
    statusStr = "End";
    ableToBid = false;
  }

  return (
    <Card className="border-0 shadow">
      <CardBody>
        <Row className="g-3">
          <Col xs={ 12 } xl={ 4 }>
            <div>
              <div className="fw-bold">
                Name
              </div>
              <div className="text-gray-600 mw-0 text-truncate">
                { name }
              </div>
            </div>
          </Col>
          <Col xs={ 12 } xl={ 2 }>
            <div className="fw-bold">
              Current Bid
            </div>
            <div className="text-warning">
              ${ formatPrice(currentBidPrice) }
            </div>
          </Col>
          <Col xs={ 12 } xl={ 3 }>
            <div className="fw-bold">
              End At
            </div>
            <div className={ `${ statusColor }` }>
              { statusStr }
            </div>
          </Col>
          {
            mine && !isDraft && (
              <Col xs={ 12 } xl={ 3 }>
                <div className="text-end">
                  <div className="fw-bold">
                    Actions
                  </div>
                  <div className="text-warning">
                    Your Item
                  </div>
                </div>
              </Col>
            )
          }
          {
            mine && isDraft && (
              <Col xs={ 12 } xl={ 3 }>
                <div className="text-end">
                  <Button color="success" onClick={ publishClick }>Publish</Button>
                </div>
              </Col>
            )
          }
          {
            !mine && ableToBid && (
              <Col xs={ 12 } xl={ 3 }>
                <div className="text-end">
                  <Button color="success" onClick={ bidClick }>New Bid</Button>
                </div>
              </Col>
            )
          }
        </Row>
      </CardBody>
    </Card>
  )
}

export default memo(MarketItemRowCard);
