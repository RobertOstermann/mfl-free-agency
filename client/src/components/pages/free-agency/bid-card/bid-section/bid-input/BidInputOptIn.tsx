import React, { useEffect, useRef } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";
import { useBoundStore } from "store/Store";

import styles from "./BidInputOptIn.module.scss";

function BidInputOptIn(props: any) {
  const { leadBid } = props;
  const inputRef = useRef<any>(null);

  const connection = useBoundStore((state) => state.connection);

  useEffect(() => {
    inputRef.current.value = leadBid;
  }, [leadBid]);

  const optIn = () => {
    connection
      ?.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.OptIn)
      .catch((error: any) => {
        return console.error(error.toString());
      });
  };

  return (
    <React.Fragment>
      <InputGroup className={styles["input-group-lead-bid"]}>
        <FormControl
          ref={inputRef}
          className={styles["input-number-lead-bid"]}
          as="input"
          type="number"
          placeholder="0.00"
          defaultValue={leadBid}
          readOnly
        />
        <Button
          variant="outline-secondary"
          className={styles["button-decrease"]}
          disabled
        >
          &darr;
        </Button>
        <Button
          variant="outline-secondary"
          className={styles["button-increase"]}
          disabled
        >
          &uarr;
        </Button>
      </InputGroup>
      <InputGroup className={styles["input-group-resume-bidding"]}>
        <Button
          variant="outline-dark"
          className={styles["button-resume-bidding"]}
          onClick={optIn}
        >
          Resume Bidding
        </Button>
      </InputGroup>
    </React.Fragment>
  );
}

export default BidInputOptIn;
