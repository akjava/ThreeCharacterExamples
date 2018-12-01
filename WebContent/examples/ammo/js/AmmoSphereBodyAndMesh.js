AmmoSphereBodyAndMesh = function(radius,body,mesh){
	AmmoBodyAndMesh.call(this,body,mesh);
	this.radius=radius;

	this.rotationSync=false;
	this.shapeType=AmmoBodyAndMesh.TYPE_SPHERE;
}

AmmoSphereBodyAndMesh.prototype = Object.create( AmmoBodyAndMesh.prototype );
AmmoSphereBodyAndMesh.prototype.constructor = AmmoSphereBodyAndMesh;
