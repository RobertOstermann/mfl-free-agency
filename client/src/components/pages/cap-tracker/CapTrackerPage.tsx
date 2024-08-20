import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";

import { Api } from "api/Api";

export function CapTrackerPage() {
  const [res, setRes] = useState<any>([]);
  const [salaryAdjustmentsResponse, setSalaryAdjustmentsResponse] = useState<any>();

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

  const getNextPlayerMaxSalary = (franchise: any) => {
    const players = checkArray(franchise.player);
    const salaryAdjustments = checkArray(salaryAdjustmentsResponse);
    let playersCount = 0;
    let salary = 0;
    const cap = 125;

    players.map((player) => {
      salary = salary + parseFloat(player.salary);
      playersCount = playersCount + 1;
      return null;
    });

    salaryAdjustments.map((adjustment) => {
      if (adjustment.franchise_id === franchise.id) {
        salary = salary + parseFloat(adjustment.amount);
      }
      return null;
    });

    const minimumRemainingSalaryHit = (16 - playersCount - 1) * 1.72;
    const maximumNextPlayerSalary = cap - salary - minimumRemainingSalaryHit;
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
      <Table bordered hover>
        <thead>
          <tr>
            <th>Team</th>
            <th>Salary</th>
            <th>Adjustments</th>
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
                <td>{getNextPlayerMaxSalary(franchise)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </React.Fragment>
  );
}
