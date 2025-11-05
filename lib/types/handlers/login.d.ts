import { KVNamespace } from '@cloudflare/workers-types';
import { ProviderRegistry } from '../types/provider';
export declare function oauth2Login(request: Request, env: {
    SESSIONS: KVNamespace<string>;
}, providers: ProviderRegistry, providerKey: string): Promise<Response>;
//# sourceMappingURL=login.d.ts.map