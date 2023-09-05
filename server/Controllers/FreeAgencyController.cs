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

            var TravisKelce = new Player(
                "Travis Kelce",
                "travis-kelce.jpg",
                Teams.StormDynasty,
                "Chiefs",
                "TE",
                19.00,
                1,
                15.37,
                33
            );
            var BreeceHall = new Player(
                "Breece Hall",
                "breece-hall.webp",
                Teams.Power,
                "Jets",
                "RB",
                7.25,
                42,
                15.09,
                22
            );
            var GarrettWilson = new Player(
                "Garrett Wilson",
                "garrett-wilson.webp",
                Teams.Gorillas,
                "Jets",
                "WR",
                7.00,
                19,
                10.25,
                23
            );
            var JoshJacobs = new Player(
                "Josh Jacobs",
                "josh-jacobs.png",
                Teams.Homelander,
                "Raiders",
                "RB",
                7.00,
                3,
                17.75,
                25
            );
            var NickChubb = new Player(
                "Nick Chubb",
                "nick-chubb.png",
                Teams.Benchwarmers,
                "Browns",
                "RB",
                10.51,
                5,
                15.76,
                27
            );
            var StefonDiggs = new Player(
                "Stefon Diggs",
                "stefon-diggs.jpg",
                Teams.PigeonBoys,
                "Bills",
                "WR",
                10.25,
                4,
                16.41,
                29
            );
            var TyreekHill = new Player(
                "Tyreek Hill",
                "tyreek-hill.jpg",
                Teams.StormDynasty,
                "Dolphins",
                "WR",
                9.51,
                2,
                16.92,
                29
            );
            var JaylenWaddle = new Player(
                "Jaylen Waddle",
                "jaylen-waddle.jpg",
                Teams.ODBs,
                "Dolphins",
                "WR",
                7.23,
                7,
                13.04,
                24
            );
            var CalvinRidley = new Player(
                "Calvin Ridley",
                "calvin-ridley.jpeg",
                "None",
                "Jaguars",
                "WR",
                7.00,
                0,
                0,
                28
            );
            var GeorgeKittle = new Player(
                "George Kittle",
                "george-kittle.webp",
                Teams.Dactyls,
                "49ers",
                "TE",
                14.00,
                3,
                11.37,
                29
            );
            var JalenHurts = new Player(
                "Jalen Hurts",
                "jalen-hurts.jpg",
                Teams.Ram,
                "Eagles",
                "QB",
                16.13,
                4,
                33.22,
                25
            );
            var JoeBurrow = new Player(
                "Joe Burrow",
                "joe-burrow.jpg",
                Teams.Gorillas,
                "Bengals",
                "QB",
                15.32,
                3,
                32.08,
                26
            );
            var AaronJones = new Player(
                "Aaron Jones",
                "aaron-jones.webp",
                Teams.Yellowstone,
                "Packers",
                "RB",
                15.00,
                9,
                12.89,
                28
            );
            var DevontaSmith = new Player(
                "Devonta Smith",
                "devonta-smith.webp",
                Teams.Yellowstone,
                "Eagles",
                "WR",
                7.00,
                9,
                12.18,
                24
            );
            var RhamondreStevenson = new Player(
                "Rhamondre Stevenson",
                "rhamondre-stevenson.jpg",
                Teams.ODBs,
                "Patriots",
                "RB",
                7.00,
                11,
                12.62,
                25
            );
            var DonovanPeoplesJones = new Player(
                "Donovan Peoples-Jones",
                "donovan-peoples-jones.jpg",
                Teams.Benchwarmers,
                "Browns",
                "WR",
                7.00,
                40,
                8.04,
                24
            );
            var KenWalker = new Player(
                "Ken Walker",
                "ken-walker.webp",
                Teams.Homelander,
                "Seahawks",
                "RB",
                7.00,
                16,
                12.60,
                22
            );

            players.AddLast(TravisKelce);
            players.AddLast(NickChubb);
            players.AddLast(JoshJacobs);
            players.AddLast(GeorgeKittle);
            players.AddLast(JalenHurts);
            players.AddLast(JoeBurrow);
            players.AddLast(JaylenWaddle);
            players.AddLast(CalvinRidley);
            players.AddLast(AaronJones);
            players.AddLast(TyreekHill);
            players.AddLast(BreeceHall);
            players.AddLast(StefonDiggs);
            players.AddLast(DevontaSmith);
            players.AddLast(RhamondreStevenson);
            players.AddLast(DonovanPeoplesJones);
            players.AddLast(KenWalker);
            players.AddLast(GarrettWilson);

            return players;
        }

        private static Team CreateYellowstone()
        {
            var players = new List<Player>
            {
                new("J.K. Dobbins", 7.00, 1),
                new("Mark Andrews", 13.50, 2),
            };

            return new Team(Teams.Yellowstone, 6.48, players);
        }

        private static Team CreateTheHomelander()
        {
            var players = new List<Player>() {
                new("Saquon Barkley", 11.50, 1),
                new("Ja'Marr Chase", 14.50, 3),
            };

            return new Team(Teams.Homelander, 5.95, players);
        }

        private static Team CreatePigeonBoys()
        {
            var players = new List<Player>
            {
                new("Justin Herbert", 11.50, 2),
                new("D'Andre Swift", 12.00, 1),
                new("Kyle Pitts", 12.50, 3),
            };

            return new Team(Teams.PigeonBoys, 0, players);
        }

        private static Team CreateDactyls()
        {
            var players = new List<Player>
            {
                new("Austin Ekeler", 29.00, 2),
                new("Javonte Williams", 23.00, 2),
            };

            return new Team(Teams.Dactyls, 0, players);
        }

        private static Team CreateODBs()
        {
            var players = new List<Player>
            {
                new("Josh Allen", 24.00, 2),
                new("Justin Jefferson", 18.00, 2),
            };

            return new Team(Teams.ODBs, 7.19, players);
        }

        private static Team CreateStormDynasty()
        {
            var players = new List<Player>
            {
                new("Patrick Mahommes", 27.00, 2),
                new("Jonathan Taylor", 7.50, 1),
                new("CeeDee Lamb", 13.00, 2),
            };

            return new Team(Teams.StormDynasty, 0, players);
        }

        private static Team CreateBenchwarmers()
        {
            var players = new List<Player>
            {
                new("Derrick Henry", 31.00, 3),
                new("Mike Williams", 7.00, 1),
            };

            return new Team(Teams.Benchwarmers, 8.05, players);
        }

        private static Team CreateGorillas()
        {
            var players = new List<Player> {
                new("Najee Harris", 8.21, 2),
                new("Tee Higgins", 8.74, 1),
            };

            return new Team(Teams.Gorillas, 10.07, players);
        }

        private static Team CreatePower()
        {
            var players = new List<Player>
            {
                new("Travis Etienne", 12.00, 3),
            };

            return new Team(Teams.Power, 7.35, players);
        }

        private static Team CreateRam()
        {
            var players = new List<Player>
            {
                new("Christian McCaffrey", 32.00, 1),
                new("A.J. Brown", 9.79, 1),
                new("Cooper Cupp", 12.62, 1),
            };

            return new Team(Teams.Ram, 0, players);
        }
    }
}
