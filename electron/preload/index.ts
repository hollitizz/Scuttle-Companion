import fs from 'fs';

function domReady(
    condition: DocumentReadyState[] = ['complete', 'interactive']
) {
    return new Promise(resolve => {
        if (condition.includes(document.readyState)) {
            resolve(true);
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true);
                }
            });
        }
    });
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find(e => e === child)) {
            return parent.appendChild(child);
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find(e => e === child)) {
            return parent.removeChild(child);
        }
    }
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
    const className = `loaders-css__square-spin`;
    const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
    const oStyle = document.createElement('style');
    const oDiv = document.createElement('div');

    oStyle.id = 'app-loading-style';
    oStyle.innerHTML = styleContent;
    oDiv.className = 'app-loading-wrap';
    oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle);
            safeDOM.append(document.body, oDiv);
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle);
            safeDOM.remove(document.body, oDiv);
        }
    };
}
// ----------------------------------------------------------------------

if (process.platform === 'darwin') {
    process.env.RIOT_LOCKFILE = `${process.env.HOME}/Library/Application Support/Riot Games/Riot Client/Config/lockfile`;
    process.env.LEAGUE_LOCKFILE = `/Applications/League\ of\ Legends.app/Contents/LoL/lockfile`;
    process.env['RESOURCES_FOLDER'] = ``;
    process.env[
        'LEAGUE_EXECUTABLE'
    ] = `/Applications/League of Legends.app`;
} else if (process.platform === 'win32') {
    process.env.RIOT_LOCKFILE = `${process.env['LOCALAPPDATA']}/Riot Games/Riot Client/Config/lockfile`;
    process.env.LEAGUE_LOCKFILE = `${process.env['SystemDrive']}/Riot Games/League of Legends/lockfile`;
    process.env[
        'LEAGUE_EXECUTABLE'
    ] = `${process.env['ProgramFiles']}/Riot Games/League of Legends/LeagueClient.exe`;
    process.env[
        'RESOURCES_FOLDER'
    ] = `${process.env.SystemDrive}\\Riot Games\\Riot Client\\RiotClientServices.exe`;
    if (process.env.VITE_DEV_SERVER_URL) {
    } else {
        process.env[
            'RESOURCES_FOLDER'
        ] = `${process.env['APPDATA']}/League\ login\ app/resources/`;
        fs.existsSync(process.env['RESOURCES_FOLDER']) ||
            fs.mkdirSync(process.env['RESOURCES_FOLDER']);
    }
} else {
    throw new Error('Unsupported platform');
}
if (!fs.existsSync(process.env['LEAGUE_EXECUTABLE'])) {
    console.log('League executable not default');
    process.env['LEAGUE_EXECUTABLE'] = '';
}

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = ev => {
    ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
