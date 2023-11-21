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

      .header {
        width: 100%;
        height: 2rem;
        display: flex;
        align-items: center;
        background-color: black;
      }

    `;
    const pageStyle = document.createElement('style');
    const header = document.createElement('div');

    pageStyle.id = 'app-loading-style';
    pageStyle.innerHTML = styleContent;
    header.className = 'app-loading-wrap';
    header.innerHTML = `<div class="header"></div>`;


    return {
        appendLoading() {
            safeDOM.append(document.head, pageStyle);
            safeDOM.append(document.body, header);
        },
        removeLoading() {
            safeDOM.remove(document.head, pageStyle);
            safeDOM.remove(document.body, header);
        }
    };
}

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

// window.onmessage = ev => {
//     ev.data.payload === 'removeLoading' && removeLoading();
// };

// setTimeout(removeLoading, 4999);

// ---------------------------------------------------------

if (process.platform === 'darwin') {
} else if (process.platform === 'win32') {
    if (process.env.VITE_DEV_SERVER_URL) {
        process.env['RESOURCES_FOLDER'] = `resources/`;
        fs.existsSync(process.env['RESOURCES_FOLDER']) ||
            fs.mkdirSync(process.env['RESOURCES_FOLDER']);
    } else {
        process.env['RESOURCES_FOLDER'] =
            `${process.env['APPDATA']}/League\ login\ app/resources/`;
        fs.existsSync(process.env['RESOURCES_FOLDER']) ||
            fs.mkdirSync(process.env['RESOURCES_FOLDER']);
    }

    process.env.RIOT_LOCKFILE = `${process.env['LOCALAPPDATA']}/Riot Games/Riot Client/Config/lockfile`;

    process.env['LEAGUE_LOCKFILE'] = '';
    process.env['LEAGUE_EXECUTABLE'] = '';

    process.env['VALORANT_LOCKFILE'] = '';
    process.env['VALORANT_EXECUTABLE'] = '';
} else {
    throw new Error('Unsupported platform');
}
