import WebTorrent from 'webtorrent';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import Transfers from './collections/transfers.js';

Meteor.startup(() => {
  const webTorrentClient = new WebTorrent();

  // on startup all transfers should be mark as stopped
  async function transfersStopped() {
    await Transfers.update({}, { $set:
      { stopped: true, downloadSpeed: 0, uploadSpeed: 0 },
    }, { multi: true });
  }
  webTorrentClient.on('ready', () => {
    transfersStopped();
  });
  webTorrentClient.on('error', (error) => {
    console.log('client error', error);
  });

  async function updateTransfer(torrent) {
    return Transfers.update(
      { _id: torrent.infoHash },
      {
        $set: {
          timeRemaining: torrent.timeRemaining,
          downloadSpeed: torrent.downloadSpeed,
          uploadSpeed: torrent.uploadSpeed,
          progress: torrent.progress,
          ratio: torrent.ratio,
          numPeers: torrent.numPeers,
          stopped: false,
        },
      },
    );
  }

  let downloadCounter = 0;
  let uploadCounter = 0;

  webTorrentClient.on('torrent', (torrent) => {
    torrent.on('download', () => {
      downloadCounter += 1;
      if (downloadCounter > 99999) {
        updateTransfer(torrent);
        downloadCounter = 0;
      }
    });
    torrent.on('upload', () => {
      uploadCounter += 1;
      if (uploadCounter > 99999) {
        updateTransfer(torrent);
        uploadCounter = 0;
      }
      updateTransfer(torrent);
    });
    torrent.on('done', () => {
      updateTransfer(torrent);
    });
    torrent.on('error', (error) => {
      console.log('torrent error', error);
    });
  });

  export default webTorrentClient;
});

