var players = [];

// Simple sorting function
function sortByScore(a,b) {
  return b.average - a.average;
};

// Initialize the scoreboard
function initialize(){
  getScores();
};

// Resets players array, fetches new data from JSON, then runs the builder
function getScores(){
  players = [];
  $.getJSON("scores.json", function(data){
    $.each(data, function(index, player){
      players.push(player);
    });
  }).then(updateScoreboard)
};

// Add a player
function addPlayer(firstname){
  players.push({name: firstname, attempts: 0, score: 0, average: 0});
  updateScores();
}

// Delete a player
function deletePlayer(firstname){
  var player = players.indexOf(firstname);
  for(var i in players){
    if(players[i].name == firstname){
      players.splice(i, 1);
    }
  }
}

// Add a score
function addScore(firstname, score){
  for(var i in players){
    if(players[i].name == firstname) {
      players[i].attempts = players[i].attempts + 1;
      players[i].score += score;
      players[i].average = ((players[i].score/players[i].attempts).toFixed(2))/1;
      updateScores()
      break;
    };
  };
};

// Builds the scoreboard
function updateScoreboard(){
  $('.player').remove();
  players.sort(sortByScore);
  $.each(players, function(key, player){
  $('.leaderboard').append('<div class="player ' + player.name.toLowerCase() + ' border-bottom"><div class="bio"><div class="image"></div><h4 class="name">'+ player.name + '</h4></div><h4 class="score">' + player.average + '<sup>' + player.attempts + '</sup></h4></div>')
  });
};

// Sends updated scores
function updateScores(){
  $.post("update.json", {
    data: JSON.stringify(players)
  }, updateScoreboard)
};

// Polls for new scores every 4 seconds
var pollScores = setInterval(function(){
  getScores()
}, 4000);

// Initialize drrrrr
initialize();
