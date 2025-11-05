import { KVNamespace } from '@cloudflare/workers-types';
import { ProviderRegistry } from '../types/provider';
/**
 * GET /me
 * - 현재 로그인 사용자 정보 반환
 * - ?refresh=1 또는 x-refresh-userinfo: 1 → provider의 userinfo를 다시 조회 후 저장
 * - ?rotate=1 → 새 세션ID 발급(헤더 x-session-rotate)
 */
export declare function oauth2Me(request: Request, env: {
    SESSIONS: KVNamespace<string>;
}, providers: ProviderRegistry): Promise<Response>;
//# sourceMappingURL=me.d.ts.map