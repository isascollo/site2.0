window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const speed = 750
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const classes = ['j','l','z','s','t','o','i']
  const speed_arr = [1000,750,562,421,316,237,177]
  const score_arr = [100,200,300,400,600,800,1000]
  let speed_set = 0
  var speedup = new Audio('smb_warning.wav')
  var audio = new Audio('miishop.mp3');
  audio.play()

  //The Tetrominoes
  const j = [
    [1, width+1, width*2+1, 2],
    [0, 1, 2, width+2],
    [1, width+1, width*2+1, width*2],
    [0, width, width+1, width+2]
  ]

  const l = [
    [1, width + 1, width * 2 + 1, 0],
    [width, width + 1, width + 2,2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [0, width,1, 2]
  ]

  const z = [
    [0,width,width+1,width*2+1],
    [1, 2,width,width+1],
    [0,width,width+1,width*2+1],
    [1, 2,width,width+1]
  ]

  const s = [
    [2, width+2, width + 1, width * 2 + 1],
    [0, 1, width + 2, width + 1],
    [2, width+2, width + 1, width * 2 + 1],
    [0, 1, width + 2, width + 1]
  ]

  const t = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const o = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const i = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [j, l, z, s, t, o, i]

  let currentPosition = 4
  let currentRotation = 0

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  //draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add(classes[random])
    })
    drop()
  }

  //undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      classes.forEach(i => {
        squares[currentPosition + index].classList.remove(i)
      })
    })
  }

  //assign functions to keyCodes
  function control(e) {
    if (timerId) {
      if(e.keyCode === 37) {
        moveLeft()
      } else if (e.keyCode === 38) {
        rotate()
      } else if (e.keyCode === 39) {
        moveRight()
      } else if (e.keyCode === 40) {
        moveDownButton()
      } else if (e.keyCode === 32) {
        floor()
      }
    }
  }
  document.addEventListener('keydown', control)

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}
  function moveDownButton() {
    undraw()
    currentPosition += width
    draw()
    freeze_nodelay()
  }

  function drop() {
    for(let i = 0; i < 200; i++) {
      if(squares[i].classList.contains('drop')) {
        squares[i].classList.remove('drop')
      }
    }
    let drop = 0
    while(currentPosition<200) {
      if(current.some(index => squares[currentPosition + index + drop].classList.contains('taken'))) {
        break
      } else {
        drop +=10
      }
    }
    current.forEach(index => squares[currentPosition + index + drop - 10].classList.add('drop'))
    return currentPosition + drop - 10
  }

  //freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      clearInterval(timerId)
      timerId = null
      setTimeout(function(){
        if(!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
          return
        }
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        addScore()
        draw()
        displayShape()
      }, speed_arr[speed_set]-100);
      timerId = setInterval(moveDown, speed_arr[speed_set])
    }
  }

  function freeze_nodelay() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      addScore()
      draw()
      displayShape()
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  function floor() {
    undraw()
    currentPosition = drop()
    draw()
    freeze_nodelay()
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }


  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }

  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

  //rotate the tetromino
  function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
  }
  /////////


  //show up-next tetromino in mini-grid dislay
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0


  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [displayWidth+2, displayWidth*2+2, displayWidth*3+2, displayWidth*3+1], //jTetromino
    [displayWidth+1, displayWidth*2 + 1, displayWidth * 3 + 1, displayWidth * 3 + 2], //lTetromino
    [displayWidth+1, displayWidth*2+1, displayWidth*2+2, displayWidth*3+2], //zTetromino
    [displayWidth+2, displayWidth*2+2, displayWidth*2 + 1, displayWidth * 3 + 1], //sTetromino
    [1+displayWidth, 2*displayWidth+1, 2*displayWidth+2, 3*displayWidth+1], //tTetromino
    [displayWidth+1, displayWidth+2, displayWidth*2+1, displayWidth*2+2], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove(classes[random])
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add(classes[nextRandom])
    })
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      audio.play();
      draw()
      timerId = setInterval(moveDown, speed_arr[speed_set])
      displayShape()
    }
  })

  //add score
  function addScore() {
    const to_flash = []
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      if(row.every(index => squares[index].classList.contains('taken'))) {
        row.forEach(index => {
          classes.forEach(i => {
            squares[index].classList.remove(i)
          })
          to_flash.push(index)
        })
      }
    }
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
    if (score>=score_arr[speed_set] && speed_set+1<score_arr.length) {
      speed_set++
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed_arr[speed_set])
      speedup.play()
      audio.pause()
      setTimeout(function(){audio.play()},3000)
    }
    to_flash.forEach(i => squares[i].classList.add('flash'))
    setTimeout(function(){
      to_flash.forEach(i => squares[i].classList.remove('flash'))
    }, 150);
  }
})
