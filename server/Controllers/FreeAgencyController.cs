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
                    "Jaylen Waddle",
                    "jaylen-waddle.jpg",
                    Teams.Ram,
                    "Broncos",
                    "WR",
                    7.23,
                    22,
                    10.15,
                    27
                )
            );
            players.AddLast(
                new Player(
                    "Ja'Marr Chase",
                    "jamarr-chase.jpeg",
                    Teams.Homelander,
                    "Bengals",
                    "WR",
                    14.50,
                    4,
                    16.74,
                    26
                )
            );
            players.AddLast(
                new Player(
                    "Amon-Ra St. Brown",
                    "amon-ra-st-brown.jpg",
                    Teams.Dactyls,
                    "Lions",
                    "WR",
                    19.00,
                    3,
                    16.59,
                    26
                )
            );
            players.AddLast(
                new Player(
                    "Javonte Williams",
                    "javonte-williams.jpg",
                    Teams.Gorillas,
                    "Cowboys",
                    "RB",
                    7.00,
                    11,
                    14.08,
                    26
                )
            );
            players.AddLast(
                new Player(
                    "Quinshon Judkins",
                    "quinshon-judkins.jpeg",
                    Teams.Homelander,
                    "Browns",
                    "RB",
                    7.00,
                    26,
                    11.20,
                    22
                )
            );
            players.AddLast(
                new Player(
                    "George Pickens",
                    "george-pickens.webp",
                    Teams.ODBs,
                    "Cowboys",
                    "WR",
                    7.13,
                    5,
                    15.34,
                    25
                )
            );
            players.AddLast(
                new Player(
                    "Drake Maye",
                    "drake-maye.webp",
                    Teams.Power,
                    "Patriots",
                    "QB",
                    13.77,
                    2,
                    31.07,
                    23
                )
            );
            players.AddLast(
                new Player(
                    "Christian McCaffrey",
                    "christian-mccaffrey.jpg",
                    Teams.Ram,
                    "49ers",
                    "RB",
                    35.50,
                    1,
                    22.85,
                    30
                )
            );
            players.AddLast(
                new Player(
                    "Chase Brown",
                    "chase-brown.webp",
                    Teams.Gorillas,
                    "Bengals",
                    "RB",
                    8.55,
                    8,
                    15.51,
                    26
                )
            );
            players.AddLast(
                new Player(
                    "Tyler Warren",
                    "tyler-warren.jpg",
                    Teams.ODBs,
                    "Colts",
                    "TE",
                    7.00,
                    5,
                    9.41,
                    24
                )
            );
            players.AddLast(
                new Player(
                    "Derrick Henry",
                    "derrick-henry.jpeg",
                    Teams.Benchwarmers,
                    "Ravens",
                    "RB",
                    31.00,
                    7,
                    17.00,
                    32
                )
            );
            players.AddLast(
                new Player(
                    "Joe Burrow",
                    "joe-burrow.jpg",
                    Teams.StormDynasty,
                    "Bengals",
                    "QB",
                    16.50,
                    29,
                    29.16,
                    29
                )
            );
            players.AddLast(
                new Player(
                    "Trey McBride",
                    "trey-mcbride.jpeg",
                    Teams.Benchwarmers,
                    "Cardinals",
                    "TE",
                    7.06,
                    1,
                    15.81,
                    26
                )
            );
            players.AddLast(
                new Player(
                    "Saquon Barkley",
                    "saquon-barkley.jpg",
                    Teams.Dactyls,
                    "Eagles",
                    "RB",
                    22.00,
                    14,
                    13.36,
                    29
                )
            );

            return players;
        }

        private static Team CreateYellowstone()
        {
            var players = new List<Player>
            {
                new("Bucky Irving", 16.00, 2),
                new("Omarion Hampton", 8.21, 2),
            };

            return new Team(Teams.Yellowstone, 3.99, players);
        }

        private static Team CreateTheHomelander()
        {
            var players = new List<Player>
            {
                new("James Cook", 11.00, 2),
                new("Travis Hunter", 7.00, 3),
            };

            return new Team(Teams.Homelander, 0, players);
        }

        private static Team CreatePigeonBoys()
        {
            var players = new List<Player>
            {
                new("Brian Thomas Jr.", 15.00, 3),
                new("Ashton Jeanty", 11.02, 2),
                new("Emeka Egbuka", 7.00, 3),
            };

            return new Team(Teams.PigeonBoys, 3.15, players);
        }

        private static Team CreateDactyls()
        {
            var players = new List<Player>
            {
                new("Bijan Robinson", 12.60, 1),
                new("Bo Nix", 7.23, 2),
            };

            return new Team(Teams.Dactyls, 2.45, players);
        }

        private static Team CreateODBs()
        {
            var players = new List<Player>
            {
                new("De'Von Achane", 20.50, 2),
                new("Ladd McConkey", 9.00, 3),
                new("Jaxon Smith-Njigba", 8.22, 3),
            };

            return new Team(Teams.ODBs, 4.38, players);
        }

        private static Team CreateStormDynasty()
        {
            var players = new List<Player>
            {
                new("CeeDee Lamb", 23.50, 2),
                new("Jayden Daniels", 22.00, 3),
                new("Malik Nabers", 7.00, 1),
            };

            return new Team(Teams.StormDynasty, 0, players);
        }

        private static Team CreateBenchwarmers()
        {
            var players = new List<Player>
            {
                new("Lamar Jackson", 19.00, 3),
                new("Puka Nacua", 10.00, 1),
                new("RJ Harvey", 7.00, 3),
            };

            return new Team(Teams.Benchwarmers, 0, players);
        }

        private static Team CreateGorillas()
        {
            var players = new List<Player>
            {
                new("Josh Allen", 25.00, 2),
                new("Nico Collins", 18.00, 2),
            };

            return new Team(Teams.Gorillas, 3.33, players);
        }

        private static Team CreatePower()
        {
            var players = new List<Player>
            {
                new("Justin Jefferson", 25.00, 2),
                new("Brock Bowers", 19.00, 2),
                new("Breece Hall", 10.00, 1),
                new("Jahmyr Gibbs", 7.80, 1),
            };

            return new Team(Teams.Power, 0, players);
        }

        private static Team CreateRam()
        {
            var players = new List<Player>
            {
                new("Drake London", 15.50, 2),
                new("TreVeyon Henderson", 7.00, 2),
            };

            return new Team(Teams.Ram, 0, players);
        }
    }
}
