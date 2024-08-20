import React from "react";
import type { NavLinkProps } from "react-bootstrap";
import { Button, Nav } from "react-bootstrap";
import type { AnyRouter, LinkComponent, LinkProps, RegisteredRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import styles from "./NavBarButton.module.scss";

type Props<
  TRouter extends AnyRouter = RegisteredRouter,
  TFrom extends string = string,
  TTo extends string = ""
> = {
  eventKey: any,
  text: string,
  linkProps: LinkProps<TRouter, TFrom, TTo>,
  navLinkProps?: NavLinkProps;
};

export function NavBarButton<
  TRouter extends AnyRouter = RegisteredRouter,
  TFrom extends string = string,
  TTo extends string = ""
>(props: Props<TRouter, TFrom, TTo>) {
  const {
    eventKey,
    text,
    linkProps,
    navLinkProps,
  } = props;

  return (
    <Nav.Link
      as={Link as LinkComponent<"a">}
      to={linkProps.to}
      activeProps={{
        className: styles["nav-link-active"],
      }}
      eventKey={eventKey}
      {...navLinkProps}
      {...linkProps}
    >
      <Button variant="primary" className={styles["navbar-btn"]}>
        {text}
      </Button>
    </Nav.Link>
  );
}
