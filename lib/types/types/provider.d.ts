export type OAuth2ProviderConfig = {
    client_id: string;
    client_secret: string;
    auth_url: string;
    response_mode?: string;
    token_url: string;
    userinfo_url: string;
    scope: string;
    oidc?: {
        issuer: string;
        discovery?: string;
        jwks_uri?: string;
        acceptable_audiences?: string[];
        require_email_verified?: boolean;
    };
};
export type ProviderRegistry = Record<string, OAuth2ProviderConfig>;
//# sourceMappingURL=provider.d.ts.map