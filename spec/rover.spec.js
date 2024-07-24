const Rover = require("../rover.js");
const Message = require("../message.js");
const Command = require("../command.js");

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.

describe("Rover class", function () {
  test("constructor sets position and default values for mode and generatorWatts", function () {
    let positionCheck = new Rover(12345678);
    expect(positionCheck.position).toBe(12345678);
    expect(positionCheck.mode).toBe("NORMAL");
    expect(positionCheck.generatorWatts).toBe(110);
  });

  test("response returned by receiveMessage contains the name of the message", function () {
    let twoCommands = [
      new Command("STATUS_CHECK"),
      new Command("MODE_CHANGE", "LOW_POWER"),
    ];
    let message = new Message("nameOne", twoCommands);
    let roverOne = new Rover(12345678);
    let response = roverOne.receiveMessage(message).message;
    expect(response).toBe(message.name);
  });

  test("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let twoCommands = [
      new Command("STATUS_CHECK"),
      new Command("MODE_CHANGE", "LOW_POWER"),
    ];
    let messageOne = new Message(
      "testing message with two commands",
      twoCommands
    );
    let roverOne = new Rover(12345678);
    let response = roverOne.receiveMessage(messageOne).results.length;
    expect(response).toBe(2);
  });

  test("responds correctly to the status check command", function () {
    let statusCheckCommand = [new Command("STATUS_CHECK")];
    let messageOne = new Message(
      "checking the Rover status",
      statusCheckCommand
    );
    let roverOne = new Rover(12345678);
    let response = roverOne.receiveMessage(messageOne).results[0];
    let roverObject = {
      completed: true,
      roverStatus: {
        mode: "NORMAL",
        generatorWatts: 110,
        position: 12345678,
      },
    };
    expect(response).toEqual(roverObject);
  });

  test("responds correctly to the mode change command", function () {
    let modeChangeCommand = [new Command("MODE_CHANGE", "LOW_POWER")];
    let messageOne = new Message("change the mode", modeChangeCommand);
    let roverOne = new Rover(12345678);
    let response = roverOne.receiveMessage(messageOne).results[0];
    expect(response).toEqual({ completed: true });
  });
  //if a move command is given and the mode === "LOW_POWER", then the rover shouldn't move and should return {completed : false}

  test("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("MOVE", 2400),
    ];
    let messageOne = new Message("change to Low Power and move", commands);
    let roverOne = new Rover(12345678);
    let response = roverOne.receiveMessage(messageOne).results[1].completed;
    expect(response).toEqual(false);
  });

  //A MOVE command will update the rover’s position with the position value in the command.
  //If I send a move command (MOVE, position(number value)) then the rover will update to the new position and return {completed : true}
  test("responds with the position for the move command", function () {
    let moveCommand = [new Command("MOVE", 2400)];
    let messageOne = new Message("Move Rover to new position", moveCommand);
    let roverOne = new Rover(12345678);
    let response = roverOne.receiveMessage(messageOne).results[0];
    expect(response).toEqual({ completed: true });
  });
});
