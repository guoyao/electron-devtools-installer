import onlineInstall from './onlineInstall';
import offlineInstall from './offlineInstall';

const install = (extensionReference, forceDownload = false, offline = true) => {
    if (forceDownload || !offline) {
        return onlineInstall(extensionReference, forceDownload);
    }

    return offlineInstall(extensionReference);
};

export default install;

export const EMBER_INSPECTOR = {
    id: 'bmdblncegkenkacieihfhpjfppoconhi',
    electron: '^1.2.1',
};
export const REACT_DEVELOPER_TOOLS = {
    id: 'fmkadmapgofadopljbjfkapdkoienihi',
    electron: '^1.2.1',
};
export const BACKBONE_DEBUGGER = {
    id: 'bhljhndlimiafopmmhjlgfpnnchjjbhd',
    electron: '^1.2.1',
};
export const JQUERY_DEBUGGER = {
    id: 'dbhhnnnpaeobfddmlalhnehgclcmjimi',
    electron: '^1.2.1',
};
export const ANGULARJS_BATARANG = {
    id: 'ighdmehidhipcmcojjgiloacoafjmpfk',
    electron: '^1.2.1',
};
export const VUEJS_DEVTOOLS = {
    id: 'nhdogjmejiglipccpnnnanhbledajbpd',
    electron: '^1.2.1',
};
export const REDUX_DEVTOOLS = {
    id: 'lmhkpmbekcpmknklioeibfkpmmfibljd',
    electron: '^1.2.1',
};
export const REACT_PERF = {
    id: 'hacmcodfllhbnekmghgdlplbdnahmhmm',
    electron: '^1.2.6',
};
export const CYCLEJS_DEVTOOL = {
    id: 'dfgplfmhhmdekalbpejekgfegkonjpfp',
    electron: '^1.2.1',
};
export const APOLLO_DEVELOPER_TOOLS = {
    id: 'jdkknkkbebbapilgoeccciglkfbmbnfm',
    electron: '^1.2.1',
};
