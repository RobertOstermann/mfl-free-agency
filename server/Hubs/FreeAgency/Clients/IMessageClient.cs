namespace server.Hubs.FreeAgency.Clients
{
    public interface IMessageClient
    {
        Task GrantMessagePermissions();
        Task RevokeMessagePermissions();
        Task SendMessage(string team, string text);
        Task SendMessageDirect(string team, string text);
        Task ReceiveMessage(string team, string text);
        Task ReceiveMessageDirect(string team, string text);
        Task ReceiveMessageInformation(string information, string footer);
    }
}
