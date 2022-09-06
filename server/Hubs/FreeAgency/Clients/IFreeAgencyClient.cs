using System.Collections.Generic;
using System.Threading.Tasks;
using MFL_Manager.Models;

namespace MFL_Manager.Hubs.FreeAgency.Clients
{
    public interface IFreeAgencyClient : IMessageClient, IPlayersClient, ITeamsClient
    {
        Task SetCookie(string id);
        Task RemoveCookie();
        Task CommissionerPermissions(bool commissioner, bool freeAgencyInProgress);
        Task OptIn();
        Task OptOut();
        Task SetOptOuts(IEnumerable<string> optOuts, Team team);

        Task UpdateOptOut(IEnumerable<string> optOuts);
        Task GrantBidPermissions();
        Task GrantFinalBidPermissions();
        Task RevokeBidPermissions();
        Task GrantMatchPermissions(int years);
        Task RevokeMatchPermissions(int ContractYears);
        Task ReceiveBid(string leadBidder, double leadBid);
        Task ReceiveBid(string leadBidder, double leadBid, bool signed);
        Task ReceiveFinalBid(string leadBidder, double leadBid, int contractYears);
        Task LoginStatus(bool status);
    }
}
