import { defineNuxtPlugin } from '#app';
import * as monaco from 'monaco-editor';

export default defineNuxtPlugin(() => {
    if (process.server) return;

    // register v language hihglighting
    monaco.languages.register({ id: 'v' });

    monaco.languages.setMonarchTokensProvider('v', {
        tokenizer: {
            root: [
                // Keywords
                [/\b(fn|mut|pub|const|struct|enum|return|if|else|for|match|go|defer|unsafe|type|import|module|interface|or|as|is|in|continue|break|true|false|map|shared|lock|rlock|atomic|assert|sizeof|typeof|dump|select|spawn)\b/, 'keyword'],

                // Built-in types
                [/\b(bool|int|i8|i16|i32|i64|i128|u8|u16|u32|u64|u128|f32|f64|rune|string|char|void|any|none)\b/, 'type'],

                // Constants (true, false, nil)
                [/\b(true|false|nil)\b/, 'constant'],

                // Function names
                [/\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/, 'function'],

                // Numbers
                [/\b\d+(\.\d+)?\b/, 'number'],

                // Strings
                [/\".*?\"/, 'string'],

                // Characters
                [/'\\?.'/, 'string'],

                // Comments
                [/\/\/.*/, 'comment'],
                [/\/\*[\s\S]*?\*\//, 'comment'],
            ],
        },
    });

    // Add V language configuration
    monaco.languages.setLanguageConfiguration('v', {
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/'],
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
        ],
        indentationRules: {
            increaseIndentPattern: /{[^}"']*$/,
            decreaseIndentPattern: /^}/,
        },
    });


    // register zig language highlighting
    monaco.languages.register({ id: 'zig' });

    monaco.languages.setMonarchTokensProvider('zig', {
        tokenizer: {
            root: [
                // Keywords
                [/\b(fn|var|const|pub|export|inline|comptime|if|else|for|while|return|break|continue|switch|defer|errdefer|usingnamespace|async|await|try|catch|error)\b/, 'keyword'],

                // Built-in types
                [/\b(u\d+|i\d+|f\d+|bool|void|anyerror|noreturn|type|anytype|usize|isize|c_int|c_uint)\b/, 'type'],

                // Constants (true, false, null)
                [/\b(true|false|null)\b/, 'constant'],

                // Function names
                [/\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/, 'function'],

                // Numbers
                [/\b\d+(\.\d+)?\b/, 'number'],

                // Strings
                [/\".*?\"/, 'string'],

                // Characters
                [/'\\?.'/, 'string'],

                // Comments
                [/\/\/.*/, 'comment'],
                [/\/\*[\s\S]*?\*\//, 'comment'],
            ],
        },
    });

    monaco.languages.setLanguageConfiguration('zig', {
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/'],
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
        ],
        indentationRules: {
            increaseIndentPattern: /{[^}"']*$/,
            decreaseIndentPattern: /^}/,
        },
    });


    monaco.editor.defineTheme('algo-dark', {
        base: 'vs-dark', // Base theme
        inherit: true, // Inherit base styles
        rules: [
            // { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' }, // Pink keywords
            // { token: 'type', foreground: '8be9fd', fontStyle: 'italic' }, // Blue types
            // { token: 'constant', foreground: 'bd93f9' }, // Purple constants
            // { token: 'function', foreground: '50fa7b' }, // Green functions
            // { token: 'number', foreground: 'ffb86c' }, // Orange numbers
            // { token: 'string', foreground: 'f1fa8c' }, // Yellow strings
            // { token: 'comment', foreground: '6272a4', fontStyle: 'italic' }, // Gray comments
        ],
        colors: {
            // 'editor.foreground': '#f8f8f2',
            // 'editor.background': '#0f0d0c',
            // 'editor.selectionBackground': '#44475a',
            // 'editor.lineHighlightBackground': '#383a59',
            // 'editorCursor.foreground': '#f8f8f0',
            // 'editorWhitespace.foreground': '#3b3b4d',
        },
    });

    // set tabsize globally
    monaco.editor.getModels().forEach(model => {
        model.updateOptions({
            tabSize: 4,
            insertSpaces: true,
        });
    });
});
