import React, { ReactElement, useEffect, useState } from "react";
import {
  Container,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu, DropdownItem
} from "reactstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { UserIcon } from "components/icons";
import DepositModal from "components/modals/deposit-modal";

import useUserAccount from "hooks/useUserAccount";

import { logout } from "services/auth";
import { formatPrice } from "utils/pricing";

import { RoutePath } from "data";

const {
  MarketItemsOngoingPage,
  MarketItemsEndPage,
  MarketMyItemsPage,
  UserLoginPath
} = RoutePath;

function FixedHeader(): ReactElement {
  const navigate = useNavigate();
  const [
    {
      name,
      balance,
      token
    },
    syncInfo
  ] = useUserAccount();
  const [
    depositModalOpen,
    setDepositModalOpen
  ] = useState(false);

  const signoutFromSystem = () => {
    logout();

    navigate(UserLoginPath);
  };

  const toggleDepositModal = () => {
    setDepositModalOpen(prevState => !prevState);
  };

  const onDepositSuccess = () => {
    syncInfo();
    toggleDepositModal();

    toast("Balance has been deposited successfully", {
      autoClose: 5000,
      type: "success"
    });
  };

  useEffect(() => {
    if (!!token) {
      syncInfo();
    }
  }, [token]);

  const balanceStr = formatPrice(balance);

  return (
    <div className="fixed-header bg-white position-fixed top-0 w-100 border-bottom">
      <Container>
        <div className="fixed-header-container d-flex align-items-center justify-content-center">
          <div className="flex-fill">
            <Nav>
              <NavItem>
                <NavLink
                  className="nav-link"
                  to={ MarketItemsOngoingPage }>Ongoing Items</NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className="nav-link"
                  to={ MarketItemsEndPage }>End Items</NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className="nav-link"
                  to={ MarketMyItemsPage }>My Items</NavLink>
              </NavItem>
            </Nav>
          </div>
          <div>
            <div className="header__user-info">
              <UncontrolledDropdown>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="pe-2 text-truncate mw-0 text-end header__user-name">
                        { name ?? "..." }
                      </div>
                      <div className="pe-2 text-end text-black-50">
                        ${ balanceStr }
                      </div>
                    </div>
                    <div className="header__user-avatar rounded-circle border-2 border">
                      <UserIcon/>
                    </div>
                  </div>
                </DropdownToggle>

                <DropdownMenu className="header__user_dropdown" container="body">
                  <DropdownItem onClick={ toggleDepositModal }>
                    Deposit
                  </DropdownItem>
                  <DropdownItem onClick={ signoutFromSystem }>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </div>
      </Container>

      <DepositModal
        onSuccess={ onDepositSuccess }
        isOpen={ depositModalOpen }
        cancel={ toggleDepositModal }/>
    </div>
  )
}

export default FixedHeader;
