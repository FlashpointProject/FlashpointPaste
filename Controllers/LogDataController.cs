using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace fp_paste.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LogDataController : ControllerBase
    {
        private const string storageDir = "./storage";

        private static Random random = new Random();

        private readonly ILogger<LogDataController> _logger;

        public LogDataController(ILogger<LogDataController> logger)
        {
            _logger = logger;
            if(!System.IO.Directory.Exists(storageDir)) {
                System.IO.Directory.CreateDirectory(storageDir);
            }
        }

        [HttpGet]
        public LogData Get(string id)
        {
            var filePath = String.Format(@"./storage/{0}.json", id);
            if (System.IO.File.Exists(filePath)) {
                Console.WriteLine("Returning Log " + id);
                var logData = JsonConvert.DeserializeObject<LogData>(System.IO.File.ReadAllText(filePath));
                return logData;
            } else {
                Console.WriteLine("Log " + id + " does not exist, returning default.");
                var logData = new LogData();
                var entryOne = new LogEntry();
                entryOne.content = "Log Not Found. Is the URL correct?";
                entryOne.source = "Server";
                entryOne.timestamp = 0;
                logData.entries = new LogEntry[]{entryOne};
                return logData;
            }
        }

        [HttpPost]
        public string Post(LogData logData)
        {
            Console.Write(logData);
            var id = RandomID(8);
            var filePath = String.Format(@"./storage/{0}.json", id);
            System.IO.File.WriteAllText(filePath, JsonConvert.SerializeObject(logData));
            return id;
        }

        private static string RandomID(int length)
        {
            const string chars = "ABCDEFGHJKMNPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
