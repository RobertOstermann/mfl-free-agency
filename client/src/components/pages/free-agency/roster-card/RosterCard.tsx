import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";
import RosterInput from "./roster-input/RosterInput";

import styles from "./RosterCard.module.scss";

function RosterCard(props: any) {
  const { connection } = props;
  const [team, setTeam] = useState<any>("MFL Teams");
  const [teams, setTeams] = useState<any>([]);
  const [players, setPlayers] = useState<any>([]);
  const [salary, setSalary] = useState<any>("0.00");
  const [adjustments, setAdjustments] = useState<any>("0.00");
  const [total, setTotal] = useState<any>("0.00");
  const [capRoom, setCapRoom] = useState<any>("125.00");
  const mountedRef = useRef<any>(true);

  const selectRoster = useCallback(() => {
    if (team === "MFL Teams") {
      connection
        .invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.GetOptOuts)
        .catch((error: any) => {
          return console.error(error.toString());
        });
    } else {
      connection
        .invoke(FreeAgencyHub.FreeAgency.Player.Invoke.GetTeamRoster, team)
        .catch((error: any) => {
          return console.error(error.toString());
        });
    }
  }, [connection, team]);

  useEffect(() => {
    mountedRef.current = true;

    if (connection) {
      connection.on(FreeAgencyHub.FreeAgency.Player.SetTeamRoster, (team: any) => {
        if (!mountedRef.current) return null;
        setTeam(team.name);
        setPlayers(team.players);
        setSalary(team.salary.toFixed(2));
        setAdjustments(team.salaryAdjustments.toFixed(2));
        setTotal(team.totalSalary.toFixed(2));
      });

      connection.on(FreeAgencyHub.FreeAgency.Player.UpdateTeamRoster, () => {
        if (!mountedRef.current) return null;
        selectRoster();
      });

      connection.on(FreeAgencyHub.FreeAgency.Bid.SetOptOuts, (teams: any, selectedTeam: any) => {
        if (!mountedRef.current) return null;
        setTeam("MFL Teams");
        setTeams(teams);
        setPlayers([]);
        setSalary(selectedTeam.salary.toFixed(2));
        setAdjustments(selectedTeam.salaryAdjustments.toFixed(2));
        setTotal(selectedTeam.totalSalary.toFixed(2));
      });

      connection.on(FreeAgencyHub.FreeAgency.Bid.UpdateOptOut, (teams: any) => {
        if (!mountedRef.current) return null;
        setTeams(teams);
      });
    }

    return () => {
      mountedRef.current = false;
    };
  }, [connection, selectRoster]);

  useEffect(() => {
    setTotal((parseFloat(salary) + parseFloat(adjustments)).toFixed(2));
    setCapRoom((125 - parseFloat(total)).toFixed(2));
  }, [salary, adjustments, total]);

  let Output = () => <React.Fragment />;

  if (team === "MFL Teams") {
    Output = () => {
      const allTeams = [
        "Yellowstone",
        "The Homelander",
        "Pigeon Boys",
        "Dactyls",
        "ODBs",
        "Storm Dynasty",
        "Benchwarmers",
        "Gorillas",
        "Power",
        "Ram",
      ];

      return (
        <React.Fragment>
          {allTeams.map((team, index) => {
            if (teams.includes(team)) {
              return (
                <Row key={index}>
                  <Col className={styles["col-team-inactive"]}>{team}</Col>
                </Row>
              );
            }
            return (
              <Row key={index}>
                <Col className={styles["col-team"]}>{team}</Col>
              </Row>
            );
          })}
        </React.Fragment>
      );
    };
  } else {
    Output = () => {
      return (
        <React.Fragment>
          <Row className={styles["row-header"]}>
            <Col className={styles["col-header"]}>Name</Col>
            <Col className={styles["col-header"]}>Salary</Col>
            <Col className={styles["col-header"]}>Year</Col>
          </Row>
          {players.map((player: any, index: any) => {
            return (
              <Row key={index} className={styles["row-player"]}>
                <Col className={styles["col-player"]}>{player.name}</Col>
                <Col className={styles["col-player"]}>
                  ${player.salary.toFixed(2)}
                </Col>
                <Col className={styles["col-player"]}>
                  {player.contractDate}
                </Col>
              </Row>
            );
          })}
        </React.Fragment>
      );
    };
  }

  return (
    <Card className={styles["card-roster"]}>
      <Card.Header className={styles["card-header"]}>{team}</Card.Header>
      <Card.Body className={styles["card-body"]}>
        <Output />
      </Card.Body>
      <Card.Footer className={styles["card-footer"]}>
        <Row className={styles["row-team-data"]}>
          <Col className={styles["col-label"]}>Salary</Col>
          <Col className={styles["col-team-data"]}>${salary}</Col>
        </Row>
        <Row className={styles["row-team-data"]}>
          <Col className={styles["col-label"]}>Adjustments</Col>
          <Col className={styles["col-team-data"]}>${adjustments}</Col>
        </Row>
        <Row className={styles["row-team-data"]}>
          <Col className={styles["col-label"]}>Total</Col>
          <Col className={styles["col-team-data"]}>${total}</Col>
        </Row>
        <Row className={styles["row-team-data"]}>
          <Col className={styles["col-label"]}>Cap Available</Col>
          <Col className={styles["col-team-data"]}>${capRoom}</Col>
        </Row>
        <RosterInput connection={connection} />
      </Card.Footer>
    </Card>
  );
}

export default RosterCard;
