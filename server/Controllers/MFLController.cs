using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/v1/mfl")]
    public class MFLController : ControllerBase
    {
        private const string baseURL = "https://www54.myfantasyleague.com/2022";

        private const string leagueId = "30916";

        private HttpClient client = new HttpClient();

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
            string url = $"{baseURL}/export?TYPE=rosters&L={leagueId}&JSON=1";
            string response = await client.GetStringAsync(url);

            return response;
        }

        private async Task<string> Adjustments()
        {
            string url = $"{baseURL}/export?TYPE=salaryAdjustments&L={leagueId}&JSON=1";
            string response = await client.GetStringAsync(url);

            return response;
        }
    }
}
