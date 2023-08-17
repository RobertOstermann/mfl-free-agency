import React, { useEffect, useRef, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import classNames from "classnames";

import { FreeAgencyHub } from "components/Hub";
import { useBoundStore } from "store/Store";
import BidSection from "./bid-section/BidSection";

import styles from "./BidCard.module.scss";

function BidCard() {
  const connection = useBoundStore((state) => state.connection);

  const [imageSrc, setImageSrc] = useState("football-field.gif");
  const [imageAlt, setImageAlt] = useState("Football Field");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [title, setTitle] = useState("Free Agency");
  const [subtitle, setSubtitle] = useState("Starting Soon");
  const mountedRef = useRef(true);

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
      src = `/images/players/${imageSrc}`;
    } catch (error) {
      try {
        src = "/imagesplayers/football-field.jpg";
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
        <BidSection />
      </Card.Footer>
    </Card>
  );
}

export default BidCard;
