import { addSyntaxHighlightSpans } from '../syntaxHighlighter.ts';

export function codeSnippetById(id: string) {
}

export function codeSnippet(code: string) {
	const highlightedCode = addSyntaxHighlightSpans(code);
	return `
    <div class="code-snippet">
        <code>
            <pre>
${highlightedCode}
            </pre>
        </code>
    </div>
    `;
}
