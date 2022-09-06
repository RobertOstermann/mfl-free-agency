const FreeAgencyHub = Object.freeze({
  // Shared
  LoginStatus: "LoginStatus",
  SetCookie: "SetCookie",
  RemoveCookie: "RemoveCookie",
  UpdateTeams: "UpdateTeams",
  ServerSelectTeam: "ServerSelectTeam",
  SelectTeam: "SelectTeam",
  ReceiveSetTeam: "ReceiveSetTeam",
  ReceiveRemoveTeam: "ReceiveRemoveTeam",
  Invoke: {
    InitializeServer: "InitializeServer",
    GetCookie: "GetCookie",
    GetTeams: "GetTeams",
    SetTeam: "SetTeam",
    RemoveTeam: "RemoveTeam",
  },
  // PlayersPage
  Players: {
    SetPlayers: "SetPlayers",
    UpdatePlayers: "UpdatePlayers",
    Invoke: {
      GetPlayers: "GetPlayers",
    },
  },
  // FreeAgencyPage
  FreeAgency: {
    Invoke: {
      StartFreeAgency: "StartFreeAgency",
      CheckPermissions: "CheckPermissions",
    },
    Message: {
      GrantMessagePermissions: "GrantMessagePermissions",
      RevokeMessagePermissions: "RevokeMessagePermissions",
      ReceiveMessage: "ReceiveMessage",
      ReceiveMessageDirect: "ReceiveMessageDirect",
      ReceiveMessageInformation: "ReceiveMessageInformation",
      SendMessage: "SendMessage",
      SendMessageDirect: "SendMessageDirect",
      Invoke: {
        GetMessages: "GetMessages",
        SendMessage: "SendMessage",
      },
    },
    Player: {
      SetPlayer: "SetPlayer",
      SetTeamRoster: "SetTeamRoster",
      UpdateTeamRoster: "UpdateTeamRoster",
      Invoke: {
        GetPlayer: "GetPlayer",
        GetPreviousPlayer: "GetPreviousPlayer",
        GetNextPlayer: "GetNextPlayer",
        PlayerReset: "PlayerReset",
        PlayerSold: "PlayerSold",
        GetTeamRoster: "GetTeamRoster",
      },
    },
    Bid: {
      GrantBidPermissions: "GrantBidPermissions",
      GrantFinalBidPermissions: "GrantFinalBidPermissions",
      RevokeBidPermissions: "RevokeBidPermissions",
      GrantMatchPermissions: "GrantMatchPermissions",
      RevokeMatchPermissions: "RevokeMatchPermissions",
      OptIn: "OptIn",
      OptOut: "OptOut",
      SetOptOuts: "SetOptOuts",
      UpdateOptOut: "UpdateOptOut",
      ReceiveBid: "ReceiveBid",
      ReceiveFinalBid: "ReceiveFinalBid",
      Invoke: {
        GetBid: "GetBid",
        SendBid: "SendBid",
        SendFinalBid: "SendFinalBid",
        MatchBid: "MatchBid",
        OptIn: "OptIn",
        OptOut: "OptOut",
        GetOptOuts: "GetOptOuts",
      },
    },
    Commissioner: {
      CommissionerPermissions: "CommissionerPermissions",
      Invoke: {
        CheckPermissions: "CheckCommissionerPermissions",
      },
    },
  },
});

export { FreeAgencyHub };
