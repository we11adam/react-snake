import React from 'react';
import './Snake.css';
// import keydown, {Keys} from 'react-keydown';
//
// const {UP, DOWN, LEFT, RIGHT} = Keys;


function Tile(props) {
  return (
    <div
      className={'tile ' + (props.shouldHighlight ? 'hlt' : '')}
      data-name={props.name}
    >
    </div>
  )
}

class Snake extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.acceptableKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    this.keyMap = {
      'ArrowLeft': 'left', 'ArrowRight': 'right', 'ArrowUp': 'up', 'ArrowDown': 'down'
    };
    this.handleArrowKey = this.handleArrowKey.bind(this);
    this.state = {
      snake: [
        {x: 8, y: 11},
        {x: 8, y: 12},
      ]
    };
    this.updateDirection();
    this.newHead = null;
  }

  updateDirection() {
    const [head, neck] = this.state.snake;
    this.direction = head.x === neck.x ? 'vertical' : 'horizontal';
  }

  crawl() {
    const snake = this.state.snake.slice();
    const [head, neck] = snake;
    let newHead;

    if (this.newHead) {
      newHead = this.newHead;
    } else if (head.x === neck.x) {
      newHead = {
        x: head.x,
        y: 2 * head.y - neck.y
      }
    } else {
      newHead = {
        x: 2 * head.x - neck.x,
        y: head.y
      }
    }

    snake.unshift(newHead);
    snake.pop();

    this.newHead = null;

    this.setState({
      snake
    })

  }

  handleArrowKey(evt) {

    let {key} = evt;
    if (!this.acceptableKeys.includes(key)) {
      return evt.preventDefault();
    }

    key = this.keyMap[key];

    const [head] = this.state.snake;

    if (this.direction === "vertical" && (key === 'left' || key === 'right')) {
      const goLeft = key === 'left';
      this.newHead = {x: head.x + (goLeft ? -1 : 1), y: head.y};

    }

    if (this.direction === "horizontal" && (key === 'up' || key === 'down')) {
      const goUp = key === 'up';
      this.newHead = {
        x: head.x,
        y: head.y + (goUp ? 1 : -1)
      };
    }

    console.log(`new head: ${this.newHead}`);

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateDirection();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleArrowKey);
    this.timer = setInterval(() => {
      this.crawl();
    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    document.removeEventListener('keydown', this.handleArrowKey);
  }

  render() {
    const {width, height} = this.props;
    const tiles = [];
    let y = height;
    while (y > 0) {
      let x = 0;
      while (x < width) {
        tiles.push(
          <Tile
            shouldHighlight={isTileIncluded({x, y}, this.state.snake)}
            key={`${x}-${y}`}
            name={`${x}-${y}`}
          />);
        x++;
      }
      y--;
    }
    return tiles;
  }
}

function isTileIncluded(tile, snake) {
  if (!snake || snake.length === 0) {
    return false;
  }
  for (let part of snake) {
    if (part.x === tile.x && part.y === tile.y) {
      return true;
    }
  }
  return false;
}

export default Snake;
