import fs from 'fs';

async function downloadImage(url: string, savePath: string) {
    const res = await fetch(url);

    const blob = await res.arrayBuffer();
    const buffer = Buffer.from(blob);
    fs.writeFileSync(savePath, buffer);
    return savePath;
}

export async function useResolveIcon(iconId: number) {
    const path = `${process.env['RESOURCES_FOLDER']}profileIcons/${iconId}.png`;

    if (!fs.existsSync(`${process.env['RESOURCES_FOLDER']}profileIcons/`)) {
        fs.mkdirSync(`${process.env['RESOURCES_FOLDER']}profileIcons/`);
    }

    if (fs.existsSync(path)) {
        return path;
    } else {
        return await downloadImage(
            `http://ddragon.leagueoflegends.com/cdn/${
                process.env['PATCH'] ?? '13.23.1'
            }/img/profileicon/${iconId}.png`,
            path
        );
    }
}
