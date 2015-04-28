

var numDivisions = 5;

var index = 0;

var points = [];
var normals = [];

var modelViewMatrix = [];
var projectionMatrix = [];
var normalMatrix, normalMatrixLoc;

var axis =0;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];
var dTheta = 5.0;

var flag = true;

var program;

bezier = function(u) {
    var b = [];
    var a = 1-u;
    b.push(u*u*u);
    b.push(3*a*u*u);
    b.push(3*a*a*u);
    b.push(a*a*a);


    return b;
}

function init()  {
    initVertices();
    
    canvas = document.getElementById( "canvas" );
    
    gl = canvas.getContext("experimental-webgl");
    if ( !gl ) { alert( "WebGL isn't available" ); }

     gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    
    
    var h = 1.0/numDivisions;

    patch = new Array(numTeapotPatches);
    for(var i=0; i<numTeapotPatches; i++) patch[i] = new Array(16);
    for(var i=0; i<numTeapotPatches; i++) 
        for(j=0; j<16; j++) {
            patch[i][j] = vector4([vertices[indices[i][j]][0],
             vertices[indices[i][j]][2], 
                vertices[indices[i][j]][1], 1.0]);
    }
    
    
    for ( var n = 0; n < numTeapotPatches; n++ ) {
    

    var data = new Array(numDivisions+1);
    for(var j = 0; j<= numDivisions; j++) data[j] = new Array(numDivisions+1);
    for(var i=0; i<=numDivisions; i++) for(var j=0; j<= numDivisions; j++) { 
        data[i][j] = vector4(0,0,0,1);
        var u = i*h;
        var v = j*h;
        var t = new Array(4);
        for(var ii=0; ii<4; ii++) t[ii]=new Array(4);
        for(var ii=0; ii<4; ii++) for(var jj=0; jj<4; jj++) 
            t[ii][jj] = bezier(u)[ii]*bezier(v)[jj];
        
        
        for(var ii=0; ii<4; ii++) for(var jj=0; jj<4; jj++) {
            temp = vector4(patch[n][4*ii+jj]);             
            temp = scaleM( t[ii][jj], temp);
            data[i][j] = addM(data[i][j], temp);
            data[i][j][3] = 1;
        }
    }

    var ndata = [];
    for(var i = 0; i<= numDivisions; i++) ndata[i] = new Array(4);
    for(var i = 0; i<= numDivisions; i++) for(var j = 0; j<= numDivisions; j++) ndata[i][j] = new Array(4);
    
    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
            
    for(var i=0; i<numDivisions; i++) for(var j =0; j<numDivisions; j++) {
        

      var t1 = subtractM(data[i+1][j], data[i][j]);
      var t2  =subtractM(data[i+1][j+1], data[i][j]);
      var normal = crossM(t1, t2);
 
       normal = normalizeM(normal);
       normal[3] =  0;
        
        points.push(data[i][j]);
        normals.push(normal);


        points.push(data[i+1][j]);
        normals.push(normal);


        points.push(data[i+1][j+1]);
        normals.push(normal);
        
        points.push(data[i][j]);
        normals.push(normal);


        points.push(data[i+1][j+1]);
        normals.push(normal);


        points.push(data[i][j+1]);
        normals.push(normal);

        index += 6;
        }
    }

    var fragmentShader = getShader(gl, "fragment-shader"); 
    var vertexShader = getShader(gl, "vertex-shader"); 

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);   // attach vertex shader
    gl.attachShader(program, fragmentShader); //attach fragment shader
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          alert("Could not initialise shaders");
    }

    gl.useProgram(program); 
       
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flattenM(points), gl.STATIC_DRAW );

    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition );

    
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flattenM(normals), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    projectionMatrix = orthoM(-8, 8, -2, 6, -200, 200);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flattenM(projectionMatrix));
    
    var lightPosition = vector4(10.0, 10.0, 10.0, 0.0 );
    var lightAmbient = vector4(0.2, 0.2, 0.2, 1.0 );
    var lightDiffuse = vector4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vector4( 1.0, 1.0, 1.0, 1.0 );

    var materialAmbient = vector4( 1.0, 0.0, 1.0, 1.0 );
    var materialDiffuse = vector4( 1.0, 0.8, 0.0, 1.0 );
    var materialSpecular = vector4( 1.0, 0.8, 0.0, 1.0 );
    var materialShininess = 10.0;
    
    var ambientProduct = multM(lightAmbient, materialAmbient);
    var diffuseProduct = multM(lightDiffuse, materialDiffuse);
    var specularProduct = multM(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flattenM(ambientProduct ));
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flattenM(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flattenM(specularProduct));	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flattenM(lightPosition ));
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
    
        normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );


    renderTeapot();
}

var renderTeapot = function(){
            //gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            if(flag) theta[axis] += 0.5;
            
            modelViewMatrix = matrix4();
 
            //modelViewMatrix = multM(modelViewMatrix, rotateM(theta[xAxis], [1, 0, 0]));
            //modelViewMatrix = multM(modelViewMatrix, rotateM(theta[yAxis], [0, 1, 0]));
            //modelViewMatrix = multM(modelViewMatrix, rotateM(theta[zAxis], [0, 0, 1]));
            
            gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flattenM(modelViewMatrix) );
            
                normalMatrix = [
        vector3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vector3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vector3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
        gl.uniformMatrix3fv(normalMatrixLoc, false, flattenM(normalMatrix) );

            gl.drawArrays( gl.TRIANGLES, 0, index);

            requestAnimFrame(renderTeapot);
        }
