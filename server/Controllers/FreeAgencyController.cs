using server.Models;
using Microsoft.AspNetCore.Mvc;

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
                CreateRam()
            };
            return Teams;
        }

        public static LinkedList<Player> GetPlayers()
        {
            var players = new LinkedList<Player>();

            var ChristianMcCaffrey = new Player(
                "Christian McCaffrey",
                "christian-mccaffrey.jpeg",
                Teams.Ram,
                "49ers",
                "RB",
                32.00,
                1,
                22.36,
                28
            );
            var JonathonTaylor = new Player(
                "Jonathon Taylor",
                "jonathon-taylor.jpeg",
                Teams.StormDynasty,
                "Colts",
                "RB",
                7.50,
                33,
                14.69,
                25
            );
            var TonyPollard = new Player(
                "Tony Pollard",
                "tony-pollard.jpeg",
                Teams.PigeonBoys,
                "Titans",
                "RB",
                11.02,
                15,
                11.48,
                27
            );
            var SaquonBarkley = new Player(
                "Saquon Barkley",
                "saquon-barkley.jpeg",
                Teams.Homelander,
                "Eagles",
                "RB",
                11.50,
                12,
                14.48,
                27
            );
            var AmonRaStBrown = new Player(
                "Amon Ra St. Brown",
                "amon-ra.jpeg",
                Teams.Power,
                "Lions",
                "WR",
                8.91,
                3,
                16.96,
                24
            );
            var SamLaPorta = new Player(
                "Sam LaPorta",
                "sam-laporta.jpeg",
                Teams.Yellowstone,
                "Lions",
                "TE",
                7.00,
                1,
                11.53,
                23
            );
            var KyrenWilliams = new Player(
                "Kyren Williams",
                "kyren-williams.jpeg",
                Teams.Ram,
                "Rams",
                "RB",
                7.00,
                6,
                19.92,
                24
            );
            var PukaNacua = new Player(
                "Puka Nacua",
                "puka-nacua.jpeg",
                Teams.Power,
                "Rams",
                "WR",
                7.00,
                4,
                14.47,
                23
            );

            players.AddLast(ChristianMcCaffrey);
            players.AddLast(JonathonTaylor);
            players.AddLast(TonyPollard);
            players.AddLast(SaquonBarkley);
            players.AddLast(AmonRaStBrown);
            players.AddLast(SamLaPorta);
            players.AddLast(KyrenWilliams);
            players.AddLast(PukaNacua);

            return players;
        }

        private static Team CreateYellowstone()
        {
            var players = new List<Player>
            {
                new("DeVonta Smith", 10.00, 1),
                new("Mark Andrews", 13.50, 1),
            };

            return new Team(Teams.Yellowstone, 8.40, players);
        }

        private static Team CreateTheHomelander()
        {
            var players = new List<Player>() {
                new("Kenneth Walker III", 16.50, 1),
                new("Ja'Marr Chase", 14.50, 2),
                new("Tyreek Hill", 26.00, 1),
            };

            return new Team(Teams.Homelander, 0, players);
        }

        private static Team CreatePigeonBoys()
        {
            var players = new List<Player>
            {
                new("Kyle Pitts", 12.50, 2),
            };

            return new Team(Teams.PigeonBoys, 12.43, players);
        }

        private static Team CreateDactyls()
        {
            var players = new List<Player>
            {
                new("Bijan Robinson", 12.60, 3),
                new("Javonte Williams", 23.00, 1),
            };

            return new Team(Teams.Dactyls, 10.15, players);
        }

        private static Team CreateODBs()
        {
            var players = new List<Player>
            {
                new("Josh Allen", 24.00, 1),
                new("Josh Jacobs", 13.50, 2),
                new("Justin Jefferson", 18.00, 1),
                new("Jaylen Waddle", 12.50, 3),
            };

            return new Team(Teams.ODBs, 0, players);
        }

        private static Team CreateStormDynasty()
        {
            var players = new List<Player>
            {
                new("Patrick Mahommes", 27.00, 1),
                new("CeeDee Lamb", 13.00, 1),
                new("Travis Kelce", 22.00, 1),
            };

            return new Team(Teams.StormDynasty, 0, players);
        }

        private static Team CreateBenchwarmers()
        {
            var players = new List<Player>
            {
                new("Derrick Henry", 31.00, 2),
            };

            return new Team(Teams.Benchwarmers, 0, players);
        }

        private static Team CreateGorillas()
        {
            var players = new List<Player> {
                new("Joe Burrow", 21.00, 1),
                new("Najee Harris", 8.21, 1),
                new("Garrett Wilson", 20.50, 1),
            };

            return new Team(Teams.Gorillas, 4.41, players);
        }

        private static Team CreatePower()
        {
            var players = new List<Player>
            {
                new("Travis Etienne", 12.00, 2),
                new("Jahmyr Gibbs", 7.80, 3),
                new("Breece Hall", 10.00, 3),
            };

            return new Team(Teams.Power, 7.35, players);
        }

        private static Team CreateRam()
        {
            var players = new List<Player>
            {
                new("Jalen Hurts", 25.00, 1),
            };

            return new Team(Teams.Ram, 0, players);
        }
    }
}
