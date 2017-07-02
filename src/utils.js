import electron, {remote} from 'electron';
import fs from 'fs';
import path from 'path';
import https from 'https';

export const getPath = () => {
    const savePath = (remote || electron).app.getPath('userData');
    return path.resolve(`${savePath}/extensions`);
};

// Use https.get fallback for Electron < 1.4.5
const {net} = (remote || electron);
const request = net ? net.request : https.get;

export const downloadFile = (from, to) => new Promise((resolve, reject) => {
    const req = request(from);
    req.on('response', (res) => {
        // Shouldn't handle redirect with `electron.net`, this is for https.get fallback
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return downloadFile(res.headers.location, to)
                .then(resolve)
                .catch(reject);
        }
        res.pipe(fs.createWriteStream(to)).on('close', resolve);
    });
    req.on('error', reject);
    req.end();
});

export const checkConfig = () => {
    const extensionsStore = getPath();

    return new Promise(function (resolve, reject) {
        fs.stat(extensionsStore, (err) => {
            if (err)
                fs.mkdir(extensionsStore, (err) => {
                    if (err) reject(err);
                    else resolve(extensionsStore)
                });
            else
                resolve(extensionsStore);
        });
    }).then(function (extensionsStore) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path.resolve(extensionsStore, 'IDMap.json'), 'utf8', function (err, data) {
                if (err) resolve({});
                else resolve(data);
            });
        });
    });
};

export const getIDMapPath = () => {
    const extensionsStore = getPath();
    return path.resolve(extensionsStore, 'IDMap.json');
};