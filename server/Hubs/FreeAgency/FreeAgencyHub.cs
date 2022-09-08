using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MFL_Manager.Controllers;
using MFL_Manager.Hubs.FreeAgency.Clients;
using MFL_Manager.Models;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.SignalR;

namespace MFL_Manager.Hubs.FreeAgency
{
    public class FreeAgencyHub : Hub<IFreeAgencyClient>
    {
        private static bool _isServerInitialized;
        private static readonly ConcurrentDictionary<string, Team> Connections = new ConcurrentDictionary<string, Team>();
        private static readonly HashSet<string> OptOutIds = new HashSet<string>();
        private static HashSet<Team> Teams;
        private static LinkedList<Player> Players;
        private static LinkedListNode<Player> _node;
        private static readonly Queue<Message> Messages = new Queue<Message>();
        private static bool _freeAgencyInProgress;
        private static bool _bidInProgress;
        private static bool _matchInProgress;
        private static double _leadBid;
        private static string _leadBidder = "None";
        private static int _contractYears;

        public void InitializeServer()
        {
            if (!_isServerInitialized)
            {
                _isServerInitialized = true;
                Teams = FreeAgencyController.GetTeams();
                Players = FreeAgencyController.GetPlayers();
                _node = Players.First;
            }
        }

        public async void GetCookie()
        {
            string teamName = Context.Features.Get<IHttpContextFeature>().HttpContext.Request.Cookies["TeamCookie"];
            if (!string.IsNullOrWhiteSpace(teamName))
            {
                if (Connections.TryAdd(Context.ConnectionId, Teams.FirstOrDefault(t => t.Name.Equals(teamName))))
                {
                    await Clients.Others.UpdateTeams();
                }
                else
                {
                    await Clients.Caller.RemoveCookie();
                }
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (Context.ConnectionId != null)
            {
                Connections.TryRemove(Context.ConnectionId, out _);
            }

            return base.OnDisconnectedAsync(exception);
        }

        #region Teams

        public async Task GetTeams()
        {
            Team userTeam = GetUserTeam();
            foreach (Team team in Connections.Values.ToHashSet())
            {
                if (userTeam != null && team != null && userTeam.Equals(team))
                {
                    await Clients.Caller.ServerSelectTeam(team.Name);
                }
                else
                {
                    await Clients.Caller.ReceiveSetTeam(team.Name);
                }
            }
        }

        public async Task SetTeam(string teamName)
        {
            if (GetUserTeam() == null)
            {
                if (Connections.TryAdd(Context.ConnectionId, Teams.FirstOrDefault(t => t.Name.Equals(teamName))))
                {
                    foreach (var connection in Connections)
                    {
                        if (!connection.Key.Equals(Context.ConnectionId) && !connection.Value.Name.Equals(teamName))
                        {
                            await Clients.Client(connection.Key).ReceiveSetTeam(teamName);
                        }
                    }
                    await Clients.Caller.SelectTeam(teamName);
                    await Clients.Caller.SetCookie(teamName);
                }
            }
        }

        public async Task RemoveTeam(string teamName)
        {
            Team team = null;
            if (Connections.TryRemove(Context.ConnectionId, out team))
            {
                await Clients.Caller.RemoveCookie();

                if (!Connections.Values.Contains(team))
                {
                    await Clients.All.ReceiveRemoveTeam(teamName);
                }
                else
                {
                    await Clients.Caller.ReceiveRemoveTeam(teamName);
                    await Clients.Caller.ReceiveSetTeam(team.Name);
                }
            }
        }

        #endregion

        #region Players

        public async Task GetPlayers()
        {
            await Clients.Caller.SetPlayers(Players.ToArray());
        }

        #endregion

        #region Free Agency

        public async Task StartFreeAgency()
        {
            OptOutIds.Clear();
            _freeAgencyInProgress = true;
            _bidInProgress = true;
            await CheckCommissionerPermissions();
            Player player = _node?.Value;
            if (player != null)
            {
                _leadBid = player.Salary;
                _leadBidder = player.MflTeam;
                await Clients.All.SetPlayer(player);
                await Clients.All.ReceiveBid(_leadBidder, _leadBid);
            }
        }

        public async Task CheckPermissions()
        {
            Team team = GetUserTeam();
            if (team != null)
            {
                await Clients.Caller.LoginStatus(true);
                await Clients.Caller.GrantMessagePermissions();
                Player player = _node?.Value;
                if (_bidInProgress)
                {
                    if (player != null && player.Signed)
                    {
                        if (team.Name.Equals(_leadBidder))
                        {
                            await Clients.Caller.GrantFinalBidPermissions();
                        }
                        else if (!string.IsNullOrWhiteSpace(player.OriginalRights) && team.Name.Equals(player.OriginalRights))
                        {
                            await Clients.Caller.RevokeMatchPermissions(_contractYears);
                        }
                        else
                        {
                            await Clients.Caller.RevokeBidPermissions();
                        }
                    }
                    else if (player != null && !string.IsNullOrWhiteSpace(player.OriginalRights) && team.Name.Equals(player.OriginalRights))
                    {
                        await Clients.Caller.RevokeMatchPermissions(_contractYears);
                    }
                    else
                    {
                        await Clients.Caller.GrantBidPermissions();
                        if (OptOutIds.Contains(team.Name))
                        {
                            await Clients.Caller.OptOut();
                        }
                    }
                }
                else
                {
                    if (_matchInProgress && player != null && !string.IsNullOrWhiteSpace(player.OriginalRights) && team.Name.Equals(player.OriginalRights))
                    {
                        await Clients.Caller.GrantMatchPermissions(_contractYears);
                    }
                    else
                    {
                        await Clients.Caller.RevokeBidPermissions();
                    }
                }
            }
            else
            {
                await Clients.Caller.RevokeMessagePermissions();
                await Clients.Caller.RevokeBidPermissions();
                await Clients.Caller.LoginStatus(false);
            }
        }

        public async Task CheckCommissionerPermissions()
        {
            Team team = GetUserTeam();
            if (team != null)
            {
                if (team.Name.Equals("Storm Dynasty"))
                {
                    await Clients.Caller.CommissionerPermissions(true, _freeAgencyInProgress);
                }
                else
                {
                    await Clients.Caller.CommissionerPermissions(false, _freeAgencyInProgress);
                }
            }
        }

        public async Task GetPreviousPlayer()
        {
            Player player = _node?.Previous?.Value;
            if (player != null)
            {
                OptOutIds.Clear();
                await Clients.All.OptIn();
                await Clients.All.UpdateOptOut(OptOutIds.ToArray());
                _bidInProgress = !player.Signed;
                _matchInProgress = false;
                _contractYears = player.ContractYears;
                _node = _node.Previous;
                _leadBid = player.Salary;
                _leadBidder = player.MflTeam;
                await Clients.All.SetPlayer(player);
            }
        }

        public async Task GetPlayer()
        {
            if (_freeAgencyInProgress)
            {
                Player player = _node?.Value;
                if (player != null)
                {
                    _bidInProgress = !player.Signed;
                    await Clients.Caller.SetPlayer(player);
                }
            }
        }

        public async Task GetNextPlayer()
        {
            Player player = _node?.Next?.Value;
            if (player != null)
            {
                OptOutIds.Clear();
                await Clients.All.OptIn();
                await Clients.All.UpdateOptOut(OptOutIds.ToArray());
                _bidInProgress = !player.Signed;
                _matchInProgress = false;
                _contractYears = player.ContractYears;
                _node = _node.Next;
                _leadBid = player.Salary;
                _leadBidder = player.MflTeam;
                await Clients.All.SetPlayer(player);
            }
        }

        public async Task PlayerReset()
        {
            OptOutIds.Clear();
            await Clients.All.OptIn();
            await Clients.All.UpdateOptOut(OptOutIds.ToArray());
            Player player = _node?.Value;
            if (player != null)
            {
                _bidInProgress = true;
                _matchInProgress = false;
                player.Salary = player.OriginalSalary;
                player.MflTeam = player.OriginalRights;
                player.ContractYears = 0;
                player.Signed = false;
                _leadBid = player.OriginalSalary;
                _leadBidder = player.OriginalRights;
                _contractYears = player.ContractYears;
                RemovePlayerFromTeam(player);
                await Clients.All.SetPlayer(player);
                await Clients.All.UpdatePlayers(player);
                await Clients.All.UpdateTeamRoster();
            }
        }

        public async Task PlayerSold()
        {
            Player player = _node?.Value;
            if (player != null)
            {
                if (!player.Signed)
                {
                    if (player.OriginalRights.Equals(_leadBidder))
                    {
                        _bidInProgress = false;
                        _matchInProgress = true;
                        player.Salary = _leadBid;
                        player.MflTeam = "None";
                        player.ContractYears = _contractYears;
                        string information = $"No bid was placed. {player.OriginalRights} has the option to sign the player.";
                        string footer = $"Player Update: {player.Name}";
                        Messages.Enqueue(new Message("Server-Everyone", information, footer));
                        await Clients.All.ReceiveMessageInformation(information, footer);
                        await Clients.All.SetPlayer(player);
                        await Clients.All.UpdatePlayers(player);
                    }
                    else
                    {
                        player.Signed = true;
                        string information = $"{_leadBidder} placing final bid and deciding contract years now.";
                        string footer = $"Player Update: {player.Name}";
                        Messages.Enqueue(new Message("Server-Everyone", information, footer));
                        await Clients.All.ReceiveMessageInformation(information, footer);
                        await Clients.All.SetPlayer(player);
                    }
                }
            }
        }

        public async Task SendMessage(string recipient, string text)
        {
            Team team = GetUserTeam();
            var message = new Message(team.Name, text, recipient);
            if (team != null && !string.IsNullOrWhiteSpace(recipient) &&
                !string.IsNullOrWhiteSpace(text) && !team.Equals(recipient))
            {
                Messages.Enqueue(message);
                if (recipient.Equals("Everyone"))
                {
                    HashSet<string> senderIds = Connections.Where(x => x.Value.Equals(team)).Select(x => x.Key).ToHashSet();
                    HashSet<string> recipientIds = Connections.Where(x => !x.Value.Equals(team)).Select(x => x.Key).ToHashSet();
                    foreach (string connectionId in senderIds)
                    {
                        await Clients.Client(connectionId).SendMessage(team.Name, text);
                    }
                    foreach (string connectionId in recipientIds)
                    {
                        await Clients.Client(connectionId).ReceiveMessage(team.Name, text);
                    }
                }
                else
                {
                    HashSet<string> senderIds = Connections.Where(x => x.Value.Equals(team)).Select(x => x.Key).ToHashSet();
                    HashSet<string> recipientIds = Connections.Where(x => x.Value.Name.Equals(recipient)).Select(x => x.Key).ToHashSet();
                    foreach (string connectionId in senderIds)
                    {
                        await Clients.Client(connectionId).SendMessageDirect($"{team.Name} to {recipient}", text);
                    }
                    foreach (string connectionId in recipientIds)
                    {
                        await Clients.Client(connectionId).ReceiveMessageDirect(team.Name, text);
                    }
                }

            }
        }

        public async Task GetMessages()
        {
            Team team = GetUserTeam();
            if (team != null)
            {
                foreach (Message message in Messages)
                {
                    if (message.Recipient.Equals("Everyone"))
                    {
                        if (message.Team.Equals(team.Name)) await Clients.Caller.SendMessage(message.Team, message.Text);
                        else await Clients.Caller.ReceiveMessage(message.Team, message.Text);
                    }
                    else if (message.Team.Equals("Server-Everyone"))
                    {
                        await Clients.Caller.ReceiveMessageInformation(message.Text, message.Recipient);
                    }
                    else
                    {
                        if (message.Team.Equals(team.Name))
                        {
                            await Clients.Caller.SendMessageDirect($"{message.Team} to {message.Recipient}", message.Text);
                        }
                        else if (message.Recipient.Equals(team.Name))
                        {
                            await Clients.Caller.ReceiveMessageDirect(message.Team, message.Text);
                        }
                    }
                }
            }
        }

        public async Task OptIn()
        {
            Team team = GetUserTeam();
            if (team != null)
            {
                if (OptOutIds.Remove(team.Name))
                {
                    await Clients.Caller.OptIn();
                    await Clients.All.UpdateOptOut(OptOutIds.ToArray());
                }
            }
        }

        public async Task OptOut()
        {
            Team team = GetUserTeam();
            if (team != null)
            {
                if (OptOutIds.Add(team.Name))
                {
                    await Clients.Caller.OptOut();
                    await Clients.All.UpdateOptOut(OptOutIds.ToArray());
                }
            }
        }

        public async Task GetBid()
        {
            if (_contractYears == 0)
            {
                Player player = _node?.Value;
                if (player != null && player.Signed)
                {
                    await Clients.Caller.ReceiveBid(_leadBidder, _leadBid, true);
                }
                else
                {
                    await Clients.Caller.ReceiveBid(_leadBidder, _leadBid);
                }
            }
            else
            {
                await Clients.All.ReceiveFinalBid(_leadBidder, _leadBid, _contractYears);
            }
        }

        public async Task SendBid(double bid)
        {
            Team team = GetUserTeam();
            if (team != null)
            {
                Player player = _node?.Value;
                if (player != null)
                {
                    if (bid > _leadBid || (player.OriginalRights.Equals(_leadBidder) && bid >= _leadBid))
                    {
                        _leadBid = bid;
                        _leadBidder = team.Name;
                        await Clients.All.ReceiveBid(_leadBidder, _leadBid);
                    }
                }
            }
        }

        public async Task SendFinalBid(double bid, int years)
        {
            Team team = GetUserTeam();
            if (team != null)
            {
                if (bid >= _leadBid)
                {
                    _leadBid = bid;
                    _leadBidder = team.Name;
                    _contractYears = years;
                    Player player = _node?.Value;
                    if (player != null)
                    {
                        _bidInProgress = false;
                        _matchInProgress = true;
                        player.Salary = _leadBid;
                        player.MflTeam = _leadBidder;
                        player.ContractYears = _contractYears;
                        player.Signed = true;
                        AddPlayerToTeam(player);
                        string information = $"{_leadBidder} places a final bid of ${_leadBid:F} for {_contractYears} years. " +
                                             $"{player.OriginalRights} now has the option to match.";
                        string footer = $"Player Update: {player.Name}";
                        Messages.Enqueue(new Message("Server-Everyone", information, footer));
                        await Clients.All.ReceiveMessageInformation(information, footer);
                        await Clients.All.SetPlayer(player);
                        await Clients.All.UpdatePlayers(player);
                        await Clients.All.UpdateTeamRoster();
                    }
                }
            }
        }

        public async Task MatchBid(bool match, int years)
        {
            Team team = GetUserTeam();
            if (team != null)
            {
                Player player = _node?.Value;
                if (player != null)
                {
                    _matchInProgress = false;
                    string information;
                    if (match)
                    {
                        _leadBidder = team.Name;
                        _contractYears = years;
                        information = $"{player.OriginalRights} match. The final deal is {_leadBid:F} for {_contractYears} years.";
                    }
                    else
                    {
                        if (player.Signed)
                        {
                            information = $"{player.OriginalRights} does not match. {_leadBidder} secures the free agent. " +
                                          $"The final deal is {_leadBid:F} for {_contractYears} years.";
                        }
                        else
                        {
                            _leadBidder = "None";
                            information = $"{player.OriginalRights} does not sign {player.Name}. He will return to the MFL draft";
                        }
                    }

                    string footer = $"Player Update: {player.Name}";
                    player.Salary = _leadBid;
                    player.MflTeam = _leadBidder;
                    player.ContractYears = _contractYears;
                    player.Signed = true;
                    AddPlayerToTeam(player);
                    Messages.Enqueue(new Message("Server-Everyone", information, footer));
                    await Clients.All.ReceiveMessageInformation(information, footer);
                }

                await Clients.All.SetPlayer(player);
                await Clients.All.UpdatePlayers(player);
                await Clients.All.UpdateTeamRoster();
            }
        }

        #endregion

        #region Team Rosters

        public async Task GetOptOuts()
        {
            Team team = GetUserTeam();
            await Clients.Caller.SetOptOuts(OptOutIds.ToArray(), team);
        }

        public async Task GetTeamRoster(string team)
        {
            await Clients.Caller.SetTeamRoster(GetSelectedTeamRoster(team));
        }

        private Team GetSelectedTeamRoster(string selectedTeam)
        {
            return Teams.FirstOrDefault(team => team.Name.Equals(selectedTeam));
        }

        #endregion

        #region Everything Else

        private Team GetUserTeam()
        {
            Team team = null;
            Connections.TryGetValue(Context.ConnectionId, out team);

            return team;
        }

        private void AddPlayerToTeam(Player player)
        {
            foreach (Team team in Teams)
            {
                team.Players.Remove(player);
                if (team.Name.Equals(player.MflTeam) || team.Id.Equals(player.MflTeam))
                {
                    team.Players.Add(player);
                }
            }
        }

        private void RemovePlayerFromTeam(Player player)
        {
            foreach (Team team in Teams)
            {
                team.Players.Remove(player);
            }
        }

        #endregion
    }
}
