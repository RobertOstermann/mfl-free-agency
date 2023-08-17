import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "@tanstack/react-router";
import classNames from "classnames";

import { FreeAgencyHub } from "components/Hub";
import { freeAgencyRoute } from "components/router/pages/free-agency";
import { useBoundStore } from "store/Store";

import styles from "./TeamCard.module.scss";

function TeamCard(props: any) {
  const { team, src, league } = props;

  const connection = useBoundStore((state) => state.connection);

  const [className, setClassName] = useState<any>("teamcard");
  const [selectedTeam, setSelectedTeam] = useState<any>(false);
  const [currentTeam, setCurrentTeam] = useState<any>(false);
  const [takenTeam, setTakenTeam] = useState<any>(false);
  const [imageLoaded, setImageLoaded] = useState<any>(false);
  const mountedRef = useRef<any>(true);
  const navigate = useNavigate();

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

        navigate({ to: freeAgencyRoute.to });
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
  }, [connection, location.pathname, team]);

  useEffect(() => {
    if (connection) {
      connection.invoke(FreeAgencyHub.Invoke.GetTeams);

      connection.on(FreeAgencyHub.UpdateTeams, () => {
        connection.invoke(FreeAgencyHub.Invoke.GetTeams);
      });
    }
  }, [connection, location.pathname]);

  useEffect(() => {
    setClassName(
      classNames({
        [styles["teamcard"]]: true,
        [styles["active"]]: currentTeam,
        [styles["taken"]]: takenTeam,
      }),
    );
  }, [setClassName, location.pathname, currentTeam, selectedTeam, takenTeam]);

  const selectTeam = (team: any) => {
    if (!currentTeam) {
      if (!selectedTeam) {
        connection
          ?.invoke(FreeAgencyHub.Invoke.SetTeam, team)
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
        ?.invoke(FreeAgencyHub.Invoke.RemoveTeam, team)
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
