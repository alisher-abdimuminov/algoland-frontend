import katex from "katex";
import { unified } from 'unified';
import { h, type VNode } from 'vue';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkToc from 'remark-toc';
import type { Root, Content, Heading, Text } from 'mdast';

// components
import Ol from '~/components/mark/Ol.vue';
import Ul from '~/components/mark/Ul.vue';
import Li from '~/components/mark/Li.vue';
import Th from '~/components/mark/MTh.vue';
import Code from '~/components/mark/Code.vue';
import Pure from "~/components/mark/Pure.vue";
import Link from '~/components/mark/Link.vue';
import Table from '~/components/mark/MTable.vue';
import TableRow from '~/components/mark/MTableRow.vue';
import TableCell from '~/components/mark/MTableCell.vue';
import CodeSpan from '~/components/mark/CodeSpan.vue';
import Blockquote from '~/components/mark/Blockquote.vue';
import Icon from "~/components/custom/Icon.vue";
import AspectRatio from "~/components/ui/aspect-ratio/AspectRatio.vue";
import Read from "~/components/mark/Read.vue";

const processor = unified()
                    .use(remarkParse)
                    .use(remarkMath)
                    .use(remarkGfm)
                    .use(remarkToc)
                    .use(remarkDirective);

const headingClass = (depth: number) => {
    if (depth === 1) {
        return "text-3xl";
    } else if (depth === 2) {
        return "text-2xl";
    } else if (depth === 3) {
        return "text-xl";
    } else if (depth === 4) {
        return "text-lg";
    } else if (depth === 5) {
        return "text-sm";
    } else if (depth === 6) {
        return "text-xs";
    }
}

function convertToVNode(node: Content): VNode {
    // Headings
    if (node.type === 'heading') {
        const headingNode = node as Heading;
        return h(`h${headingNode.depth}`, {
            class: headingClass(node.depth)
        }, headingNode.children.map(convertToVNode));
    }

    // Paragraph
    else if (node.type === 'paragraph') {
        return h('div', {}, node.children.map(convertToVNode));
    }

    // Text
    else if (node.type === 'text') {
        return h('span', {}, (node as Text).value);
    }

    // Bold
    else if (node.type === 'strong') {
        return h('strong', {}, node.children.map(convertToVNode));
    }

    // Italic
    else if (node.type === 'emphasis') {
        return h('em', {}, node.children.map(convertToVNode));
    }

    else if (node.type === "delete") {
        return h("s", {}, node.children.map(convertToVNode));
    }

    // List
    else if (node.type === 'list') {
        return h(node.ordered ? Ol : Ul, {}, {
            default: () => node.children.map(convertToVNode)
        });
    }
    else if (node.type === 'listItem') {
        return h(Li, {
            checked: node.checked
        }, {
            default: () => node.children.map(convertToVNode)
        });
    }

    // Link
    else if (node.type === 'link') {
        return h(Link, { to: node.url }, {
            default: () => node.children.map(convertToVNode)
        });
    }

    // Image
    else if (node.type === "image") {
        return h("div", {
            class: "my-1 flex flex-col items-center justify-center gap-1"
        }, [
            h("img", { src: node.url, alt: node.alt, class: "rounded-md " }),
            node.alt ? h("p", { class: "text-xs text-muted-foreground" }, node.alt) : null,
        ]);
    }

    // Blockquote
    else if (node.type === 'blockquote') {
        return h(Blockquote, {}, {
            default: () => node.children.map(convertToVNode)
        });
    }

    // CodeSpan
    else if (node.type === 'inlineCode') {
        return h(CodeSpan, {
            value: node.value
        });
    }

    // Code
    else if (node.type === 'code') {
        return h(Code, { lang: node.lang ? node.lang : 'plain', code: node.value, meta: node.meta });
    }

    // Table
    else if (node.type === "table") {
        return h(Table, {},{
            default: () => [
                h("thead", {}, [
                    h(TableRow, {}, {
                        default: () => node.children[0].children.map((cell) =>
                            h(Th, {}, {
                                default: () => cell.children.map(convertToVNode)
                            })
                        )
                    })
                ]),
                h("tbody", {}, node.children.slice(1).map((row) =>
                    h(TableRow, {}, {
                        default: () => row.children.map((cell) =>
                            h(TableCell, {}, {
                                default: () => cell.children.map(convertToVNode)
                            })
                        )
                    })
                )),
            ]
        });
    }

    // Math
    else if (node.type === "inlineMath") {
        return h("code", { class: "cursor-pointer p-1 text-xs border bg-accent/30 rounded-md inline-flex gap-1 items-center", innerHTML: katex.renderToString(node.value, { throwOnError: false }) });
    }
    else if (node.type === "math") {
        return h("code", { class: "w-full  rounded-md p-2 my-2 overflow-auto cursor-pointer block inline-flex gap-1 items-center justify-center", innerHTML: katex.renderToString(node.value, { throwOnError: false }) });
    }
    
    // HR
    else if (node.type === 'thematicBreak') {
        return h('hr', { class: "my-2" });
    }

    // HTML
    else if (node.type === "html") {
        return h(Pure, {}, {
            default: () => node.value
        })
    }

    // Leaf directives
    else if (node.type === "textDirective") {
        if (node.name === "icon") {
            return h(Icon, { name: (node.attributes && node.attributes.name) ? node.attributes.name : "" })
        } else if (node.name === "read") {
            console.log(node);
            if (node.attributes) {
                return h(Read, { to: node.attributes.to ? node.attributes.to : '#' }, [])
            }
        }
    }

    return h('span', {}, `Unsupported: ${node.type}`);
}


export default function mark(content: string){
    const tree = processor.parse(content) as Root;
    const nodes: VNode[] = tree.children.map(convertToVNode);
    return nodes;
}