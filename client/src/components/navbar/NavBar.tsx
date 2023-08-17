import React from "react";
import { Nav, Navbar } from "react-bootstrap";

import NavBarButton from "components/navbar/NavBarButton";
import { capTrackerRoute } from "components/router/pages/cap-tracker";
import { freeAgencyRoute } from "components/router/pages/free-agency";
import { homeRoute } from "components/router/pages/home";
import { playersRoute } from "components/router/pages/players";

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
              to={homeRoute.to}
              text={"Home"}
            />
            <NavBarButton
              eventKey={"2"}
              to={capTrackerRoute.to}
              activeOptions={{
                exact: false,
              }}
              text={"Cap"}
            />
            <NavBarButton
              eventKey={"3"}
              to={playersRoute.to}
              activeOptions={{
                exact: false,
              }}
              text={"Players"}
            />
            <NavBarButton
              eventKey={"4"}
              to={freeAgencyRoute.to}
              activeOptions={{
                exact: false,
              }}
              text={"Free Agency"}
            />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default NavBar;
