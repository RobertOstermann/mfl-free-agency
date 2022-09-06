import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { FreeAgencyHub } from "components/Hub";
import TeamCard from "./team-card/TeamCard";
import TeamData from "./TeamData.json";

import styles from "./HomePage.module.scss";

function HomePage(props: any) {
  const { connection } = props;
  const history = useHistory();

  const [teamData, setTeamData] = useState<any>(null);
  const [teamDataLoaded, setTeamDataLoaded] = useState<any>(false);

  useEffect(() => {
    if (connection) {
      connection.invoke(FreeAgencyHub.Invoke.GetTeams);

      connection.on(FreeAgencyHub.UpdateTeams, () => {
        connection.invoke(FreeAgencyHub.Invoke.GetTeams);
      });
    }
  }, [connection, history]);

  useEffect(() => {
    setTeamData(TeamData);
    setTeamDataLoaded(true);
  }, [setTeamData]);

  const createTeamCards = () => {
    const teamImages = require.context("data/images/teams", true);

    return teamDataLoaded ? (
      teamData.data.map((team: any) => {
        return (
          <TeamCard
            connection={connection}
            key={team.name}
            team={team.name}
            league={team.division}
            src={teamImages(`./${team.image}`).default}
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
            <p className={styles["welcome--instructions"]}>Select Your Team</p>
          </Col>
        </Row>
      </Container>
      <hr />
      <Row xs={1} sm={2} lg={3} xl={5}>
        {createTeamCards()}
      </Row>
    </React.Fragment>
  );
}

export default HomePage;
