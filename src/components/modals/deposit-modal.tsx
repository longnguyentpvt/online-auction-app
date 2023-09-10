import React, { ReactElement, memo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";

import useLocale from "hooks/useLocale";

import { depositToBalance } from "services/account";

import { DepositError } from "types/services";

function DepositModal(props: {
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
    amount,
    setAmount
  ] = useState<number>(null);
  const [
    formErrorMap,
    setFormErrorMap
  ] = useState<Record<DepositError, boolean>>({} as Record<DepositError, boolean>);
  const [
    inProgress,
    setInProgress
  ] = useState(false);

  const [translations] = useLocale();

  const onClosed = (): void => {
    setFormErrorMap({} as Record<DepositError, boolean>);
    setAmount(null);
  }

  const onSubmit = async (): Promise<void> => {
    setInProgress(true);
    setFormErrorMap({} as Record<DepositError, boolean>);

    const {
      errors
    } = await depositToBalance(amount);
    if (!!errors && errors.length) {
      const newErrorMap: Record<DepositError, boolean> = {} as Record<DepositError, boolean>;
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
            { translations("modal.deposit.label.amount") }
          </div>
          <div>
            <Input
              disabled={ inProgress }
              value={ amount }
              onChange={ (event) => setAmount(parseInt(event.target.value)) }
              type="number"
              placeholder={ translations("modal.deposit.hint.amount") }/>
          </div>
        </div>

        {
          formErrorMap[DepositError.Unknown] && (
            <div className="pt-1 text-danger">
              { translations("form.default.error.report") }
            </div>
          )
        }
        {
          formErrorMap[DepositError.InvalidPrice] && (
            <div className="pt-1 text-danger">
              { translations("modal.deposit.error.amount") }
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

export default memo(DepositModal);
