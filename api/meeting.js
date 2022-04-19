// import {NowRequest, NowResponse} from '@vercel/node';
import Lifx from 'lifxjs';
const devicePrefix = 'zoom_';
const participantJoinedEvent = 'meeting.participant_joined';
const participantLeftEvent = 'meeting.participant_left';
const userPresenseStatusUpdated='user.presence_status_updated';
const presenceAvailable='Available';
const presenceMeeting='In_Meeting';
const presenceAway='Away';
const presencePhoneCall='On_Phone_Call';
const presenceDND='Do_Not_Disturb';

export default async (request, response) => {
  const authValid =
    request.headers['authorization'] === process.env.ZOOM_WEBHOOK_TOKEN;
    console.log("Request Headers: "+JSON.stringify(request.headers));
    console.log("Request Body: " + JSON.stringify(request.body.event));
  const event = request.body.event;
  const presenceStatus=request.body.requestBody.payload.object.presenceStatus;
  const participant = request.body.payload.object.participant;

  const isParticipantEvent =
    event &&
    participant 

  if (!authValid) {
    // just return a 200, we don't want zoom to keep retrying for a non-2xx error;
    console.log("Auth invalid")
    return response.status(200).send({});
  }

  if(!isParticipantEvent) {
    console.log("The participant or event from the webhook request body was null")
  }

  if(event === userPresenseStatusUpdated) {
    if (presenceStatus===presenceMeeting) console.log("In Meeting") 
    else if (presenceStatus===presenceAvailable) console.log("User Available");
  }

  console.log('Zoom authenticated...');
  console.log('Event parse successful...');

  const isValidParticipant = participant.email === process.env.ZOOM_PARTICIPANT;
  if (!isValidParticipant) {
    console.log("Participant: " + participant.email);
    return response.status(200).send({});
  }

  console.log('Zoom participant verified...');
  console.log('Connecting to LIFX...');

  const options = {
    appToken: process.env.LIFX_TOKEN
  };

  try {
    const lifx = new Lifx();
    lifx.init(options);
    const devices = await lifx.get.all();
    const filtered = devices.filter(
      (x) =>
        x.label.startsWith(devicePrefix)
    );

    const turnRed = (presenceStatus === presenceMeeting) || 
    (presenceStatus === presenceAway) || (presenceStatus === presencePhoneCall) 
    || (presenceStatus === presenceDND);

    console.log(`${turnRed ? 'Turning red!' : 'Turning green!'}`);
    const promises = filtered.map((device) =>
      lifx.color.light(device.id, { rgb: (turnRed)?'255,0,0':'0,255,0' })
    );

    await Promise.all(promises);
  } catch (err) {
    console.log('LIFX ERROR: ', err);
  }

  response.status(200).send({});
};
