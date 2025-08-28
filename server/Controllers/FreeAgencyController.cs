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
            var players = new List<Player> { new("Marvin Harrison Jr.", 9.51, 3) };

            return new Team(Teams.Gorillas, 0, players);
        }

        private static Team CreatePower()
        {
            var players = new List<Player>
            {
                new("Jahmyr Gibbs", 7.80, 2),
                new("Breece Hall", 10.00, 2),
                new("Amon-Ra St. Brown", 19.00, 1),
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
