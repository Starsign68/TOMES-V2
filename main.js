globalThis.txtValue = "";
require.config({ paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/" } });
window.MonacoEnvironment = {
    getWorkerUrl: function (workerId, label) {
        return `data:text/javascript;charset=utf-8 , ${encodeURIComponent(`
self.MonacoEnvironment = { baseUrl: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/" };
importScripts("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/base/worker/workerMain.min.js");` )}`;
    }
};
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}
require(["vs/editor/editor.main"], function () {
    let url = new URL(document.location.href);
    let Lang = url.searchParams.has("lang") ? url.searchParams.get("lang") : "javascript";
    let MiniMap = url.searchParams.has("mm") ? true : false;
    let Theme = url.searchParams.has("theme") ? url.searchParams.get("theme") : "vs-dark";
    const model = monaco.editor.createModel("", Lang, monaco.Uri.parse('inmemory://1'));

    model.onDidChangeContent(() => {
        document.getElementById('saved').innerText = "Changed";
    });
    const editor = monaco.editor.create(document.getElementById("editor"), {
        model,
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
        cursorSurroundingLines: 2,
    });

    // Resize the editor when the window size changes
    const editorElement = document.getElementById("editor");
    window.addEventListener("resize", () => editor.layout({
        width: editorElement.offsetWidth,
        height: editorElement.offsetHeight
    }));
    async function openFile() {
        [fH] = await window.showOpenFilePicker();
        const file = await fH.getFile();
        const contents = await file.text();
        globalThis.txtValue = contents;
        const type = await file.type;
        globalThis.curTyp = type;

    }
    async function saveFile() {
        if (!globalThis?.fH) {
            let fHandle = await window.showSaveFilePicker();
            globalThis.fH = fHandle;
        } else { fHandle = fH };
        const writableStream = await fHandle.createWritable();
        await writableStream.write(globalThis.txtValue);
        await writableStream.close();
    }
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
            saveFile();
            document.getElementById('saved').innerText = "Saved";
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
            saveFile();
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
            openFile().then(() => edi.setValue(globalThis.txtValue));
        }
    });
});

