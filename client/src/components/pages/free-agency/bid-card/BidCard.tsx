import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Card, Spinner } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";
import BidSection from "./bid-section/BidSection";

import styles from "./BidCard.module.scss";

function BidCard(props: any) {
  const { connection } = props;
  const [imageSrc, setImageSrc] = useState("football-field.gif");
  const [imageAlt, setImageAlt] = useState("Football Field");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [title, setTitle] = useState("Free Agency");
  const [subtitle, setSubtitle] = useState("Starting Soon");
  const mountedRef = useRef(true);

  const playerImages = require.context("data/images/players", true);

  useEffect(() => {
    mountedRef.current = true;

    if (connection) {
      connection.on(FreeAgencyHub.FreeAgency.Player.SetPlayer, (player: any) => {
        if (!mountedRef.current) return null;
        connection.invoke(FreeAgencyHub.FreeAgency.Invoke.CheckPermissions);
        setTitle(player.name);
        setSubtitle(player.mflTeam);
        setImageSrc(player.src);
        setImageAlt(player.name);
      });
    }

    return () => {
      mountedRef.current = false;
    };
  }, [connection]);

  const getSource = (): string | undefined => {
    let src = undefined;
    try {
      src = playerImages(`./${imageSrc}`).default;
    } catch (error) {
      try {
        src = playerImages("./football-field.jpg").default;
      } catch (error) {
        src = undefined;
      }
    }

    return src;
  };

  return (
    <Card className={styles["bidcard"]}>
      <Card.Header
        className={classNames({
          [styles["bidcard-spinner"]]: !imageLoaded,
          [styles["bidcard-spinner-hidden"]]: imageLoaded,
        })}
      >
        <Spinner animation="border" />
      </Card.Header>
      <Card.Img
        variant="top"
        src={getSource()}
        alt={imageAlt}
        onLoad={() => {
          setImageLoaded(true);
        }}
      />
      <Card.Body className={styles["bidcard-body"]}>
        <Card.Title as="h4">{title}</Card.Title>
        <Card.Subtitle as="h5" className="mb-2 text-muted">
          {subtitle}
        </Card.Subtitle>
      </Card.Body>
      <Card.Footer className={styles["bidcard-footer"]}>
        <BidSection connection={connection} />
      </Card.Footer>
    </Card>
  );
}

export default BidCard;
