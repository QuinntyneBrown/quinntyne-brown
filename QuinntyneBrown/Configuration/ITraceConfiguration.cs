namespace QuinntyneBrown.Configuration
{
    public interface ITraceConfiguration
    {
        string LoggingSqlServerConnectionString { get; }
        bool LogToSql { get; }
        bool LogToFile { get; }
        bool LogLoggingDebugInfo { get; }
    }
}
