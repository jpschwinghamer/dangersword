// Setup
var players = [];
var selectedPlayer = "";

// Setup pubnub
var pubnub = PUBNUB.init({
  publish_key: 'pub-c-a7321d4d-92be-47cb-bd61-ccf219a33e89',
  subscribe_key: 'sub-c-ca1d2302-80af-11e4-bfb6-02ee2ddab7fe'
});

pubnub.subscribe({
  channel: 'dangerscores',
  message: function(m){
    console.log(m);
    getScores();
  }
});

// Simple sorting function
function sortByScore(a,b) {
  return b.average - a.average;
};

// Initialize the scoreboard
function initialize(){
  FastClick.attach(document.body);
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
  players.push({name: firstname, attempts: 0, score: 0, average: 0, recent: [0,0,0,0,0,0,0,0,0,0]});
  updateScores();
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
      players[i].recent.unshift(score);
      players[i].recent.length = 10;
      break;
    };
  };
  updateScores();
};

// Resets players array, fetches new data from JSON, then runs the builder
function getScores(){
  players = [];
  $.getJSON("scores.json", function(data){
    $.each(data, function(index, player){
      players.push(player);
    });
  }).done(updateScoreboard)
};

// Builds the scoreboard
function updateScoreboard(){
  $('.player').remove();
  players.sort(sortByScore);
  var count = 0;
  $.each(players, function(key, player){
    var recentScorePath = "";
    // Iterate through recent scores and build up svg path data
    for(var i in player.recent){
      if(i == 0){
        var point = "M" + (1000 - i * 100) + "," + Math.abs(player.recent[i] - 100);
        recentScorePath = recentScorePath.concat(point);
      }
      else {
        var point = "L" + (1000 - i * 100) + "," + Math.abs(player.recent[i] - 100);
        recentScorePath = recentScorePath.concat(point);
      }
    }
    $('.leaderboard').append('\
      <div class="player ' + player.name.toLowerCase() + ' border-bottom" data-player-name="' + player.name + '"> \
        <div class="bio"> \
          <div class="image"></div> \
          <h4 class="name">'+ player.name + '</h4> \
        </div> \
        <div class="hidden show-at-medium graph"> \
          <svg viewbox="0 0 1000 100"> \
            <path fill="none" stroke="" stroke-width="2" preserveAspectRatio="xMidYMax" stroke-linejoin="round" stroke-linecap="round"  d="' + recentScorePath + '"/> \
          </svg> \
        </div> \
        <div class="scores"> \
          <h4 class="score">' + player.average + '<span class="hidden show-at-medium inline">/' + player.attempts + '</span></h4> \
        </div> \
      </div>'
    );
  });
};

// Sends updated scores
function updateScores(){
  $.post("update.json", {
    data: JSON.stringify(players, null, '  ')
  }).done(pubnub.publish({channel: 'dangerscores', message: " "}))
};

// Resets all scores
function resetScores(){
  for(var i in players){
    players[i].attempts = 0;
    players[i].score = 0;
    players[i].average = 0;
    players[i].recent = [0,0,0,0,0,0,0,0,0,0];
  };
  updateScores();
  updateScoreboard();
};

// Initialize drrrrr
$(document).ready(function(){
  initialize();
});
