const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    convertFiles: (filePaths, format) => ipcRenderer.invoke('convert-files', filePaths, format),
    openFileDialog: () => ipcRenderer.invoke('show-open-dialog'),
    openFolder: (folderPath) => ipcRenderer.send('open-folder', folderPath),
    onProgress: (callback) => ipcRenderer.on('conversion-progress', (_, percent) => callback(percent))
  }
);