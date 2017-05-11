"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 1.0, 1.0, 1.0), // white
    vec4(0.0, 1.0, 1.0, 1.0) // cyan
];


var wristId = 0;
var wristIdX = 0;
var wristIdY = 15;
var pinkieLowId  = 1;
var pinkieMiddleId  = 2;
var pinkieHighId  = 3;
var ringLowId  = 4;
var ringMiddleId  = 5;
var ringHighId  = 6;
var middleLowId  = 7;
var middleMiddleId  = 8;
var middleHighId  = 9;
var indexLowId  = 10;
var indexMiddleId  = 11;
var indexHighId  = 12;
var thumbLowId  = 13;
var thumbHighId  = 14;

var wristHeight = 1.0;
var wristWidth = 10.0;
var pinkieHeight = 5.0;
var pinkieWidth  = 1.0;
var ringHeight = 6.0;
var ringWidth  = 1.0;
var middleWidth  = 1.0;
var middleHeight = 7.0;
var indexWidth  = 1.0;
var indexHeight = 6.0;
var thumbHeight = 5.0;
var thumbWidth = 1.0;


var numNodes = 15;
var numAngles = 16; //non serve
var angle = 0; //non serve

var theta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var numVertices = 24;  //non serve
var stack = [];
var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];
var colorsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

        case wristId:
        case wristIdX:
        case wristIdY:
            m = translate(0.0, -5.0, 0.0);
            m = mult(m, rotate(theta[wristIdX], 0, 1, 0 ));
            m = mult(m, rotate(theta[wristIdY], 1, 0, 0 ));
            figure[wristId] = createNode( m, wrist, null, pinkieLowId);
            break;

        case pinkieLowId:
            m = translate(-1.0, 2.0 , 0.0);
            //m = mult(m, rotate(theta[pinkieLowId], 0, 1, 0 ));
            figure[pinkieLowId] = createNode( m, pinkieLow, ringLowId, pinkieMiddleId );
            break;
        case pinkieMiddleId:
            m = translate(-1.0, 1.0 , 0.0);
            //m = rotate(theta[pinkieMiddleId], 0, 1, 0 );
            figure[pinkieMiddleId] = createNode( m, pinkieMiddle, null, pinkieHighId );
            break;
        case pinkieHighId:
            m = rotate(theta[pinkieHighId], 0, 1, 0 );
            figure[pinkieHighId] = createNode( m, pinkieHigh, null, null );
            break;

        case ringLowId:
            m = rotate(theta[ringLowId], 0, 1, 0 );
            figure[ringLowId] = createNode( m, ringLow, middleLowId, ringMiddleId );
            break;
        case ringMiddleId:
            m = rotate(theta[ringMiddleId], 0, 1, 0 );
            figure[ringMiddleId] = createNode( m, ringMiddle, null, ringHighId );
            break;
        case ringHighId:
            m = rotate(theta[ringHighId], 0, 1, 0 );
            figure[ringHighId] = createNode( m, ringHigh, null, null );
            break;

        case middleLowId:
            m = rotate(theta[middleLowId], 0, 1, 0 );
            figure[middleLowId] = createNode( m, middleLow, indexLowId, middleMiddleId );
            break;
        case middleMiddleId:
            m = rotate(theta[middleMiddleId], 0, 1, 0 );
            figure[middleMiddleId] = createNode( m, middleMiddle, null, middleHighId );
            break;
        case middleHighId:
            m = rotate(theta[middleHighId], 0, 1, 0 );
            figure[middleHighId] = createNode( m, middleHigh, null, null );
            break;

        case indexLowId:
            m = rotate(theta[indexLowId], 0, 1, 0 );
            figure[indexLowId] = createNode( m, indexLow, thumbLowId, indexMiddleId );
            break;
        case indexMiddleId:
            m = rotate(theta[indexMiddleId], 0, 1, 0 );
            figure[indexMiddleId] = createNode( m, indexMiddle, null, indexHighId );
            break;
        case indexHighId:
            m = rotate(theta[indexHighId], 0, 1, 0 );
            figure[indexHighId] = createNode( m, indexHigh, null, null );
            break;

        case thumbLowId:
            m = rotate(theta[thumbLowId], 0, 1, 0 );
            figure[thumbLowId] = createNode( m, thumbLow, null, thumbHighId );
            break;
        case thumbHighId:
            m = rotate(theta[thumbHighId], 0, 1, 0 );
            figure[thumbHighId] = createNode( m, thumbHigh, null, null );
            break;

    }

}

function wrist(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*wristHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( wristWidth, wristHeight, wristWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function pinkieLow(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*pinkieHigh, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( pinkieWidth, pinkieHeight, pinkieWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function pinkieMiddle(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*pinkieHigh, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( pinkieWidth, pinkieHeight, pinkieWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function pinkieHigh(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*pinkieHigh, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( pinkieWidth, pinkieHeight, pinkieWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function ringLow(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*ringHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ringWidth, ringHeight, ringWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function ringMiddle(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*ringHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ringWidth, ringHeight, ringWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function ringHigh(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*ringHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ringWidth, ringHeight, ringWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function middleLow(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*middleHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( middleWidth, middleHeight, middleWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function middleMiddle(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*middleHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( middleWidth, middleHeight, middleWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function middleHigh(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*middleHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( middleWidth, middleHeight, middleWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function indexLow(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*indexHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( indexWidth, indexHeight, indexWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function indexMiddle(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*indexHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( indexWidth, indexHeight, indexWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function indexHigh(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*indexHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( indexWidth, indexHeight, indexWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function thumbLow(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*thumbHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( thumbWidth, thumbHeight, thumbWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function thumbHigh(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*thumbHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( thumbWidth, thumbHeight, thumbWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}



function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);

     colorsArray.push(vertexColors[a]);
     colorsArray.push(vertexColors[a]);
     colorsArray.push(vertexColors[a]);
     colorsArray.push(vertexColors[a]);
}


function cube(){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    document.getElementById("slider0").onchange = function(event) {
        theta[wristIdX] = event.target.value;
        initNodes(wristIdX);
    };
    document.getElementById("slider15").onchange = function(event) {
        theta[wristIdY] = event.target.value;
        initNodes(wristIdY);
    };
    document.getElementById("slider1").onchange = function(event) {
        theta[pinkieLowId] = event.target.value;
        initNodes(pinkieLowId);
    };


    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}


var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT );
        traverse(wristId);
        requestAnimFrame(render);
}
