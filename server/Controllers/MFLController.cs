using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/v1/mfl")]
    public class MFLController : ControllerBase
    {
        private const string baseURL = "https://www44.myfantasyleague.com";

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

        private async Task<string> Roster()
        {
            var year = DateTime.Now.Year;
            var url = $"{baseURL}/{year}/export?TYPE=rosters&L={leagueId}&JSON=1";
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
    }
}
