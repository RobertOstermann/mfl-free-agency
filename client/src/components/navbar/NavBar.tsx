import { Nav, Navbar } from "react-bootstrap";

import { NavBarButton } from "components/navbar/NavBarButton";

import styles from "./NavBar.module.scss";

export function NavBar() {
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
              text={"Home"}
              linkProps={{
                to: "/",
              }}
            />
            <NavBarButton
              eventKey={"2"}
              text={"Cap"}
              linkProps={{
                to: "/cap-tracker",
                activeOptions: {
                  exact: false,
                },
              }}
            />
            <NavBarButton
              eventKey={"3"}
              text={"Players"}
              linkProps={{
                to: "/players",
                activeOptions: {
                  exact: false,
                },
              }}
            />
            <NavBarButton
              eventKey={"4"}
              text={"Free Agency"}
              linkProps={{
                to: "/free-agency",
                activeOptions: {
                  exact: false,
                },
              }}
            />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}
