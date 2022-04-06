        const DEV = {
          DEVName: 'Text Editor',
          file: {
            handle: null,
            name: "Standerd",
            isModified: false,
          },
          options: {
            captureTabs: true,
            fontSize: 14,
            monoSpace: false,
            wordWrap: true,
          },
          hasFSAccess: 'chooseFileSystemEntries' in window ||
            'showOpenFilePicker' in window,
        };
      DEV.setText = (val) => {
globalThis.txtValue = val;};
        DEV.saveFile = async () => {
          try {
            if (!DEV.file.handle) {
              return await DEV.saveFileAs();
            }
            await writeFile(DEV.file.handle, DEV.getText());
            DEV.setModified(false);
          } catch (ex) {
            const msg = 'Unable to save file';
            console.error(msg, ex);
            alert(msg);
          }
        }
        DEV.setFile = (fileHandle) => {
          if (fileHandle && fileHandle.name) {
            DEV.file.handle = fileHandle;
            DEV.file.name = fileHandle.name;
            document.title = `${fileHandle.name} - ${DEV.DEVName}`;
          } else {
            DEV.file.handle = null;
            DEV.file.name = "thisIsCool";
            document.title = DEV.DEVName;
          }
        };
      DEV.getText = () => {
          return globalThis.txtValue;
        };
        DEV.setModified = (val) => {
          if (!DEV.hasFSAccess) {
            return;
          }
          DEV.file.isModified = val;
        }
        DEV.saveFileAs = async () => {
          let fileHandle;
          try {
            fileHandle = await getNewFileHandle();
          } catch (ex) {
            if (ex.name === 'AbortError') {
              return;
            }
            const msg = 'An error occured trying to open the file.';
            console.error(msg, ex);
            alert(msg);
            return;
          }
          try {
            await writeFile(fileHandle,DEV.getText());
            DEV.setFile(fileHandle);
            DEV.setModified(false);
          } catch (ex) {
            const msg = 'Unable to save file.';
            console.error(msg, ex);
            alert(msg);
            return;
          }
        };
        /**
         * Open a handle to an existing file on the local file system.
         *
         * @return {!Promise<FileSystemFileHandle>} Handle to the existing file.
         */
        function getFileHandle() {
          if ('showOpenFilePicker' in window) {
            return window.showOpenFilePicker().then((handles) => handles[0]);
          }
        }
        /**
         * Create a handle to a new (text) file on the local file system.
         *
         * @return {!Promise<FileSystemFileHandle>} Handle to the new file.
         */
        function getNewFileHandle() {
          // For Chrome 86 and later...
          if ('showSaveFilePicker' in window) {
            const opts = {
              types: [{
                description: 'Text file',
                accept: {
                  'text/plain': ['.txt']
                },
              }, {
                description: 'JS file',
                accept: {
                  'text/javascript': ['.js']
                },
              }, {
                description: 'HTML file',
                accept: {
                  'text/html': ['.html']
                },
              }],
            };
            return window.showSaveFilePicker(opts);
          }
        }
      function readAFile(file) {
        // If the new .text() reader is available, use it.
        if (file.text) {
          return file.text();
        }};
        /**
         * Reads the raw text from a file.
         *
         * @param {File} file
         * @return {!Promise<string>} A promise that resolves to the parsed string.
         */
        DEV.readFile = async (file, fileHandle) => {
        try {
          DEV.setFile(fileHandle || file.name);
          DEV.setText(await readAFile(file));
          DEV.setModified(false);
        } catch (ex) {
          const msg = `An error occured reading. ${ex}`;
          console.error(msg, ex);
          alert(msg);
        }
      };
      /**
       * Opens a file for reading.
       *
       * @param {FileSystemFileHandle} fileHandle File handle to read from.
       */
      DEV.openFile = async (fileHandle) => {
        
        // If a fileHandle is provided, verify we have permission to read/write it,
        // otherwise, show the file open prompt and allow the user to select the file.
        if (fileHandle) {
          if (await verifyPermission(fileHandle, true) === false) {
            console.error(`User did not grant permission to '${fileHandle.name}'`);
            return;
          }
        } else {
          try {
            fileHandle = await getFileHandle();
          } catch (ex) {
            if (ex.name === 'AbortError') {
              return;
            }
            const msg = 'An error occured trying to open the file: ' + ex;
            console.error(msg, ex);
            alert(msg);
          }
        }
      
        if (!fileHandle) {
          return;
        }
        const file = await fileHandle.getFile();
        DEV.readFile(file, fileHandle);
        return await DEV.readFile(file, fileHandle);
      };  
      
      /**
         * Writes the contents to disk.
         *
         * @param {FileSystemFileHandle} fileHandle File handle to write to.
         * @param {string} contents Contents to write.
         */
        async function writeFile(fileHandle, contents) {
          // Create a FileSystemWritableFileStream to write to.
          const writable = await fileHandle.createWritable();
          // Write the contents of the file to the stream.
          await writable.write(contents);
          // Close the file and write the contents to disk.
          await writable.close();
        }
        DEV.newFile = () => {  
        DEV.setText();
        DEV.setFile();
        DEV.setModified(false);
      }
        /**
         * Verify the user has granted permission to read or write to the file, if
         * permission hasn't been granted, request permission.
         *
         * @param {FileSystemFileHandle} fileHandle File handle to check.
         * @param {boolean} withWrite True if write permission should be checked.
         * @return {boolean} True if the user has granted read/write permission.
         */
        async function verifyPermission(fileHandle, withWrite) {
          const opts = {};
          if (withWrite) {
            opts.writable = true;
            opts.mode = 'readwrite';
          }
          if (await fileHandle.queryPermission(opts) === 'granted') {
            return true;
          }
          if (await fileHandle.requestPermission(opts) === 'granted') {
            return true;
          }
          return false;
        }
globalThis.dev = DEV;