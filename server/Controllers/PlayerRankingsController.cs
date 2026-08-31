using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    public class PlayerRanking
    {
        public string Name { get; set; } = "";
        public string Position { get; set; } = "";
        public int Rank { get; set; }
    }

    [ApiController]
    [Route("api/v1/rankings")]
    public class PlayerRankingsController : ControllerBase
    {
        private const string baseURL = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons";

        private static readonly Dictionary<int, string> positionsById = new()
        {
            { 1, "QB" },
            { 2, "RB" },
            { 3, "WR" },
            { 4, "TE" },
            { 5, "K" },
            { 16, "DST" },
        };

        private static readonly TimeSpan cacheDuration = TimeSpan.FromHours(24);

        private static List<PlayerRanking> cache = new();

        private static DateTime cachedAt = DateTime.MinValue;

        private readonly HttpClient client = new();

        [HttpGet]
        public async Task<List<PlayerRanking>> GetRankings()
        {
            try
            {
                if (DateTime.UtcNow - cachedAt < cacheDuration && cache.Count > 0)
                {
                    return cache;
                }

                var year = DateTime.Now.Year;
                var url = $"{baseURL}/{year}/players?view=kona_player_info";
                var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Add(
                    "x-fantasy-filter",
                    "{\"players\":{\"filterRanksForRankTypes\":{\"value\":[\"STANDARD\"]}}}"
                );

                var response = await client.SendAsync(request);
                var body = await response.Content.ReadAsStreamAsync();

                using var document = await JsonDocument.ParseAsync(body);

                var rankings = new List<PlayerRanking>();
                foreach (var player in document.RootElement.EnumerateArray())
                {
                    if (
                        !player.TryGetProperty("defaultPositionId", out var positionIdElement)
                        || !positionsById.TryGetValue(
                            positionIdElement.GetInt32(),
                            out var position
                        )
                    )
                    {
                        continue;
                    }

                    if (
                        !player.TryGetProperty("draftRanksByRankType", out var ranksElement)
                        || !ranksElement.TryGetProperty("STANDARD", out var standardRank)
                        || !standardRank.TryGetProperty("rank", out var rankElement)
                        || rankElement.ValueKind != JsonValueKind.Number
                    )
                    {
                        continue;
                    }

                    var name = player.TryGetProperty("fullName", out var nameElement)
                        ? nameElement.GetString() ?? ""
                        : "";

                    rankings.Add(
                        new PlayerRanking
                        {
                            Name = name,
                            Position = position,
                            Rank = rankElement.GetInt32(),
                        }
                    );
                }

                cache = rankings.OrderBy(ranking => ranking.Rank).ToList();
                cachedAt = DateTime.UtcNow;

                return cache;
            }
            catch (Exception)
            {
                return cache;
            }
        }
    }
}
