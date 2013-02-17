// Generated by CoffeeScript 1.4.0
/*
based on 
http://roguebasin.roguelikedevelopment.org/index.php?title=Java_Example_of_Dungeon-Building_Algorithm
*/

var Dungeon, Tile, Tiles, getTile;

Math.randInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Tile = (function() {

  function Tile(name, src, color, passable) {
    this.name = name;
    this.src = src;
    this.color = color;
    this.passable = passable;
  }

  return Tile;

})();

Tile.prototype.isDirtfloorOrCorridor = function() {
  return this.name === "dirtFloor" || this.name === "corridor";
};

Tiles = [new Tile("unused", "_", "black", true), new Tile("dirtWall", "+", "brown", false), new Tile("dirtFloor", ".", "brown", true), new Tile("stoneWall", "O", "grey", false), new Tile("corridor", "#", "brown", true), new Tile("door", "D", "brown", true), new Tile("upStairs", "<", "yellow", true), new Tile("downStairs", ">", "yellow", true)];

getTile = function(name) {
  var matches;
  matches = Tiles.filter(function(t) {
    return t.name === name;
  });
  if (matches.length > 0) {
    return matches[0];
  }
};

Dungeon = function() {
  this.xmax;
  this.ymax;
  this.xsize = 0;
  this.ysize = 0;
  this.objects;
  this.chanceRoom = 75;
  this.dungeonMap = [];
  this.msgXSize = "X size of dungeon: \t";
  this.msgYSize = "Y size of dungeon: \t";
  this.msgMaxObject = "Max objects: \t";
  this.msgNumObjects = "Created objects: \t";
  return this;
};

Dungeon.prototype.setCell = function(x, y, cellType) {
  return this.dungeonMap[x + this.xsize * y] = cellType;
};

Dungeon.prototype.getCellType = function(x, y) {
  return this.dungeonMap[x + this.xsize * y];
};

Dungeon.prototype.makeCorridor = function(x, y, length, direction) {
  var dir, floor, len, xtemp, ytemp;
  len = Math.randInt(2, length);
  floor = getTile("corridor");
  dir = 0;
  if (direction > 0 && direction < 4) {
    dir = direction;
  }
  xtemp = 0;
  ytemp = 0;
  if (dir === 0) {
    if (x < 0 || x > this.xsize) {
      return false;
    }
    xtemp = x;
    ytemp = y;
    while (ytemp > (y - len)) {
      if (ytemp < 0 || ytemp > this.ysize || this.getCellType(xtemp, ytemp).name !== "unused") {
        return false;
      }
      ytemp--;
    }
    ytemp = y;
    while (ytemp > (y - len)) {
      this.setCell(xtemp, ytemp, floor);
      ytemp--;
    }
  }
  if (dir === 1) {
    if (y < 0 || y > this.ysize) {
      return false;
    }
    ytemp = y;
    xtemp = x;
    while (xtemp < (x + len)) {
      if (xtemp < 0 || xtemp > this.xsize || this.getCellType(xtemp, ytemp).name !== "unused") {
        return false;
      }
      xtemp++;
    }
    xtemp = x;
    while (xtemp < (x + len)) {
      this.setCell(xtemp, ytemp, floor);
      xtemp++;
    }
  }
  if (dir === 2) {
    if (x < 0 || x > this.xsize) {
      return false;
    }
    xtemp = x;
    ytemp = y;
    while (ytemp < (y + len)) {
      if (ytemp < 0 || ytemp > this.ysize || this.getCellType(xtemp, ytemp).name !== "unused") {
        return false;
      }
      ytemp++;
    }
    ytemp = y;
    while (ytemp < (y + len)) {
      this.setCell(xtemp, ytemp, floor);
      ytemp++;
    }
  }
  if (dir === 3) {
    if (ytemp < 0 || ytemp > this.ysize) {
      return false;
    }
    ytemp = y;
    xtemp = x;
    while (xtemp > x - len) {
      if (xtemp < 0 || xtemp > this.xsize || this.getCellType(xtemp, ytemp).name !== "unused") {
        return false;
      }
      xtemp--;
    }
    xtemp = x;
    while (xtemp > x - len) {
      this.setCell(xtemp, ytemp, floor);
      xtemp--;
    }
  }
  return true;
};

Dungeon.prototype.makeRoom = function(x, y, xlength, ylength, direction) {
  var buildWall, dir, eastwall, floor, insideEast, insideeastwall, insidenorthwall, northwall, southwall, wall, westwall, xlen, xtemp, ylen, ytemp;
  xlen = Math.randInt(4, xlength);
  ylen = Math.randInt(4, ylength);
  floor = getTile("dirtFloor");
  wall = getTile("dirtWall");
  dir = 0;
  if (direction > 0 && direction < 4) {
    dir = direction;
  }
  if (dir === 0) {
    ytemp = y;
    westwall = Math.round(x - xlen / 2);
    insideEast = Math.round(x + (xlen - 1) / 2);
    eastwall = Math.round(x + (xlen + 1) / 2);
    while (ytemp > y - ylen) {
      if (ytemp < 0 || ytemp > this.ysize) {
        return false;
      }
      xtemp = westwall;
      while (xtemp < eastwall) {
        if (xtemp < 0 || xtemp > this.xsize || this.getCellType(xtemp, ytemp).name !== "unused") {
          return false;
        }
        xtemp++;
      }
      ytemp--;
    }
    ytemp = y;
    while (ytemp > y - ylen) {
      xtemp = westwall;
      while (xtemp < eastwall) {
        buildWall = xtemp === westwall || xtemp === insideEast || ytemp === y || ytemp === y - ylen + 1;
        this.setCell(xtemp, ytemp, buildWall ? wall : floor);
        xtemp++;
      }
      ytemp--;
    }
  }
  if (dir === 1) {
    southwall = Math.round(y - ylen / 2);
    northwall = Math.round(y + (ylen + 1) / 2);
    insidenorthwall = Math.round(y + (ylen - 1) / 2);
    ytemp = southwall;
    while (ytemp < y + (ylen + 1) / 2) {
      if (ytemp < 0 || ytemp > this.ysize) {
        return false;
      }
      xtemp = x;
      while (xtemp < x + xlen) {
        if (xtemp < 0 || xtemp > this.xsize || this.getCellType(xtemp, ytemp).name !== "unused") {
          return false;
        }
        xtemp++;
      }
      ytemp++;
    }
    ytemp = y - ylen / 2;
    while (ytemp < y + (ylen + 1) / 2) {
      xtemp = x;
      while (xtemp < x + xlen) {
        buildWall = xtemp === x || xtemp === x + xlen - 1 || ytemp === southwall || ytemp === insidenorthwall;
        this.setCell(xtemp, ytemp, buildWall ? wall : floor);
        xtemp++;
      }
      ytemp++;
    }
  }
  if (dir === 2) {
    ytemp = y;
    westwall = Math.round(x - xlen / 2);
    eastwall = Math.round(x + (xlen + 1) / 2);
    insideeastwall = Math.round(x + (xlen - 1) / 2);
    while (ytemp < y + ylen) {
      if (ytemp < 0 || ytemp > this.ysize) {
        return false;
      }
      xtemp = westwall;
      while (xtemp < eastwall) {
        if (xtemp < 0 || xtemp > this.xsize || this.getCellType(xtemp, ytemp).name !== "unused") {
          return false;
        }
        xtemp++;
      }
      ytemp++;
      ytemp = y;
      while (ytemp < y + ylen) {
        xtemp = westwall;
        while (xtemp < eastwall) {
          buildWall = xtemp === westwall || xtemp === insideeastwall || ytemp === y || ytemp === y + ylen - 1;
          this.setCell(xtemp, ytemp, buildWall ? wall : floor);
          xtemp++;
        }
        ytemp++;
      }
    }
  }
  if (dir === 3) {
    southwall = Math.round(y - ylen / 2);
    northwall = Math.round(y + (ylen + 1) / 2);
    insidenorthwall = Math.round(y + (ylen - 1) / 2);
    ytemp = southwall;
    while (ytemp < northwall) {
      if (ytemp < 0 || ytemp > this.ysize) {
        return false;
      }
      xtemp = x;
      while (xtemp > x - xlen) {
        if (xtemp < 0 || xtemp > this.xsize || this.getCellType(xtemp, ytemp) !== "unused") {
          return false;
        }
        xtemp--;
      }
      ytemp++;
    }
    ytemp = southwall;
    while (ytemp < northwall) {
      xtemp = x;
      while (xtemp > x - xlen) {
        buildWall = xtemp === x || xtemp === x - xlen + 1 || ytemp === southwall || (ytemp = insidenorthwall);
        this.setCell(xtemp, ytemp, buildWall ? wall : floor);
        xtemp--;
      }
      ytemp++;
    }
  }
  return true;
};

Dungeon.prototype.getDungeon = function() {
  return this.dungeonMap.slice(0);
};

Dungeon.prototype.showDungeon = function() {
  var row, x, y, _results;
  y = 0;
  _results = [];
  while (y < this.ysize) {
    x = 0;
    row = '';
    while (x < this.xsize) {
      row += this.getCellType(x, y).src;
      x++;
    }
    console.log(row + " " + y);
    _results.push(y++);
  }
  return _results;
};

Dungeon.prototype.initialize = function(x, y) {
  var buildWall;
  this.xsize = x;
  this.ysize = y;
  console.log(this.msgXSize + this.xsize);
  console.log(this.msgYSize + this.ysize);
  this.dungeonMap = [];
  y = 0;
  while (y < this.ysize) {
    x = 0;
    while (x < this.xsize) {
      buildWall = y === 0 || y === this.ysize - 1 || x === 0 || x === this.xsize - 1;
      this.setCell(x, y, getTile(buildWall ? "stoneWall" : "unused"));
      x++;
    }
    y++;
  }
  return true;
};

Dungeon.prototype.createDungeon = function(inx, iny, inobj) {
  var cell1, cell2, cell3, cell4, cellType, countingTries, currentFeatures, feature, newx, newy, testing, validTile, xcenter, xmod, ycenter, ymod;
  this.objects = inobj < 1 ? 10 : inobj;
  if (inx < 3) {
    this.xsize = 3;
  } else if (iny > this.ymax) {
    this.ysize = this.ymax;
  } else {
    this.xsize = inx;
  }
  if (iny < 3) {
    this.ysize = this.ymax;
  } else if (iny > this.ymax) {
    this.ysize = this.ymax;
  } else {
    this.ysize = iny;
  }
  this.initialize(this.xsize, this.ysize);
  console.log(this.msgMaxObject + this.objects);
  xcenter = Math.round(this.xsize / 2);
  ycenter = Math.round(this.ysize / 2);
  this.makeRoom(xcenter, ycenter, 8, 6, Math.randInt(0, 3));
  currentFeatures = 1;
  countingTries = 0;
  while (countingTries < 1000) {
    if (currentFeatures >= this.objects) {
      break;
    }
    newx = 0;
    xmod = 0;
    newy = 0;
    ymod = 0;
    validTile = -1;
    testing = 0;
    while (testing < 1000) {
      newx = Math.randInt(1, this.xsize - 1);
      newy = Math.randInt(1, this.ysize - 1);
      validTile = -1;
      cellType = this.getCellType(newx, newy);
      if (cellType.name === "dirtWall" || cellType.name === "corridor") {
        cell1 = this.getCellType(newx, newy + 1);
        cell2 = this.getCellType(newx - 1, newy);
        cell3 = this.getCellType(newx, newy - 1);
        cell4 = this.getCellType(newx + 1, newy);
        if (cell1 && cell1.isDirtfloorOrCorridor()) {
          validTile = 0;
          xmod = 0;
          ymod = -1;
        } else if (cell2 && cell2.isDirtfloorOrCorridor()) {
          validTile = 1;
          xmod = +1;
          ymod = 0;
        } else if (cell3 && cell3.isDirtfloorOrCorridor()) {
          validTile = 2;
          xmod = 0;
          ymod = +1;
        } else if (cell4 && cell4.isDirtfloorOrCorridor()) {
          validTile = 3;
          xmod = -1;
          ymod = 0;
        }
        if (validTile > (-1)) {
          if ((cell1 && cell1.name === "door") || (cell2 && cell2.name === "door") || (cell3 && cell3.name === "door") || (cell4 && cell4.name === "door")) {
            console.log('invalidating tile for door');
            validTile = -1;
          }
        }
        if (validTile >= 0) {
          break;
        }
      }
    }
    if (validTile > -1) {
      feature = Math.randInt(0, 100);
      if (feature <= this.chanceRoom) {
        if (this.makeRoom(newx + xmod, newy + ymod, 8, 6, validTile)) {
          console.log('made a room!');
          currentFeatures++;
          this.setCell(newx, newy, getTile("door"));
          this.setCell(newx + xmod, newy + ymod, getTile("dirtFloor"));
        }
      } else if (feature >= this.chanceRoom) {
        console.log('making a corridor!');
        if (this.makeCorridor(newx + xmod, newy + ymod, 6, validTile)) {
          console.log('made a corridor!');
          currentFeatures++;
          this.setCell(newx, newy, getTile("door"));
        }
      }
      testing++;
    }
    countingTries++;
  }
  console.log("countingTries:" + countingTries);
  this.addSprinkles();
  console.log(this.msgNumObjects + currentFeatures);
  return true;
};

Dungeon.prototype.addSprinkles = function() {
  var cantgo, newx, newy, self, state, testing, ways, _results;
  newx = 0;
  newy = 0;
  ways = 0;
  state = 0;
  _results = [];
  while (state !== 10) {
    testing = 0;
    _results.push((function() {
      var _results1;
      _results1 = [];
      while (testing < 1000) {
        newx = Math.randInt(1, this.xsize - 1);
        newy = Math.randInt(1, this.ysize - 2);
        ways = 4;
        self = this;
        cantgo = function(x, y) {
          return self.getCellType(x, y).isDirtfloorOrCorridor() || self.getCellType(x, y).name !== "door";
        };
        if (cantgo(newx, newy + 1)) {
          ways--;
        }
        if (cantgo(newx - 1, newy)) {
          ways--;
        }
        if (cantgo(newx, newy - 1)) {
          ways--;
        }
        if (cantgo(newx + 1, newy)) {
          ways--;
        }
        if (state === 0 && ways === 0) {
          this.setCell(newx, newy, getTile("upStairs"));
          state = 1;
          break;
        }
        if (state === 1 && ways === 0) {
          this.setCell(newx, newy, getTile("downStairs"));
          state = 10;
          break;
        }
        _results1.push(testing++);
      }
      return _results1;
    }).call(this));
  }
  return _results;
};
