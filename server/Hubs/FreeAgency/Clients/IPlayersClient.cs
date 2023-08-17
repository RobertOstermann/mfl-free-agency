using server.Models;

namespace server.Hubs.FreeAgency.Clients
{
    public interface IPlayersClient
    {
        Task SetPlayer(Player player);
        Task SetPlayers(IEnumerable<Player> Players);
        Task UpdatePlayers(Player player);
    }
}
