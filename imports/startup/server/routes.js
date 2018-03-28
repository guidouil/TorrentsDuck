import { Meteor } from 'meteor/meteor';

import fs from 'fs';

import { JsonRoutes } from 'meteor/simple:json-routes';

JsonRoutes.add('get', '/file/:name', function (req, res) {
  const filename = decodeURIComponent(req.params.name);
  if (filename.startsWith('.') || filename.includes('/.')) {
    throw new Meteor.Error(420, 'Hack detected.');
  }
  if (filename && fs.existsSync(`${Meteor.settings.torrentsPath}${filename}`)) {
    // indicate a download and set the filename of the returned file
    const stat = fs.statSync(`${ Meteor.settings.torrentsPath }${ filename }`);
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': stat.size,
    });
    // read a stream from the local filesystem, and pipe it to the response object
    fs.createReadStream(`${Meteor.settings.torrentsPath}${filename}`).pipe(res);
  } else {
    // otherwise indicate that the name is not recognised
    res.writeHead(400);
    res.end(`cannot find ${filename}`);
  }
});
