using Microsoft.AspNetCore.Mvc;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/v1/freeagency")]
    public class FreeAgencyController : ControllerBase
    {
        public static HashSet<Team> GetTeams()
        {
            var Teams = new HashSet<Team>
            {
                CreateYellowstone(),
                CreateTheHomelander(),
                CreatePigeonBoys(),
                CreateDactyls(),
                CreateODBs(),
                CreateStormDynasty(),
                CreateBenchwarmers(),
                CreateGorillas(),
                CreatePower(),
                CreateRam(),
            };
            return Teams;
        }

        public static LinkedList<Player> GetPlayers()
        {
            var players = new LinkedList<Player>();

            players.AddLast(
                new Player(
                    "Ladd McConkey",
                    "ladd-mcconkey.jpg",
                    Teams.Gorillas,
                    "Chargers",
                    "WR",
                    7.00,
                    13,
                    12.49,
                    23
                )
            );
            players.AddLast(
                new Player(
                    "Josh Allen",
                    "josh-allen.webp",
                    Teams.ODBs,
                    "Bills",
                    "QB",
                    24.00,
                    4,
                    29.75,
                    29
                )
            );
            players.AddLast(
                new Player(
                    "Courtland Sutton",
                    "courtland-sutton.jpg",
                    Teams.Dactyls,
                    "Broncos",
                    "WR",
                    7.00,
                    11,
                    11.85,
                    29
                )
            );
            players.AddLast(
                new Player(
                    "Justin Jefferson",
                    "justin-jefferson.webp",
                    Teams.ODBs,
                    "Vikings",
                    "WR",
                    18.00,
                    2,
                    15.67,
                    26
                )
            );
            players.AddLast(
                new Player(
                    "Drake London",
                    "drake-london.webp",
                    Teams.Ram,
                    "Falcons",
                    "WR",
                    8.74,
                    5,
                    13.58,
                    24
                )
            );
            players.AddLast(
                new Player(
                    "Kenneth Walker",
                    "kenneth-walker.jpg",
                    Teams.Homelander,
                    "Seahawks",
                    "RB",
                    16.50,
                    28,
                    14.38,
                    24
                )
            );
            players.AddLast(
                new Player(
                    "Brock Bowers",
                    "brock-bowers.jpg",
                    Teams.Power,
                    "Raiders",
                    "TE",
                    7.00,
                    1,
                    12.16,
                    22
                )
            );
            players.AddLast(
                new Player(
                    "De'Von Achane",
                    "devon-achane.webp",
                    Teams.ODBs,
                    "Dolphins",
                    "RB",
                    8.79,
                    6,
                    15.35,
                    23
                )
            );
            players.AddLast(
                new Player(
                    "James Cook",
                    "james-cook.webp",
                    Teams.Homelander,
                    "Bills",
                    "RB",
                    8.21,
                    8,
                    15.67,
                    25
                )
            );
            players.AddLast(
                new Player(
                    "George Kittle",
                    "george-kittle.webp",
                    Teams.PigeonBoys,
                    "49ers",
                    "TE",
                    7.00,
                    2,
                    13.17,
                    31
                )
            );
            players.AddLast(
                new Player(
                    "Jayden Daniels",
                    "jayden-daniels.webp",
                    Teams.Yellowstone,
                    "Commanders",
                    "QB",
                    14.38,
                    6,
                    28.40,
                    24
                )
            );
            players.AddLast(
                new Player(
                    "Ceedee Lamb",
                    "ceedee-lamb.jpg",
                    Teams.StormDynasty,
                    "Cowboys",
                    "WR",
                    13.00,
                    8,
                    14.20,
                    26
                )
            );
            players.AddLast(
                new Player(
                    "Brian Thomas Jr.",
                    "brian-thomas.webp",
                    Teams.PigeonBoys,
                    "Jaguars",
                    "WR",
                    7.00,
                    4,
                    14.15,
                    22
                )
            );
            players.AddLast(
                new Player(
                    "Nico Collins",
                    "nico-collins.jpeg",
                    Teams.Power,
                    "Texans",
                    "WR",
                    7.80,
                    22,
                    14.72,
                    26
                )
            );
            players.AddLast(
                new Player(
                    "Bucky Irving",
                    "bucky-irving.webp",
                    Teams.Benchwarmers,
                    "Buccaneers",
                    "RB",
                    7.00,
                    14,
                    13.00,
                    23
                )
            );
            players.AddLast(
                new Player(
                    "Jalen Hurts",
                    "jalen-hurts.webp",
                    Teams.Ram,
                    "Eagles",
                    "QB",
                    25.00,
                    12,
                    27.45,
                    27
                )
            );
            players.AddLast(
                new Player(
                    "Joe Burrow",
                    "joe-burrow.jpg",
                    Teams.Gorillas,
                    "Bengals",
                    "QB",
                    21.00,
                    2,
                    32.77,
                    28
                )
            );
            players.AddLast(
                new Player(
                    "Lamar Jackson",
                    "lamar-jackson.jpg",
                    Teams.Benchwarmers,
                    "Ravens",
                    "QB",
                    17.05,
                    1,
                    33.90,
                    28
                )
            );

            return players;
        }

        private static Team CreateYellowstone()
        {
            var players = new List<Player>
            {
                new("Jonathan Taylor", 22.00, 1),
                new("Sam LaPorta", 14.00, 1),
            };

            return new Team(Teams.Yellowstone, 0, players);
        }

        private static Team CreateTheHomelander()
        {
            var players = new List<Player>() { new("Ja'Marr Chase", 14.50, 1) };

            return new Team(Teams.Homelander, 4.03, players);
        }

        private static Team CreatePigeonBoys()
        {
            var players = new List<Player>();

            return new Team(Teams.PigeonBoys, 4.38, players);
        }

        private static Team CreateDactyls()
        {
            var players = new List<Player>
            {
                new("Bo Nix", 7.23, 3),
                new("Bijan Robinson", 12.60, 2),
                new("Saquon Barkley", 22.00, 1),
            };

            return new Team(Teams.Dactyls, 0, players);
        }

        private static Team CreateODBs()
        {
            var players = new List<Player> { new("Josh Jacobs", 13.50, 1) };

            return new Team(Teams.ODBs, 4.38, players);
        }

        private static Team CreateStormDynasty()
        {
            var players = new List<Player> { new("Malik Nabers", 7.00, 2) };

            return new Team(Teams.StormDynasty, 0, players);
        }

        private static Team CreateBenchwarmers()
        {
            var players = new List<Player>
            {
                new("Derrick Henry", 31.00, 1),
                new("Puka Nacua", 10.00, 2),
            };

            return new Team(Teams.Benchwarmers, 0, players);
        }

        private static Team CreateGorillas()
        {
            var players = new List<Player>
            {
                new("Marvin Harrison Jr.", 9.51, 3),
                new("Amon-Ra St. Brown", 19.00, 1),
            };

            return new Team(Teams.Gorillas, 0, players);
        }

        private static Team CreatePower()
        {
            var players = new List<Player>
            {
                new("Jahmyr Gibbs", 7.80, 2),
                new("Breece Hall", 10.00, 2),
            };

            return new Team(Teams.Power, 4.20, players);
        }

        private static Team CreateRam()
        {
            var players = new List<Player>
            {
                new("Christian McCaffrey", 35.00, 1),
                new("Kyren Williams", 15.00, 1),
            };

            return new Team(Teams.Ram, 0, players);
        }
    }
}
