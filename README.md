# FLAC to ALAC/MP3 Converter

A simple desktop application to convert FLAC audio files to Apple Lossless (ALAC/M4A) or MP3 format.

## Features

- Convert FLAC to ALAC/M4A without quality loss
- Convert FLAC to MP3 (320kbps) for maximum compatibility
- Preserve all metadata and cover art during conversion
- Simple drag-and-drop interface
- Support for batch processing
- Sleek dark theme with animated background
- Visual feedback with progress indication

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [FFmpeg](https://ffmpeg.org/download.html) (required for audio conversion)

## Setup

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Download FFmpeg binaries and place them in the `assets/ffmpeg` folder:
   - For Windows: Place `ffmpeg.exe` in the `assets/ffmpeg` folder
   - For macOS/Linux: Place the `ffmpeg` binary in the `assets/ffmpeg` folder

## Usage

To start the application:
```
npm start
```

### Converting Files

1. Drag and drop FLAC files onto the drop area, or click "Select Files" to browse
2. Choose your desired output format (ALAC or MP3)
3. Click "Convert Files" to start the conversion process
4. The application will convert all files and show the results
5. Converted files will be saved in the same location as the source files with the appropriate extension (`.m4a` for ALAC or `.mp3` for MP3)
6. You can open the folder containing converted files by clicking the "Open Folder" button

## Building from Source

To build the application for your platform:
```
npm install
npm run make
```

This will create distributable packages in the `out` folder.

## Download

You can download pre-built packages from the [Releases](https://github.com/gzizouseif24/Converter/releases) page.

### Windows
- Download the `.exe` installer and run it
- Or download the `.zip` file, extract it, and run the executable

### macOS
- Download the `.dmg` file, open it, and drag the application to your Applications folder
- Or download the `.zip` file and extract it

### Linux
- Download the `.deb` or `.rpm` package and install it using your package manager
- Or download the `.zip` file, extract it, and run the executable

## Publishing Your Own Fork

If you've made changes and want to distribute your own version:

1. Fork this repository
2. Make your changes
3. Update the `forge.config.js` file with your GitHub username
4. Run `npm run publish` to build and publish your app to GitHub Releases

## License

MIT