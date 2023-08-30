namespace server.Models
{
    public class Player
    {
        public string Name { get; set; } = null!;

        public string Src { get; set; } = null!;

        public string MflTeam { get; set; } = null!;

        public string OriginalRights { get; set; } = null!;

        public string NflTeam { get; set; } = null!;

        public string Position { get; set; } = null!;

        public int Age { get; set; } = 0;

        public double Salary { get; set; } = 7.00;

        public double OriginalSalary { get; set; } = 7.00;

        public int ContractYears { get; set; } = 0;

        public int ContractDate => ContractYears + DateTime.Now.Year - 1;

        public int PreviousRank { get; set; } = 0;

        public double PreviousAverage { get; set; } = 0;

        public bool Signed { get; set; } = false;

        /// <summary>
        /// Rostered player.
        /// </summary>
        /// <param name="player">Player name of id</param>
        /// <param name="salary">Salary</param>
        /// <param name="years">Contract years</param>
        /// <param name="team">MFL Team</param>
        public Player(string player, double salary, int years)
        {
            Name = player;
            Salary = salary;
            ContractYears = years;
        }

        /// <summary>
        /// Free Agent player.
        /// </summary>
        /// <param name="player">Player name or id</param>
        /// <param name="mflTeam">MFL Team</param>
        /// <param name="nflTeam">NFL Team</param>
        /// <param name="position">Position</param>
        /// <param name="salary">Salary</param>
        /// <param name="previousRank">Previous year rank by total points</param>
        /// <param name="previousAverage">Previous year average points</param>
        /// <param name="age">Player age</param>
        /// <param name="years">Contract years</param>
        /// <param name="signed">Status of signed to team</param>
        public Player(
            string player,
            string mflTeam,
            string nflTeam,
            string position,
            double salary,
            int previousRank,
            double previousAverage,
            int age,
            int years = 0,
            bool signed = false
        )
        {
            Name = player;
            Src = player.ToLower().Replace(" ", "-").Replace("'", "").Replace(".", "") + ".gif";
            MflTeam = mflTeam;
            OriginalRights = mflTeam;
            NflTeam = nflTeam;
            Position = position;
            Age = age;
            Salary = salary;
            OriginalSalary = salary;
            ContractYears = years;
            PreviousRank = previousRank;
            PreviousAverage = previousAverage;
            Signed = signed;
        }

        /// <summary>
        /// Free Agent player.
        /// </summary>
        /// <param name="player">Player name or id</param>
        /// <param name="src">Image source</param>
        /// <param name="mflTeam">MFL Team</param>
        /// <param name="nflTeam">NFL Team</param>
        /// <param name="position">Position</param>
        /// <param name="salary">Salary</param>
        /// <param name="previousRank">Previous year rank by total points</param>
        /// <param name="previousAverage">Previous year average points</param>
        /// <param name="age">Player age</param>
        /// <param name="years">Contract years</param>
        /// <param name="signed">Status of signed to team</param>
        public Player(
            string player,
            string src,
            string mflTeam,
            string nflTeam,
            string position,
            double salary,
            int previousRank,
            double previousAverage,
            int age,
            int years = 0,
            bool signed = false
        )
        {
            Name = player;
            Src = src;
            MflTeam = mflTeam;
            OriginalRights = mflTeam;
            NflTeam = nflTeam;
            Position = position;
            Age = age;
            Salary = salary;
            OriginalSalary = salary;
            ContractYears = years;
            PreviousRank = previousRank;
            PreviousAverage = previousAverage;
            Signed = signed;
        }
    }
}
