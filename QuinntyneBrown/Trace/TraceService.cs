using Serilog;
using Serilog.Events;
using SerilogMetrics;
using System.Runtime.CompilerServices;
using static QuinntyneBrown.Trace.TracingEvents;

namespace QuinntyneBrown.Trace
{
    public class TraceService: ITraceService
    {
        public ILogger Diagnostics { get; set; }
        public ILogger Analytics { get; set; }
        public ILogger Performance { get; set; }

        public ITimedOperation BeginTimedOperation(string operationInfo = null, [CallerMemberName] string caller = null)        
            => Performance
                .BeginTimedOperation(
                    $"{caller}({operationInfo ?? string.Empty})",
                    completedMessage: CompletedOperationTemplate.Message,
                    levelBeginning: LogEventLevel.Verbose,
                    levelCompleted: LogEventLevel.Information,
                    levelExceeds: LogEventLevel.Verbose);
        
    }
}
