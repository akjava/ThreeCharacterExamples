
//double radius,double height,btRigidBody body, Mesh mesh
AmmoCapsuleBodyAndMesh = function(radius,height,body,mesh){
	AmmoBodyAndMesh.call(this,body,mesh);
	this.radius=radius;
	this.height=height;

	this.rotationSync=true;
	this.shapeType=AmmoBodyAndMesh.TYPE_CAPSULE;
}

AmmoCapsuleBodyAndMesh.prototype = Object.create( AmmoBodyAndMesh.prototype );
AmmoCapsuleBodyAndMesh.prototype.constructor = AmmoCapsuleBodyAndMesh;
