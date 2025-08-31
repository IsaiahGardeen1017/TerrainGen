const symbols = '(),{}=+-.;';
const numbers = '123456890';

const keyWords = ['void', 'vec4', 'vec3', 'vec2', 'out', 'in', 'flaot'];
const whitespace = [' ', '/r', '/n'];
const symbolArr = symbols.split('');
const numberArr = numbers.split('');

export type Type = 'keyword' | 'symbol' | 'func' | 'var' | 'number' | 'whitespace';
export function addSyntaxHighlightSpans(glsl: string): string {
	const tokens = tokenize(glsl);
	return tokensToSpans(tokens);
}

function tokensToSpans(tokens: string[]): string {
	const outStrs: string[] = [];
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const tokenType = determineTokenType(tokens, i);
		if (tokenType === 'whitespace') {
			outStrs.push(token);
		} else {
			outStrs.push(span(token, tokenType));
		}
	}
	return outStrs.join('');
}

export function determineTokenType(tokens: string[], index: number): Type {
	const token = tokens[index];
	if (whitespace.includes(token)) {
		return ('whitespace');
	} else if (symbolArr.includes(token)) {
		return ('symbol');
	} else if (numberArr.includes(token.charAt(0))) {
		return ('number');
	} else if (keyWords.includes(token)) {
		return ('keyword');
	} else if (index !== tokens.length && tokens[index + 1] === '(') {
		return ('func');
	} else {
		return ('var');
	}
}

export function tokenize(glsl: string): string[] {
	const textCharArr = glsl.split('');

	let currWord = '';

	let words: string[] = [];
	for (let i = 0; i < textCharArr.length; i++) {
		const char = textCharArr[i];

		if (char === '\r') {
			//Do nothing
		} else if (char === ' ' || char === '\n' || char === '\r') {
			//Nothing
			if (currWord) {
				words.push(currWord);
			}
			currWord = '';

			words.push(char);
		} else if (symbolArr.includes(char)) {
			//Symbol

			if (currWord) {
				words.push(currWord);
			}
			currWord = '';

			words.push(char);
		} else {
			currWord += char;
		}
	}
	return words;
}

export function span(value: string, type: Type) {
	if (type === 'whitespace') {
		return value;
	}
	return `<span class="code-${type}">${value}</span>`;
}
