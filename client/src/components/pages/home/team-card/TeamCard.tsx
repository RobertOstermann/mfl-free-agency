import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { FreeAgencyHub } from "components/Hub";

import styles from "./TeamCard.module.scss";

function TeamCard(props: any) {
  const { connection, team, src, league } = props;
  const [className, setClassName] = useState<any>("teamcard");
  const [selectedTeam, setSelectedTeam] = useState<any>(false);
  const [currentTeam, setCurrentTeam] = useState<any>(false);
  const [takenTeam, setTakenTeam] = useState<any>(false);
  const [imageLoaded, setImageLoaded] = useState<any>(false);
  const mountedRef = useRef<any>(true);
  const history = useHistory();

  useEffect(() => {
    mountedRef.current = true;

    if (connection) {
      connection.on(FreeAgencyHub.ServerSelectTeam, (serverTeam: any) => {
        if (!mountedRef.current) return null;
        setSelectedTeam(true);
        if (serverTeam === team) {
          setCurrentTeam(true);
        }
      });

      connection.on(FreeAgencyHub.SelectTeam, (serverTeam: any) => {
        if (!mountedRef.current) return null;
        setSelectedTeam(true);
        if (serverTeam === team) {
          setCurrentTeam(true);
        }
        history.push("/free-agency");
      });

      connection.on(FreeAgencyHub.ReceiveSetTeam, (serverTeam: any) => {
        if (!mountedRef.current) return null;
        if (serverTeam === team) {
          setTakenTeam(true);
        }
      });

      connection.on(FreeAgencyHub.ReceiveRemoveTeam, (serverTeam: any) => {
        if (!mountedRef.current) return null;
        setSelectedTeam(false);
        if (serverTeam === team) {
          setCurrentTeam(false);
          setTakenTeam(false);
        }
      });
    }

    return () => {
      mountedRef.current = false;
    };
  }, [connection, history, team]);

  useEffect(() => {
    setClassName(
      classNames({
        [styles["teamcard"]]: true,
        [styles["active"]]: currentTeam,
        [styles["taken"]]: takenTeam,
      })
    );
  }, [setClassName, currentTeam, takenTeam]);

  const selectTeam = (team: any) => {
    if (!currentTeam) {
      if (!selectedTeam) {
        connection
          .invoke(FreeAgencyHub.Invoke.SetTeam, team)
          .then(() => {
            if (!mountedRef.current) return null;
            setCurrentTeam(true);
          })
          .catch((error: any) => {
            return console.error(error.toString());
          });
      }
    } else {
      connection
        .invoke(FreeAgencyHub.Invoke.RemoveTeam, team)
        .then(() => {
          setCurrentTeam(false);
        })
        .catch((error: any) => {
          return console.error(error.toString());
        });
    }
  };

  return (
    <Col className={styles["teamcard--col"]}>
      <Card
        className={className}
        onClick={() => selectTeam(team)}
        id={`teamcard-${team}`}
      >
        <Card.Header
          className={classNames({
            [styles["teamcard-spinner"]]: !imageLoaded,
            [styles["teamcard-spinner-hidden"]]: imageLoaded,
          })}
        >
          <Spinner animation="border" />
        </Card.Header>
        <Card.Img
          variant="top"
          src={src}
          alt={team}
          onLoad={() => {
            setImageLoaded(true);
          }}
        />
        <Card.Body className={styles["teamcard--body"]}>
          <Card.Title>{team}</Card.Title>
          <Card.Subtitle>{league}</Card.Subtitle>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default TeamCard;
