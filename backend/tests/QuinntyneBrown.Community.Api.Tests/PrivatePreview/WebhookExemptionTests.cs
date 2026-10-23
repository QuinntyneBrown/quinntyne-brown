// Traces to: L2-161, L2-101
using System.Net;
using System.Text;
using QuinntyneBrown.Community.Api.Tests.Integrations;

namespace QuinntyneBrown.Community.Api.Tests.PrivatePreview;

/// <summary>The webhook passes the wall by its exact method and path, and nothing else does (ADR 0042).</summary>
public class WebhookExemptionTests(PrivatePreviewApiFactory factory) : IClassFixture<PrivatePreviewApiFactory>
{
    [Fact]
    public async Task A_signed_webhook_reaches_the_api_while_the_wall_is_locked()
    {
        var app = await factory.SeedAppAsync();

        var response = await factory.DeliverRawAsync(app.SourceId, Encoding.UTF8.GetBytes(IntegrationClients.ContactRequestBody()), app.Secret, client: factory.Browser());

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
    }

    [Fact]
    public async Task Other_methods_and_neighbouring_paths_stay_locked()
    {
        var client = factory.Browser();

        Assert.Equal(HttpStatusCode.Forbidden, (await client.GetAsync("/api/webhooks/events")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.PostAsync("/api/webhooks/events/extra", null)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.PostAsync("/api/webhooks", null)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.GetAsync("/api/integrations/apps")).StatusCode);
    }
}
