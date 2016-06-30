using Serilog.Events;

namespace QuinntyneBrown.Trace
{
    public static class TracingEvents
    {
        public static readonly TracingEvent ClientError = new TracingEvent
        {
            Message = "{ErrorMessage}, {StackTrace}",
            EventId = 6,
            Level = LogEventLevel.Error
        };
    }
}
