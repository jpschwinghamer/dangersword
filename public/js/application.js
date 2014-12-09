var players = [];
var selectedPlayer = "";

// Simple sorting function
function sortByScore(a,b) {
  return b.average - a.average;
};

// Initialize the scoreboard
function initialize(){
  enableBindings();
  getScores();
};

// Enables global app bindings
function enableBindings(){
  // Open scorecard when you click a player
  $('body').on('click', '.player', function(e){
    e.stopPropagation();
    selectedPlayer = $(this).data('player-name');
    activateScorecard(selectedPlayer);
  });

  // Close scorecard when you click outside of player
  $('body').on('click', function(){
    deactivateScorecard()
  });

  $('body').on('click', '.scorecard .button', function(e){
    e.preventDefault();
    e.stopPropagation();
    addScore(selectedPlayer, $(this).data('score'));
  })
}

// Add a player
function addPlayer(firstname){
  players.push({name: firstname, attempts: 0, score: 0, average: 0});
  updateScores();
  updateScoreboard();
}

// Delete a player
function deletePlayer(firstname){
  var player = players.indexOf(firstname);
  for(var i in players){
    if(players[i].name == firstname){
      players.splice(i, 1);
      break;
    };
  };
  updateScores();
  updateScoreboard();
}

// Select player to begin scoring
function activateScorecard(firstname){
  $('.scorecard .image').css({'background-image' : 'url(/images/' + firstname.toLowerCase() + '.jpg)'});
  $('.scorecard h4').html("Give " + firstname + " a score:");
  $('body').addClass('scorecard-active');
}

// Close the scorecard
function deactivateScorecard(){
  $('body').removeClass('scorecard-active');
}

// Add a score
function addScore(firstname, score){
  for(var i in players){
    if(players[i].name == firstname) {
      players[i].attempts = players[i].attempts + 1;
      players[i].score += score;
      players[i].average = ((players[i].score/players[i].attempts).toFixed(2))/1;
      break;
    };
  };
  updateScores();
  updateScoreboard();
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

// Builds the scoreboard
function updateScoreboard(){
  $('.player').remove();
  players.sort(sortByScore);
  var count = 0;
  $.each(players, function(key, player){
    $('.leaderboard').append('\
      <div class="player ' + player.name.toLowerCase() + ' border-bottom" data-player-name="' + player.name + '"> \
        <div class="bio"> \
          <div class="image"></div> \
          <h4 class="name">'+ player.name + '</h4> \
        </div> \
        <h4 class="score">' + player.average + '/<span>' + player.attempts + '</span></h4> \
      </div>')
  });
};

// Sends updated scores
function updateScores(){
  $.post("update.json", {
    data: JSON.stringify(players, null, '  ')
  })
};

// Resets all scores
function resetScores(){
  for(var i in players){
    players[i].attempts = 0;
    players[i].score = 0;
    players[i].average = 0;
  };
  updateScores();
  updateScoreboard();
};

// Initialize drrrrr
initialize();
