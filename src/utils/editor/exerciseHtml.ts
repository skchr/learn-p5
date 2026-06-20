import { importMap } from "./importmap";
import { p5Source } from "../p5Source";
import { P5_FUNCTION_NAMES } from "../../data/p5Symbols";
import { Colors } from "../../constants/Colors";

const SYMBOL_PATTERN = new RegExp(
  `\\b(${P5_FUNCTION_NAMES.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b(?=\\()`,
  "g"
);

function parseInstructionHtml(text: string): string {
  if (!text) return "";
  let html = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  SYMBOL_PATTERN.lastIndex = 0;

  while ((match = SYMBOL_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      html += escapeHtml(text.slice(lastIndex, match.index));
    }
    html += `<span class="symbol" data-symbol="${match[0]}">${match[0]}</span>`;
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    html += escapeHtml(text.slice(lastIndex));
  }

  return html || escapeHtml(text);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function jsString(s: string): string {
  return JSON.stringify(s.replace(/<\/script>/gi, "<\\/script>"));
}

export function getExerciseHtml(params: {
  title: string;
  moduleName: string;
  instruction: string;
  exerciseNumber: number;
  startingCode: string;
  solution: string;
  colorScheme: "light" | "dark";
}): string {
  const colors = Colors[params.colorScheme === "dark" ? "dark" : "light"];
  const instructionHtml = parseInstructionHtml(params.instruction);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { min-height: 100%; background: ${colors.surface}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

  .description {
    padding: 12px 16px;
    background: ${colors.surfaceContainer};
  }
  .description-title {
    font-family: "SpaceGrotesk", sans-serif;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${colors.primary};
    margin-bottom: 4px;
  }
  .description-text {
    font-size: 16px;
    line-height: 24px;
    color: ${colors.onSurfaceVariant};
  }
  .symbol {
    font-weight: 700;
    text-decoration: underline;
    color: ${colors.primary};
    cursor: pointer;
  }

  .preview-section {
    margin-top: 16px;
    padding: 0 16px;
  }
  .preview-label {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${colors.onSurfaceVariant};
    margin-bottom: 8px;
  }
  .sketch-box {
    height: 180px;
    background: #000000;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sketch-box canvas { display: block; }

  .solution-section {
    margin-top: 16px;
    padding: 0 16px;
  }
  .solution-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    padding: 0;
  }
  .solution-header:active { opacity: 0.7; }

  .editor-section {
    margin-top: 16px;
    margin-left: 16px;
    margin-right: 16px;
    border-radius: 8px;
    overflow: hidden;
    background: #0D0E12;
    min-height: 400px;
    position: relative;
  }
  .cm-editor { height: 100%; font-size: 22px; background: #0D0E12; }
  .cm-editor .cm-scroller { font-family: 'JetBrains Mono', monospace; overflow: auto; }
  .cm-editor.cm-focused { outline: none; }
  .cm-editor .cm-gutters { background: #0D0E12; border-right: 1px solid #292A2E; color: #6B7280; }
  .cm-editor .cm-activeLineGutter { background: rgba(255,255,255,0.03); }
  .cm-editor .cm-activeLine { background: rgba(255,255,255,0.03); }
  .cm-editor .cm-cursor { border-left-color: #ED225D; }
  .cm-editor .cm-selectionBackground,
  .cm-editor.cm-focused .cm-selectionBackground { background: rgba(237, 34, 93, 0.2) !important; }
  .cm-editor .cm-matchingBracket {
    background: rgba(237, 34, 93, 0.3);
    outline: 1px solid #ED225D;
  }
  .toolbar {
    position: absolute;
    top: 4px;
    right: 8px;
    z-index: 10;
    display: flex;
    gap: 4px;
  }
  .toolbar button {
    background: rgba(237, 34, 93, 0.2);
    border: none;
    color: #ED225D;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .toolbar button:active { background: rgba(237, 34, 93, 0.4); }

  .scroll-whitespace {
    height: 700px;
  }
</style>
</head>
<body>

<div class="description">
  <div class="description-title">Exercise ${params.exerciseNumber}: ${escapeHtml(params.title)}</div>
  <div class="description-text">${instructionHtml}</div>
</div>

<div class="preview-section">
  <div class="preview-label">Your Output</div>
  <div id="user-sketch" class="sketch-box"></div>
</div>

${
  params.solution
    ? `<div class="solution-section" id="solution-section" style="display:none">
  <button class="solution-header" id="solution-toggle">
    <span class="preview-label" style="margin-bottom:0">Target Solution</span>
    <span class="solution-chevron" id="solution-chevron">&#9660;</span>
  </button>
  <div id="solution-sketch" class="sketch-box"></div>
</div>`
    : ""
}

<div class="editor-section">
  <div class="toolbar">
    <button id="formatBtn">Format</button>
  </div>
  <div id="editor" style="min-height:400px"></div>
</div>

<div class="scroll-whitespace"></div>

<script>${p5Source}</script>

<script type="importmap">
${JSON.stringify({ imports: importMap }, null, 2)}
</script>

<script type="module">
${getBridgeScript(params.startingCode, params.solution)}
</script>

</body>
</html>`;
}

function getBridgeScript(startingCode: string, solution: string): string {
  const codeArg = jsString(startingCode);
  const solutionArg = jsString(solution);

  return `
import { basicSetup, EditorView, EditorState, keymap } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { indentSelection } from '@codemirror/commands';
import { syntaxHighlighting } from '@codemirror/language';
import { HighlightStyle } from '@codemirror/highlight';
import { tags } from '@lezer/highlight';

const p5Theme = EditorView.theme({
  '&': { backgroundColor: '#0D0E12', color: '#E3E2E7' },
  '.cm-content': { caretColor: '#ED225D', fontFamily: "'JetBrains Mono', monospace" },
  '.cm-gutters': { backgroundColor: '#0D0E12', color: '#6B7280', borderRight: '1px solid #292A2E' },
  '.cm-activeLineGutter': { backgroundColor: 'rgba(255,255,255,0.03)' },
  '.cm-activeLine': { backgroundColor: 'rgba(255,255,255,0.03)' },
  '.cm-cursor': { borderLeftColor: '#ED225D', borderLeftWidth: '2px' },
  '.cm-selectionBackground': { backgroundColor: 'rgba(237, 34, 93, 0.2)' },
  '.cm-matchingBracket': { backgroundColor: 'rgba(237, 34, 93, 0.3)', outline: '1px solid #ED225D' },
});

const p5Highlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#ED225D' },
  { tag: tags.definitionKeyword, color: '#ED225D', fontWeight: 'bold' },
  { tag: tags.moduleKeyword, color: '#ED225D' },
  { tag: tags.controlKeyword, color: '#ED225D' },
  { tag: tags.operator, color: '#E3E2E7' },
  { tag: tags.arithmeticOperator, color: '#E3E2E7' },
  { tag: tags.logicOperator, color: '#E3E2E7' },
  { tag: tags.compareOperator, color: '#E3E2E7' },
  { tag: tags.punctuation, color: '#E3E2E7' },
  { tag: tags.separator, color: '#E3E2E7' },
  { tag: tags.brace, color: '#E3E2E7' },
  { tag: tags.bracket, color: '#E3E2E7' },
  { tag: tags.paren, color: '#E3E2E7' },
  { tag: tags.number, color: '#FF4F75' },
  { tag: tags.string, color: '#22C55E' },
  { tag: tags.bool, color: '#FF4F75' },
  { tag: tags.null, color: '#FF4F75' },
  { tag: tags.variableName, color: '#E3E2E7' },
  { tag: tags.definition(tags.variableName), color: '#FFB2BB' },
  { tag: tags.function(tags.variableName), color: '#FFB2BB' },
  { tag: tags.definition(tags.function(tags.variableName)), color: '#FFB2BB' },
  { tag: tags.propertyName, color: '#FFB2BB' },
  { tag: tags.attributeName, color: '#FFB2BB' },
  { tag: tags.labelName, color: '#FFB2BB' },
  { tag: tags.comment, color: '#6B7280', fontStyle: 'italic' },
  { tag: tags.self, color: '#ED225D' },
  { tag: tags.typeName, color: '#FFB2BB' },
  { tag: tags.className, color: '#FFB2BB' },
  { tag: tags.standard(tags.tagName), color: '#ED225D' },
  { tag: tags.meta, color: '#FFB2BB' },
  { tag: tags.invalid, color: '#ED225D' },
  { tag: tags.modifier, color: '#ED225D' },
  { tag: tags.constant(tags.variableName), color: '#FF4F75' },
  { tag: tags.special(tags.variableName), color: '#FF4F75' },
]);

let view;
const SOLUTION_CODE = ${solutionArg};

function createEditor(initialCode) {
  const state = EditorState.create({
    doc: initialCode || '',
    extensions: [
      basicSetup,
      javascript(),
      p5Theme,
      syntaxHighlighting(p5Highlight),
      keymap.of([{ key: 'Ctrl-s', run: () => true }, { key: 'Cmd-s', run: () => true }]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          postCodeChange(update.state.doc.toString());
        }
      }),
    ],
  });
  view = new EditorView({ state, parent: document.getElementById('editor') });
  postReady();
  setTimeout(function() {
    view.dom.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 300);
}

function postCodeChange(code) {
  if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'codeChange', code }));
  }
}

function postReady() {
  if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
  }
}

function postOpenRef(symbol) {
  if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'openRef', symbol }));
  }
}

function renderSketch(containerId, code) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var scriptId = containerId + '-script';
  var oldScript = document.getElementById(scriptId);
  if (oldScript) oldScript.remove();

  if (container.__p5) {
    container.__p5.remove();
    container.__p5 = null;
  }
  container.innerHTML = '';

  if (!code) return;

  var script = document.createElement('script');
  script.id = scriptId;
  script.textContent = code;
  document.body.appendChild(script);

  try {
    container.__p5 = new p5(undefined, container);
  } catch(e) {
    console.error('Sketch render error:', e);
  }
}

function renderAllSketches(userCode, solutionCode) {
  renderSketch('user-sketch', userCode);
  if (solutionCode) {
    renderSketch('solution-sketch', solutionCode);
  }
}

function handleMessage(data) {
  try {
    var msg = typeof data === 'string' ? JSON.parse(data) : data;
    switch (msg.type) {
      case 'setCode':
        if (view && msg.code !== view.state.doc.toString()) {
          view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: msg.code },
          });
        }
        break;
      case 'insert':
        if (view) {
          var cursor = view.state.selection.main.head;
          view.dispatch({
            changes: { from: cursor, insert: msg.text },
            selection: { anchor: cursor + (msg.cursorOffset !== undefined ? msg.cursorOffset : msg.text.length) },
          });
          view.focus();
        }
        break;
      case 'focus':
        if (view) {
          view.dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function() { view.focus(); }, 200);
        }
        break;
      case 'setFontSize':
        var scroller = view && view.dom && view.dom.querySelector('.cm-scroller');
        if (scroller) scroller.style.fontSize = msg.fontSize + 'px';
        break;
      case 'runSketch':
        renderAllSketches(msg.code || view.state.doc.toString(), SOLUTION_CODE);
        break;
    }
  } catch(e) {}
}

window.addEventListener('message', function(event) { handleMessage(event.data); });
document.addEventListener('message', function(event) { handleMessage(event.data); });

document.getElementById('formatBtn').addEventListener('click', function() {
  if (view) {
    view.dispatch({ selection: { anchor: 0, head: view.state.doc.length } });
    indentSelection({ state: view.state, dispatch: view.dispatch });
    view.dispatch({ selection: { anchor: view.state.doc.length } });
  }
});

document.querySelectorAll('.symbol').forEach(function(el) {
  el.addEventListener('click', function() {
    postOpenRef(el.getAttribute('data-symbol'));
  });
});

var solutionToggle = document.getElementById('solution-toggle');
if (solutionToggle) {
  solutionToggle.addEventListener('click', function() {
    var section = document.getElementById('solution-section');
    var chevron = document.getElementById('solution-chevron');
    if (section) {
      var isVisible = section.style.display !== 'none';
      section.style.display = isVisible ? 'none' : '';
      if (chevron) chevron.innerHTML = isVisible ? '&#9660;' : '&#9650;';
    }
  });
}

createEditor(${codeArg});
`;
}
