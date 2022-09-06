using System.Threading.Tasks;
using MFL_Manager.Models;
using Microsoft.AspNetCore.SignalR;

namespace MFL_Manager.Hubs.FreeAgency.Clients
{
    public interface ITeamsClient
    {
        Task ServerSelectTeam(string team);
        Task SelectTeam(string id);
        Task ReceiveSetTeam(string team);
        Task ReceiveRemoveTeam(string id);
        Task SetTeamRoster(Team team);
        Task UpdateTeamRoster();
        Task UpdateTeams();
    }
}