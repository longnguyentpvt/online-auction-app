import React from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";

import App from "route/App";

import "/assets/style/styles.scss";
import "react-toastify/dist/ReactToastify.css";

function Main(): React.ReactElement {
  return (
    <>
      <App/>
      <ToastContainer
        position="top-right"
        closeOnClick={ true }
        pauseOnHover />
    </>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<Main/>);

