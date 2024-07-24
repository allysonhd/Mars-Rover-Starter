class Rover {
  constructor(position, mode = "NORMAL", generatorWatts = 110) {
    this.position = position;
    this.mode = mode;
    this.generatorWatts = generatorWatts;
  }

  receiveMessage(message) {
    let response = {
      message: message.name,
      results: [],
      }
for (let index = 0; index < message.commands.length; index++) {
  if (message.commands[index].commandType === "STATUS_CHECK"){
    response.results.push({
      completed : true,
      roverStatus : {
        mode : this.mode,
        generatorWatts : this.generatorWatts,
        position : this.position
      }
    })
  } else if (message.commands[index].commandType === "MODE_CHANGE"){
    this.mode = message.commands[index].value
    response.results.push({
      completed : true
    })
  } else if (message.commands[index].commandType === "MOVE") {
    if (this.mode === "LOW_POWER") {
      response.results.push({
        completed : false
      })
    } else {
      this.position = message.commands[index].value
      response.results.push({
        completed : true
      })
    }
  } else {
    response.results.push({
      completed : true
    })
  }
    };
    return response;
  }
}
//need to check the command name === the commandType (conditional - boolean if/else)
//commandTypes return objects, the STATUS_CHECK command returns an extra object roverStatus inside the object
//we're going to be pushing objects inside the results array

module.exports = Rover;