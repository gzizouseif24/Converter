const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

console.log('FFmpeg Setup Verification Tool');
console.log('------------------------------');

// Check if FFmpeg exists in assets folder
const ffmpegPath = path.join(__dirname, 'assets', 'ffmpeg', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
console.log(`Looking for FFmpeg at: ${ffmpegPath}`);

if (!fs.existsSync(ffmpegPath)) {
  console.error('❌ ERROR: FFmpeg not found at the expected location!');
  console.log('\nPlease download FFmpeg and place it in the assets/ffmpeg directory:');
  console.log('1. Download from: https://github.com/BtbN/FFmpeg-Builds/releases');
  console.log('2. Extract the archive');
  console.log('3. Copy the ffmpeg.exe file from the bin directory to:');
  console.log(`   ${ffmpegPath}`);
  process.exit(1);
}

console.log('✅ FFmpeg found!');

// Try to execute FFmpeg
console.log('\nTesting FFmpeg...');
execFile(ffmpegPath, ['-version'], (error, stdout, stderr) => {
  if (error) {
    console.error('❌ ERROR: Failed to execute FFmpeg:');
    console.error(error);
    process.exit(1);
  }
  
  console.log('✅ FFmpeg works correctly!');
  console.log('\nFFmpeg version information:');
  console.log(stdout);
  
  console.log('\nAll checks passed. Your FFmpeg setup is correct.');
  console.log('You can now run the application with: npm start');
}); 