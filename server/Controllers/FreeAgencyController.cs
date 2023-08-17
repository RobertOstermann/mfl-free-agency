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
            HashSet<Team> Teams = new HashSet<Team>
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

            var TravisEtienne = new Player(
                "Travis Etienne",
                "Power",
                "Jaguars",
                "RB",
                7.00,
                0,
                0,
                23
            );
            var MikeEvans = new Player(
                "Mike Evans",
                "Benchwarmers",
                "Buccaneers",
                "WR",
                8.22,
                10,
                13.44,
                29
            );
            var LeonardFournette = new Player(
                "Leonard Fournette",
                "Homelander",
                "Buccaneers",
                "RB",
                7.00,
                6,
                15.80,
                27
            );
            var AustinEkler = new Player(
                "Austin Ekeler",
                "Gorillas",
                "Chargers",
                "RB",
                17.50,
                2,
                19.23,
                27
            );
            var JMarrChase = new Player(
                "J'Marr Chase",
                "jmarr-chase.jpg",
                "Homelander",
                "Bengals",
                "WR",
                7.00,
                4,
                16.41,
                22
            );
            var MarkAndrews = new Player(
                "Mark Andrews",
                "mark-andrews.jpg",
                "Power",
                "Ravens",
                "TE",
                7.00,
                1,
                14.70,
                27
            );
            var CeedeeLamb = new Player(
                "Ceedee Lamb",
                "Storm Dynasty",
                "Cowboys",
                "WR",
                8.48,
                15,
                12.52,
                23
            );
            var MikeWilliams = new Player(
                "Mike Williams",
                "mike-williams.jpg",
                "Benchwarmers",
                "Chargers",
                "WR",
                7.00,
                16,
                12.41,
                27
            );
            var SaquonBarkley = new Player(
                "Saquon Barkley",
                "Power",
                "Giants",
                "RB",
                11.02,
                32,
                9.52,
                25
            );
            var JavonteWilliams = new Player(
                "Javonte Williams",
                "Gorillas",
                "Broncos",
                "RB",
                7.00,
                16,
                11.13,
                22
            );
            var KylePitts = new Player(
                "Kyle Pitts",
                "Pigeon Boys",
                "Falcons",
                "TE",
                7.00,
                5,
                8.80,
                21
            );
            var JamesConnor = new Player(
                "James Connor",
                "Homelander",
                "Cardinals",
                "RB",
                7.00,
                7,
                15.35,
                27
            );
            var PatrickMahomes = new Player(
                "Patrick Mahomes",
                "Storm Dynasty",
                "Chiefs",
                "QB",
                27.00,
                4,
                32.43,
                26
            );
            var DerrickHenry = new Player(
                "Derrick Henry",
                "Pigeon Boys",
                "Titans",
                "RB",
                21.50,
                13,
                23.20,
                28
            );

            players.AddLast(TravisEtienne);
            players.AddLast(MikeEvans);
            players.AddLast(LeonardFournette);
            players.AddLast(AustinEkler);
            players.AddLast(JMarrChase);
            players.AddLast(MarkAndrews);
            players.AddLast(CeedeeLamb);
            players.AddLast(MikeWilliams);
            players.AddLast(SaquonBarkley);
            players.AddLast(JavonteWilliams);
            players.AddLast(KylePitts);
            players.AddLast(JamesConnor);
            players.AddLast(PatrickMahomes);
            players.AddLast(DerrickHenry);

            return players;
        }

        private static Team CreateYellowstone()
        {
            var players = new List<Player>
            {
                new Player("J.K. Dobbins", 7.00, 2),
                new Player("Aaron Jones", 15.00, 1),
                new Player("Joe Mixon", 21.00, 1),
            };

            return new Team("Yellowstone", 6.48, players);
        }

        private static Team CreateTheHomelander()
        {
            var players = new List<Player>() { new Player("Dalvin Cook", 26.50, 1), };

            return new Team("The Homelander", 12.11, players);
        }

        private static Team CreatePigeonBoys()
        {
            var players = new List<Player>
            {
                new Player("Justin Herbert", 11.50, 3),
                new Player("D'Andre Swift", 12.00, 2),
            };

            return new Team("Pigeon Boys", 2.45, players);
        }

        private static Team CreateDactyls()
        {
            var players = new List<Player>
            {
                new Player("Alvin Kamara", 12.60, 3),
                new Player("Christian McCaffrey", 32.00, 2),
                new Player("George Kittle", 14.00, 1),
            };

            return new Team("Dactyls", 0, players);
        }

        private static Team CreateODBs()
        {
            var players = new List<Player>
            {
                new Player("Josh Allen", 24.00, 3),
                new Player("Chris Godwin", 18.50, 1),
                new Player("Justin Jefferson", 18.00, 3),
            };

            return new Team("ODBs", 3.86, players);
        }

        private static Team CreateStormDynasty()
        {
            var players = new List<Player>
            {
                new Player("Jonathan Taylor", 7.50, 2),
                new Player("Travis Kelce", 19.00, 1),
            };

            return new Team("Storm Dynasty", 0, players);
        }

        private static Team CreateBenchwarmers()
        {
            var players = new List<Player>();

            return new Team("Benchwarmers", 12.08, players);
        }

        private static Team CreateGorillas()
        {
            var players = new List<Player> { new Player("DK Metcalf", 7.23, 1), };

            return new Team("Gorillas", 0, players);
        }

        private static Team CreatePower()
        {
            var players = new List<Player>
            {
                new Player("Lamar Jackson", 28.00, 1),
                new Player("Antonio Gibson", 21.00, 3),
                new Player("Davante Adams", 25.00, 1),
            };

            return new Team("Power", 0, players);
        }

        private static Team CreateRam()
        {
            var players = new List<Player>
            {
                new Player("Najee Harris", 8.21, 3),
                new Player("A.J. Brown", 9.79, 2),
            };

            return new Team("Ram", 10.33, players);
        }
    }
}
