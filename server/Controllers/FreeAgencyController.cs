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

            var AmonRaStBrown = new Player(
                "Amon-Ra St. Brown",
                "amon-ra-st-brown.jpg",
                Teams.Homelander,
                "Lions",
                "WR",
                7.00,
                0,
                0,
                23
            );
            var BreeceHall = new Player(
                "Breece Hall",
                "breece-hall.webp",
                Teams.Power,
                "Jets",
                "RB",
                7.25,
                0,
                0,
                22
            );
            var GarrettWilson = new Player(
                "Garrett Wilson",
                "garrett-wilson.webp",
                Teams.Gorillas,
                "Jets",
                "WR",
                7.00,
                0,
                0,
                23
            );
            var JoshJacobs = new Player(
                "Josh Jacobs",
                "josh-jacobs.png",
                Teams.Homelander,
                "Raiders",
                "RB",
                7.00,
                0,
                0,
                25
            );
            var NickChubb = new Player(
                "Nick Chubb",
                "nick-chubb.png",
                Teams.Benchwarmers,
                "Browns",
                "RB",
                10.51,
                0,
                0,
                27
            );
            var StefonDiggs = new Player(
                "Stefon Diggs",
                "stefon-diggs.jpg",
                Teams.PigeonBoys,
                "Bills",
                "WR",
                7.00,
                0,
                0,
                29
            );
            var TonyPollard = new Player(
                "Tony Pollard",
                "tony-pollard.webp",
                Teams.Ram,
                "Cowboys",
                "RB",
                7.00,
                0,
                0,
                26
            );
            var TravisKelce = new Player(
                "Travis Kelce",
                "travis-kelce.jpg",
                Teams.Power,
                "Chiefs",
                "TE",
                19.00,
                0,
                0,
                33
            );
            var TyreekHill = new Player(
                "Tyreek Hill",
                "tyreek-hill.jpg",
                Teams.StormDynasty,
                "Dolphins",
                "WR",
                9.51,
                0,
                0,
                29
            );

            players.AddLast(AmonRaStBrown);
            players.AddLast(BreeceHall);
            players.AddLast(GarrettWilson);
            players.AddLast(JoshJacobs);
            players.AddLast(NickChubb);
            players.AddLast(StefonDiggs);
            players.AddLast(TonyPollard);
            players.AddLast(TravisKelce);
            players.AddLast(TyreekHill);

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
                new("Mike Evans", 9.00, 1),
                new("Mike Williams", 7.00, 1),
            };

            return new Team(Teams.Benchwarmers, 4.90, players);
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
