export function jsonWithCors(obj, status = 200) {
    return new Response(obj ? (typeof obj === 'string' ? obj : JSON.stringify(obj)) : null, {
        status,
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*',
        },
    });
}
//# sourceMappingURL=response.js.map