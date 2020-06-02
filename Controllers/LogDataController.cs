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
        

        private readonly ILogger<LogDataController> _logger;

        public LogDataController(ILogger<LogDataController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public LogData Get(string id)
        {
            var filePath = String.Format(@"./storage/{0}.json", id);
            Console.WriteLine(filePath);
            if (System.IO.File.Exists(filePath)) {
                var logData = JsonConvert.DeserializeObject<LogData>(System.IO.File.ReadAllText(filePath));
                return logData;
            } else {
                var logData = new LogData();
                var entryOne = new LogEntry();
                entryOne.content = "TEST CONTENT";
                entryOne.source = "Launcher";
                entryOne.timestamp = 0;
                logData.entries = new LogEntry[]{entryOne};
                return logData;
            }
        }

        [HttpPost]
        public string Post(LogData logData)
        {
            Console.Write(logData);
            var uuid = System.Guid.NewGuid().ToString();
            var filePath = String.Format(@"./storage/{0}.json", uuid);
            System.IO.File.WriteAllText(filePath, JsonConvert.SerializeObject(logData));
            return uuid;
        }
    }
}
