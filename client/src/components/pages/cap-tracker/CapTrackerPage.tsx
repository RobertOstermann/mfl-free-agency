import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";

import { Api } from "api/Api";

const CAP = 125;
const ROSTER_SIZE = 16;
const REPLACEMENT_COST = 1.72;

const ROSTER_REQUIREMENTS = [
  { position: "QB", count: 1, cost: 5.93 },
  { position: "RB", count: 2, cost: 2.06 },
  { position: "WR", count: 2, cost: 3.35 },
  { position: "PK", count: 1, cost: 2.39 },
  { position: "Def", count: 1, cost: 5.5 },
];

export function CapTrackerPage() {
  const [res, setRes] = useState<any>([]);
  const [salaryAdjustmentsResponse, setSalaryAdjustmentsResponse] = useState<any>();
  const [positionsById, setPositionsById] = useState<Record<string, string>>({});

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

  const getRequest = async () => {
    axios
      .get(`${Api.route}/mfl/rosters`)
      .then((response) => {
        setRes(response.data.rosters.franchise);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${Api.route}/mfl/adjustments`)
      .then((response) => {
        const data = checkArray(
          response.data.salaryAdjustments.salaryAdjustment,
        );
        setSalaryAdjustmentsResponse(data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${Api.route}/mfl/players`)
      .then((response) => {
        const positions: Record<string, string> = {};
        checkArray(response.data.players.player).map((player) => {
          positions[player.id] = player.position;
          return null;
        });
        setPositionsById(positions);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSalary = (franchise: any) => {
    const players = checkArray(franchise.player);
    let salary = 0;
    players.map((player) => {
      salary = salary + parseFloat(player.salary);
      return null;
    });

    return salary.toFixed(2);
  };

  const GetAdjustments = (franchise: any) => {
    const salaryAdjustments = checkArray(salaryAdjustmentsResponse);
    let salary = 0;
    salaryAdjustments.map((adjustment) => {
      if (adjustment.franchise_id === franchise.id) {
        salary = salary + parseFloat(adjustment.amount);
      }
      return null;
    });
    return salary.toFixed(2);
  };

  const getTotalSalary = (franchise: any) => {
    return (
      parseFloat(getSalary(franchise)) + parseFloat(GetAdjustments(franchise))
    );
  };

  /**
   * Cheapest way to fill every roster spot other than the next player. Slots
   * that still need a required position cost that position's minimum, the rest
   * are filled with replacement level tight ends.
   */
  const getRemainingRosterCost = (franchise: any) => {
    const players = checkArray(franchise.player);
    const openSpots = ROSTER_SIZE - players.length - 1;
    if (openSpots <= 0) return 0;

    const rostered: Record<string, number> = {};
    players.map((player) => {
      const position = positionsById[player.id];
      if (position) rostered[position] = (rostered[position] ?? 0) + 1;
      return null;
    });

    let cost = 0;
    let spotsLeft = openSpots;
    ROSTER_REQUIREMENTS.map((requirement) => {
      const missing = Math.max(
        0,
        requirement.count - (rostered[requirement.position] ?? 0),
      );
      const filling = Math.min(missing, spotsLeft);
      cost = cost + filling * requirement.cost;
      spotsLeft = spotsLeft - filling;
      return null;
    });

    return cost + spotsLeft * REPLACEMENT_COST;
  };

  const getMissingPositions = (franchise: any) => {
    const players = checkArray(franchise.player);
    const rostered: Record<string, number> = {};
    players.map((player) => {
      const position = positionsById[player.id];
      if (position) rostered[position] = (rostered[position] ?? 0) + 1;
      return null;
    });

    const missing: string[] = [];
    ROSTER_REQUIREMENTS.map((requirement) => {
      const short = Math.max(
        0,
        requirement.count - (rostered[requirement.position] ?? 0),
      );
      if (short > 0) {
        missing.push(short > 1 ? `${short} ${requirement.position}` : requirement.position);
      }
      return null;
    });

    if (missing.length === 0) return "None";
    return missing.join(", ");
  };

  /** Max bid treating every other open spot as a $1.72 tight end. */
  const getNextPlayerMaxSalary = (franchise: any) => {
    const players = checkArray(franchise.player);
    const openSpots = Math.max(0, ROSTER_SIZE - players.length - 1);
    const maximumNextPlayerSalary =
      CAP - getTotalSalary(franchise) - openSpots * REPLACEMENT_COST;

    if (maximumNextPlayerSalary < 0) {
      return "No Cap Room";
    }
    return `$${maximumNextPlayerSalary.toFixed(2)}`;
  };

  /** Max bid that still leaves enough cap to fill the required positions. */
  const getNextPlayerMaxSalaryWithRoster = (franchise: any) => {
    const maximumNextPlayerSalary =
      CAP - getTotalSalary(franchise) - getRemainingRosterCost(franchise);

    if (maximumNextPlayerSalary < 0) {
      return "No Cap Room";
    }
    return `$${maximumNextPlayerSalary.toFixed(2)}`;
  };

  const checkArray = (data: any) => {
    if (data === null || data === undefined) return [];
    if (!Array.isArray(data)) {
      return [data];
    }
    return data;
  };

  return (
    <React.Fragment>
      <Button size="lg" onClick={getRequest}>
        Request
      </Button>
      <br />
      <br />
      <p>
        Please do not repeatedly click the request button, once every minute or
        so should be ok.
      </p>
      <p>
        The <b>Max Cost of Next Player</b> assumes the remainder of your roster,
        except for the player you will be drafting, is filled with $1.72 tight
        ends.
      </p>
      <p>
        The <b>Max Cost (With Roster)</b> also reserves cap for the positions you
        still have to fill: $5.93 QB, $2.06 RB (2), $3.35 WR (2), $2.39 K and
        $5.50 DEF. Positions already on your roster are not reserved again, and
        every other open spot is a $1.72 tight end.
      </p>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Team</th>
            <th>Salary</th>
            <th>Adjustments</th>
            <th>Positions Needed</th>
            <th>Max Cost (With Roster)</th>
            <th>Max Cost of Next Player</th>
          </tr>
        </thead>
        <tbody>
          {res.map((franchise: any, index: any) => {
            return (
              <tr key={index}>
                <td>{allTeams[parseFloat(franchise.id) - 1]}</td>
                <td>${getSalary(franchise)}</td>
                <td>${GetAdjustments(franchise)}</td>
                <td>{getMissingPositions(franchise)}</td>
                <td>{getNextPlayerMaxSalaryWithRoster(franchise)}</td>
                <td>{getNextPlayerMaxSalary(franchise)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </React.Fragment>
  );
}
