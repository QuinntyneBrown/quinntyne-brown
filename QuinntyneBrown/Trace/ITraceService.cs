using Serilog;
using SerilogMetrics;
using System.Runtime.CompilerServices;

namespace QuinntyneBrown.Trace
{
    public interface ITraceService
    {
        ILogger Diagnostics { get; set; }
        ILogger Analytics { get; set; }
        ILogger Performance { get; set; }        
        ITimedOperation BeginTimedOperation(string operationInfo = null, [CallerMemberName] string caller = null);
    }
}
