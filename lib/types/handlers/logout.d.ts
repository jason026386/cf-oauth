import { KVNamespace } from '@cloudflare/workers-types';
import { ProviderRegistry } from '../types/provider';
/**
 * POST /oauth2/logout[?revoke=access|refresh|both]
 * - Authorization: Bearer <sessionId> 필수(없어도 200 ok로 처리하여 idempotent)
 * - 세션 삭제, (선택) 공급자 토큰 무효화 시도
 */
export declare function oauth2Logout(request: Request, env: {
    SESSIONS: KVNamespace;
}, providers: ProviderRegistry): Promise<Response>;
//# sourceMappingURL=logout.d.ts.map