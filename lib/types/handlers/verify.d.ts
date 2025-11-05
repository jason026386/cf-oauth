import { KVNamespace } from '@cloudflare/workers-types';
import { ProviderRegistry } from '../types/provider';
export declare function oauth2Verify(request: Request, env: {
    SESSIONS: KVNamespace<string>;
}, providers: ProviderRegistry, providerKey: string): Promise<Response>;
//# sourceMappingURL=verify.d.ts.map