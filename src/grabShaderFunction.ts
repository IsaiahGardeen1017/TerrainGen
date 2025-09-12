import { determineTokenType, span, tokenize, Type } from './syntaxHighlighter.ts';

export function getFunctions(shader: string): Record<string, string> {
	const funcs: Record<string, string> = {};
	let currFunc: string[] = [];
	let inFunc = false;
	let funcName = '';
	let bracketDepth = 0;
	const tokens = tokenize(shader);
	for (let i = 0; i < tokens.length; i++) {
		const tokenType = determineTokenType(tokens, i);
		if (tokenType === 'func') {
			inFunc = true;
			funcName = tokens[i];
			currFunc.push(tokens[i - 2]);
			currFunc.push(tokens[i - 1]);
		}
		if (inFunc) {
			currFunc.push(tokens[i]);
			if (tokens[i] === '{') {
				bracketDepth++;
			}
			if (tokens[i] === '}') {
				bracketDepth--;
				if (bracketDepth <= 0) {
					//End of function
					inFunc = false;
					funcs[funcName] = currFunc.join('');
					currFunc = [];
					funcName = '';
				}
			}
		}
	}

	return funcs;
}
