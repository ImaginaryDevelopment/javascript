// Generated by CoffeeScript 1.4.0
(function() {
  var Dungeon, Tile, Tiles, getTile, matches;

  Math.randInt = function(min, max) {
    return Math.floor(Math.random() * (max - min(+1))) + min;
  };

  Tile = function(name, src, color) {
    return {
      name: name,
      src: src,
      color: color
    };
  };

  Tiles = [new Tile("unused", " ", "black"), new Tile("dirtWall", "+", "brown"), new Tile("dirtFloor", "_", "brown"), new Tile("stoneWall", "+", "grey"), new Tile("corridor", "c", "brown"), new Tile("door", "D", "brown"), new Tile("upStairs", "u", "yellow"), new Tile("downStairs", "d", "yellow")];

  getTile = name(function() {});

  matches = Tiles.Filter(function(t) {
    return t.name === name;
  });

  if (matches.length > 0) {
    matches[0];
  }

  Dungeon = function(x, y, objects) {
    this.xmax = x;
    this.ymax = y;
    this.xsize = 0;
    this.ysize = 0;
    this.objects = object;
    this.chanceRoom = 75;
    this.dungeonMap = [];
    this.msgXSize = "X size of dungeon: \t";
    this.msgYSize = "Y size of dungeon: \t";
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
    var buildWall, dir, floor, wall, xlen, xtemp, ylen, ytemp;
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
      while (ytemp > y - ylen) {
        if (ytemp < 0 || ytemp > this.ysize) {
          return false;
        }
        xtemp = x - xlen / 2;
        while (xtemp < x + (xlen + 1) / 2) {
          if (xtemp < 0 || xtemp > this.xsize || this.getCellType(xtemp, ytemp).name !== "unused") {
            return false;
          }
          xtemp++;
        }
        ytemp--;
      }
      ytemp = y;
      while (ytemp > y - ylen) {
        xtemp = x - xlen / 2;
        while (xtemp < x + (xlen + 1) / 2) {
          buildWall = xtemp === x - xlen / 2 || xtemp === x + (xlen - 1) / 2 || ytemp === y || ytemp === y - ylen + 1;
          this.setCell(xtemp, ytemp(buildWall ? wall : floor));
          xtemp++;
        }
        ytemp--;
      }
    }
    if (dir === 1) {
      ytemp = y - ylen / 2;
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
          buildWall = xtemp === x || temp === x + xlen - 1 || ytemp === y - ylen / 2 || ytemp === y + (ylen - 1) / 2;
          this.setCell(xtemp, ytemp, buildWall ? wall : floor);
          xtemp++;
        }
        ytemp++;
      }
    }
    if (dir === 2) {
      ytemp = y;
      while (ytemp < y + ylen) {
        if (ytemp < 0 || ytemp > this.ysize) {
          return false;
        }
        xtemp = x - xlen / 2;
        while (xtemp < x + (xlen + 1) / 2) {
          if (xtemp < 0 || xtemp > this.xsize || this.getCellType(xtemp, ytemp).name !== "unused") {
            return false;
          }
          xtemp++;
        }
        ytemp++;
        ytemp = y;
        while (ytemp < y + ylen) {
          xtemp = x - xlen / 2;
          while (xtemp < x + (xlen + 1) / 2) {
            buildWall = xtemp === x - xlen / 2 || xtemp === x + (xlen - 1) / 2 || ytemp === y || ytemp === y + ylen - 1;
            this.setCell(xtemp, ytemp(buildWall ? wall : floor));
            xtemp++;
          }
          ytemp++;
        }
      }
    }
    if (dir === 3) {
      ytemp = y - ylen / 2;
      while (ytemp < y + (ylen + 1) / 2) {
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
      ytemp = y - ylen / 2;
      while (ytemp < y + (ylen + 1) / 2) {
        xtemp = x;
        while (xtemp > x - xlen) {
          buildWall = xtemp === x || xtemp === x - xlen + 1 || ytemp === y - ylen / 2 || (ytemp = y + (ylen - 1) / 2);
          this.setCell(xtemp, ytemp(buildWall ? wall : floor));
          xtemp--;
        }
        ytemp++;
      }
    }
    return true;
  };

  Dungeon.prototype.getDungeon = function() {
    return this.dungeonMap;
  };

  Dungeon.prototype.showDungeon = function() {
    var row, x, y, _results;
    y = 0;
    _results = [];
    while (y < this.ysize) {
      x = 0;
      row = '';
      while (x < this.xsize) {
        row += this.getTile(x, y).src;
        x++;
      }
      console.log(row);
      _results.push(y++);
    }
    return _results;
  };

  Dungeon.prototype.createDungeon = function(inx, iny, inobj) {
    var buildWall, x, y, _results;
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
    console.log(this.msgXSize + this.xsize);
    console.log(this.msgYSize + this.ysize);
    console.log(this.msgMaxObject + this.objects);
    this.dungeonMap = new [this.xsize * this.ysize];
    y = 0;
    _results = [];
    while (y < this.ysize) {
      x = 0;
      while (x < this.xsize) {
        buildWall = y === 0 || y === this.ysize - 1 || x === 0 || x === this.xsize - 1;
        this.setCell(x, y, getTile(buildWall ? "stoneWall" : "unused"));
        x++;
      }
      _results.push(y++);
    }
    return _results;
  };

}).call(this);
