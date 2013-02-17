###
based on 
http://roguebasin.roguelikedevelopment.org/index.php?title=Java_Example_of_Dungeon-Building_Algorithm
###
Math.randInt = (min,max) ->
  Math.floor(Math.random() * (max - min + 1)) + min
  
class Tile 
  constructor: (@name,@src,@color,@passable) ->
Tile::isDirtfloorOrCorridor =() -> 
  this.name =="dirtFloor" || this.name=="corridor"

Tiles = [new Tile("unused","_","black",true),
     new Tile("dirtWall","+","brown",false),
     new Tile("dirtFloor",".","brown",true),
     new Tile("stoneWall","O","grey",false),
     new Tile("corridor","#","brown",true),
     new Tile("door","D","brown",true)
     new Tile("upStairs","<","yellow",true),
     new Tile("downStairs",">","yellow",true),
     
      
  ]
  getTile = (name) -> 
    matches = Tiles.filter( (t) -> t.name==name)
    matches[0] if matches.length>0
    

Dungeon = () ->
  @xmax
  @ymax
  
  @xsize=0
  @ysize=0
  
  @objects
  @chanceRoom=75;
  
  @dungeonMap=[] 
  @msgXSize = "X size of dungeon: \t"
  @msgYSize = "Y size of dungeon: \t"
  @msgMaxObject = "Max objects: \t"
  @msgNumObjects = "Created objects: \t"
  this

Dungeon::setCell= (x,y,cellType) ->
  @dungeonMap[x+@xsize*y]=cellType

Dungeon::getCellType= (x,y) -> @dungeonMap[x+@xsize*y]

Dungeon::inBounds= (x,y) -> 
  x>=0 && x<@xsize && y>=0 && y>=@ysize

Dungeon::isUnused= (x,y) ->
  @inBounds(x,y) && @getCellType(x,y).name =="unused"

Dungeon::makeCorridor = (x,y,length,direction) ->
  len= Math.randInt(2,length)
  floor= getTile("corridor")
  dir=0
  if direction > 0 && direction < 4 then dir= direction
  xtemp= 0
  ytemp= 0
  if dir is 0 #north
    return false  if x < 0 or x > @xsize
    xtemp= x
    ytemp= y
    while ytemp > (y - len)
      return false if !@inBounds(xtemp,ytemp) || !@isUnused(xtemp,ytemp)
      ytemp--
    #if we're still here, let's start building
    ytemp = y
    while ytemp > (y - len)
      @setCell xtemp, ytemp, floor
      ytemp--
    
  if (dir== 1) #east
    return false if (y<0 || y>=@ysize)
    ytemp=y
    xtemp=x
    while xtemp < (x+len)
      return false if !@inBounds(xtemp,ytemp) || !@isUnused(xtemp,ytemp)
      xtemp++
    xtemp=x
    while xtemp < (x+len)
      @setCell(xtemp,ytemp,floor)
      xtemp++

  if dir is 2 #south
    return false if x < 0 or x> @xsize
    xtemp=x
    ytemp=y
    while ytemp< (y+len)
      return false if !@inBounds(xtemp,ytemp) || !@isUnused(xtemp,ytemp)
      ytemp++
    ytemp=y
    while ytemp < (y+len)
      @setCell xtemp, ytemp, floor
      ytemp++
  if dir is 3 #west
    return false if ytemp<0 || ytemp>@ysize
    ytemp=y
    xtemp=x
    while xtemp > x-len
      return false if !@inBounds(xtemp,ytemp) || !@isUnused(xtemp,ytemp)
      xtemp--
    xtemp=x
    while xtemp > x-len
      @setCell xtemp, ytemp, floor
      xtemp--
  true

Dungeon::makeRoom = (x,y,xlength,ylength,direction) ->
  xlen= Math.randInt 4,xlength
  ylen= Math.randInt 4,ylength
  floor= getTile("dirtFloor")
  wall= getTile("dirtWall")
  dir=0
  if (direction >0 && direction<4)  then dir= direction
  if dir == 0 #north
    ytemp= y
    westwall= Math.round  x-xlen/2
    insideEast= Math.round x+(xlen-1)/2
    eastwall= Math.round x+ (xlen+1)/2

    #check if there's enough space left for it
    while ytemp> y-ylen
      return false if ytemp <0 || ytemp > @ysize
      xtemp = westwall
      while xtemp < eastwall
        return false if !@inBounds(xtemp,ytemp) || !@isUnused(xtemp,ytemp)
        xtemp++
      ytemp--
    #we're here build
    ytemp= y
    while ytemp>y-ylen
      xtemp= westwall
      while xtemp< eastwall
        buildWall = xtemp == westwall || 
          xtemp == insideEast ||
          ytemp ==y ||
          ytemp == y-ylen+1
        @setCell xtemp,ytemp, if buildWall then wall else floor

        xtemp++
      ytemp--
  if dir == 1 #east
    southwall= Math.round y-ylen/2
    northwall= Math.round y+(ylen+1)/2
    insidenorthwall = Math.round y+ (ylen-1)/2

    ytemp= southwall


    while ytemp < y+ (ylen+1)/2
      return false if ytemp<0 || ytemp> @ysize
      xtemp= x
      while xtemp < x+xlen
        return false if !@inBounds(xtemp,ytemp) || !@isUnused(xtemp,ytemp)
        xtemp++
      ytemp++
    #we're here build
    ytemp= y-ylen/2
    while ytemp< y+(ylen+1)/2
      xtemp= x
      while xtemp< x+xlen
        buildWall = xtemp == x || xtemp == x+ xlen-1 || ytemp == southwall || ytemp == insidenorthwall
        @setCell xtemp,ytemp, if buildWall then wall else floor  
        xtemp++
      ytemp++
  if dir == 2 #south
    ytemp= y
    westwall= Math.round x-xlen/2
    eastwall= Math.round x+(xlen+1)/2
    insideeastwall = Math.round x+(xlen-1)/2

    while ytemp < y+ylen
      return false if ytemp <0 || ytemp >= @ysize
      xtemp= westwall
      while xtemp< eastwall
        return false if !@inBounds(xtemp,ytemp) || !@isUnused(xtemp,ytemp)
        xtemp++
      ytemp++
      ytemp=y
      while ytemp< y+ylen
        xtemp= westwall
        while xtemp < eastwall
          buildWall = xtemp == westwall || xtemp == insideeastwall || ytemp==y || ytemp == y+ylen-1
          @setCell xtemp,ytemp, if buildWall then wall else floor
          xtemp++
        ytemp++
  if dir ==3 #west
    southwall= Math.round y-ylen/2
    northwall= Math.round y+(ylen+1)/2
    insidenorthwall= Math.round y+(ylen-1)/2

    ytemp= southwall
    while ytemp < northwall
      return false if ytemp <0 || ytemp >= @ysize
      xtemp=x 
      while xtemp > x-xlen
        return false if !@inBounds(xtemp,ytemp) || !@isUnused(xtemp,ytemp)
        xtemp--
      ytemp++
    ytemp= southwall
    while ytemp < northwall
      xtemp=x 
      while xtemp > x-xlen
        buildWall= xtemp == x || xtemp == x-xlen+1 || ytemp ==southwall || ytemp = insidenorthwall
        @setCell xtemp,ytemp, if buildWall then wall else floor
        xtemp--
      ytemp++
  true

#be warned the array is flat not [,]
Dungeon::getDungeon = () -> @dungeonMap.slice 0

Dungeon::showDungeon = () ->
  y= 0
  while y<@ysize
    x=0
    row= '';
    while x<@xsize
      row+= @getCellType(x,y).src
      x++
    console.log row + " " + y
    y++

Dungeon::initialize = (x,y) ->
  @xsize=x
  @ysize=y
  console.log(@msgXSize+@xsize)
  console.log(@msgYSize+@ysize)
  
  #redefine map var to the adjusted map size
  @dungeonMap=[]
  y= 0
  while y< @ysize
    x= 0
    while x<@xsize
      buildWall= y==0 || y==@ysize-1 || x==0 || x == @xsize-1
      @setCell x,y, getTile(if buildWall then "stoneWall" else "unused")
      x++
    y++
  true


Dungeon::createDungeon = (inx,iny,inobj) ->
  @objects = if inobj < 1 then 10 else inobj
  if inx<3
    @xsize=3
  else if iny> @ymax
    @ysize=@ymax
  else
    @xsize=inx
  if iny<3
    @ysize=@ymax
  else if iny>@ymax
    @ysize=@ymax
  else
    @ysize=iny
  @initialize(@xsize,@ysize)
  console.log(@msgMaxObject+@objects)
  #start with a room in the middle
  xcenter= Math.round @xsize/2
  ycenter= Math.round @ysize/2
  @makeRoom xcenter, ycenter,8,6,Math.randInt(0,3)
  currentFeatures= 1 #we just made a room so we start with 1
  countingTries= 0
  while countingTries<1000
    break if currentFeatures>=@objects
    newx = 0
    xmod = 0
    newy = 0
    ymod = 0
    validTile = -1
    testing= 0
    while testing<1000
      newx= Math.randInt 1,@xsize-1
      newy= Math.randInt 1, @ysize-1
      validTile= -1
      cellType= @getCellType newx,newy
      if cellType.name=="dirtWall" || cellType.name =="corridor"
        #check if we can reach the place
        cell1= @getCellType(newx,newy+1)
        cell2= @getCellType(newx-1,newy)
        cell3= @getCellType(newx,newy-1)
        cell4= @getCellType(newx+1,newy)
        if cell1 && cell1.isDirtfloorOrCorridor() 
          validTile = 0;
          xmod = 0
          ymod = -1
        else if cell2 && cell2.isDirtfloorOrCorridor() 
          validTile = 1
          xmod = +1
          ymod = 0
        else if cell3 && cell3.isDirtfloorOrCorridor() 
          validTile = 2
          xmod = 0
          ymod = +1
        else if cell4 && cell4.isDirtfloorOrCorridor()  
          validTile = 3
          xmod = -1
          ymod = 0
        if validTile > (-1) 
          if (cell1 && cell1.name == "door") ||
           (cell2 && cell2.name == "door") ||
           (cell3 && cell3.name == "door") ||
           (cell4 && cell4.name == "door")
            console.log('invalidating tile for door')
            validTile= -1
        break if validTile >= 0
      testing++
    if validTile > -1
      feature= Math.randInt 0,100
      if feature <= @chanceRoom #a new room
        if @makeRoom newx+xmod, newy+ymod, 8,6,validTile
          console.log('made a room!')
          currentFeatures++
          @setCell newx,newy, getTile("door")
          #clean up in front of the door so we can reach it
          @setCell newx+xmod, newy + ymod, getTile("dirtFloor")
      else if feature >= @chanceRoom
        console.log('making a corridor!')
        if @makeCorridor newx+xmod, newy+ymod, 6, validTile
          console.log('made a corridor!')
          currentFeatures++
          @setCell newx,newy,getTile("door")
      
    countingTries++

  console.log("countingTries:"+countingTries)

  @addSprinkles()
  console.log(@msgNumObjects + currentFeatures)
  true

Dungeon::addSprinkles = () ->
  #sprinkle out the bonusstuff (stairs, chests etc.) over the map
  newx= 0
  newy= 0
  ways= 0
  state= 0
  while state !=10
    testing=0
    while testing<1000
      newx= Math.randInt 1, @xsize-1
      newy= Math.randInt 1, @ysize-2 #cheap bugfix, pulls down newy to 0<y<24, from 0<y<25
      ways=4
      self= this
      cantgo = (x,y) -> self.getCellType(x,y).isDirtfloorOrCorridor() || self.getCellType(x,y).name !="door"
      #north
      ways-- if cantgo newx,newy+1
      ways-- if cantgo newx-1,newy
      ways-- if cantgo newx,newy-1
      ways-- if cantgo newx+1,newy
      if state ==0 && ways ==0
        @setCell newx,newy, getTile( "upStairs")
        state= 1
        break
      if state==1 && ways==0
        @setCell newx,newy, getTile("downStairs")
        state= 10
        break;
      testing++

