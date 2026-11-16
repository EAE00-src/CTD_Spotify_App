//PKCE: Proof Key for Code Exchange
//Code verifier
const generateRandomString = (length: number): string => {
    const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((accum, x) => accum + possible[x % possible.length], "")
}


//Code challenge
    /*According to Spotify documentation, after the code verifier has been generated 
     it must be transformed (hashed) using the SHA256 algorithm.
     This value will be sent within the user auth request*/
const sha256 = async (plain: string): Promise<ArrayBuffer> => {
    const encoder: TextEncoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

/**Next, the implementation of a function base64encode that returns base64 representation
 * of the digest that was just calculated with the sha256 function
 */
const base64encode = (input: ArrayBuffer): string => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
//Now to put everything together
    //This generates a fresh code verifier & code challenge pair on demand

export const generatePkcePair = async(): Promise<{codeVerifier: string; codeChallenge: string}> => {
    const codeVerifier: string = generateRandomString(64)
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed)
    return {codeVerifier, codeChallenge};
}