import React from "react";

function SuspenseFallbackFullPage() : React.ReactElement {
  return (
    <div
      style={ {
        position : "fixed",
        top : 0,
        left : 0,
        width : "100%",
        height : "100%"
      } }>
      <div className="page-loading-spin" />
    </div>
  );
}

export default SuspenseFallbackFullPage;
