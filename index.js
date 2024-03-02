const express = require("express");

const app = express();

// BODY PARSER
app.use(express.json());

app.route("/").get((req, res) => {
  res.json({
    message: "hello world",
  });
});

// REGISTER BRACELET PHONE# AND PHONE NUMBERS TO SEND TO
app.route("/user/:phoneNumber").post(async (request, response) => {
  const phoneNumber = request.params.phoneNumber;

  const body = request.body;

  await fetch(`http://localhost:3500/phones`, {
    method: "POST",
    body: JSON.stringify({
      phoneNumber: phoneNumber,
      name: body.name,
      sendTo: body.phoneNumbersToSendto,
    }),
  });

  response.json({
    message: "phone number added",
    phoneNumber: phoneNumber,
  });
});

// DISTRESS SIGNAL
app.post("/emergency/:phoneNumber", async (request, response) => {
  const phoneNumber = request.params.phoneNumber;

  const responseAfterFetch = await fetch(
    `http://localhost:3500/phones?phoneNumber=${phoneNumber}`,
    {
      method: "GET",
    }
  );

  const [data] = await responseAfterFetch.json();

  //***
  // THIS IS THE NUMBERS YOU NEED TO SEND TO
  // NEED A LIBRARY LIKE TWILIO TO SEND THE MESSAGE
  const phoneNumbersToSendTo = data.sendTo;
  const nameOfOwner = data.name;
  const coordinates = request.body.coordinates;

  //^^^

  const helpMessage = `This is a distress signal from ${nameOfOwner} (${phoneNumber}) at coordinates: (lat:${coordinates.latitude},long:${coordinates.longitude})`;
  console.log(helpMessage);

  response.send(
    `${helpMessage}: distress signal sent to ${phoneNumbersToSendTo.map(
      (number) => `${number}, `
    )}`
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
