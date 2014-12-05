var players = [
  {name: "Dave", score: Math.round(Math.random() * 100)},
  {name: "Ty", score: Math.round(Math.random() * 100)},
  {name: "Michelle", score: Math.round(Math.random() * 100)},
  {name: "Justin", score: Math.round(Math.random() * 100)},
  {name: "Nathan", score: Math.round(Math.random() * 100)},
  {name: "Jimmy", score: Math.round(Math.random() * 100)},
  {name: "Chris", score: Math.round(Math.random() * 100)},
  {name: "Aaron", score: Math.round(Math.random() * 100)}
];

function sortByScore(a,b) {
  return b.score - a.score;
};

function buildScoreboard(){
  $.each(players, function(key, player){
  $('.leaderboard').append('<div class="player ' + player.name.toLowerCase() + ' border-bottom"><div class="bio"><div class="image"></div><h4 class="name">'+ player.name + '</h4></div><h4 class="score">' + player.score + '</h4></div>')
  });
};

function getScores(){
  $.getJSON("scores.json", function(data){
    $.each(data, function(player, score){
      console.log(player + ": " + score)
    });
  });
};

function sendScores(){
  $.each(players, function(key, val){
    console.log(val);
  });
};

function initialize(){
  players.sort(sortByScore);
  buildScoreboard()
};

initialize()
