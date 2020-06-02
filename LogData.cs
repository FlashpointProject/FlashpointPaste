using System;

namespace fp_paste
{
    public class LogEntry 
    {
        public string source { get; set; }
        
        public string content { get; set; }

        public Int64 timestamp { get; set; }
    }

    public class LogData
    {
        public LogEntry[] entries { get; set; }
 
    }
}