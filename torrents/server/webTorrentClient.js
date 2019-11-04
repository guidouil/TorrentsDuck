import WebTorrent from 'webtorrent';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import Transfers from './collections/transfers.js';

Meteor.startup(() => {
  const maxConns = Meteor.settings.torrentMaxConnections;
  const webTorrentClient = new WebTorrent({ maxConns });

  // on startup all transfers should be mark as stopped
  async function transfersStopped() {
    Transfers.update(
      {},
      { $set: { stopped: true, downloadSpeed: 0, uploadSpeed: 0 } },
      { multi: true },
    );
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

  const interval = 1000;
  let downloadInTheFutur = Date.now() + interval;
  let uploadInTheFutur = Date.now() + interval;

  webTorrentClient.on('torrent', (torrent) => {
    torrent.on('download', () => {
      if (Date.now() > downloadInTheFutur) {
        updateTransfer(torrent);
        downloadInTheFutur = Date.now() + interval;
      }
    });
    torrent.on('upload', () => {
      if (Date.now() > uploadInTheFutur) {
        updateTransfer(torrent);
        uploadInTheFutur = Date.now() + interval;
      }
    });
    torrent.on('done', () => {
      console.log('Done', torrent);
      updateTransfer(torrent);
    });
    torrent.on('error', (error) => {
      console.log('torrent error', error);
    });
  });

  export default webTorrentClient;
});
