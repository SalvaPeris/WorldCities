using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace HealthCheckAPI.Controllers
{
	[Route("api/[controller]/[action]")]
	[ApiController]
	public class BroadcastController : ControllerBase
	{
		private IHubContext<HealthCheckHub> _hub;
		private ILogger<BroadcastController> _logger;

		public BroadcastController(IHubContext<HealthCheckHub> hub, ILogger<BroadcastController> logger)
		{
			_hub = hub;
			_logger = logger;
		}

		[HttpGet]
		public async Task<IActionResult> Update()
		{
			_logger.LogInformation("Update has been invoked");
			await _hub.Clients.All.SendAsync("Update", "test");
			return Ok("Update message sent.");
		}
	}
}
