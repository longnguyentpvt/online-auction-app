import React, { ReactElement, memo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";

import useLocale from "hooks/useLocale";

import { publishItem } from "services/market";

import { PublishItemError } from "types/services";

function PublishItemModal(props: {
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
    duration,
    setDuration
  ] = useState<number>(1);
  const [
    formErrorMap,
    setFormErrorMap
  ] = useState<Record<PublishItemError, boolean>>({} as Record<PublishItemError, boolean>);
  const [
    inProgress,
    setInProgress
  ] = useState(false);

  const [translations] = useLocale();

  const onClosed = (): void => {
    setFormErrorMap({} as Record<PublishItemError, boolean>);
    setPrice(null);
    setDuration(1);
  }

  const onSubmit = async (): Promise<void> => {
    setInProgress(true);
    setFormErrorMap({} as Record<PublishItemError, boolean>);

    const {
      errors
    } = await publishItem(itemId, price, duration);
    if (!!errors && errors.length) {
      const newErrorMap: Record<PublishItemError, boolean> = {} as Record<PublishItemError, boolean>;
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
        { translations("modal.item.publish.title") }
      </ModalHeader>
      <ModalBody>
        <div className="mb-2">
          <div className="pb-1">
            { translations("modal.item.publish.label.price") }
          </div>
          <div>
            <Input
              disabled={ inProgress }
              value={ price }
              onChange={ (event) => setPrice(parseInt(event.target.value)) }
              type="number"
              placeholder={ translations("modal.item.publish.hint.price") }/>
          </div>
        </div>

        <div>
          <div className="pb-1">
            { translations("modal.item.publish.label.duration") }
          </div>
          <div>
            <Input
              disabled={ inProgress }
              value={ duration }
              onChange={ (event) => setDuration(parseInt(event.target.value)) }
              type="number"
              placeholder={ translations("modal.item.publish.hint.duration") }/>
          </div>
        </div>

        {
          formErrorMap[PublishItemError.InvalidPrice] && (
            <div className="pt-1 text-danger">
              { translations("modal.item.publish.error.price") }
            </div>
          )
        }
        {
          formErrorMap[PublishItemError.InvalidDuration] && (
            <div className="pt-1 text-danger">
              { translations("modal.item.publish.error.duration") }
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

export default memo(PublishItemModal);
