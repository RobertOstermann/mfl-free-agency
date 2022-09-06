using System.Collections.Generic;
using System.Threading.Tasks;
using MFL_Manager.Models;

namespace MFL_Manager.Hubs.FreeAgency.Clients
{
    public interface IPlayersClient
    {
        Task SetPlayer(Player player);
        Task SetPlayers(IEnumerable<Player> Players);
        Task UpdatePlayers(Player player);
    }
}