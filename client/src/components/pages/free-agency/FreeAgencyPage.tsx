import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";
import BidCard from "./bid-card/BidCard";
import ChatBox from "./chat-box/ChatBox";
import RosterCard from "./roster-card/RosterCard";

import styles from "./FreeAgencyPage.module.scss";

function FreeAgencyPage(props: any) {
  const { connection } = props;

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
            <ChatBox connection={connection} />
          </Col>
          <Col className={styles["freeagency-col"]}>
            <BidCard connection={connection} />
          </Col>
          <Col className={styles["freeagency-col"]}>
            <RosterCard connection={connection} />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default FreeAgencyPage;
