const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const log = require('electron-log');

// Set up logging
log.transports.file.level = 'debug';
log.info('Application starting...');

// Set ffmpeg path
const ffmpegPath = path.join(__dirname, 'assets', 'ffmpeg', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

log.info(`Setting FFmpeg path to: ${ffmpegPath}`);
log.info(`FFmpeg exists: ${fs.existsSync(ffmpegPath)}`);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'assets', 'icons', 'icon.png')
  });

  mainWindow.loadFile('index.html');
  
  // Uncomment for development tools
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Handle conversion request from renderer
ipcMain.handle('convert-files', async (event, filePaths, format = 'alac') => {
  try {
    log.info(`Starting conversion of ${filePaths.length} files to ${format} format`);
    const results = [];
    
    // To track overall progress
    let completedFiles = 0;
    const totalFiles = filePaths.length;
    const updateProgress = (fileProgress = 0) => {
      const overallProgress = ((completedFiles / totalFiles) * 100) + (fileProgress / totalFiles);
      event.sender.send('conversion-progress', Math.min(overallProgress, 100));
    };
    
    updateProgress(0); // Initial progress update
    
    for (const filePath of filePaths) {
      // Check if it's a FLAC file
      if (!filePath.toLowerCase().endsWith('.flac')) {
        log.warn(`File is not a FLAC file: ${filePath}`);
        results.push({
          success: false,
          original: filePath,
          error: 'Not a FLAC file'
        });
        continue;
      }
      
      // Create output path with appropriate extension
      const extension = format === 'mp3' ? '.mp3' : '.m4a';
      const outputPath = filePath.replace(/\.flac$/i, extension);
      log.info(`Converting ${filePath} to ${outputPath} using ${format} format`);
      
      // Check if input file exists
      if (!fs.existsSync(filePath)) {
        log.error(`Input file does not exist: ${filePath}`);
        results.push({
          success: false,
          original: filePath,
          error: 'Input file does not exist'
        });
        continue;
      }
      
      // Convert file
      await new Promise((resolve, reject) => {
        // Configure FFmpeg based on the selected format
        let command = ffmpeg(filePath);
        
        if (format === 'mp3') {
          // MP3 conversion settings
          command.outputOptions([
            '-c:a libmp3lame',       // Use MP3 codec
            '-b:a 320k',             // Use 320 kbps bitrate
            '-map_metadata 0',       // Copy metadata
            '-id3v2_version 3'       // Use ID3v2.3 tags for better compatibility
          ]);
        } else {
          // ALAC conversion settings (default)
          command.outputOptions([
            '-c:a alac',             // Use ALAC codec
            '-c:v copy',             // Copy video (cover art) stream
            '-map 0'                 // Map all streams
          ])
          .format('ipod');           // M4A container format
        }
        
        command.on('start', (commandLine) => {
            log.info(`FFmpeg command: ${commandLine}`);
          })
          .on('progress', (progress) => {
            log.debug(`Processing: ${progress.percent}% done`);
            // Update progress with current file's progress
            updateProgress(progress.percent || 0);
          })
          .on('end', () => {
            log.info(`Successfully converted ${filePath}`);
            results.push({
              success: true,
              original: filePath,
              output: outputPath
            });
            completedFiles++; // Increment completed files count
            updateProgress(); // Update progress after file completion
            resolve();
          })
          .on('error', (err, stdout, stderr) => {
            log.error(`Error converting ${filePath}:`);
            log.error(`FFmpeg error: ${err.message}`);
            log.error(`FFmpeg stdout: ${stdout}`);
            log.error(`FFmpeg stderr: ${stderr}`);
            results.push({
              success: false,
              original: filePath,
              error: `FFmpeg error: ${err.message}`
            });
            reject(err);
          });
        
        // Save to output file
        command.save(outputPath);
      }).catch(err => {
        log.error(`Promise error: ${err}`);
      });
    }
    
    log.info(`Conversion completed for ${results.length} files`);
    return results;
  } catch (error) {
    log.error('Conversion error:', error);
    return { success: false, error: error.message };
  }
});

// Handle open folder request
ipcMain.on('open-folder', (event, folderPath) => {
  try {
    log.info(`Opening folder: ${folderPath}`);
    require('electron').shell.openPath(folderPath);
  } catch (error) {
    log.error(`Error opening folder: ${error.message}`);
  }
});

// Handle open file dialog
ipcMain.handle('show-open-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'FLAC Files', extensions: ['flac'] }]
  });
  
  return result.filePaths;
}); 