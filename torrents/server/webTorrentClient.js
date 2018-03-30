import WebTorrent from 'webtorrent';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import Transfers from './collections/transfers.js';
import Torrents from './collections/torrents.js';

Meteor.startup(() => {
  const webTorrentClient = new WebTorrent();

  // on startup and error all transfers should be mark as stopped
  async function transfersStopped() {
    await Transfers.update({}, { $set: { stopped: true } }, { multi: true });
  }
  webTorrentClient.on('ready', (torrent) => {
    transfersStopped();
  });
  webTorrentClient.on('error', () => {
    transfersStopped();
  });

  Meteor.setInterval(() => {
    // Updating current transfers status
    const { torrents } = webTorrentClient;
    if (torrents && torrents.length) {
      _.each(torrents, (torrent) => {
        Transfers.update(
          { _id: torrent.infoHash },
          {
            $set: {
              timeRemaining: torrent.timeRemaining,
              received: torrent.received,
              downloaded: torrent.downloaded,
              uploaded: torrent.uploaded,
              downloadSpeed: torrent.downloadSpeed,
              uploadSpeed: torrent.uploadSpeed,
              progress: torrent.progress,
              ratio: torrent.ratio,
              numPeers: torrent.numPeers,
              path: torrent.path,
              size: torrent.length,
              stopped: false,
            },
          },
        );
      });
    }

    async function upsertTransfer(_id, transfer) {
      await Transfers.upsert({ _id }, { $set: transfer });
    }
    async function updateTorrent(_id, torrent) {
      await Torrents.update({ _id }, { $set: torrent });
    }
    async function removeTransfert(_id) {
      await Transfers.remove({ _id });
    }
    async function removeTorrent(_id) {
      await Torrents.remove({ _id });
    }

    // Watching for torrents to start
    const torrentsToStart = Torrents.find({ toStart: true }).fetch();
    if (torrentsToStart && torrentsToStart.length > 0) {
      _.each(torrentsToStart, (torrentToStart) => {
        const maxConns = Meteor.settings.torrentMaxConnections;
        const path = Meteor.settings.torrentsPath;
        const { _id, torrentRef, userName } = torrentToStart;
        webTorrentClient.add(torrentRef, { maxConns, path }, (torrent) => {
          if (torrent.ready) {
            upsertTransfer(torrent.infoHash, {
              name: torrent.name,
              downloadSpeed: 0,
              uploadSpeed: 0,
              timeRemaining: Infinity,
              createdAt: new Date(),
              stopped: false,
              torrentId: _id,
              torrentRef,
              userName,
            });
            updateTorrent(torrentToStart._id, {
              toStart: false,
              transferId: torrent.infoHash,
              name: torrent.name,
              startedAt: new Date(),
            });
          }
        });
      });
    }

    // watching torrents to stop
    const torrentsToStop = Torrents.find({ toStop: true }).fetch();
    if (torrentsToStop && torrentsToStop.length > 0) {
      _.each(torrentsToStop, (torrentToStop) => {
        if (torrentToStop.transferId) {
          const torrent = webTorrentClient.get(torrentToStop.transferId);
          if (torrent) {
            webTorrentClient.remove(torrentToStop.transferId);
          }
          upsertTransfer(torrentToStop.transferId, { stopped: true });
          updateTorrent(torrentToStop._id, { toStop: false });
        }
      });
    }

    // watching torrents to remove
    const torrentsToRemove = Torrents.find({ toRemove: true }).fetch();
    if (torrentsToRemove && torrentsToRemove.length > 0) {
      _.each(torrentsToRemove, (torrentToRemove) => {
        if (torrentToRemove.transferId) {
          const torrent = webTorrentClient.get(torrentToRemove.transferId);
          if (torrent) {
            webTorrentClient.remove(torrentToRemove.transferId);
          }
          removeTransfert(torrentToRemove.transferId);
          removeTorrent(torrentToRemove._id);
        }
      });
    }
  }, 3333);

  export default webTorrentClient;
});

