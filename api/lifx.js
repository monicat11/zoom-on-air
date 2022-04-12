async function getDevices(){
    const lifx = new Lifx();
    lifx.init(options);
    const devices = await lifx.get.all();
    const filtered = devices.filter(
    (x) =>
        x.label.startsWith(devicePrefix)
    );

    const turnOn = event === participantJoinedEvent;

    console.log(`${turnOn ? 'Turning red!' : 'Turning green!'}`);
    const promises = filtered.map((device) =>
    lifx.color.light(device.id, { rgb: (turnOn)?'255,0,0':'0,255,0' })
    );

    await Promise.all(promises);
}

exports.getDevices=getDevices;
