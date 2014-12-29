// Setup
var selectedPlayerID = "";
var selectedPlayerName = "";

// Setup pubnub
var pubnub = PUBNUB.init({
  publish_key: 'pub-c-a7321d4d-92be-47cb-bd61-ccf219a33e89',
  subscribe_key: 'sub-c-ca1d2302-80af-11e4-bfb6-02ee2ddab7fe'
});

pubnub.subscribe({
  channel: 'dangerscores',
  message: function(m){
    updateScoreboard();
  }
});


// Initialize the scoreboard
function initialize(){
  FastClick.attach(document.body);
  enableBindings();
  updateScoreboard();
};

// Enables global app bindings
function enableBindings(){
  // Open scorecard when you click a player
  $('body').on('click', '.player', function(e){
    e.stopPropagation();
    selectedPlayerID = $(this).data('player-id');
    selectedPlayerName = $(this).data('player-name');
    activateScorecard(selectedPlayerID, selectedPlayerName);
  });

  // Close scorecard when you click outside of player
  $('body').on('click', function(){
    deactivateScorecard()
  });

  $('body').on('click', '.scorecard .button', function(e){
    e.preventDefault();
    e.stopPropagation();
    addScore(selectedPlayerID, $(this).data('score'));
  })
}

// Select player to begin scoring
function activateScorecard(id, name){
  $('.scorecard .image').css({'background-image' : 'url(/images/' + name.toLowerCase() + '.jpg)'});
  $('.scorecard h4').html("Give " + name + " a score:");
  $('body').addClass('scorecard-active');
}

// Close the scorecard
function deactivateScorecard(){
  $('body').removeClass('scorecard-active');
}

function addScore(player, score){
  $.post("/", {
    data: {
      player_id: selectedPlayerID,
      points: score
    }
  }).done(pubnub.publish({channel: 'dangerscores', message: " "}));
};

function updateScoreboard(){
  $('.player').remove();
  $.getJSON("scores", function(data){
    $.each(data, function(index, player){
      var recentScorePath = "";
      // Iterate through recent scores and build up svg path data
      for(var i in player.scores){
        if(i == 0){
          var point = "M" + (1000 - i * 100) + "," + Math.abs(player.scores[i] - 100);
          recentScorePath = recentScorePath.concat(point);
        }
        else if(i == 10) {
          break;
        }
        else {
          var point = "L" + (1000 - i * 100) + "," + Math.abs(player.scores[i] - 100);
          recentScorePath = recentScorePath.concat(point);
        }
      }
      $('.leaderboard').append(' \
        <div class="player ' + player.name.toLowerCase() + ' border-bottom" data-player-id="' + player.id + '" data-player-name="' + player.name + '"> \
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
            <h4 class="score">' + player.average + '<span class="hidden show-at-medium inline">/' + player.count + '</span></h4> \
          </div> \
        </div>');
    });
  });
}

// Initialize drrrrr
$(document).ready(function(){
  initialize();
});
