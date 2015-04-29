function Planet (pName, mat, radius, distanceToSun, year, day, parent){
	this.planetName = pName;
	this.material = new THREE.MeshPhongMaterial();
	this.material.map = THREE.ImageUtils.loadTexture(mat);
	this.radius = radius;
	this.distToSun = distanceToSun;
	this.year = year;
	this.day = day;
	this.parent = parent;
	this.theta = 0;
	this.segs = 100;
	this.location = new THREE.Vector3(distanceToSun,0,0);
	this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius, this.segs, this.segs), this.material);
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
