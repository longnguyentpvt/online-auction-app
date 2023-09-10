import React, { ReactElement } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter
} from "reactstrap";

import useUserAccount from "hooks/useUserAccount";
import useLocale from "hooks/useLocale";

import { RoutePath } from "data";

const {
  UserLoginPath
} = RoutePath;

const AccountSessionExpiredModal = () : ReactElement => {
  const [{
    token,
    expired : sessionExpired
  }] = useUserAccount();

  const [translations] = useLocale();

  return (
    <Modal isOpen={ !token || sessionExpired }>
      <ModalBody>
        { translations("modal.session.text.expired") }
      </ModalBody>

      <ModalFooter>
        <Button
          href={ UserLoginPath }
          tag="a"
          color="primary">
          { translations("modal.session.text.login") }
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AccountSessionExpiredModal;
