// start slingin' some d3 here.
(function() {
  d3.select("body").append("p").text("testing!");
  
  var gameOptions = {
    height: 450,
    width: 700,
    enemyCount: 30
  };

  var gameBoard = d3.select(".board").append('svg:svg').attr('width', gameOptions.width).attr('height', gameOptions.height);

  var createEnemies = function() {
    return _.range(0, gameOptions.enemyCount).map(function(i) {
      return {
        id: i,
        x: Math.random() * 440,
        y: Math.random() * 670,
        color: "purple",

      };
    });
  };

  console.log(createEnemies())

  d3.select("body .board svg").selectAll("circle")
    .data(createEnemies)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 10)
    .style("fill",function(d){return d.color; });
     

  // var render = function(enemyData) {
 
  // };


})();