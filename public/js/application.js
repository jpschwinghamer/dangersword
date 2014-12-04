Ds = window.Ds || {};

Ds.getScores = function(){
  $.getJSON("scores.json", function(data){
    $.each(data, function(player, score){
      console.log(player + ": " + score)
    })
  })
}

