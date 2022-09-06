using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MFL_Manager.Controllers
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

        [HttpGet("[action]")]
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

        [HttpGet("[action]")]
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

        public async Task<string> Roster()
        {
            string url = $"{baseURL}/export?TYPE=rosters&L={leagueId}&JSON=1";
            string response = await client.GetStringAsync(url);

            return response;
        }

        public async Task<string> Adjustments()
        {
            string url = $"{baseURL}/export?TYPE=salaryAdjustments&L={leagueId}&JSON=1";
            string response = await client.GetStringAsync(url);

            return response;
        }
    }
}
