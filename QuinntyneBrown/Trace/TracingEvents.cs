using Serilog.Events;

namespace QuinntyneBrown.Trace
{
    public static class TracingEvents
    {
        
        public static readonly TracingEvent CompletedOperationTemplate = new TracingEvent
        {
            Message = "Completed {TimedOperationId}: {OperationName} started {StartedTime} in {TimedOperationElapsed} ({TimeTakenMsec} ms) {OperationResult}",
            EventId = 4
        };

        public static readonly TracingEvent ErrorInAppController = new TracingEvent
        {
            Message = "{ErrorMessage}, {StackTrace}",
            EventId = 5,
            Level = LogEventLevel.Error
        };

        public static readonly TracingEvent ClientError = new TracingEvent
        {
            Message = "{ErrorMessage}, {StackTrace}",
            EventId = 6,
            Level = LogEventLevel.Error
        };
    }
}
