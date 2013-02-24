var main = function(){
  var x=80;
  var y=25;
  var dungeonObjects=40;
  var generator = new Dungeon();
  var d= generator.createDungeon(x,y,dungeonObjects);
  var dArray=generator.getDungeon();
  return generator;
};

var Dungeon=function(){
  var self=this;
  self.xmax=80;
  self.ymax=25;
  
  self.objects=0;
  self.chanceRoom=75;
  self.dungeonMap=[];
  self.msgXSize= "X size of dungeon: \t";
  self.msgYSize="Y size of dungeon: \t";
  self.msgMaxObjects= "max # of objects:\t";
  self.msgNumObjects= "# of objects made: \t";
  self.setCell=function(x,y, cellType){
    self.dungeonMap[x+self.xsize*y]=cellType;
  };
  
  self.getCellType=function(x,y){
    return self.dungeonMap[x+self.xsize*y];
  };
  
  self.getRand=function(min,max){
    return Math.floor( Math.random()*max)+min;
  };
  
  self.makeCorridor=function(x,y,length,direction){
    var len=self.getRand(2,length);
    var floor=Tile.Corridor;
    var dir=0;
    if(direction>0 && direction<4) dir=direction;
    var xtemp=0;
    var ytemp=0;
    switch(dir){
      case 0:
        if(x<0 || x>xsize) return false;
        xtemp=x;
        for (ytemp = y; ytemp > (y-len); ytemp--){
				if (ytemp < 0 || ytemp > self.ysize) return false; 
				if (self.getCellType(xtemp, ytemp) != Tile.Unused) return false;
			}
        for (ytemp = y; ytemp > (y-len); ytemp--){
				setCell(xtemp, ytemp, floor);
			}
        break;
      case 1:
        //east
				if (y < 0 || y > self.ysize) return false;
				else ytemp = y;
 
				for (xtemp = x; xtemp < (x+len); xtemp++){
					if (xtemp < 0 || xtemp > self.xsize) return false;
					if (self.getCellType(xtemp, ytemp) != Tile.Unused) return false;
				}
 
				for (xtemp = x; xtemp < (x+len); xtemp++){
					self.setCell(xtemp, ytemp, floor);
				}
			break;
    case 2:
		//south
			if (x < 0 || x > xsize) return false;
			else xtemp = x;
 
			for (ytemp = y; ytemp < (y+len); ytemp++){
				if (ytemp < 0 || ytemp > self.ysize) return false;
				if (GetCellType(xtemp, ytemp) != Tile.Unused) return false;
			}
 
			for (ytemp = y; ytemp < (y+len); ytemp++){
				setCell(xtemp, ytemp, floor);
			}
			break;
		case 3:
		//west
			if (ytemp < 0 || ytemp > self.ysize) return false;
			else ytemp = y;
 
			for (xtemp = x; xtemp > (x-len); xtemp--){
				if (xtemp < 0 || xtemp > self.xsize) return false;
				if (GetCellType(xtemp, ytemp) != Tile.Unused) return false; 
			}
 
			for (xtemp = x; xtemp > (x-len); xtemp--){
				setCell(xtemp, ytemp, floor);
			}
			break;
		}
 
		//woot, we're still here! let's tell the other guys we're done!!
		return true;
  };
  self.makeRoom=function(x, y, xlength, ylength, direction){
		//define the dimensions of the room, it should be at least 4x4 tiles (2x2 for walking on, the rest is walls)
		var xlen = self.getRand(4, xlength);
		var ylen = self.getRand(4, ylength);
		//the tile type it's going to be filled with
		var floor = Tile.DirtFloor;
		var wall = Tile.DirtWall;
		//choose the way it's pointing at
		var dir = 0;
		if (direction > 0 && direction < 4) dir = direction;
        var xtemp=0;
        var ytemp=0;
		switch(dir){
		case 0:
            var westwall=Math.round(x-xlen/2);
            var insideEast=Math.round(x+ (xlen-1)/2);
            var eastWall= Math.round(x+(xlen+1)/2);
		//north
			//Check if there's enough space left for it
			for (ytemp = y; ytemp > (y-ylen); ytemp--){
				if (ytemp < 0 || ytemp > self.ysize) return false;
				for (xtemp = westwall; xtemp < eastWall; xtemp++){
					if (xtemp < 0 || xtemp > self.xsize) return false;
					if (self.getCellType(xtemp, ytemp) != Tile.Unused) return false; //no space left...
				}
			}
 
			//we're still here, build
			for (ytemp = y; ytemp > (y-ylen); ytemp--){
				for (xtemp = westwall; xtemp < eastWall; xtemp++){
					//start with the walls
					if (xtemp == westwall) setCell(xtemp, ytemp, wall);
					else if (xtemp == insideEast) setCell(xtemp, ytemp, wall);
					else if (ytemp == y) setCell(xtemp, ytemp, wall);
					else if (ytemp == (y-ylen+1)) setCell(xtemp, ytemp, wall);
					//and then fill with the floor
					else setCell(xtemp, ytemp, floor);
				}
			}
			break;
		case 1:
		//east
            var southwall=Math.round( y-ylen/2);
            var northwall=Math.round( y+ (ylen+1)/2);
            var insideSouthWall=Math.round(y+(ylen-1)/2);
            
			for (ytemp = southwall; ytemp < northwall; ytemp++){
				if (ytemp < 0 || ytemp > ysize) return false;
				for (xtemp = x; xtemp < (x+xlen); xtemp++){
					if (xtemp < 0 || xtemp > xsize) return false;
					if (self.getCellType(xtemp, ytemp) != Tile.Unused) return false;
				}
			}
 
			for (ytemp = southwall; ytemp < northwall; ytemp++){
				for (xtemp = x; xtemp < (x+xlen); xtemp++){
 
					if (xtemp == x) setCell(xtemp, ytemp, wall);
					else if (xtemp == (x+xlen-1)) setCell(xtemp, ytemp, wall);
					else if (ytemp == southwall) setCell(xtemp, ytemp, wall);
					else if (ytemp == insideSouthWall) setCell(xtemp, ytemp, wall);
 
					else setCell(xtemp, ytemp, floor);
				}
			}
			break;
		case 2:
		//south
            westwall=Math.round(x-xlen/2);
            eastwall=Math.round(x(xlen+1)/2);
            insideEast=Math.round(x+(xlen-1)/2);
			for (ytemp = y; ytemp < (y+ylen); ytemp++){
				if (ytemp < 0 || ytemp > ysize) return false;
				for (xtemp = westwall; xtemp < eastwall; xtemp++){
					if (xtemp < 0 || xtemp > xsize) return false;
					if (self.getCellType(xtemp, ytemp) != Tile.Unused) return false;
				}
			}
 
			for (ytemp = y; ytemp < (y+ylen); ytemp++){
				for (xtemp = westwall; xtemp < eastwall; xtemp++){
 
					if (xtemp == westwall) setCell(xtemp, ytemp, wall);
					else if (xtemp == insideEast) setCell(xtemp, ytemp, wall);
					else if (ytemp == y) setCell(xtemp, ytemp, wall);
					else if (ytemp == (y+ylen-1)) setCell(xtemp, ytemp, wall);
 
					else setCell(xtemp, ytemp, floor);
				}
			}
			break;
		case 3:
		//west
            southwall=Math.round(y-ylen/2);
            northwall=Math.round(y+(ylen+1)/2);
            insideSouthWall=Math.round(y+(ylen-1)/2);
            
			for (ytemp = southwall; ytemp < northwall; ytemp++){
				if (ytemp < 0 || ytemp > ysize) return false;
				for (xtemp = x; xtemp > (x-xlen); xtemp--){
					if (xtemp < 0 || xtemp > xsize) return false;
					if (self.getCellType(xtemp, ytemp) != Tile.Unused) return false; 
				}
			}
 
			for (ytemp = southwall; ytemp < northwall; ytemp++){
				for (xtemp = x; xtemp > (x-xlen); xtemp--){
 
					if (xtemp == x) setCell(xtemp, ytemp, wall);
					else if (xtemp == (x-xlen+1)) setCell(xtemp, ytemp, wall);
					else if (ytemp == southwall) setCell(xtemp, ytemp, wall);
					else if (ytemp == insideSouthWall) setCell(xtemp, ytemp, wall);
 
					else setCell(xtemp, ytemp, floor);
				}
			}
			break;
		}
 
		//yay, all done
		return true;
	};
  self.getDungeon=function(){
    return self.dungeonMap.slice(0);
    
  };
  self.showDungeon=function(){
      
      
    for(var y=0;y<self.ysize;y++){
      var row='';
      for(var x=0;x<self.xsize;x++){
        row+=self.getCellType(x,y);
      }
      console.log(row);
    }
  };
  
  self.createDungeon=function(inx,iny, inobj){
    var xsize,ysize;
    self.objects=inobj<1? 10:inobj;
    if(inx<3){ xsize=3;} else if(inx>self.xmax){ xsize=self.xmax;} else {xsize=inx;}
    if(iny<3){ ysize=3;} else if(iny>self.ymax){ ysize=self.ymax;} else {ysize=iny;}
    console.log(self.msgXSize + xsize);
    console.log(self.msgYSize+ysize);
    console.log(self.msgMaxObjects+self.objects);
    
    for(var y=0; y<ysize;y++){
      for(var x=0; x<xsize; x++){
        if( y===0 || y===ysize-1 ||x===0 || x===xsize-1){ self.setCell(x,y,Tile.StoneWall);} else
          self.setCell(x,y,Tile.Unused);
        
      }
    }
    var xcenter=Math.round(xsize/2);
    var ycenter=Math.round(ysize/2);
    
    self.makeRoom(xcenter,ycenter,8,6,self.getRand(0,3));
  };
};//end Dungeon

var Tile= {
  Unused:'_',
  DirtWall:'+',
  DirtFloor:'.',
  StoneWall:'O',
  Corridor: '#',
  Door: 'D',
  Upstairs: '<',
  Downstairs: '>',
  Chest: '*'
  
};
 main();