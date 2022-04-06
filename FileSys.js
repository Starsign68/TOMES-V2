async function openFile() {
  if ('showOpenFilePicker' in window) { 
    [fileHandle] = await window.showOpenFilePicker(); 
    const file = await fileHandle.getFile(); 
    const contents = await file.text(); 
    globalThis.txtValue = contents; 
  } else {
    alert('API not supported');
  }
}
async function saveFile() {
  if ('showSaveFilePicker' in window) { 
    const newHandle = await window.showSaveFilePicker(); 
      const writableStream = await newHandle.createWritable(); 
        await writableStream.write(globalThis.txtValue); 
      await writableStream.close(); 
  }
}
