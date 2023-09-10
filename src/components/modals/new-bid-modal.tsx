import React, { ReactElement, memo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";

import useLocale from "hooks/useLocale";

import { itemBid } from "services/market";

import { BidError } from "types/services";

function NewBidModal(props: {
  itemId: number,
  isOpen: boolean,
  cancel: () => void,
  onSuccess: () => void
}): ReactElement {
  const {
    itemId,
    isOpen,
    cancel,
    onSuccess
  } = props;
  const [
    price,
    setPrice
  ] = useState<number>(null);
  const [
    formErrorMap,
    setFormErrorMap
  ] = useState<Record<BidError, boolean>>({} as Record<BidError, boolean>);
  const [
    inProgress,
    setInProgress
  ] = useState(false);

  const [translations] = useLocale();

  const onClosed = (): void => {
    setFormErrorMap({} as Record<BidError, boolean>);
    setPrice(null);
  }

  const onSubmit = async (): Promise<void> => {
    setInProgress(true);
    setFormErrorMap({} as Record<BidError, boolean>);

    const {
      errors
    } = await itemBid(itemId, price);
    if (!!errors && errors.length) {
      const newErrorMap: Record<BidError, boolean> = {} as Record<BidError, boolean>;
      errors.forEach(error => newErrorMap[error] = true);
      setFormErrorMap(newErrorMap);
    } else {
      onSuccess && onSuccess();
    }

    setInProgress(false);
  };

  return (
    <Modal
      onClosed={ onClosed }
      isOpen={ isOpen }
      backdrop="static">
      <ModalHeader>
        { translations("modal.newbid.title") }
      </ModalHeader>
      <ModalBody>
        <div>
          <div className="pb-1">
            { translations("modal.newbid.form.label.price") }
          </div>
          <div>
            <Input
              disabled={ inProgress }
              value={ price }
              onChange={ (event) => setPrice(parseInt(event.target.value)) }
              type="number"
              placeholder={ translations("modal.newbid.form.hint.price") }/>
          </div>
        </div>

        {
          formErrorMap[BidError.InvalidItem] && (
            <div className="pt-1 text-danger">
              { translations("modal.newbid.form.error.item") }
            </div>
          )
        }
        {
          formErrorMap[BidError.InsufficientBalance] && (
            <div className="pt-1 text-danger">
              { translations("modal.newbid.form.error.balance") }
            </div>
          )
        }
        {
          formErrorMap[BidError.ExceedTime] && (
            <div className="pt-1 text-danger">
              { translations("modal.newbid.form.error.time") }
            </div>
          )
        }
        {
          formErrorMap[BidError.InvalidPrice] && (
            <div className="pt-1 text-danger">
              { translations("modal.newbid.form.error.price") }
            </div>
          )
        }
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={ onSubmit }>
          {
            inProgress && (
              <Spinner size="sm">
                Loading...
              </Spinner>
            )
          }
          <span>{ translations("form.default.btn.submit") }</span>
        </Button>
        <Button color="secondary" onClick={ cancel }>
          { translations("form.default.btn.cancel") }
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default memo(NewBidModal);
