function Planet (pName, color, radius, distanceToSun, year, day, parent){
	this.planetName = pName;
	this.color = color;
	this.radius = radius;
	this.distToSun = distanceToSun;
	this.year = year;
	this.day = day;
	this.parent = parent;
	this.theta = 0;
	this.segs = 100;
	this.location = new THREE.Vector3(distanceToSun,0,0);
	this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius, this.segs, this.segs), new THREE.MeshPhongMaterial( { abmient: 0x050505, color: this.color, specular: 0x555555, shininess: 10 } ));
	this.mesh.overdraw = true;
	this.mesh.position.set(this.location);
	this.children = [];
	
	this.Update = function (){
		
		var parentLocation = parent.location;
		
		// calculate local position accounting for parent position
		var x = this.distToSun*Math.sin(2*Math.PI*this.theta/this.year) + parentLocation.x;
		var y = this.distToSun*Math.cos(2*Math.PI*this.theta/this.year) + parentLocation.y;
		var z = parentLocation.z;
		
		// update and set location and rotation
		//var rotationAxis = new THREE.Vector3(8.4,0,10);
		this.location = new THREE.Vector3(x,y,z);
		this.mesh.position.set(x,y,z);

		//increment by one 'day' and reset on new year
		this.theta++;
		if ( this.theta > this.year){
			this.theta = 0;
		}
		
		// update all children
		for(var i =0; i < this.children.length; i++){
			this.children[i].Update();
		}
	}
	
	this.AddChild = function (child){
		this.children[this.children.length] = child;
	}
	
	function rotateAroundObjectAxis(object, axis, radians) {
		rotObjectMatrix = new THREE.Matrix4();
		rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

		// old code for Three.JS pre r54:
		// object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
		// new code for Three.JS r55+:
		object.matrix.multiply(rotObjectMatrix);

		// old code for Three.js pre r49:
		// object.rotation.getRotationFromMatrix(object.matrix, object.scale);
		// old code for Three.js r50-r58:
		// object.rotation.setEulerFromRotationMatrix(object.matrix);
		// new code for Three.js r59+:
		object.rotation.setFromRotationMatrix(object.matrix);
	}

}
