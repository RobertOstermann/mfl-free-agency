using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/v1/mfl")]
    public class MFLController : ControllerBase
    {
        private const string baseURL = "https://www44.myfantasyleague.com";

        private const string apiBaseURL = "https://api.myfantasyleague.com";

        private const string leagueId = "30916";

        private readonly HttpClient client = new();

        private readonly ILogger<MFLController> _logger;

        public MFLController(ILogger<MFLController> logger)
        {
            _logger = logger;
        }

        [HttpGet("rosters")]
        public string GetRosters()
        {
            try
            {
                Task<string> rosters = Roster();
                return rosters.Result;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpGet("adjustments")]
        public string GetAdjustments()
        {
            try
            {
                Task<string> adjustments = Adjustments();
                return adjustments.Result;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpGet("players")]
        public string GetPlayers()
        {
            try
            {
                Task<string> players = Players();
                return players.Result;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpGet("salaries")]
        public string GetSalaries()
        {
            try
            {
                Task<string> salaries = Salaries();
                return salaries.Result;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpGet("byeWeeks")]
        public string GetByeWeeks()
        {
            try
            {
                Task<string> byeWeeks = ByeWeeks();
                return byeWeeks.Result;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private async Task<string> Roster()
        {
            var year = DateTime.Now.Year;
            var url = $"{baseURL}/{year}/export?TYPE=rosters&L={leagueId}&JSON=1";
            var response = await client.GetStringAsync(url);

            return response;
        }

        private async Task<string> Players()
        {
            var year = DateTime.Now.Year;
            var url = $"{baseURL}/{year}/export?TYPE=players&L={leagueId}&JSON=1";
            var response = await client.GetStringAsync(url);

            return response;
        }

        private async Task<string> Adjustments()
        {
            var year = DateTime.Now.Year;
            var url = $"{baseURL}/{year}/export?TYPE=salaryAdjustments&L={leagueId}&JSON=1";
            var response = await client.GetStringAsync(url);

            return response;
        }

        private async Task<string> Salaries()
        {
            var year = DateTime.Now.Year;
            var url = $"{baseURL}/{year}/export?TYPE=salaries&L={leagueId}&JSON=1";
            var response = await client.GetStringAsync(url);

            return response;
        }

        private async Task<string> ByeWeeks()
        {
            var year = DateTime.Now.Year;
            var url = $"{apiBaseURL}/{year}/export?TYPE=nflByeWeeks&JSON=1";
            var response = await client.GetStringAsync(url);

            return response;
        }
    }
}
