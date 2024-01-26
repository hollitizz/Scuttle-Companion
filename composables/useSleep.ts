export default async function (time: number = 50, callback = () => {}) {
    await new Promise(resolve => {
        setTimeout(resolve, time);
    });

    callback();
}
