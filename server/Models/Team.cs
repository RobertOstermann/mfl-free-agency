using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace MFL_Manager.Models
{
    public class Team
    {
        public string Name { get; set; }

        public string Id { get; set; }

        public double Salary
        {
            get
            {
                return Players.Sum(p => p.Salary);
            }
        }

        public double SalaryAdjustments { get; set; }

        public double TotalSalary
        {
            get => Salary + SalaryAdjustments;
        }

        public List<Player> Players { get; set; }

        public Team(string team)
        {
            Name = team;
            Id = team.Replace(' ', '-').Replace("'", "");
            SalaryAdjustments = 0;
            Players = new List<Player>();
        }

        public Team(string team, double salaryAdjustments, List<Player> players)
        {
            Name = team;
            Id = team.Replace(' ', '-').Replace("'", "");
            SalaryAdjustments = salaryAdjustments;
            Players = players;
        }
    }
}
