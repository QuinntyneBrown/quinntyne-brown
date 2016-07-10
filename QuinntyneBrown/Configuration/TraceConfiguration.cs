using System;
using System.Configuration;

namespace QuinntyneBrown.Configuration
{
    public class TraceConfiguration : ConfigurationSection, ITraceConfiguration
    {
        [ConfigurationProperty("loggingSqlServerConnectionString")]
        public string LoggingSqlServerConnectionString
        {
            get { return (string)this["loggingSqlServerConnectionString"]; }
            set { this["loggingSqlServerConnectionString"] = value; }
        }

        [ConfigurationProperty("logToSql", IsRequired = true)]
        public bool LogToSql
        {
            get { return Convert.ToBoolean(this["logToSql"]); }
            set { this["logToSql"] = value; }
        }

        [ConfigurationProperty("logToFile")]
        public bool LogToFile
        {
            get { return Convert.ToBoolean(this["logToFile"]); }
            set { this["logToFile"] = value; }
        }

        [ConfigurationProperty("logLoggingDebugInfo")]
        public bool LogLoggingDebugInfo
        {
            get { return Convert.ToBoolean(this["logLoggingDebugInfo"]); }
            set { this["logLoggingDebugInfo"] = value; }
        }

        public static TraceConfiguration Config
        {
            get { return ConfigurationManager.GetSection("traceConfiguration") as TraceConfiguration; }
        }

        public static readonly Lazy<ITraceConfiguration> LazyConfig = new Lazy<ITraceConfiguration>(() =>
        {
            var section = ConfigurationManager.GetSection("traceConfiguration") as ITraceConfiguration;
            if (section == null)
                throw new ConfigurationErrorsException("traceConfiguration");
            return section;
        }, true);
    }
}
