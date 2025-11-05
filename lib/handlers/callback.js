import { fromBase64UrlToJSON, randomBytesBase64Url } from '../utils/pkce';
import { jsonWithCors } from '../utils/response';
// —— The Function ——
export async function oauth2Callback(request, env, providerName, providers, redirectUri, returnTo) {
    // 1) form_post 방식 우선
    let code = null;
    let stateRaw = null;
    if (request.method === 'POST') {
        const ct = request.headers.get('content-type') || '';
        if (ct.includes('application/x-www-form-urlencoded')) {
            const body = await request.text();
            const params = new URLSearchParams(body);
            code = params.get('code');
            stateRaw = params.get('state');
        }
    }
    // 2) fallback: query string 처리
    if (!code || !stateRaw) {
        const url = new URL(request.url);
        code = url.searchParams.get('code');
        stateRaw = url.searchParams.get('state');
    }
    if (!code || !stateRaw) {
        return jsonWithCors({ error: 'Missing code or state' }, 400);
    }
    // 1) state 파싱 및 기본 검증
    let parsed;
    try {
        parsed = fromBase64UrlToJSON(stateRaw);
    }
    catch {
        return jsonWithCors({ error: 'Invalid state' }, 400);
    }
    const { s: csrf, t: txnId, p: providerFromState } = parsed || {};
    if (!csrf || !txnId)
        return jsonWithCors({ error: 'Invalid state payload' }, 400);
    // 2) TXN 조회 및 검증
    const txnKey = `txn:${txnId}`;
    const txnJSON = await env.TXNS.get(txnKey);
    if (!txnJSON)
        return jsonWithCors({ error: 'Transaction expired' }, 400);
    const txn = JSON.parse(txnJSON);
    if (txn.csrf !== csrf)
        return jsonWithCors({ error: 'CSRF mismatch' }, 400);
    // 3) 프로바이더 결정(라우트 vs state) 및 일치 검증
    const effectiveProvider = providerFromState || providerName;
    const cfg = providers[effectiveProvider];
    if (!cfg)
        return jsonWithCors({ error: 'Unknown provider', provider: effectiveProvider }, 400);
    if (txn.provider && txn.provider !== effectiveProvider) {
        return jsonWithCors({ error: 'Provider mismatch', expected: txn.provider, got: effectiveProvider }, 400);
    }
    // 4) 토큰 교환
    const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: cfg.client_id,
        code_verifier: txn.code_verifier,
    });
    if (cfg.client_secret)
        tokenParams.set('client_secret', cfg.client_secret);
    const tokenResp = await fetch(cfg.token_url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'accept': 'application/json',
        },
        body: tokenParams,
    });
    if (!tokenResp.ok) {
        const detail = await tokenResp.text();
        return jsonWithCors({ error: 'Token exchange failed', detail }, 502);
    }
    const token = await tokenResp.json();
    // 5) userinfo 조회 (기본값)
    let user = null;
    // ★ 추가 부분: 애플이면 id_token에서 이메일/서브 꺼내기
    if (effectiveProvider === 'apple') {
        const idToken = token?.id_token;
        if (idToken) {
            // JWT: header.payload.signature
            const parts = idToken.split('.');
            if (parts.length >= 2) {
                try {
                    const payloadJson = fromBase64UrlToJSON(parts[1]);
                    // Apple이 첫 로그인 때만 email을 넣어줌
                    user = {
                        sub: payloadJson.sub,
                        email: payloadJson.email,
                        email_verified: payloadJson.email_verified,
                        is_private_email: payloadJson.is_private_email,
                    };
                }
                catch {
                    // payload 파싱 실패 시 그냥 넘어감
                }
            }
        }
    }
    // ★ 일반 OIDC/OAuth provider면 userinfo_url 있으면 그대로 호출
    if (!user && cfg.userinfo_url && token?.access_token) {
        const ui = await fetch(cfg.userinfo_url, {
            headers: { Authorization: `Bearer ${token.access_token}`, 'accept': 'application/json' },
        });
        if (ui.ok) {
            user = await ui.json();
        }
    }
    // 6) 세션 생성/저장
    const sessionId = randomBytesBase64Url(48);
    const sessionRecord = {
        provider: effectiveProvider,
        created_at: Date.now(),
        token,
        user,
    };
    const ttlSeconds = 7 * 24 * 60 * 60; // 7 days
    await env.SESSIONS.put(`sess:${sessionId}`, JSON.stringify(sessionRecord), {
        expirationTtl: ttlSeconds,
    });
    // 7) 일회성 TXN 정리
    await env.TXNS.delete(txnKey);
    // 8) 응답
    const accept = request.headers.get('accept') || '';
    if (!accept.includes('application/json')) {
        const html = `<!doctype html>
<meta charset="utf-8">
<script>
  window.location.replace('${returnTo}?session=' + encodeURIComponent('${sessionId}'));
</script>`;
        return new Response(html, { status: 200, headers: { 'content-type': 'text/html' } });
    }
    return jsonWithCors({ ok: true, sessionId, user, provider: effectiveProvider });
}
//# sourceMappingURL=callback.js.map