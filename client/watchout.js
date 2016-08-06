// start slingin' some d3 here.
(function() {

  //Game options
  var gameOptions = {
    height: 900,
    width: 1200,
    enemyCount: 30,
    score: 0,
    speed: 2000
  };

  //Generate random data
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

  //Get a new batch of random data
  var updateEnemies = function(arr) {
    arr.forEach(function(enemy) {
      enemy.x = Math.random() * gameOptions.width;
      enemy.y = Math.random() * gameOptions.height;
    });
  };

  //Toggle drag
  var dragstarted = function(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed('dragging', true);
  }; 
  
  //Change the players position
  var dragged = function(d) {
    d3.select(this)
      .attr('cx', d3.event.x)
      .attr('cy', d3.event.y);
  }; 

  //Un-toggle drag
  var dragend = function(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed('dragging', false);
  }; 

  //Update helper appends new data and transitions update data
  var update = function(data) {

    //Generate new locations
    updateEnemies(data);

    //Grab the update
    var update = d3.select('body .board svg')
                   .selectAll('image.enemy')
                   .data(data);

    //Append new things
    update.enter()
          .append('image')
          //.attr('r', 10)
          .attr('class', 'enemy')
          .attr('xlink:href', 'asteroid.png')
          .attr('height', 30)
          .attr('width', 30)
          //.style('fill', function(d) { return d.color; })
          .attr('x', function(d) { return d.x; })
          .attr('y', function(d) { return d.y; });


    //Update the things currently on the board
    update.transition().duration(gameOptions.speed)
          .attr('x', function(d) { return d.x; })
          .attr('y', function(d) { return d.y; });

    //If anything needs to be removed we can do it now
    update.exit().remove();
       
  };



  //Simple collsion counter iterator, feed it to throttle in order to slow down
  //collision count
  var collisionCounter = function() {
    var collisionCount = d3.select('.scoreboard .collisions span');
    collisionCount.text(+collisionCount.text() + 1);
  };
  var slowCollisionCounter = _.throttle(collisionCounter, gameOptions.speed);


  
  //Checks for collisions  
  var checkOverlap = function() {

    //Getting relevant objects for position calculation
    var enemies = d3.select('body .board svg').selectAll('image.enemy')._groups[0];
    var player = d3.select('body .board svg').select('circle.mouse')._groups[0][0];
    var score = d3.select('.scoreboard .current span');
    var highScore = d3.select('.scoreboard .highscore span');
    var bool = false;

    //Check if any enemy is nearby
    enemies.forEach(function(oneEnemy) {
      if (Math.abs(oneEnemy.x.animVal.value - player.cx.animVal.value) < 10 
          && Math.abs(oneEnemy.y.animVal.value - player.cy.animVal.value) < 10) {
        bool = true;
      }
    });

    //Changing scores logic, using the throttled collision counter
    if (bool) {
      if (+score.text() > +highScore.text()) {
        highScore.text(+score.text());
      }
      score.text(0);
      gameOptions.score = 0;
      slowCollisionCounter();
    } else {
      gameOptions.score++;
      score.text(Math.floor(gameOptions.score / 10));
    }
  };


  //Initialize the game board
  var gameBoard = d3.select('.board')
                    .append('svg:svg')
                    .attr('width', gameOptions.width)
                    .attr('height', gameOptions.height);


  //Initialize and update the board
  var myEnemies = createEnemies();
  update(myEnemies);
  setInterval(function() { update(myEnemies); }, gameOptions.speed);

  //Initialize player
  d3.select('body .board svg')
    .append('circle')
    .attr('class', 'mouse')
    .attr('r', 10)
    .style('fill', 'red')
    .attr('cx', gameOptions.width / 2)
    .attr('cy', gameOptions.height / 2);

  //Initialize event listener for player dragging
  d3.select('body .board svg .mouse').call(d3.drag().on('start', dragstarted)
                                                    .on('drag', dragged)
                                                    .on('end', dragend));


  d3.select('body .board')
    .on('mouseover', function() {
      setInterval(checkOverlap, 50);
    });

  // Below is event listener for if player icon should ALWAYS follow mouse,
  //instead of just on a drag
  
  // d3.select('body .board')
  //   .on('mousemove', function() {

  //     var mouseCoordinates = d3.mouse(this);

  //     d3.select('body .board svg .mouse')
  //       .attr('cx', mouseCoordinates[0])
  //       .attr('cy', mouseCoordinates[1]);

  //   });


})();


