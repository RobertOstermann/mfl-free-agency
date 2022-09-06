import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";
import PlayerCard from "./player-card/PlayerCard";

import styles from "./PlayerPage.module.scss";

function PlayerPage(props: any) {
  const { connection } = props;

  const [playerData, setPlayerData] = useState<any>(null);
  const [playerDataLoaded, setPlayerDataLoaded] = useState<any>(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (connection) {
      connection.invoke(FreeAgencyHub.Players.Invoke.GetPlayers);

      connection.on(FreeAgencyHub.Players.SetPlayers, (players: any) => {
        if (!mountedRef.current) return null;
        setPlayerData(players);
        setPlayerDataLoaded(true);
      });

      connection.on(FreeAgencyHub.Players.UpdatePlayers, (players: any) => {
        if (!mountedRef.current) return null;
        setPlayerData(players);
        setPlayerDataLoaded(true);
      });
    }

    return () => {
      mountedRef.current = false;
    };
  }, [connection]);

  const createPlayerCards = () => {
    const playerImages = require.context("data/images/players", true);

    return playerDataLoaded ? (
      playerData.map((player: any, index: any) => {
        return (
          <PlayerCard
            key={index}
            player={player.name}
            src={playerImages(`./${player.src}`).default}
            teamNFL={player.nflTeam}
            teamMFL={player.mflTeam}
            salary={player.salary}
            position={player.position}
            age={player.age}
            prevPositionRank={player.previousRank}
            prevFantasyAverage={player.previousAverage}
            contractYears={player.contractYears}
          />
        );
      })
    ) : (
      <React.Fragment />
    );
  };

  return (
    <React.Fragment>
      <Container fluid className={styles["welcome"]}>
        <Row xs={1} className={styles["welcome--row"]}>
          <Col className={styles["welcome__row--col"]}>
            <h1 className={styles["welcome--league"]}>
              Midwest Fantasy League
            </h1>
          </Col>
          <Col xs={11} md={8}>
            <hr className={styles["welcome--divider"]} />
          </Col>
          <Col className={styles["welcome__row--col"]}>
            <p className={styles["welcome--instructions"]}>Free Agents</p>
          </Col>
        </Row>
      </Container>
      <hr />
      <Row xs={1} sm={2} lg={3} xl={5}>
        {createPlayerCards()}
      </Row>
    </React.Fragment>
  );
}

export default PlayerPage;
