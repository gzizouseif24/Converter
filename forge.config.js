module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icons/icon',
    extraResource: [
      "./assets/ffmpeg"
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: "flac_alac_converter",
        iconUrl: 'https://raw.githubusercontent.com/gzizouseif24/Converter/main/assets/icons/icon.ico',
        setupIcon: './assets/icons/icon.ico'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './assets/icons/icon.png'
        }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'gzizouseif24',
          name: 'Converter'
        },
        prerelease: false
      }
    }
  ]
};
