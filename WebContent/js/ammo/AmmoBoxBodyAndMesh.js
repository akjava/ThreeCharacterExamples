
//Vector3 boxSize,btRigidBody body, Mesh mesh
AmmoBoxBodyAndMesh = function(boxSize,body,mesh){
	AmmoBodyAndMesh.call(this,body,mesh);
	this.boxSize=boxSize;

	this.rotationSync=true;
	this.shapeType=AmmoBodyAndMesh.TYPE_BOX;
}

AmmoBoxBodyAndMesh.prototype = Object.create( AmmoBodyAndMesh.prototype );
AmmoBoxBodyAndMesh.prototype.constructor = AmmoBoxBodyAndMesh;
