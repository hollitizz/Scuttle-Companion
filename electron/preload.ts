import fs from 'fs';
// import { app } from 'electron';

// function domReady(
//     condition: DocumentReadyState[] = ['complete', 'interactive']
// ) {
//     return new Promise(resolve => {
//         if (condition.includes(document.readyState)) {
//             resolve(true);
//         } else {
//             document.addEventListener('readystatechange', () => {
//                 if (condition.includes(document.readyState)) {
//                     resolve(true);
//                 }
//             });
//         }
//     });
// }

// const safeDOM = {
//     append(parent: HTMLElement, child: HTMLElement) {
//         if (!Array.from(parent.children).find(e => e === child)) {
//             return parent.appendChild(child);
//         }
//     },
//     remove(parent: HTMLElement, child: HTMLElement) {
//         if (Array.from(parent.children).find(e => e === child)) {
//             return parent.removeChild(child);
//         }
//     }
// };

// function useLoading() {
//     const className = `loaders-css__square-spin`;

//     const styleContent = `
//       .header {
//         position: absolute;
//         inset: 0;
//         padding: 0px;
//         height: 2rem;
//         width: 100%;
//         -webkit-app-region: drag;
//         background-color: #084363;
//         display: flex;
//       }

//       .icon {
//         -webkit-app-region: no-drag;
//       }

//       .loader {
//         height: 5rem;
//         width: 5rem;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//       }

//       .body {
//         position: absolute;
//         inset: 0;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         height: 100%;
//         width: 100%;
//       }

//       .dash {
//         margin-left: auto;
//         -webkit-app-region: no-drag;
//       }

//       .square {
//         -webkit-app-region: no-drag;
//       }

//       .cross {
//         -webkit-app-region: no-drag;
//       }
//       `;
//     const pageStyle = document.createElement('style');
//     pageStyle.innerHTML = styleContent;

//     const icon = document.createElement('img');
//     icon.classList.add('icon');
//     icon.style.padding = '2px';
//     icon.style.paddingLeft = '4px';
//     icon.src = 'assets/icon.png';

//     const dash = document.createElement('img');
//     dash.classList.add('dash');
//     dash.src = 'assets/svg/dash.svg';
//     const square = document.createElement('img');
//     square.classList.add('square');
//     square.src = 'assets/svg/square.svg';
//     const cross = document.createElement('img');
//     cross.classList.add('cross');
//     cross.src = 'assets/svg/cross.svg';

//     const loader = document.createElement('img');
//     loader.src = 'assets/svg/loader.svg';
//     loader.classList.add('loader');

//     const header = document.createElement('div');
//     header.classList.add('header');
//     header.append(icon);
//     header.append(dash);
//     header.append(square);
//     header.append(cross);

//     const body = document.createElement('div');
//     body.classList.add('body');
//     body.append(loader);

//     return {
//         appendLoading() {
//             safeDOM.append(document.head, pageStyle);
//             safeDOM.append(document.body, header);
//             safeDOM.append(document.body, body);
//         },
//         removeLoading() {
//             safeDOM.remove(document.head, pageStyle);
//             safeDOM.remove(document.body, header);
//             safeDOM.remove(document.body, body);
//         }
//     };
// }

// const { appendLoading, removeLoading } = useLoading();
// domReady().then(appendLoading);

// window.onmessage = ev => {
//     console.log(ev.data);
//     ev.data.payload === 'removeLoading' && removeLoading();
// };

// app.on('ready',() => {
//     domReady().then(removeLoading);
// });

// setTimeout(removeLoading, 4999);

// ---------------------------------------------------------

fetch('https://ddragon.leagueoflegends.com/api/versions.json')
    .then(res => res.json())
    .then(res => (process.env['PATCH'] = res[0]));

if (process.platform === 'darwin') {
    process.env['RESOURCES_FOLDER'] = `resources/`;
    fs.existsSync(process.env['RESOURCES_FOLDER']) ||
        fs.mkdirSync(process.env['RESOURCES_FOLDER']);
    process.env.RIOT_LOCKFILE = `${process.env['HOME']}/Library/Application Support/Riot Games/Riot Client/Config/lockfile`;

    process.env['DEFAULT_LEAGUE_LOCKFILE'] =
        '/Applications/League of Legends.app/Contents/LoL/lockfile';
    process.env['DEFAULT_LEAGUE_EXECUTABLE'] =
        '/Users/Shared/Riot Games/Riot Client.app';

    process.env['DEFAULT_VALORANT_LOCKFILE'] =
        '/Applications/Valorant.app/Contents/LoL/lockfile';
    process.env['DEFAULT_VALORANT_EXECUTABLE'] = '/Applications/Valorant.app';
} else if (process.platform === 'win32') {
    if (process.env.VITE_DEV_SERVER_URL) {
        process.env['RESOURCES_FOLDER'] = `resources/`;
        fs.existsSync(process.env['RESOURCES_FOLDER']) ||
            fs.mkdirSync(process.env['RESOURCES_FOLDER']);
    } else {
        process.env['RESOURCES_FOLDER'] =
            `${process.env['APPDATA']}/Scuttle\ Companion/resources/`;
        fs.existsSync(process.env['RESOURCES_FOLDER']) ||
            fs.mkdirSync(process.env['RESOURCES_FOLDER']);
    }

    process.env.RIOT_LOCKFILE = `${process.env['LOCALAPPDATA']}/Riot Games/Riot Client/Config/lockfile`;

    process.env['LEAGUE_LOCKFILE'] = '';
    process.env['LEAGUE_EXECUTABLE'] = '';
    process.env['DEFAULT_LEAGUE_LOCKFILE'] =
        `${process.env['SystemDrive']}/Riot Games/League of Legends/lockfile`;

    process.env['VALORANT_LOCKFILE'] = '';
    process.env['VALORANT_EXECUTABLE'] = '';
    process.env['DEFAULT_VALORANT_LOCKFILE'] = '';
} else {
    throw new Error('Unsupported platform');
}
