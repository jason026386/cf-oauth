export declare function base64url(buf: ArrayBuffer | Uint8Array | string): string;
export declare function randomBytesBase64Url(n?: number): string;
export declare function makePkcePair(): Promise<{
    verifier: string;
    challenge: string;
    method: "S256";
}>;
export declare function fromBase64UrlToJSON<T = unknown>(s: string): T;
export declare function makeAppleClientSecret({ teamId, keyId, clientId, privateKeyPem, expSec }: {
    teamId: string;
    keyId: string;
    clientId: string;
    privateKeyPem: string;
    expSec?: number;
}): Promise<string>;
//# sourceMappingURL=pkce.d.ts.map