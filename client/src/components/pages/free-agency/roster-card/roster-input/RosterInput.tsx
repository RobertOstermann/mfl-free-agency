import React from "react";
import { FormControl, InputGroup } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";

import styles from "./RosterInput.module.scss";

function RosterInput(props: any) {
  const { connection } = props;

  const selectRoster = (event: any) => {
    const index = event.target.value;
    const team = event.target[index].text;
    if (index === "0") {
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
  };

  return (
    <InputGroup className={styles["input-group-roster"]}>
      <InputGroup.Text className={styles["input-group-text-team"]}>
        Team:
      </InputGroup.Text>
      <FormControl
        as="select"
        className={styles["form-control-teams"]}
        onChange={selectRoster}
      >
        <option value="0" defaultValue={"0"}>
          All
        </option>
        <option value="1">Yellowstone</option>
        <option value="2">The Homelander</option>
        <option value="3">Pigeon Boys</option>
        <option value="4">Dactyls</option>
        <option value="5">ODBs</option>
        <option value="6">Storm Dynasty</option>
        <option value="7">Benchwarmers</option>
        <option value="8">Gorillas</option>
        <option value="9">Power</option>
        <option value="10">Ram</option>
      </FormControl>
    </InputGroup>
  );
}

export default RosterInput;
