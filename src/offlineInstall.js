import electron, {remote} from 'electron';
import path from 'path';
import fs from 'fs';
import semver from 'semver';
import unzip from 'cross-unzip';
import rimraf from 'rimraf';

import {checkConfig, getPath, getIDMapPath} from './utils';

const offlineChromeExtension = chromeStoreID => {
    return Promise.resolve(path.join(__dirname, `../extensions/${chromeStoreID}.crx`));
};

const install = extensionReference => {
    let chromeStoreID;
    if (typeof extensionReference === 'object' && extensionReference.id) {
        chromeStoreID = extensionReference.id;
        if (!semver.satisfies(process.versions.electron, extensionReference.electron)) {
            return Promise.reject(
                new Error(`Version of Electron: ${process.versions.electron} does not match required range ${extensionReference.electron} for extension ${chromeStoreID}`), // eslint-disable-line
            );
        }
    } else if (typeof extensionReference === 'string') {
        chromeStoreID = extensionReference;
    } else {
        return Promise.reject(new Error(`Invalid extensionReference passed in: "${extensionReference}"`));
    }

    return checkConfig().then(function (IDMap) {
        if (IDMap[chromeStoreID]
            && (remote || electron).BrowserWindow.getDevToolsExtensions
            && (remote || electron).BrowserWindow.getDevToolsExtensions().hasOwnProperty(IDMap[chromeStoreID])) {
            return Promise.resolve(IDMap[chromeStoreID]);
        }

        let promise = offlineChromeExtension(chromeStoreID);

        return promise.then((extensionPath) => {
            const extensionsStore = getPath();
            const extensionFolder = path.resolve(`${extensionsStore}/${chromeStoreID}`);
            rimraf.sync(extensionFolder);

            return new Promise(function (resolve, reject) {
                unzip(extensionPath, extensionFolder, (err) => {
                    if (err && !fs.existsSync(path.resolve(extensionFolder, 'manifest.json'))) {
                        return reject(err);
                    }
                    else {
                        const name = (remote || electron).BrowserWindow.addDevToolsExtension(extensionFolder); // eslint-disable-line

                        fs.writeFile(getIDMapPath()
                            , JSON.stringify(Object.assign(IDMap, {
                                [chromeStoreID]: name
                            }))
                            , err => {
                                if (err) reject(err);
                                else resolve(extensionFolder);
                            });
                    }
                });
            });
        });
    });
};

export default install;
