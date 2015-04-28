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

	this.Update = function (){
		
		this.mesh.position.set(this.distToSun*Math.sin(2*Math.PI*this.theta/this.year),this.distToSun*Math.cos(2*Math.PI*this.theta/this.year),0);
		this.theta++;
		if ( this.theta > this.year){
			this.theta = 0;
		}
	}
}
