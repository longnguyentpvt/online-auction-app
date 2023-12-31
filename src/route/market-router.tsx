import React, { ReactElement } from "react";
import {
  Routes,
  Route
} from "react-router-dom";

import { MarketItemsPage, NotFoundPage } from "pages";

import { AccountSessionExpiredModal } from "components/modals";

import {
  RoutePath
} from "data";

const {
  MarketItemsPathName
} = RoutePath;

function MarketRouter(): ReactElement {

  return (
    <>
      {
        <>
          <Routes>
            <Route path={ MarketItemsPathName + "/:itemStatus" } element={ <MarketItemsPage/> }/>

            <Route path="*" element={ <NotFoundPage/> }/>
          </Routes>
        </>
      }

      <AccountSessionExpiredModal/>
    </>
  )
}

export default MarketRouter;
