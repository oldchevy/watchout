// start slingin' some d3 here.
(function() {
  d3.select('body').append('p').text('testing!');
  
  var gameOptions = {
    height: 450,
    width: 700,
    enemyCount: 30
  };

  var gameBoard = d3.select('.board')
                    .append('svg:svg')
                    .attr('width', gameOptions.width)
                    .attr('height', gameOptions.height);

  var createEnemies = function() {
    return _.range(0, gameOptions.enemyCount).map(function(i) {
      return {
        id: i,
        x: Math.random() * gameOptions.width,
        y: Math.random() * gameOptions.height,
        color: 'purple',

      };
    });
  };

  var updateEnemies = function(arr) {
    arr.forEach(function(enemy) {
      enemy.x = Math.random() * gameOptions.width;
      enemy.y = Math.random() * gameOptions.height;
    });
  };

  console.log(createEnemies());

  var update = function(data) {

    //Generate new locations
    updateEnemies(data);

    //Grab the update
    var update = d3.select('body .board svg')
                   .selectAll('circle.enemy')
                   .data(data);

    //Append new things
    update.enter()
          .append('circle')
          .attr('r', 10)
          .attr('class', 'enemy')
          .style('fill', function(d) { return d.color; })
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; });

    //Update the things currently on the board
    update.transition().duration(1000)
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; });

    //If anything needs to be removed we can do it now
    update.exit().remove();
       
  };
  
  //Initialize and update the board
  var myEnemies = createEnemies();
  update(myEnemies);
  setInterval(function() { update(myEnemies); }, 1000);

  d3.select('body .board svg')
    .append('circle')
    .attr('class', 'mouse')
    .attr('r', 10)
    .style('fill', 'red')
    .attr('cx', gameOptions.width / 2)
    .attr('cy', gameOptions.height / 2);

  d3.select('body .board')
    .on('mousemove', function() {

      var mouseCoordinates = d3.mouse(this);

      d3.select('body .board svg .mouse')
        .attr('cx', mouseCoordinates[0])
        .attr('cy', mouseCoordinates[1]);

      //We see if the mousecoordinates are close to any enemy coordinates
      //If it's within a threshhold.
        //Reset Score

    });

  var checkOverlap = function() {

    var enemies = d3.select('body .board svg').selectAll('circle.enemy')[0];
    var player = d3.select('body .board svg').select('circle.mouse')[0][0];
    var score = d3.select('.scoreboard .current span');
    var bool = false;

    enemies.forEach(function(oneEnemy) {
      //console.log(oneEnemy.cx.animVal.value, oneEnemy.cy);
      if (Math.abs(oneEnemy.cx.animVal.value - player.cx.animVal.value) < 10 
          && Math.abs(oneEnemy.cy.animVal.value - player.cy.animVal.value) < 10) {
        bool = true;
      }
    });

    if (bool) {
      score.text(0);
    } else {
      var currentScore = +score.text();
      score.text(currentScore + 1);
    }

  
  };

  d3.select('body .board')
    .on('mouseover', function() {
      setInterval(checkOverlap, 10);
    });

})();


