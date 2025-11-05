import { KVNamespace } from '@cloudflare/workers-types';
import { ProviderRegistry } from '../types/provider';
export declare function oauth2Callback(request: Request, env: {
    TXNS: KVNamespace<string>;
    SESSIONS: KVNamespace<string>;
}, providerName: string, providers: ProviderRegistry, redirectUri: string, returnTo: string): Promise<Response>;
//# sourceMappingURL=callback.d.ts.map