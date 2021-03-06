CodeMirror.registerHelper('lint', 'javascript', text => {
  const [compiledOutput, errMsg] = compile('try.dre', text)

  if (errMsg) {
    const [startLine, startCol, endLine, endCol, message] = errMsg.split(':')
    const error = {
      from: CodeMirror.Pos(Number(startLine) - 1, Number(startCol)),
      to: CodeMirror.Pos(Number(endLine) - 1, Number(endCol)),
      message: message
    }

    return [error]
  } else {
    return []
  }
})

const inputEditorEl = document.getElementById('input')
const inputEditor = CodeMirror.fromTextArea(inputEditorEl, {
  lineNumbers: true,
  mode: 'text/typescript',
  gutters: ['CodeMirror-lint-markers'],
  lint: true,
  autoCloseBrackets: true,
  matchBrackets: true
})

const outputEditorEl = document.getElementById('output')
const outputEditor = CodeMirror.fromTextArea(outputEditorEl, {
  lineNumbers: true,
  mode: 'rust',
  readOnly: true
})

inputEditor.on('change', () => {
  const inputEditorVal = inputEditor.getValue()
  const [compiledOutput, errMsg] = compile('try.dre', inputEditorVal)

  if (compiledOutput) {
    outputEditor.setValue(compiledOutput)
  }
})

const exampleDre = `
declare module "fetch" {
  declare interface FetchOptions {
    mode: string;
    body: string;
  }

  declare function fetch(url: string, options: FetchOptions): string;
}
`.trim()

inputEditor.setValue(exampleDre)
