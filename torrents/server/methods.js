import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import webTorrentClient from './webTorrentClient.js';

import Transfers from './collections/transfers.js';
import Torrents from './collections/torrents.js';

async function upsertTransfer(_id, transfer) {
  return Transfers.upsert({ _id }, { $set: transfer });
}
async function updateTorrent(_id, torrent) {
  return Torrents.update({ _id }, { $set: torrent });
}
async function removeTransfert(_id) {
  return Transfers.remove({ _id });
}
async function removeTorrent(_id) {
  return Torrents.remove({ _id });
}

/* eslint-disable */
Meteor.methods({
  startTorrent: function (torrentToStart) {
    this.unblock();
    check(torrentToStart, Object);

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
  },
  stopTorrent: function (torrentToStop) {
    this.unblock();
    check(torrentToStop, Object);

    if (torrentToStop.transferId) {
      const torrent = webTorrentClient.get(torrentToStop.transferId);
      if (torrent) {
        webTorrentClient.remove(torrentToStop.transferId);
      }
      upsertTransfer(torrentToStop.transferId, {
        stopped: true,
        downloadSpeed: 0,
        uploadSpeed: 0,
        peers: 0,
      });
      updateTorrent(torrentToStop._id, { toStop: false });
    }
  },
  removeTorrent: function (torrentToRemove) {
    this.unblock();
    check(torrentToRemove, Object);

    if (torrentToRemove.transferId) {
      const torrent = webTorrentClient.get(torrentToRemove.transferId);
      if (torrent) {
        webTorrentClient.remove(torrentToRemove.transferId);
      }
      removeTransfert(torrentToRemove.transferId);
      removeTorrent(torrentToRemove._id);
    }
  },
});
/* eslint-enable */
