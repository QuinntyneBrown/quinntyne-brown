using Serilog;
using System.Linq;

namespace QuinntyneBrown.Trace
{
    public static class LoggerExtensions
    {
        public static string EventId { get; set; } = "EventId";

        public static void Event(this ILogger logger, TracingEvent tracingEvent, params object[] properties)
        {
            properties = properties.Concat(new object[] { tracingEvent.EventId }).ToArray();
            logger.Write(tracingEvent.Level, $"{tracingEvent.Message} {{{EventId}}}", properties);
        }
    }
}
