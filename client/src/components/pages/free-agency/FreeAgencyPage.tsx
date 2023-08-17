import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";
import { useBoundStore } from "store/Store";
import BidCard from "./bid-card/BidCard";
import ChatBox from "./chat-box/ChatBox";
import RosterCard from "./roster-card/RosterCard";

import styles from "./FreeAgencyPage.module.scss";

function FreeAgencyPage() {
  const connection = useBoundStore((state) => state.connection);

  useEffect(() => {
    if (connection) {
      connection.invoke(FreeAgencyHub.FreeAgency.Invoke.CheckPermissions);

      connection.invoke(FreeAgencyHub.FreeAgency.Player.Invoke.GetPlayer);
      connection.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.GetOptOuts);
    }
  }, [connection]);

  return (
    <React.Fragment>
      <Container fluid>
        <Row xs={1} lg={2} xl={3}>
          <Col className={styles["freeagency-col"]}>
            <ChatBox />
          </Col>
          <Col className={styles["freeagency-col"]}>
            <BidCard />
          </Col>
          <Col className={styles["freeagency-col"]}>
            <RosterCard />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default FreeAgencyPage;
