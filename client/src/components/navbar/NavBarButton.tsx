import React from "react";
import { Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import styles from "./NavBarButton.module.scss";

function NavBarButton(props: any) {
  return (
    <Nav.Link
      as={NavLink}
      eventKey={props.eventKey}
      to={props.to}
      exact={props.exact}
      activeClassName={styles["nav-link-active"]}
    >
      <Button variant="primary" className={styles["navbar-btn"]}>
        {props.text}
      </Button>
    </Nav.Link>
  );
}

export default NavBarButton;
