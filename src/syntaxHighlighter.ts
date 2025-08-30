const symbols = '(),{}=+-.;';
const numbers = '123456890';

const keyWords = ['void', 'vec4', 'vec3', 'vec2', 'out', 'in', 'flaot'];
const whitespace = [' ', '/r', '/n'];
const symbolArr = symbols.split('');
const numberArr = numbers.split('');

type Type = 'keyword' | 'symbol' | 'func' | 'var' | 'number';
export function addSyntaxHighlightSpans(glsl: string): string {
	const tokens = tokenize(glsl);
	return tokensToSpans(tokens);
}

function tokensToSpans(tokens: string[]): string {
	const outStrs: string[] = [];

	for (let i = 0; i < tokens.length; i++) {
		let token = tokens[i];

		if (whitespace.includes(token)) {
			outStrs.push(token);
		} else if (symbolArr.includes(token)) {
			outStrs.push(span(token, 'symbol'));
		} else if (numberArr.includes(token.charAt(0))) {
			outStrs.push(span(token, 'number'));
		} else if (keyWords.includes(token)) {
			outStrs.push(span(token, 'keyword'));
		} else if (i !== tokens.length && tokens[i + 1] === '(') {
			outStrs.push(span(token, 'func'));
		} else {
			outStrs.push(span(token, 'var'));
		}
	}

	return outStrs.join('');
}

function tokenize(glsl: string): string[] {
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

function span(value: string, type: Type) {
	return `<span class="code-${type}">${value}</span>`;
}
