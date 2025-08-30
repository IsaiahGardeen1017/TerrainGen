import { determineTokenType, tokenize, Type } from './syntaxHighlighter.ts';

export function getFunctions(shader: string): Record<string,string> {
	const funcs: Record<string,string> = {};
    let currFunc = '';
    let inFunc = false;
    const tokens = tokenize(shader);
    for(let i = 0; i < tokens.length){
        const tokenType = determineTokenType(tokens, i);
        if(tokenType === 'func'){
            
        }
    }

    return funcs;
}
