import React, {
  memo,
  useEffect,
  Suspense
} from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation
} from "react-router-dom";

import {
  LoginPage,
  RegisterPage,
  NotFoundPage
} from "pages";
import MarketRouter from "./market-router";

import SuspenseFallbackFullPage from "components/suspense-fallback-full-page";

import {
  RoutePath
} from "data";

const {
  UserLoginPath,
  UserRegisterPath,
  MarketAppPrefix
} = RoutePath

const App = (): React.ReactElement => {
  useEffect(() => {
    console.log("App Loaded");
  }, []);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={ <SuspenseFallbackFullPage/> }>
          <Routes>
            <Route
              path={ `${ MarketAppPrefix }/*` }
              element={ <MarketRouter/> }/>

            <Route
              path={ UserLoginPath }
              element={ <LoginPage/> }/>

            <Route
              path={ UserRegisterPath }
              element={ <RegisterPage/> }/>

            <Route path="*" element={ <NotFoundPage /> }/>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default memo(App);
