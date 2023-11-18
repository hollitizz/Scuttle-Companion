import fs from 'fs';

if (process.platform === 'darwin') {
} else if (process.platform === 'win32') {
    if (process.env.VITE_DEV_SERVER_URL) {
        process.env['RESOURCES_FOLDER'] = `../resources/`;
        fs.existsSync(process.env['RESOURCES_FOLDER']) ||
        fs.mkdirSync(process.env['RESOURCES_FOLDER']);
    } else {
        process.env[
            'RESOURCES_FOLDER'
        ] = `${process.env['APPDATA']}/League\ login\ app/resources/`;
        fs.existsSync(process.env['RESOURCES_FOLDER']) ||
            fs.mkdirSync(process.env['RESOURCES_FOLDER']);
    }

    process.env['RIOT_LOCKFILE'] = `${process.env.APPDATA}/Riot Games/Riot Client/Config/lockfile`;

    process.env['LEAGUE_LOCKFILE'] = '';
    process.env['LEAGUE_EXECUTABLE'] = '';

    process.env['VALORANT_LOCKFILE'] = '';
    process.env['VALORANT_EXECUTABLE'] = '';
} else {
    throw new Error('Unsupported platform');
}