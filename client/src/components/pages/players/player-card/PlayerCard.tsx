import React, { useState } from "react";
import { Card, Col, Spinner } from "react-bootstrap";
import classNames from "classnames";

import styles from "./PlayerCard.module.scss";

export function PlayerCard(props: any) {
  const {
    player,
    src,
    teamNFL,
    teamMFL,
    salary,
    age,
    position,
    prevPositionRank,
    prevFantasyAverage,
    contractYears,
  } = props;

  const [imageLoaded, setImageLoaded] = useState<any>(false);

  return (
    <Col className={styles["playercard--col"]}>
      <Card className={styles["playercard"]}>
        <Card.Header
          className={classNames({
            [styles["playercard-spinner"]]: !imageLoaded,
            [styles["playercard-spinner-hidden"]]: imageLoaded,
          })}
        >
          <Spinner animation="border" />
        </Card.Header>
        <Card.Img
          variant="top"
          src={src}
          alt={player}
          height={150}
          onLoad={() => {
            setImageLoaded(true);
          }}
        />
        <Card.Body className={styles["playercard--body"]}>
          <Card.Title>{player}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{teamMFL}</Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">
            $
            {contractYears === 0
              ? salary.toFixed(2)
              : `${salary.toFixed(2)} for ${contractYears} years`}
          </Card.Subtitle>
          <Card.Text>
            {`NFL Team: ${teamNFL}`}
            <br />
            {`Position: ${position}`}
            <br />
            {`Age: ${age}`}
            <br />
            {`${new Date().getFullYear() - 1} Average: ${prevFantasyAverage.toFixed(2)}`}
            <br />
            {`${new Date().getFullYear() - 1} Position Rank: ${prevPositionRank}`}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}
