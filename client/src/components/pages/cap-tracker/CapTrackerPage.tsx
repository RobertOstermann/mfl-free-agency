import React, { useMemo, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useCookies } from "react-cookie";
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

type LeaguePlayer = {
  id: string;
  name: string;
  team: string;
  position: string;
  salary: number | null;
  bye: string | null;
};

const ESPN_POSITION_BY_MFL_POSITION: Record<string, string> = {
  QB: "QB",
  RB: "RB",
  WR: "WR",
  TE: "TE",
};

function normalizePlayerName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim();
}

const VALID_POSITIONS = ["QB", "RB", "WR", "TE", "PK", "Def"];
const DRAFT_TARGET_POSITIONS = ["QB", "RB", "WR", "TE"];

function getEstimatedSalary(player: { position: string; salary: number | null }) {
  if (player.salary !== null) return player.salary;
  const requirement = ROSTER_REQUIREMENTS.find(
    (item) => item.position === player.position,
  );
  return requirement ? requirement.cost : REPLACEMENT_COST;
}
const PLAYERS_PER_PAGE = 10;

type SortDirection = "asc" | "desc";
type SortState<TKey extends string> = {
  key: TKey | null;
  direction: SortDirection;
};

function toggleSort<TKey extends string>(
  current: SortState<TKey>,
  key: TKey,
  defaultDirection: SortDirection,
): SortState<TKey> {
  if (current.key !== key) return { key, direction: defaultDirection };
  if (current.direction === defaultDirection) {
    return { key, direction: defaultDirection === "asc" ? "desc" : "asc" };
  }
  return { key: null, direction: defaultDirection };
}

function compareValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

function formatPlayerName(name: string) {
  const [last, first] = name.split(",").map((part) => part.trim());
  if (!first) return name;
  return `${first} ${last}`;
}

function SortableHeader<TKey extends string>({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: TKey;
  sort: SortState<TKey>;
  onSort: (key: TKey) => void;
}) {
  const isActive = sort.key === sortKey;
  const arrow = isActive ? (sort.direction === "asc" ? " ^" : " v") : "";
  return (
    <th
      role="button"
      onClick={() => onSort(sortKey)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {label}
      <span style={{ color: "#adb5bd" }}>{arrow}</span>
    </th>
  );
}

const ALL_TEAMS = [
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

export function CapTrackerPage() {
  const [res, setRes] = useState<any>([]);
  const [salaryAdjustmentsResponse, setSalaryAdjustmentsResponse] = useState<any>();
  const [positionsById, setPositionsById] = useState<Record<string, string>>({});
  const [players, setPlayers] = useState<Record<string, LeaguePlayer>>({});
  const [byeWeeksByTeam, setByeWeeksByTeam] = useState<Record<string, string>>({});
  const [ecrRankByNameAndPosition, setEcrRankByNameAndPosition] = useState<
    Record<string, number>
  >({});

  const [cookies] = useCookies(["TeamCookie"]);

  const [myTeamId, setMyTeamId] = useState<string>(() => {
    const teamIndex = ALL_TEAMS.indexOf(cookies.TeamCookie);
    if (teamIndex >= 0) return String(teamIndex + 1);

    return "";
  });
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [affordableOnly, setAffordableOnly] = useState(true);
  const [page, setPage] = useState(0);
  const [projectedPlayerIds, setProjectedPlayerIds] = useState<string[]>([]);

  type RosterSortKey = "name" | "team" | "position" | "bye" | "salary";
  const DEFAULT_ROSTER_SORT: { key: RosterSortKey; direction: SortDirection } = {
    key: "position",
    direction: "asc",
  };
  const [rosterSort, setRosterSort] = useState<SortState<RosterSortKey>>({
    key: null,
    direction: DEFAULT_ROSTER_SORT.direction,
  });

  type AvailableSortKey = "name" | "team" | "position" | "bye" | "salary";
  const DEFAULT_AVAILABLE_SORT: {
    key: AvailableSortKey;
    direction: SortDirection;
  } = {
    key: "salary",
    direction: "desc",
  };
  const [availableSort, setAvailableSort] = useState<
    SortState<AvailableSortKey>
  >({ key: null, direction: DEFAULT_AVAILABLE_SORT.direction });

  const allTeams = ALL_TEAMS;

  const handleMyTeamChange = (id: string) => {
    setMyTeamId(id);
    setProjectedPlayerIds([]);
  };

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

    const playersRequest = axios.get(`${Api.route}/mfl/players`);
    const salariesRequest = axios.get(`${Api.route}/mfl/salaries`);
    const byeWeeksRequest = axios.get(`${Api.route}/mfl/byeWeeks`);

    Promise.all([playersRequest, salariesRequest, byeWeeksRequest])
      .then(([playersResponse, salariesResponse, byeWeeksResponse]) => {
        const positions: Record<string, string> = {};
        const salariesById: Record<string, number> = {};
        const byeWeeksByTeamCode: Record<string, string> = {};

        checkArray(
          salariesResponse.data.salaries.leagueUnit.player,
        ).map((entry) => {
          salariesById[entry.id] = parseFloat(entry.salary);
          return null;
        });

        checkArray(byeWeeksResponse.data.nflByeWeeks.team).map((team) => {
          byeWeeksByTeamCode[team.id] = team.bye_week;
          return null;
        });

        const playerList: Record<string, LeaguePlayer> = {};
        checkArray(playersResponse.data.players.player).map((player) => {
          positions[player.id] = player.position;
          playerList[player.id] = {
            id: player.id,
            name: formatPlayerName(player.name),
            team: player.team,
            position: player.position,
            salary: salariesById[player.id] ?? null,
            bye: byeWeeksByTeamCode[player.team] ?? null,
          };
          return null;
        });

        setPositionsById(positions);
        setPlayers(playerList);
        setByeWeeksByTeam(byeWeeksByTeamCode);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${Api.route}/rankings`)
      .then((response) => {
        const rankByNameAndPosition: Record<string, number> = {};
        checkArray(response.data).map((rankedPlayer: any) => {
          const key = `${normalizePlayerName(rankedPlayer.name)}|${rankedPlayer.position}`;
          rankByNameAndPosition[key] = rankedPlayer.rank;
          return null;
        });
        setEcrRankByNameAndPosition(rankByNameAndPosition);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEcrRank = (player: LeaguePlayer) => {
    const espnPosition = ESPN_POSITION_BY_MFL_POSITION[player.position];
    if (!espnPosition) return null;

    const key = `${normalizePlayerName(player.name)}|${espnPosition}`;
    return ecrRankByNameAndPosition[key] ?? null;
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
  const getRemainingRosterCost = (
    rostered: Record<string, number>,
    rosterSizeUsed: number,
  ) => {
    const openSpots = ROSTER_SIZE - rosterSizeUsed - 1;
    if (openSpots <= 0) return 0;

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

  const getRosteredPositionCounts = (franchise: any) => {
    const rosteredPlayers = checkArray(franchise.player);
    const rostered: Record<string, number> = {};
    rosteredPlayers.map((player) => {
      const position = positionsById[player.id];
      if (position) rostered[position] = (rostered[position] ?? 0) + 1;
      return null;
    });
    return rostered;
  };

  const getMissingPositions = (franchise: any) => {
    const rostered = getRosteredPositionCounts(franchise);

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
    const players = checkArray(franchise.player);
    const rostered = getRosteredPositionCounts(franchise);
    const maximumNextPlayerSalary =
      CAP -
      getTotalSalary(franchise) -
      getRemainingRosterCost(rostered, players.length);

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

  const myFranchise = useMemo(() => {
    if (!myTeamId) return undefined;
    return checkArray(res).find(
      (franchise: any) => parseInt(franchise.id, 10) === parseInt(myTeamId, 10),
    );
  }, [res, myTeamId]);

  const myRosterPlayers = useMemo(() => {
    if (!myFranchise) return [];
    return checkArray(myFranchise.player).map((rosterPlayer: any) => {
      const info = players[rosterPlayer.id];
      const team = info?.team ?? "";
      return {
        id: rosterPlayer.id,
        name: info?.name ?? rosterPlayer.id,
        team,
        position: info?.position ?? positionsById[rosterPlayer.id] ?? "",
        salary: parseFloat(rosterPlayer.salary),
        bye: info?.bye ?? byeWeeksByTeam[team] ?? null,
      };
    });
  }, [myFranchise, players, positionsById, byeWeeksByTeam]);

  const allRosteredPlayerIds = useMemo(() => {
    const ids = new Set<string>();
    checkArray(res).map((franchise: any) => {
      checkArray(franchise.player).map((rosterPlayer: any) => {
        ids.add(rosterPlayer.id);
        return null;
      });
      return null;
    });
    return ids;
  }, [res]);

  const projectedPlayers = projectedPlayerIds
    .map((id) => players[id])
    .filter((player): player is LeaguePlayer => Boolean(player));

  const combinedRosterPlayers = useMemo(() => {
    const rostered = myRosterPlayers.map((player: any) => ({
      ...player,
      isProjected: false,
    }));
    const projected = projectedPlayers.map((player) => ({
      id: player.id,
      name: player.name,
      team: player.team,
      position: player.position,
      salary: getEstimatedSalary(player),
      bye: player.bye,
      isProjected: true,
    }));
    const key: RosterSortKey = rosterSort.key ?? DEFAULT_ROSTER_SORT.key;
    const effectiveDirection =
      rosterSort.key === null ? DEFAULT_ROSTER_SORT.direction : rosterSort.direction;
    const direction = effectiveDirection === "asc" ? 1 : -1;
    return [...rostered, ...projected].sort(
      (a, b) => direction * compareValues(a[key] ?? "", b[key] ?? ""),
    );
  }, [myRosterPlayers, projectedPlayers, rosterSort]);

  const handleRosterSort = (key: RosterSortKey) => {
    setRosterSort((current) =>
      toggleSort(current, key, key === "salary" ? "desc" : "asc"),
    );
  };

  const currentSalary = myFranchise ? getTotalSalary(myFranchise) : 0;
  const projectedAddedSalary = projectedPlayers.reduce(
    (sum, player) => sum + getEstimatedSalary(player),
    0,
  );
  const projectedTotalSalary = currentSalary + projectedAddedSalary;
  const projectedRemainingCap = CAP - projectedTotalSalary;

  const projectedRosterCount = myRosterPlayers.length + projectedPlayers.length;
  const projectedPositionCounts = useMemo(() => {
    const counts = myFranchise ? getRosteredPositionCounts(myFranchise) : {};
    const combined: Record<string, number> = { ...counts };
    projectedPlayers.map((player) => {
      combined[player.position] = (combined[player.position] ?? 0) + 1;
      return null;
    });
    return combined;
  }, [myFranchise, projectedPlayers]);

  const formatMaxSalary = (maximumNextPlayerSalary: number) => {
    if (maximumNextPlayerSalary < 0) return "No Cap Room";
    return `$${maximumNextPlayerSalary.toFixed(2)}`;
  };

  const projectedOpenSpots = Math.max(0, ROSTER_SIZE - projectedRosterCount - 1);
  const projectedMaxSalaryValue =
    CAP - projectedTotalSalary - projectedOpenSpots * REPLACEMENT_COST;
  const projectedMaxSalary = formatMaxSalary(projectedMaxSalaryValue);
  const projectedMaxSalaryWithRoster = formatMaxSalary(
    CAP -
    projectedTotalSalary -
    getRemainingRosterCost(projectedPositionCounts, projectedRosterCount),
  );

  const availablePlayers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const key: AvailableSortKey = availableSort.key ?? DEFAULT_AVAILABLE_SORT.key;
    const effectiveDirection =
      availableSort.key === null
        ? DEFAULT_AVAILABLE_SORT.direction
        : availableSort.direction;
    const direction = effectiveDirection === "asc" ? 1 : -1;
    return Object.values(players)
      .filter((player) => VALID_POSITIONS.includes(player.position))
      .filter((player) => !allRosteredPlayerIds.has(player.id))
      .filter((player) => !projectedPlayerIds.includes(player.id))
      .filter((player) => !query || player.name.toLowerCase().includes(query))
      .filter((player) => !positionFilter || player.position === positionFilter)
      .filter(
        (player) =>
          !affordableOnly ||
          getEstimatedSalary(player) <= projectedMaxSalaryValue,
      )
      .sort(
        (a, b) => direction * compareValues(a[key] ?? "", b[key] ?? ""),
      );
  }, [
    players,
    search,
    positionFilter,
    affordableOnly,
    projectedMaxSalaryValue,
    allRosteredPlayerIds,
    projectedPlayerIds,
    availableSort,
  ]);

  const handleAvailableSort = (key: AvailableSortKey) => {
    setAvailableSort((current) =>
      toggleSort(current, key, key === "salary" ? "desc" : "asc"),
    );
    setPage(0);
  };

  const rosterByeWeekCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    [...myRosterPlayers, ...projectedPlayers].map((player) => {
      if (player.bye) counts[player.bye] = (counts[player.bye] ?? 0) + 1;
      return null;
    });
    return counts;
  }, [myRosterPlayers, projectedPlayers]);

  const draftTargets = useMemo(() => {
    if (!myFranchise) return [];

    return Object.values(players)
      .filter((player) => DRAFT_TARGET_POSITIONS.includes(player.position))
      .filter((player) => player.team !== "FA")
      .filter((player) => !allRosteredPlayerIds.has(player.id))
      .filter((player) => !projectedPlayerIds.includes(player.id))
      .filter((player) => getEstimatedSalary(player) <= projectedMaxSalaryValue)
      .map((player) => {
        const requirement = ROSTER_REQUIREMENTS.find(
          (item) => item.position === player.position,
        );
        const rosteredCount = projectedPositionCounts[player.position] ?? 0;
        const fillsNeed = requirement ? rosteredCount < requirement.count : false;

        const ecrRank = getEcrRank(player);
        const ecrBonus = ecrRank ? 3 / (1 + ecrRank / 50) : 0;

        const byeCount = player.bye ? rosterByeWeekCounts[player.bye] ?? 0 : 0;
        const byePenalty = byeCount >= 2 ? 0.5 : 0;

        const score = (fillsNeed ? 2 : 0) + ecrBonus - byePenalty;

        return { player, fillsNeed, ecrRank, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [
    myFranchise,
    players,
    allRosteredPlayerIds,
    projectedPlayerIds,
    projectedMaxSalaryValue,
    projectedPositionCounts,
    rosterByeWeekCounts,
    ecrRankByNameAndPosition,
  ]);

  const pageCount = Math.max(
    1,
    Math.ceil(availablePlayers.length / PLAYERS_PER_PAGE),
  );
  const currentPage = Math.min(page, pageCount - 1);
  const pagedPlayers = availablePlayers.slice(
    currentPage * PLAYERS_PER_PAGE,
    currentPage * PLAYERS_PER_PAGE + PLAYERS_PER_PAGE,
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handlePositionFilterChange = (value: string) => {
    setPositionFilter(value);
    setPage(0);
  };

  const addProjectedPlayer = (id: string) => {
    setProjectedPlayerIds((current) => [...current, id]);
  };

  const removeProjectedPlayer = (id: string) => {
    setProjectedPlayerIds((current) => current.filter((playerId) => playerId !== id));
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
          {checkArray(res).map((franchise: any, index: any) => {
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

      <hr />

      <h3>My Team</h3>
      <Form.Group className="mb-3" controlId="myTeamSelect">
        <Form.Label>Select your team</Form.Label>
        <Form.Select
          value={myTeamId}
          onChange={(event) => handleMyTeamChange(event.target.value)}
        >
          <option value="">Choose a team...</option>
          {allTeams.map((teamName, index) => (
            <option key={teamName} value={String(index + 1)}>
              {teamName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {myTeamId && !myFranchise && (
        <p>
          No roster data loaded yet for this team. Click <b>Request</b> above
          to fetch the latest rosters.
        </p>
      )}

      {myFranchise !== undefined && (
        <React.Fragment>
          <Table bordered hover>
            <thead>
              <tr>
                <SortableHeader
                  label="Player"
                  sortKey="name"
                  sort={rosterSort}
                  onSort={handleRosterSort}
                />
                <SortableHeader
                  label="NFL Team"
                  sortKey="team"
                  sort={rosterSort}
                  onSort={handleRosterSort}
                />
                <SortableHeader
                  label="Position"
                  sortKey="position"
                  sort={rosterSort}
                  onSort={handleRosterSort}
                />
                <SortableHeader
                  label="Bye"
                  sortKey="bye"
                  sort={rosterSort}
                  onSort={handleRosterSort}
                />
                <SortableHeader
                  label="Salary"
                  sortKey="salary"
                  sort={rosterSort}
                  onSort={handleRosterSort}
                />
                <th></th>
              </tr>
            </thead>
            <tbody>
              {combinedRosterPlayers.map((player) => (
                <tr key={player.id}>
                  <td>
                    {player.name}
                    {player.isProjected === true && (
                      <>
                        {" "}
                        <span className="badge bg-secondary">Projected</span>
                      </>
                    )}
                  </td>
                  <td>{player.team}</td>
                  <td>{player.position}</td>
                  <td>{player.bye ?? "-"}</td>
                  <td>${player.salary.toFixed(2)}</td>
                  <td>
                    {player.isProjected === true && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => removeProjectedPlayer(player.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <p>
            Current Salary: ${currentSalary.toFixed(2)} &nbsp;|&nbsp;
            Salary: ${projectedTotalSalary.toFixed(2)} &nbsp;|&nbsp;
            Remaining Cap: ${projectedRemainingCap.toFixed(2)}
            <br />
            Max Cost (With Roster): {projectedMaxSalaryWithRoster}
            &nbsp;|&nbsp; Max Cost of Next Player: {projectedMaxSalary}
          </p>

          <h4>Suggested Draft Targets</h4>
          {draftTargets.length === 0 && (
            <p>
              No affordable targets found under your projected Max Cost of
              Next Player.
            </p>
          )}
          {draftTargets.length > 0 && (
            <Table bordered hover size="sm" className="mb-4">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>NFL Team</th>
                  <th>Position</th>
                  <th>Bye</th>
                  <th>Salary</th>
                  <th>Why</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {draftTargets.map(({ player, fillsNeed, ecrRank }) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.team}</td>
                    <td>{player.position}</td>
                    <td>{player.bye ?? "-"}</td>
                    <td>
                      {player.salary !== null
                        ? `$${player.salary.toFixed(2)}`
                        : `~$${getEstimatedSalary(player).toFixed(2)} (est.)`}
                    </td>
                    <td>
                      {fillsNeed && (
                        <span className="badge bg-primary me-1">
                          Fills Need
                        </span>
                      )}
                      {ecrRank !== null && (
                        <span className="badge bg-success">
                          Rank #{ecrRank}
                        </span>
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        onClick={() => addProjectedPlayer(player.id)}
                      >
                        Add
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <h4>Players Available to Project</h4>
          <div className="d-flex gap-2 mb-2">
            <Form.Control
              type="text"
              placeholder="Search for a player by name..."
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
            <Form.Select
              value={positionFilter}
              onChange={(event) => handlePositionFilterChange(event.target.value)}
              style={{ maxWidth: "150px" }}
            >
              <option value="">All Positions</option>
              {VALID_POSITIONS.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </Form.Select>
            <Form.Check
              type="checkbox"
              id="affordableOnlyCheck"
              label="Affordable only"
              checked={affordableOnly}
              onChange={(event) => {
                setAffordableOnly(event.target.checked);
                setPage(0);
              }}
              className="text-nowrap align-self-center"
            />
          </div>

          <Table bordered hover className="mt-2">
            <thead>
              <tr>
                <SortableHeader
                  label="Player"
                  sortKey="name"
                  sort={availableSort}
                  onSort={handleAvailableSort}
                />
                <SortableHeader
                  label="NFL Team"
                  sortKey="team"
                  sort={availableSort}
                  onSort={handleAvailableSort}
                />
                <SortableHeader
                  label="Position"
                  sortKey="position"
                  sort={availableSort}
                  onSort={handleAvailableSort}
                />
                <SortableHeader
                  label="Bye"
                  sortKey="bye"
                  sort={availableSort}
                  onSort={handleAvailableSort}
                />
                <SortableHeader
                  label="Salary"
                  sortKey="salary"
                  sort={availableSort}
                  onSort={handleAvailableSort}
                />
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pagedPlayers.map((player) => {
                const estimatedSalary = getEstimatedSalary(player);
                const isUnaffordable = estimatedSalary > projectedMaxSalaryValue;
                return (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.team}</td>
                    <td>{player.position}</td>
                    <td>{player.bye ?? "-"}</td>
                    <td
                      style={
                        isUnaffordable
                          ? { backgroundColor: "#f8d7da" }
                          : undefined
                      }
                    >
                      {player.salary !== null
                        ? `$${player.salary.toFixed(2)}`
                        : `~$${estimatedSalary.toFixed(2)} (est.)`}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        onClick={() => addProjectedPlayer(player.id)}
                      >
                        Add
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <div className="d-flex align-items-center gap-2">
            <Button
              size="sm"
              variant="outline-secondary"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage + 1} of {pageCount}
            </span>
            <Button
              size="sm"
              variant="outline-secondary"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
