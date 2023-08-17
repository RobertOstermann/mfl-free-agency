import React from "react";
import { Button, Nav, NavLinkProps } from "react-bootstrap";
import { Link, LinkPropsOptions } from "@tanstack/react-router";

import styles from "./NavBarButton.module.scss";

type NavBarButtonProps = {
  eventKey: any,
  text: string,
} & NavLinkProps & LinkPropsOptions;

function NavBarButton(props: NavBarButtonProps) {
  return (
    <Nav.Link
      as={Link}
      to={props.to}
      activeProps={{
        className: styles["nav-link-active"],
      }}
      {...props}
    >
      <Button variant="primary" className={styles["navbar-btn"]}>
        {props.text}
      </Button>
    </Nav.Link>
  );
}

export default NavBarButton;
