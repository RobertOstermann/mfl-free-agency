namespace server.Models
{
    public class Message(string team, string text, string recipient)
    {
        public string Team { get; set; } = team;

        public string Text { get; set; } = text;

        public string Recipient { get; set; } = recipient;
    }
}
