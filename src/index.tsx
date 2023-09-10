import React from "react";

import App from "route/App";

import { createRoot } from "react-dom/client";

import "/assets/style/styles.scss";

function Main() : React.ReactElement {
  return (
    <App />
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<Main />);

