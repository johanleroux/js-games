let difficulties

const minesweeper = {
  gameOver: false,
  gameStarted: null,
  gameTime: 0,
  mines: 10,
  cells: 10,
  size: 25,
  time: 0,
  map: []
}

const colors = {
  hidden: ['#AAD751', '#A2D149'],
  visible: ['#D7B899', '#E5C29F'],
  highlight: '#BFE17D',
  cells: {
    1: '#1A76D2',
    2: '#458E3C',
    3: '#D44630',
    4: '#7E4AA2',
    5: '#000000',
    6: '#000000',
    7: '#000000',
    8: '#000000'
  }
}

const images = {
  flag: null,
  clock: null
}

function preload () {
  images.flag = loadImage('https://www.google.com/logos/fnbx/minesweeper/flag_icon.png')
  images.clock = loadImage('https://www.google.com/logos/fnbx/minesweeper/clock_icon.png')
}

function setup () {
  difficulties = createSelect()
  difficulties.position(10, 20)
  difficulties.size(75, 30)
  difficulties.option('Easy')
  difficulties.option('Medium')
  difficulties.option('Hard')
  difficulties.changed(selectDifficulty)

  minesweeperInit()
}

function minesweeperInit () {
  createCanvas(minesweeper.size * minesweeper.cells, minesweeper.size * minesweeper.cells + 60)

  minesweeper.gameOver = false
  minesweeper.gameStarted = null
  minesweeper.gameTime = 0
  minesweeper.time = 0
  minesweeper.map = []

  for (let y = 0; y < minesweeper.cells; y++) {
    const row = []
    for (let x = 0; x < minesweeper.cells; x++) {
      row.push({ cell: 0, visible: false, flagged: false })
    }
    minesweeper.map.push(row)
  }

  let planted = 0
  while (planted < minesweeper.mines) {
    const y = Math.floor(Math.random() * minesweeper.cells)
    const x = Math.floor(Math.random() * minesweeper.cells)

    if (minesweeper.map[y][x].cell !== 'x') {
      minesweeper.map[y][x] = { cell: 'x', visible: false, flagged: false }
      planted++
    }
  }

  for (let y = 0; y < minesweeper.cells; y++) {
    for (let x = 0; x < minesweeper.cells; x++) {
      if (minesweeper.map[y][x].cell !== 'x') {
        minesweeper.map[y][x] = risk(y, x)
      }
    }
  }
}

function risk (y, x) {
  let boom = 0

  let yLow = y - 1
  let yHig = y + 1
  let xLow = x - 1
  let xHig = x + 1

  yLow = yLow < 0 ? 0 : yLow
  xLow = xLow < 0 ? 0 : xLow
  yHig = yHig >= minesweeper.cells ? minesweeper.cells - 1 : yHig
  xHig = xHig >= minesweeper.cells ? minesweeper.cells - 1 : xHig

  for (let i = yLow; i <= yHig; i++) {
    for (let j = xLow; j <= xHig; j++) {
      if (i === y && j === x) continue

      if (minesweeper.map[i][j].cell === 'x') {
        boom++
      }
    }
  }

  return { cell: boom, visible: false, flagged: false }
}

function draw () {
  noStroke()
  fill('#4A752C')
  rect(0, 0, minesweeper.cells * minesweeper.size, 60)
  fill('#FFF')
  textSize(25)

  image(images.flag, 80, 11, 38, 38)
  text(minesweeper.mines - flags(), 120, 38)

  image(images.clock, 170, 11, 38, 38)
  if (!minesweeper.gameOver) { minesweeper.gameTime = minesweeper.gameStarted ? Math.floor(((new Date()) - minesweeper.gameStarted) / 1000) : 0 }
  text(minesweeper.gameTime, 170 + 40, 38)

  for (let y = 0; y < minesweeper.cells; y++) {
    for (let x = 0; x < minesweeper.cells; x++) {
      const inside = minesweeper.map[y][x].cell
      const visible = minesweeper.map[y][x].visible
      const odd = y % 2 === 0 ? x % 2 === 0 : x % 2 === 1

      fill(colors[visible ? 'visible' : 'hidden'][odd ? 1 : 0])
      rect(x * minesweeper.size, y * minesweeper.size + 60, minesweeper.size, minesweeper.size)

      if (minesweeper.map[y][x].visible === false) {
        if (minesweeper.gameOver) continue
        if (
          mouseX > x * minesweeper.size &&
          mouseY > y * minesweeper.size + 60 &&
          mouseX < x * minesweeper.size + minesweeper.size &&
          mouseY < y * minesweeper.size + 60 + minesweeper.size
        ) {
          fill(colors.highlight)
          rect(x * minesweeper.size, y * minesweeper.size + 60, minesweeper.size, minesweeper.size)
        }
      } else {
        if (inside === 'x') {
          fill('red ')
          circle(x * minesweeper.size + minesweeper.size / 2, y * minesweeper.size + 60 + minesweeper.size / 2, (minesweeper.size - 10))
        } else if (inside > 0) {
          fill(colors.cells[inside])
          text(minesweeper.map[y][x].cell, (x * minesweeper.size) + 5, y * minesweeper.size + 60 + 22)
        } else {
          fill(colors[visible ? 'visible' : 'hidden'][odd ? 1 : 0])
          rect(x * minesweeper.size, y * minesweeper.size + 60, minesweeper.size, minesweeper.size)
        }
      }
      if (minesweeper.map[y][x].flagged) {
        image(images.flag, x * minesweeper.size, y * minesweeper.size + 60, minesweeper.size, minesweeper.size)
      }
    }
  }
}

function mousePressed () {
  if (minesweeper.gameOver) return
  for (let y = 0; y < minesweeper.cells; y++) {
    for (let x = 0; x < minesweeper.cells; x++) {
      if (
        mouseX > x * minesweeper.size &&
        mouseY > y * minesweeper.size + 60 &&
        mouseX < x * minesweeper.size + minesweeper.size &&
        mouseY < y * minesweeper.size + 60 + minesweeper.size
      ) {
        if (!minesweeper.gameStarted) {
          minesweeper.gameStarted = new Date()
        }
        if (mouseButton === 'left' && !minesweeper.map[y][x].flagged) this.reveal(y, x)
        else if (mouseButton === 'right' && !minesweeper.map[y][x].visible) {
          minesweeper.map[y][x].flagged = !minesweeper.map[y][x].flagged
        }
      }
    }
  }
}

function reveal (y, x) {
  if (minesweeper.map[y][x].visible === true) return

  minesweeper.map[y][x].visible = true
  minesweeper.map[y][x].flagged = false

  gameOver()

  if (minesweeper.map[y][x].cell === 'x') {
    minesweeper.gameOver = true
    for (let y = 0; y < minesweeper.cells; y++) {
      for (let x = 0; x < minesweeper.cells; x++) {
        if (minesweeper.map[y][x].cell === 'x') {
          minesweeper.map[y][x].visible = true
          minesweeper.map[y][x].flagged = false
        }
      }
    }
    return
  }

  if (minesweeper.map[y][x].cell === 0) {
    const cells = this.surroundings(y, x)

    for (const cell of cells) { this.reveal(cell.y, cell.x) }
  }
}

function surroundings (y, x) {
  let yLow = y - 1
  let yHig = y + 1
  let xLow = x - 1
  let xHig = x + 1

  yLow = yLow < 0 ? 0 : yLow
  xLow = xLow < 0 ? 0 : xLow
  yHig = yHig >= minesweeper.cells ? minesweeper.cells - 1 : yHig
  xHig = xHig >= minesweeper.cells ? minesweeper.cells - 1 : xHig

  const cells = []

  for (let i = yLow; i <= yHig; i++) {
    for (let j = xLow; j <= xHig; j++) {
      if (i === y && j === x) continue

      cells.push({
        y: i,
        x: j
      })
    }
  }

  return cells
}

function flags () {
  let flags = 0
  for (let y = 0; y < minesweeper.cells; y++) {
    for (let x = 0; x < minesweeper.cells; x++) {
      if (minesweeper.map[y][x].flagged) flags++
    }
  }

  return flags
}

function gameOver () {
  let visible = 0
  for (let y = 0; y < minesweeper.cells; y++) {
    for (let x = 0; x < minesweeper.cells; x++) {
      if (minesweeper.map[y][x].visible) visible++
    }
  }

  minesweeper.gameOver = visible === (minesweeper.cells * minesweeper.cells - minesweeper.mines)
}

function keyPressed () {
  if (keyCode === 82) { minesweeperInit() }
}

function selectDifficulty () {
  switch (difficulties.value()) {
    case 'Easy':
      minesweeper.mines = 10
      minesweeper.cells = 10
      break

    case 'Medium':
      minesweeper.mines = 40
      minesweeper.cells = 18
      break

    case 'Hard':
      minesweeper.mines = 100
      minesweeper.cells = 24
      break

    default:
      break
  }

  minesweeperInit()
}
