using server.Models;

namespace server.Hubs.FreeAgency.Clients
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
