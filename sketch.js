/************* variables *************/
const _Square = 0;
const _Rectangle = 1;
const _LShape = 2;
const _GridColorB = 190;
const _GridColorG = 240;

let _Unit = 20;
let _TrackerRect = 14;
let _DiffValue = _TrackerRect / 2;
let _CNV;
let _NewSqaureButton, 
    _NewRectButton, 
    _NewLshapeButton;
let _DeleteImg;
let _Edges = [];
let _ID = 0;
let _SelectedID = -1;
let _DeletedID = -1;
/************** system methods ***************/
function setup() {
  _CNV = createCanvas(windowWidth, windowHeight);
  _DeleteImg.resize(_Unit, _Unit);
  pixelDensity(1);
  
  _NewSqaureButton = createButton('Square');
  _NewSqaureButton.parent('addnewSquare');
  _NewSqaureButton.mousePressed(_addNewSquare);

  _NewRectButton = createButton('Rectangle');
  _NewRectButton.parent('addnewRect');
  _NewRectButton.mousePressed(_addNewRect);

  _NewLshapeButton = createButton('LShape');
  _NewLshapeButton.parent('addnewLshape');
  _NewLshapeButton.mousePressed(_addNewLshape);
}

function draw() {
  background(255);
  _drawGrid();
  for (i = 0; i < _Edges.length; i++) {
  	_Edges[i].show(mouseX,mouseY);
  }
}

function preload() {
  _DeleteImg = loadImage("img/delete.png");
}

function mousePressed() {
  let _selected = false;
  for (i = 0; i < _Edges.length; i++) {
    _Edges[i].pressed(mouseX,mouseY);
    if(_Edges[i])
      _selected |= _Edges[i].gSelected;
  }
  if(_SelectedID !== -1) {
    console.log("selected = " + _SelectedID);
    _Edges.filter(exceptID).forEach(_unSelectedItem);
  }
  if(!_selected){
    console.log("no selected");
    _unSelectedAll();
  }
}

function mouseReleased() {
  for (i = 0; i < _Edges.length; i++) {
    _Edges[i].notPressed();
  }
}

/************** filter &  ***************/
function exceptID(_item) {
  return _item.gID != _SelectedID;
}

function deleteID(_item) {
  return _item.gID != _DeletedID;
}

function _unSelectedItem(_item, _index) {
  console.log(_item.gID);
  _item.notSelected();
}
/************** user methods ***************/
function _drawGrid() {
  let counterX = 0;
  let counterY = 0;
  stroke(_GridColorB);
  // strokeWeight(1);
  rect(0, 0, width, height);
  for (var x = 0; x < width; x += _Unit) {
		for (var y = 0; y < height; y += _Unit) {
      if(counterX % 4 == 0 || counterY % 4 == 0)
      	stroke(_GridColorB);
      else
        stroke(_GridColorG);
			line(x, 0, x, height);
			line(0, y, width, y);
      counterY++;
		}
    counterX++;
	}
}

function _unSelectedAll() {
  for (i = 0; i < _Edges.length; i++) {
    _Edges[i].notSelected();
  }
  _SelectedID = -1;
}

function _createEdge(_shape) {
  let id = _Edges.length;
  let x, y, w, h;
  x = y = 0;
  switch(_shape) {
    case _Square:
      w = h = _Unit * 4;
      break;
    case _Rectangle:
      w = _Unit * 8;
      h = _Unit * 4;
      break;
    case _LShape:
      x = y = _Unit * 12;
      w = h = _Unit * 14;
      break;
  }
  _Edges[id] = new Rectangle(x, y, w, h);
  _Edges[id].sShape = _shape;
  _Edges[id].sID = _ID;
  _ID++;
  console.log("shape = " + _Edges[id].gShape + ", ID = " + _Edges[id].gID);
}

function _addNewSquare() {
  _createEdge(_Square);
}

function _addNewRect() {
  _createEdge(_Rectangle);
}

function _addNewLshape() {
  _createEdge(_LShape);
}

function _deleteShape() {
  _Edges = _Edges.filter(exceptID);
  _DeletedID = -1;
}
/************* Object Oriented***************/
class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragging = false;
    this.selected = false;
    this.shape = -1;
    this.ID = -1;
  }
  
  get gShape() {
    return this.shape;
  }
  set sShape(_shape) {
    this.shape = _shape;
  }

  get gID() {
    return this.ID;
  }
  set sID(_id) {
    this.ID = _id;
  }

  get gSelected() {
    // return this.selected;
    // must use this member not this.selected
    return this.dragging;
  }

  show(px, py) {
    if (this.dragging) {
      this.x = px + this.offsetX;
      this.y = py + this.offsetY;
    }
    let wid = this.w, hei = this.h;
    let x0 = this.x, y0 = this.y;
    // switch(this.shape) {
      // case _Square:
      // case _Rectangle:
      //   break;
    //   case _LShape:
        // x0 += _Unit * 2;
        // y0 += _Unit * 2;
        // wid = hei = _Unit * 12;
    //     break;
    // }
    stroke(0);
    fill(255);
    if(this.shape == _LShape) {
      x0 += _Unit * 2;
      y0 += _Unit * 2;
      let _unitX = (this.w - _Unit * 2)/97.5;
      let _unitY = (this.h - _Unit * 2)/97.5;
      beginShape();
      vertex(x0+_unitX*97.5,    y0+_unitY*32);
      vertex(x0+_unitX*50.6375, y0+_unitY*32.5);
      vertex(x0+_unitX*32.5,    y0+_unitY*50.6375);
      vertex(x0+_unitX*32.5,    y0+_unitY*97.5);
      vertex(x0+0,              y0+_unitY*97.5);
      vertex(x0+0,              y0+0);
      vertex(x0+_unitX*97.5,    y0+0);
      vertex(x0+_unitX*97.5,    y0+_unitY*32);
      endShape();
    } else {
      rect(x0, y0, wid, hei);
    }
    if (this.selected) {
      stroke(150, 150, 255);
      noFill();
      rect(this.x-1, this.y-1, this.w+2, this.h+2);//edge
      rect(this.x-_DiffValue, this.y-_DiffValue, _TrackerRect, _TrackerRect);//2
      rect(this.x-_DiffValue, this.y+this.h/2-_DiffValue, _TrackerRect, _TrackerRect);//2
      rect(this.x+this.w/2-_DiffValue, this.y+this.h-_DiffValue, _TrackerRect, _TrackerRect);//3
      // rect(this.x+this.w/2-_DiffValue, this.y+this.h/2-_DiffValue, _TrackerRect, _TrackerRect);//rotate
      image(_DeleteImg, this.x+this.w-_Unit/2, this.y-_Unit/2);
    }
  }

  pressed(px, py) {
    if(this.overDelBtn(px, py)){
      print("remove this shape");
      _DeletedID = this.ID;
      _deleteShape();
      return;
    }
    if (this.overBody(px, py)) {
      print("clicked on rect");
      this.dragging = true;
      this.selected = true;
      this.offsetX = this.x - px;
      this.offsetY = this.y - py;
      _SelectedID = this.ID;
    }
  }
  overBody(px, py) {
    if (px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h) {
      return true;
    }
    return false;
  }
  overDelBtn(px, py) {
    if (px > this.x+this.w-_Unit/2 && px < this.x+this.w+_Unit/2 && 
        py > this.y-_Unit/2 && py < this.y+_Unit/2) {
      return true;
    }
    return false;
  }
  notSelected(px, py) {
    print("shape was unselected");
    this.selected = false;
  }

  notPressed(px, py) {
    print("mouse was released");
    this.dragging = false;
  }
}