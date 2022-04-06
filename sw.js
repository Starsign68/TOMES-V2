globalThis.txtValue = "";
require.config({ paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/" } });
window.MonacoEnvironment = {
    getWorkerUrl: function (workerId, label) {
        return `data:text/javascript;charset=utf-8 , ${encodeURIComponent(`
self.MonacoEnvironment = { baseUrl: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/" };
importScripts("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/base/worker/workerMain.min.js");` )}`;
    }
};

require(["vs/editor/editor.main"], function () {
    let url = new URL(document.location.href);
    let Lang = url.searchParams.has("lang") ? url.searchParams.get("lang") : "javascript";
    let MiniMap = url.searchParams.has("mm") ? true : false;
    let Theme = url.searchParams.has("theme") ? url.searchParams.get("theme") : "vs-dark";
    const editor = monaco.editor.create(document.getElementById("editor"), {
        value: "",
        loading: "",
        language: Lang,
        theme: Theme,
        autoIndent: true,
        cursorBlinking: "phase",
        cursorSmoothCaretAnimation: true,
        cursorStyle: "line-thin",
        fontSize: 15,
        lineHeight: 1.5,
        minimap: { enabled: MiniMap, renderCharacters: false },
        multiCursorModifier: "ctrlCmd",
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        smoothScrolling: false,
    });
    // Resize the editor when the window size changes
    const editorElement = document.getElementById("editor");
    window.addEventListener("resize", () => editor.layout({
        width: editorElement.offsetWidth,
        height: editorElement.offsetHeight
    }));
    let Open = editor.addCommand(
        0,
        function (edi) {
            alert('Opening!');
        },
        ''
    );

    let Save = editor.addCommand(
        0,
        function (edi) {
            alert('Saving!');
        },
        ''
    );
    editor.addAction({
        // An unique identifier of the contributed action.
        id: 're-init',

        // A label of the action that will be presented to the user.
        label: 'Reload the Editor.',

        // An optional array of keybindings for the action.
        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR

        ],

        // An optional precondition for this action.
        precondition: null,

        // An optional rule to evaluate on top of the precondition in order to dispatch the keybindings.
        keybindingContext: null,

        contextMenuOrder: 0,

        /** Method that will be executed when the action is triggered.
         *  - `editor` -- The editor instance is passed in as a convenience
         */
        run: function (edi) {
            globalThis.edi = edi;
        }
    });

    editor.addAction({
        id: 'short-help',

        label: 'Show Menu.',

        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Space,
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
        ],
        contextMenuOrder: 0,

        run: function (edi) {
            edi._actions["editor.action.quickCommand"]._run();
        }
    });

    editor.addAction({
        id: 'save-edits',

        label: 'Save To Cached File.',

        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS
        ],

        contextMenuOrder: 0,

        run: function (edi) {
            globalThis.txtValue = edi.getValue();
            DEV.saveFile();
        }
    });

    editor.addAction({
        id: 'save-edits-as',

        label: 'Save To New File.',

        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS
        ],

        contextMenuOrder: 0,

        run: function (edi) {
            globalThis.txtValue = edi.getValue();
            DEV.saveFileAs();
        }
    });

    editor.addAction({
        id: 'open-edits-from',

        label: 'Open a file.',

        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO
        ],

        contextMenuOrder: 0,

        run: function (edi) {
            DEV.openFile().then(() => edi.setValue(globalThis.txtValue));
        }
    });


});
const optionsO = {
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "on",
    accessibilitySupport: "auto",
    autoIndent: true,
    automaticLayout: true,
    codeLens: true,
    colorDecorators: true,
    contextmenu: true,
    cursorBlinking: "phase",
    cursorSmoothCaretAnimation: true,
    cursorStyle: "line-thin",
    disableLayerHinting: false,
    disableMonospaceOptimizations: false,
    dragAndDrop: false,
    fixedOverflowWidgets: false,
    folding: true,
    foldingStrategy: "auto",
    fontLigatures: false,
    fontSize: 14,
    formatOnPaste: false,
    formatOnType: false,
    hideCursorInOverviewRuler: false,
    highlightActiveIndentGuide: true,
    glyphMargin: true,
    lineHeight: 1.5,
    links: true,
    mouseWheelZoom: false,
    multiCursorMergeOverlapping: true,
    multiCursorModifier: "ctrlKey",
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    quickSuggestions: true,
    quickSuggestionsDelay: 500,
    readOnly: false,
    renderControlCharacters: false,
    renderFinalNewline: true,
    renderIndentGuides: true,
    renderLineHighlight: "all",
    renderWhitespace: "none",
    revealHorizontalRightPadding: "none",
    roundedSelection: false,
    rulers: [],
    scrollBeyondLastColumn: false,
    scrollBeyondLastLine: false,
    selectOnLineNumbers: true,
    selectionClipboard: true,
    selectionHighlight: true,
    showFoldingControls: "mouseover",
    smoothScrolling: false,
    snippetSuggestions: "top",
    suggestOnTriggerCharacters: true,
    wordBasedSuggestions: true,
    wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
    wordWrap: "off",
    wordWrapBreakAfterCharacters: "\t})]?|&,;",
    wordWrapBreakBeforeCharacters: "{([+ ",
    wordWrapBreakObtrusiveCharacters: ".",
    wordWrapColumn: 80,
    wordWrapMinified: true,
    wrappingIndent: "none",
    minimap: { enabled: false, renderCharacters: false },
    padding: { top: "0px", bottom: "0px" },
};