import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles["footer"]}>
      <Container fluid>
        <Row xs={1}>
          <Col>
            <h5>Website Created By: Robbie Ostermann</h5>
            <hr className={styles["hr-light"]} />
            <h5>&copy; 2022 MFL Free Agency</h5>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
