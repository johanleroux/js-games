const game = {
  cells: 25,
  size: 25,
  map: [],
  snake: [],
  apple: {},
  direction: 'right',
  gameOver: false
}

const colors = {
  map: ['#AAD751', '#A2D149'],
  snake: ['darkblue', 'blue'],
  apple: 'red'
}

function setup () {
  createCanvas(game.size * game.cells, game.size * game.cells + 60)
  frameRate(5)

  for (let y = 0; y < game.cells; y++) {
    const row = []
    for (let x = 0; x < game.cells; x++) {
      row.push({ cell: 0, visible: false, flagged: false })
    }
    game.map.push(row)
  }

  game.snake.push({ y: 12, x: 12 })
  game.snake.push({ y: 12, x: 11 })
  game.snake.push({ y: 12, x: 10 })

  spawnApple()
}

function draw () {
  if (!game.gameOver) {
    moveSnake()
  }

  noStroke()
  fill('#4A752C')
  rect(0, 0, game.cells * game.size, 60)
  fill('#FFF')
  textSize(25)

  for (let y = 0; y < game.cells; y++) {
    for (let x = 0; x < game.cells; x++) {
      const odd = y % 2 === 0 ? x % 2 === 0 : x % 2 === 1

      fill(colors.map[odd ? 1 : 0])
      rect(x * game.size, y * game.size + 60, game.size, game.size)
    }
  }

  fill(colors.apple)
  rect(game.apple.x * game.size, game.apple.y * game.size + 60, game.size, game.size)

  for (const [key, snake] of game.snake.entries()) {
    fill(key === 0 ? colors.snake[0] : colors.snake[1])
    rect(snake.x * game.size, snake.y * game.size + 60, game.size, game.size)
  }
}

function moveSnake () {
  let y, x

  switch (game.direction) {
    case 'left':
      y = game.snake[0].y
      x = game.snake[0].x - 1
      break

    case 'right':
      y = game.snake[0].y
      x = game.snake[0].x + 1
      break

    case 'up':
      y = game.snake[0].y - 1
      x = game.snake[0].x
      break

    case 'down':
      y = game.snake[0].y + 1
      x = game.snake[0].x
      break

    default:
      break
  }

  if (collision(y, x)) {
    game.gameOver = true
  } else {
    game.snake.unshift({ y, x })
  }

  const head = game.snake[0]
  if (head.y === game.apple.y && head.x === game.apple.x) {
    spawnApple()
  } else {
    game.snake.pop()
  }
}

function keyPressed () {
  switch (keyCode) {
    case LEFT_ARROW:
      if (game.direction !== 'right') game.direction = 'left'
      break
    case RIGHT_ARROW:
      if (game.direction !== 'left') game.direction = 'right'
      break
    case UP_ARROW:
      if (game.direction !== 'down') game.direction = 'up'
      break
    case DOWN_ARROW:
      if (game.direction !== 'up') game.direction = 'down'
      break

    default:
      break
  }
}

function collision (y, x) {
  for (const snake of game.snake) { if (snake.y === y && snake.x === x) return true }

  if (y < 0 || y >= game.cells) return true
  if (x < 0 || x >= game.cells) return true
}

function spawnApple () {
  let spawned = false
  while (!spawned) {
    const y = Math.floor(Math.random() * game.cells)
    const x = Math.floor(Math.random() * game.cells)

    for (const snake of game.snake) { if (snake.y === y && snake.x === x) continue }
    game.apple = { y, x }
    spawned = true
  }
}
