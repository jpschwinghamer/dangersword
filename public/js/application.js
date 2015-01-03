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

  $('body').on('click', '.scorecard .score', function(e){
    e.stopPropagation();
  });

  $('body').on('click', '.scorecard .delete', function(e){
    e.stopPropagation();
    var sure = confirm("Delete this score?")
    if (sure == true){
      deleteScore($(this).parent().data('score-id'));
    }
    else {
      console.log("nope")
    };

  });
}

// Select player to begin scoring
function activateScorecard(id, name){
  $('.scorecard .image').css({'background-image' : 'url(/images/' + name.toLowerCase() + '.jpg)'});
  $('.scorecard .bio h4').html("Give " + name + " a score:");
  getSelectedPlayerScores(id);
  $('body').addClass('scorecard-active');
}

// Close the scorecard
function deactivateScorecard(){
  $('body').removeClass('scorecard-active');
}

// Selected player feed
function getSelectedPlayerScores(id){
  selectedPlayerFeed = "/scores/" + id;
  if(id != ''){
    $.getJSON(selectedPlayerFeed, function(data){
      $('.scorecard .chart .score').remove();
      $.each(data, function(index, score){
        $('.scorecard .chart').append('<div class="score border-bottom pad-col" data-score-id="' + score.id + '"><h4>' + score.points + '</h4><span class="delete">Delete</span><span>' + moment(score.created_at).fromNow() + '</span></div>');
      });
    });
  };
}

// Add Score
function addScore(player, score){
  $.post("/", {
    data: {
      player_id: selectedPlayerID,
      points: score
    }
  }).done(pubnub.publish({channel: 'dangerscores', message: "Score added."}));
};

// Delete Score
function deleteScore(id){
  deleteURL = "/scores/delete/" + id;
  $.post(deleteURL, {
    data: {
      id: id
    }
  }).done(pubnub.publish({channel: 'dangerscores', message: "Score deleted."}));
};

// Add a new player
function addPlayer(name){
  $.post("/players/create", {
    data: {
      name: name
    }
  }).done(pubnub.publish({channel: 'dangerscores', message: "Player Created."}));
};

function updateScoreboard(){
  $('.player').remove();
  $.getJSON("scores", function(data){
    $.each(data, function(index, player){
      var recentScorePath = "";
      var recentScoreGraph = "";
      // Iterate through recent scores and build up svg path or graph data
      for(var i in player.scores){
        recentScoreGraph += '<div class="bar" data-bar-height="' + player.scores[i] + '" \
        style="height: ' + player.scores[i] + '; opacity: ' + player.scores[i]/100 + '; -webkit-animation-delay: ' + 0.1 * i + 's"></div>';
        if(i == 15){
          break;
        }
      }
      $('.leaderboard').append(' \
        <div class="player ' + player.name.toLowerCase() + ' border-bottom" data-player-id="' + player.id + '" data-player-name="' + player.name + '"> \
          <div class="bio"> \
            <div class="image"></div> \
            <h4 class="name">'+ player.name + '</h4> \
          </div> \
          <div class="graph border-bottom">' +
            recentScoreGraph +
          '</div> \
          <div class="scores"> \
            <h4 class="score">' + player.average + '<span class="hidden show-at-medium inline">/' + player.count + '</span></h4> \
          </div> \
        </div>'
      );
    });
    getSelectedPlayerScores(selectedPlayerID);
  });
}

// Initialize drrrrr
$(document).ready(function(){
  initialize();
});
