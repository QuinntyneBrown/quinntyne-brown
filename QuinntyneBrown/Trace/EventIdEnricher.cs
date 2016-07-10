using Serilog.Core;
using Serilog.Events;

namespace QuinntyneBrown.Trace
{
    public class EventIdEnricher : ILogEventEnricher
    {
        public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty(LoggerExtensions.EventId, -1));
        }
    }
}
