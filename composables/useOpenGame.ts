import { spawn } from 'child_process';

export default function (game: 'League of Legends' | 'Valorant') {
    if (!process.env['LEAGUE_EXECUTABLE']) {
        return useToast.error(
            `Impossible de lancer ${game} car le chemin d'accès n'est pas valide`
        );
    }

    const product =
        game === 'League of Legends' ? 'league_of_legends' : 'valorant';

    try {
        if (process.platform === 'win32') {
            spawn('cmd.exe', [
                '/c',
                'start',
                '""',
                process.env['LEAGUE_EXECUTABLE'],
                `--launch-product=${product}`,
                '--launch-patchline=live'
            ]);
        } else if (process.platform === 'darwin') {
            spawn('open', [process.env['LEAGUE_EXECUTABLE']]);
        }
        return true;
    } catch (e) {
        return false;
    }
}
