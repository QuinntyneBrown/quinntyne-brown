using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace QuinntyneBrown.Community.Cli;

internal static class Program
{
    private static async Task<int> Main(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") ?? "Production";
        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile($"appsettings.{environment}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("Community")
            ?? throw new InvalidOperationException("ConnectionStrings:Community is not configured.");

        return await CliApp.RunAsync(
            args,
            options => options.UseNpgsql(connectionString),
            configuration["WebApp:Origin"] ?? "http://localhost:4200",
            devAccount: environment == "Development" && configuration["DevAccount:Email"] is { } email && configuration["DevAccount:Password"] is { } password
                ? new DevAccount(email, password)
                : null);
    }
}
