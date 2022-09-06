import React from "react";
import { Col, Row } from "react-bootstrap";

import styles from "./BidInformation.module.scss";

function BidInformation(props: any) {
  const { leadBid, leadTeam, contractYears } = props;

  return (
    <React.Fragment>
      <Row>
        <Col>
          <h3 className={styles["bidinformation"]}>{leadTeam}</h3>
        </Col>
        <Col>
          <h3 className={styles["bidinformation"]}>
            {[2, 3, 4].includes(contractYears)
              ? `$${leadBid} for ${contractYears} years`
              : `$${leadBid}`}
          </h3>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default BidInformation;
