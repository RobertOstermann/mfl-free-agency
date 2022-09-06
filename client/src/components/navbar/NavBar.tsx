import React from "react";
import { Nav, Navbar } from "react-bootstrap";

import NavBarButton from "components/navbar/NavBarButton";
import routes from "components/RoutesHelper";

import styles from "./NavBar.module.scss";

function NavBar() {
  return (
    <header className={styles["header"]}>
      <Navbar
        collapseOnSelect
        fixed="top"
        expand="md"
        variant="light"
        bg="navbar"
        id="navbar"
      >
        <Navbar.Brand id="navbar">
          <span className={styles["highlight-blue"]}>M</span>
          <span className={styles["highlight-red"]}>F</span>
          <span className={styles["highlight-blue"]}>L</span>
        </Navbar.Brand>
        <Navbar.Brand
          id="navbar-toggle"
          as={Navbar.Toggle}
          aria-controls="responsive-navbar-nav"
        >
          <span className={styles["highlight-blue"]}>M</span>
          <span className={styles["highlight-red"]}>F</span>
          <span className={styles["highlight-blue"]}>L</span>
        </Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <NavBarButton
              eventKey={"1"}
              to={routes.owner.home}
              exact={true}
              text={"Home"}
            />
            <NavBarButton
              eventKey={"2"}
              to={routes.owner.captracker}
              exact={false}
              text={"Cap"}
            />
            <NavBarButton
              eventKey={"3"}
              to={routes.owner.players}
              exact={false}
              text={"Players"}
            />
            <NavBarButton
              eventKey={"4"}
              to={routes.owner.freeagency}
              exact={false}
              text={"Free Agency"}
            />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default NavBar;
