namespace QuinntyneBrown.Community.Domain.Profiles;

/// <summary>A person signs in; an agent calls the API with a token and has no password or email (ADR 0036).</summary>
public enum ProfileKind
{
    Person,
    Agent,
}
