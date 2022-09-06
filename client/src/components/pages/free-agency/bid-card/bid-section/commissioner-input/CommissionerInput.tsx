import React, { useEffect, useRef, useState } from "react";
import { Button, InputGroup } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";

import styles from "./CommissionerInput.module.scss";

function CommissionerInput(props: any) {
  const { connection } = props;
  const [commissioner, setCommissioner] = useState(false);
  const [freeAgencyStarted, setFreeAgencyStarted] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (connection) {
      connection.invoke(
        FreeAgencyHub.FreeAgency.Commissioner.Invoke.CheckPermissions
      );

      connection.on(
        FreeAgencyHub.FreeAgency.Commissioner.CommissionerPermissions,
        (isCommissioner: any, started: any) => {
          if (!mountedRef.current) return null;
          setCommissioner(isCommissioner);
          setFreeAgencyStarted(started);
        }
      );
    }

    return () => {
      mountedRef.current = false;
    };
  }, [connection]);

  const startFreeAgency = () => {
    connection
      .invoke(FreeAgencyHub.FreeAgency.Invoke.StartFreeAgency)
      .catch((error: any) => {
        return console.error(error.toString());
      });
  };

  const resetCurrentPlayer = () => {
    connection
      .invoke(FreeAgencyHub.FreeAgency.Player.Invoke.PlayerReset)
      .catch((error: any) => {
        return console.error(error.toString());
      });
  };

  const sellCurrentPlayer = () => {
    connection
      .invoke(FreeAgencyHub.FreeAgency.Player.Invoke.PlayerSold)
      .catch((error: any) => {
        return console.error(error.toString());
      });
  };

  const setPreviousPlayer = () => {
    connection
      .invoke(FreeAgencyHub.FreeAgency.Player.Invoke.GetPreviousPlayer)
      .catch((error: any) => {
        return console.error(error.toString());
      });
  };

  const setNextPlayer = () => {
    connection
      .invoke(FreeAgencyHub.FreeAgency.Player.Invoke.GetNextPlayer)
      .catch((error: any) => {
        return console.error(error.toString());
      });
  };

  if (!commissioner) {
    return <React.Fragment />;
  }

  if (freeAgencyStarted) {
    return (
      <React.Fragment>
        <InputGroup className={styles["input-group-players"]}>
          <Button
            className={styles["button-previous"]}
            onClick={setPreviousPlayer}
            variant="outline-dark"
          >
            Previous Player
          </Button>
          <Button
            className={styles["button-next"]}
            onClick={setNextPlayer}
            variant="outline-dark"
          >
            Next Player
          </Button>
        </InputGroup>
        <InputGroup className={styles["input-group-start"]}>
          <Button
            className={styles["button-reset"]}
            onClick={resetCurrentPlayer}
            variant="outline-warning"
          >
            Reset
          </Button>
          <Button
            className={styles["button-sold"]}
            onClick={sellCurrentPlayer}
            variant="outline-danger"
          >
            Sold
          </Button>
        </InputGroup>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <InputGroup className={styles["input-group-players"]}>
        <Button
          className={styles["button-previous"]}
          variant="outline-dark"
          disabled
        >
          Previous Player
        </Button>
        <Button
          className={styles["button-next"]}
          variant="outline-dark"
          disabled
        >
          Next Player
        </Button>
      </InputGroup>
      <InputGroup className={styles["input-group-start"]}>
        <Button
          className={styles["button-start"]}
          onClick={startFreeAgency}
          variant="outline-success"
        >
          Start Free Agency
        </Button>
      </InputGroup>
    </React.Fragment>
  );
}

export default CommissionerInput;
