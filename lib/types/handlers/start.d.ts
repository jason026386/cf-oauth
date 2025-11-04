import { KVNamespace } from '@cloudflare/workers-types';
import { ProviderRegistry } from '../types/provider';
export declare function oauth2Start(request: Request, env: {
    TXNS: KVNamespace;
}, providerName: string, providers: ProviderRegistry, redirectUri: string): Promise<Response>;
//# sourceMappingURL=start.d.ts.map