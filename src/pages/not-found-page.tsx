import { useLocation, NavLink } from "react-router-dom";
import React from "react";
import { Container } from "reactstrap";

import { RoutePath } from "data";

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <Container>
        <div className="py-5">
          <h3>
            No match for <code>{ location.pathname }</code>
          </h3>
          <div>Login <NavLink to={RoutePath.UserLoginPath}>here</NavLink></div>
        </div>
      </Container>
    </div>
  );
}

export default NoMatch;
