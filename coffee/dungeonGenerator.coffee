###
based on 
http://roguebasin.roguelikedevelopment.org/index.php?title=Java_Example_of_Dungeon-Building_Algorithm
###
Math.randInt = (min,max) ->
  Math.floor(Math.random() * (max - min + 1)) + min
if not Array::some
  Array::some= (f)-> (x for x in @ when f(x)).length>0
if not Array::every
  Array::every= (f)-> (x for x in @ when f(x)).length == @length
if not Array::cross
  Array::cross= (A)-> 
    results = []
    for x in A
      for y in @
        results.push {x,y}
    results.flatten()
Direction = {North:0,East:1, South:2, West:3} 
class Tile 
  constructor: (@name,@compatChar,@src,@color,@passable) ->
Tile::isDirtfloorOrCorridor =() -> 
  this.name =="dirtFloor" || this.name=="corridor"
imgBase= "http://imaginarydevelopment.com/assets/planetcute png/"
makeImg = (base,suffix) ->
  "<img src=\"" + base + suffix+"\" />"
Tiles = [new Tile("unused","_"," ","black",true),
     new Tile("dirtWall","+",makeImg(imgBase, "Dirt Block.png"),"brown",false),
     new Tile("dirtFloor",".",makeImg(imgBase,"Brown Block.png"), "brown",true),
     new Tile("stoneWall","O",makeImg(imgBase,"Rock.png"), "grey",false),
     new Tile("corridor","#",makeImg(imgBase,"Stone Block.png"), "brown",true),
     new Tile("door","D",makeImg(imgBase,"Wood Block.png"), "brown",true)
     new Tile("upStairs","<",makeImg(imgBase,"Ramp West.png") , "#CC6633",true),
     new Tile("downStairs",">",makeImg(imgBase,"Ramp East.png"),"#CC6633",true),
     
      
  ]
  getTile = (name) -> 
    matches = Tiles.filter( (t) -> t.name==name)
    matches[0] if matches.length>0

class Feature
  constructor: (@name, @x,@y,@yEnd,@xEnd) ->
class PointI
  constructor: (@x,@y) ->

Dungeon = (irandomizer) ->
  @xmax
  @ymax
  @rnd=irandomizer
  @xsize=0
  @ysize=0
  
  @objects
  @chanceRoom=75;
  @dungeonFeatures=[]
  @dungeonMap=[] 
  @msgXSize = "X size of dungeon: \t"
  @msgYSize = "Y size of dungeon: \t"
  @msgMaxObject = "Max objects: \t"
  @msgNumObjects = "Created objects: \t"
  this
Dungeon::initialize = (x,y) ->
  @xsize=x
  @ysize=y
  console.log(@msgXSize+@xsize)
  console.log(@msgYSize+@ysize)
  
  #redefine map var to the adjusted map size
  @dungeonMap=[]
  @dungeonFeatures=[]

  y= 0
  while y< @ysize
    x= 0
    while x<@xsize
      buildWall= y==0 || y==@ysize-1 || x==0 || x == @xsize-1
      @setCell x,y, getTile(if buildWall then "stoneWall" else "unused")
      x++
    y++
  true

Dungeon::setCell= (x,y,cellType) ->
  @dungeonMap[x+@xsize*y]=cellType

Dungeon::getCellType= (x,y) -> @dungeonMap[x+@xsize*y]

Dungeon::inBounds= (x,y) -> 
  x>=0 && x<@xmax && y>=0 && y <= @ymax
Dungeon::getCorridorPoints=(x,y,len,direction) ->
  switch d
    when Direction.North then [y-len ..y].map (m) -> [x,m]
    when Direction.East then [x..x+len].map(m) -> [m,y]
    when Direction.South then [y..y+len].map(m) -> [x,m]
    when Direction.West then [x-xlen .. x].map(m) -> [m,y]

  
Dungeon::makeCorridor = (x,y,length,direction) ->
  return false if x< 0 || x> @xsize
  self= @
  len= Math.randInt(2,length)
  points= @getCorridorPoints(x,y,len,direction)
  return false if(points.some( (p)-> !@inBounds(p) || @getCellType(p.X,p.Y) != "unused"))
  (i) -> @setCell(i.X,i.Y,"corridor") for i in points

  true
Dungeon::getFeatureLowerBound = (c,len) ->
  Math.round (c- len/2)

Dungeon::getFeatureUpperBound = (c,len) ->
  Math.round (c+ (len+1)/2)

Dungeon::getRoomPoints = (x,y,xlen,ylen,d) ->
  a = @getFeatureLowerBound
  b= @getFeatureUpperBound
  switch d
    when Direction.North then [a(x,xlen)...b(x,xlen)].cross([y...y-ylen]).flatten()
    when Direction.East then []
    when Direction.South then []
    when Direction.West then []
     
Dungeon::makeRoom = (x,y,xlength,ylength,direction) ->
  self= @
  console.log("attempting to make room:"+x+","+y)
  xlen= Math.randInt 4,xlength
  ylen= Math.randInt 4,ylength
  floor= getTile("dirtFloor")
  wall= getTile("dirtWall")
  points = @getRoomPoints x, y,xlen,ylen,direction
  return false if points.some((p)-> p.x <0 || p.y> @ysize || p.x <0 || p.y > @xsize || self.getCellType(p.x,p.y) != "unused")
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



Dungeon::findvalidTile =() ->
  validTile
  testing= 0
  while testing<=1000
    testing++
    newx= Math.randInt 1,@xsize-1
    newy= Math.randInt 1, @ysize-1
    validTile= undefined
    cellType= @getCellType newx,newy
    if cellType.name=="dirtWall" || cellType.name =="corridor"
      #check if we can reach the place
      cell1= @getCellType(newx,newy+1)
      cell2= @getCellType(newx-1,newy)
      cell3= @getCellType(newx,newy-1)
      cell4= @getCellType(newx+1,newy)
      if cell1 && cell1.isDirtfloorOrCorridor() 
        validTile = {validTile:0,newx:newx,newy:newy, xmod:0, ymod:-1};
      else if cell2 && cell2.isDirtfloorOrCorridor() 
        validTile= {validTile:1,newx:newx,newy:newy,xmod:+1,ymod:0}
      else if cell3 && cell3.isDirtfloorOrCorridor() 
        validTile= {validTile:2,newx:newx,newy:newy,xmod:0,ymod:+1};
      else if cell4 && cell4.isDirtfloorOrCorridor()  
        validTile= {validTile:3,newx:newx,newy:newy,xmod:-1,ymod:0};
      if validTile > (-1) 
        if (cell1 && cell1.name == "door") ||
         (cell2 && cell2.name == "door") ||
         (cell3 && cell3.name == "door") ||
         (cell4 && cell4.name == "door")
          console.log('invalidating tile for door')
          validTile= undefined
      break if validTile >= 0
  
  validTile

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
  console.log('making start room')
  madeStart= @makeRoom xcenter, ycenter,8,6,Math.randInt(0,3)
  if madeStart is false then throw "couldn't make start room"
  @showDungeon
  currentFeatures= 1 #we just made a room so we start with 1
  countingTries= 0
  while countingTries<=1000
    countingTries++
    break if currentFeatures>=@objects
    validTile = @findvalidTile()
    if validTile && validTile.validTile>=0
      console.log('making a feature!')
      feature= Math.randInt 0,100
      if feature <= @chanceRoom #a new room
        console.log 'making a room at '+JSON.stringify(validTile)
        if @makeRoom validTile.newx+validTile.xmod, validTile.newy+validTile.ymod, 8,6,validTile.validTile
          console.log('made a room!')
          currentFeatures++
          @setCell validTile.newx,validTile.newy, getTile("door")
          #clean up in front of the door so we can reach it
          @setCell validTile.newx+validTile.xmod, validTile.newy + validTile.ymod, getTile("dirtFloor")
      else if feature >= @chanceRoom
        console.log('making a corridor!')
        if @makeCorridor validTile.newx+validTile.xmod, validTile.newy+validTile.ymod, 6, validTile.validTile
          console.log('made a corridor!')
          currentFeatures++
          @setCell validTile.newx,validTile.newy,getTile("door")

  console.log("countingTries:"+countingTries)

  @addSprinkles()
  console.log(@msgNumObjects + currentFeatures)
  true

Dungeon::addSprinkles = () ->
  #sprinkle out the bonus stuff (stairs, chests etc.) over the map
  newx= 0
  newy= 0
  ways= 0
  state= 0
  while state !=10
    testing=0
    while testing<1000
      newx= Math.randInt 1, @xsize-2
      newy= Math.randInt 1, @ysize-2 #cheap bug fix, pulls down new y to 0<y<24, from 0<y<25
      ways=4
      self= this
      cantgo = (x,y) -> self.getCellType(x,y).isDirtfloorOrCorridor() || self.getCellType(x,y).name !="door"
      #north
      ways-- if cantgo newx,newy+1
      ways-- if cantgo newx-1,newy
      ways-- if cantgo newx,newy-1
      ways-- if cantgo newx+1,newy
      if state ==0 && ways ==0
        @dungeonFeatures.push(new Feature("upStairs",newx,newy,newx,newy))
        state= 1
        @setCell newx,newy, getTile( "upStairs")
        break
      if state==1 && ways==0
        @setCell newx,newy, getTile("downStairs")
        @dungeonFeatures.push(new Feature("downStairs",newx,newy,newx,newy))
        state= 10
        break;
      testing++

