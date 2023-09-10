import React, { ReactElement, memo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";

import useLocale from "hooks/useLocale";

import { addItem } from "services/market";

import { NewItemError } from "types/services";

function AddItemModal(props: {
  isOpen: boolean,
  cancel: () => void,
  onSuccess: () => void
}): ReactElement {
  const {
    isOpen,
    cancel,
    onSuccess
  } = props;
  const [
    name,
    setName
  ] = useState<string>("");
  const [
    formErrorMap,
    setFormErrorMap
  ] = useState<Record<NewItemError, boolean>>({} as Record<NewItemError, boolean>);
  const [
    inProgress,
    setInProgress
  ] = useState(false);

  const [translations] = useLocale();

  const onClosed = (): void => {
    setFormErrorMap({} as Record<NewItemError, boolean>);
    setName("");
  }

  const onSubmit = async (): Promise<void> => {
    setInProgress(true);
    setFormErrorMap({} as Record<NewItemError, boolean>);

    const {
      errors
    } = await addItem(name);
    if (!!errors && errors.length) {
      const newErrorMap: Record<NewItemError, boolean> = {} as Record<NewItemError, boolean>;
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
        { translations("modal.deposit.title") }
      </ModalHeader>
      <ModalBody>
        <div>
          <div className="pb-1">
            { translations("modal.item.new.label.name") }
          </div>
          <div>
            <Input
              disabled={ inProgress }
              value={ name }
              maxLength={ 255 }
              onChange={ (event) => setName(event.target.value) }
              type="text"
              placeholder={ translations("modal.item.new.hint.name") }/>
          </div>
        </div>

        {
          formErrorMap[NewItemError.Unknown] && (
            <div className="pt-1 text-danger">
              { translations("form.default.error.report") }
            </div>
          )
        }
        {
          formErrorMap[NewItemError.InvalidName] && (
            <div className="pt-1 text-danger">
              { translations("modal.item.new.error.name") }
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

export default memo(AddItemModal);
