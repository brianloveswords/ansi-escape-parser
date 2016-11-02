function inRange(n: number, o: {high: number, low: number}): boolean {
    return n >= o.low && n <= o.high;
}

export function isNumber(c: string): boolean {
    return inRange(c.charCodeAt(0), {low: 48, high: 57});
}

export function isEscape(c: string): boolean {
    return c.charCodeAt(0) === 27;
}

export function isSemicolon(c: string): boolean {
    return c.charCodeAt(0) === 59;
}

export function isLeftBrace(c: string): boolean {
    return c.charCodeAt(0) === 91;
}

export function isLetter(c: string): boolean {
    let code = c.charCodeAt(0);
    return inRange(code, {low: 65, high: 90}) || inRange(code, {low: 97, high: 122});
}
