/*
 * need Three.js so far
 */
var AmmoUtils={
DEBUG:false,
destroy:function(ammoObject){
	if(ammoObject==undefined){
		console.error("AmmoUtils-destroy:object is undefined");
		return;
	}
	
	Ammo.destroy(ammoObject);
	if(AmmoUtils.DEBUG)
	console.log("destroyed:",ammoObject);
	
	if(ammoObject._refs){
		ammoObject._refs.forEach(function(object){
			Ammo.destroy(object);
			if(AmmoUtils.DEBUG)
			console.log("destroyed:",object);
		});
	}
},


//x,y,z gravity
initWorld:function(x,y,z){
	x = x !== undefined ? x : 0;
	y = y !== undefined ? y : -9.8;//or -10?
	z = z !== undefined ? z : 0;
	
	var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
	var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
	var broadphase  = new Ammo.btDbvtBroadphase();
	var solver = new Ammo.btSequentialImpulseConstraintSolver();


	var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(
	    dispatcher, 
	    broadphase , 
	    solver, 
	    collisionConfiguration
	);
	var gravity=new Ammo.btVector3(x, y, z);
	dynamicsWorld.setGravity(gravity);
	Ammo.destroy(gravity);

	return dynamicsWorld;

},

ACTIVE_TAG :1,
ISLAND_SLEEPING :2,
WANTS_DEACTIVATION :3,
DISABLE_DEACTIVATION :4,
DISABLE_SIMULATION :5


//used when destroy
,getDestroyWiths:function(object){
	if(!object._refs){
		object._refs=[];
	}
	return object._refs;
}

//if you care 
,dispose:function(){
	if(AmmoUtils._sharedBtVector3!==undefined){
		AmmoUtils.destroy(AmmoUtils._sharedBtVector3);
		AmmoUtils._sharedBtVector3=undefined;
	}
}

,getSharedBtVector3:function(x,y,z){
	x=x!==undefined?x:0;
	y=y!==undefined?y:0;
	z=z!==undefined?z:0;
	
	if(AmmoUtils._sharedBtVector3==undefined){
		AmmoUtils._sharedBtVector3=new Ammo.btVector3();
	}
	AmmoUtils._sharedBtVector3.setX(x);
	AmmoUtils._sharedBtVector3.setY(y);
	AmmoUtils._sharedBtVector3.setZ(z);
	return AmmoUtils._sharedBtVector3;
}

,getSharedBtTransform:function(){
	if(AmmoUtils._sharedBtTransform==undefined){
		AmmoUtils._sharedBtTransform=new Ammo.btTransform();
		AmmoUtils._sharedBtTransform.setIdentity();
	}
	return AmmoUtils._sharedBtTransform;
}

,getSharedBtQuaternion:function(x,y,z,w){
	x=x!==undefined?x:0;
	y=y!==undefined?y:0;
	z=z!==undefined?z:0;
	w=w!==undefined?w:1;
	if(AmmoUtils._sharedBtQuaternion==undefined){
		AmmoUtils._sharedBtQuaternion=new Ammo.btQuaternion();
	}
	AmmoUtils._sharedBtQuaternion.setX(x);
	AmmoUtils._sharedBtQuaternion.setY(y);
	AmmoUtils._sharedBtQuaternion.setZ(z);
	AmmoUtils._sharedBtQuaternion.setW(w);
	return AmmoUtils._sharedBtQuaternion;
}


,copyFromVector3:function(targetBtVector3,fromVector3){
	if(targetBtVector3==null || targetBtVector3==undefined){
		targetBtVector3=AmmoUtils.getSharedBtVector3();
	}
	targetBtVector3.setX(fromVector3.x);
	targetBtVector3.setY(fromVector3.y);
	targetBtVector3.setZ(fromVector3.z);
	return targetBtVector3;
}
,copyFromXYZ:function(targetBtVector3,x,y,z){
	if(targetBtVector3==null || targetBtVector3==undefined){
		targetBtVector3=AmmoUtils.getSharedBtVector3();
	}
	targetBtVector3.setX(x);
	targetBtVector3.setY(y);
	targetBtVector3.setZ(z);
	return targetBtVector3;
}

,copyToVector3:function(targetBtVector3,toVector3){
	toVector3.set(targetBtVector3.x(),targetBtVector3.y(),targetBtVector3.z());
	return toVector3;
}
,copyFromQuaternion:function(targetBtQuaternion,fromQuaternion){
	if(targetBtQuaternion==null || targetBtQuaternion==undefined){
		targetBtQuaternion=AmmoUtils.getSharedBtQuaternion();
	}
	targetBtQuaternion.setX(fromQuaternion.x);
	targetBtQuaternion.setY(fromQuaternion.y);
	targetBtQuaternion.setZ(fromQuaternion.z);
	return targetBtQuaternion;
}
,copyFromXYZW:function(targetBtQuaternion,x,y,z,w){
	if(targetBtQuaternion==null || targetBtQuaternion==undefined){
		targetBtQuaternion=AmmoUtils.getSharedBtQuaternion();
	}
	targetBtQuaternion.setX(x);
	targetBtQuaternion.setY(y);
	targetBtQuaternion.setZ(z);
	targetBtQuaternion.setW(w);
	return targetBtQuaternion;
}

,copyToQuaternion:function(targetBtQuaternion,toQuaternion){
	toQuaternion.set(targetBtQuaternion.x(),targetBtQuaternion.y(),targetBtQuaternion.z(),targetBtQuaternion.w());
	return toQuaternion;
}
,setLinearVelocity:function(body,vector3){
	if(vector3.x==undefined){
		console.error("setLinearVelocity:value must be vector3,"+vector3)
	}
	var vec=AmmoUtils.getSharedBtVector3();
	
	
	AmmoUtils.copyFromVector3(vec,vector3);
	body.setLinearVelocity(vec);
}

,setAngularVelocity:function(body,vector3){
	if(vector3.x==undefined){
		console.error("setLinearVelocity:value must be vector3,"+vector3)
	}
	var vec=AmmoUtils.getSharedBtVector3();
	AmmoUtils.copyFromVector3(vec,vector3);
	body.setAngularVelocity(vec);
}

//for lock ,all-xyz free[1,1,1],all lock [0,0,0]
,setLinearFactor:function(body,vector3){
	var vec=AmmoUtils.getSharedBtVector3();
	AmmoUtils.copyFromVector3(vec,vector3);
	body.setLinearFactor(vec);
}
//for lock ,all-xyz free[1,1,1],all lock [0,0,0]
,setAngularFactor:function(body,vector3){
	var vec=AmmoUtils.getSharedBtVector3();
	AmmoUtils.copyFromVector3(vec,vector3);
	body.setAngularFactor(vec);
}


,setPosition:function(body,x,y,z){
	var transform=AmmoUtils.getSharedBtTransform();
	body.getMotionState().getWorldTransform(transform);//copy rotation
	AmmoUtils.copyFromXYZ(transform.getOrigin(),x,y,z);
	body.setCenterOfMassTransform(transform);
	body.getMotionState().setWorldTransform(transform);
}

,getLinearVelocity:function(body,vector3){
	if(vector3==undefined){
		vector3=new THREE.Vector3();
	}
	var btVector3=body.getLinearVelocity();
	AmmoUtils.copyToVector3(btVector3,vector3);
	return vector3;
}

,getAngularVelocity:function(body,vector3){
	if(vector3==undefined){
		vector3=new THREE.Vector3();
	}
	var btVector3=body.getAngularVelocity();
	AmmoUtils.copyToVector3(btVector3,vector3);
	return vector3;
}

,setAngularEnableSpring:function(springConstraint,enabledX,enabledY,enabledZ){
	enabledX=enabledX!==undefined?enabledX:true;
	enabledY=enabledY!==undefined?enabledY:enabledX;
	enabledZ=enabledZ!==undefined?enabledZ:enabledX;
	springConstraint.enableSpring(3,enabledX);
	springConstraint.enableSpring(4,enabledY);
	springConstraint.enableSpring(5,enabledZ);
}
,setLinearEnableSpring:function(springConstraint,enabledX,enabledY,enabledZ){
	enabledX=enabledX!==undefined?enabledX:true;
	enabledY=enabledY!==undefined?enabledY:enabledX;
	enabledZ=enabledZ!==undefined?enabledZ:enabledX;
	springConstraint.enableSpring(0,enabledX);
	springConstraint.enableSpring(1,enabledY);
	springConstraint.enableSpring(2,enabledZ);
}
,seteAllEnableSpring:function(springConstraint,enabled){
	AmmoUtils.setAngularEnableSpring(springConstraint,enabled);
	AmmoUtils.setLinearEnableSpring(springConstraint,enabled);
}


,seteLinearStiffness:function(springConstraint,valueX,valueY,valueZ){
	valueX=valueX!==undefined?valueX:true;
	valueY=valueY!==undefined?valueY:valueX;
	valueZ=valueZ!==undefined?valueZ:valueX;
	springConstraint.setStiffness(0,valueX);
	springConstraint.setStiffness(1,valueY);
	springConstraint.setStiffness(2,valueZ);
}
,seteAngularStiffness:function(springConstraint,valueX,valueY,valueZ){
	valueX=valueX!==undefined?valueX:true;
	valueY=valueY!==undefined?valueY:valueX;
	valueZ=valueZ!==undefined?valueZ:valueX;
	springConstraint.setStiffness(3,valueX);
	springConstraint.setStiffness(4,valueY);
	springConstraint.setStiffness(5,valueZ);
}
,seteAllStiffness:function(springConstraint,value){
	AmmoUtils.seteLinearStiffness(springConstraint,value);
	AmmoUtils.seteAngularStiffness(springConstraint,value);
}
,seteLinearDamping:function(springConstraint,valueX,valueY,valueZ){
	valueX=valueX!==undefined?valueX:true;
	valueY=valueY!==undefined?valueY:valueX;
	valueZ=valueZ!==undefined?valueZ:valueX;
	springConstraint.setDamping(0,valueX);
	springConstraint.setDamping(1,valueY);
	springConstraint.setDamping(2,valueZ);
}
,seteAngularDamping:function(springConstraint,valueX,valueY,valueZ){
	valueX=valueX!==undefined?valueX:true;
	valueY=valueY!==undefined?valueY:valueX;
	valueZ=valueZ!==undefined?valueZ:valueX;
	springConstraint.setDamping(3,valueX);
	springConstraint.setDamping(4,valueY);
	springConstraint.setDamping(5,valueZ);
}
,seteAllDamping:function(springConstraint,value){
	AmmoUtils.seteLinearDamping(springConstraint,value);
	AmmoUtils.seteAngularDamping(springConstraint,value);
}

,setLinearFactor:function(body,x,y,z){
	x=x!==undefined?x:0;
	y=y!==undefined?y:x;
	z=z!==undefined?z:x;
	
	var vec3=AmmoUtils.getSharedBtVector3(x, y, z);
	body.setLinearFactor(vec3);
}

,setAngularFactor:function(body,x,y,z){
	x=x!==undefined?x:0;
	y=y!==undefined?y:x;
	z=z!==undefined?z:x;
	
	var vec3=AmmoUtils.getSharedBtVector3(x, y, z);
	body.setAngularFactor(vec3);
}

,setRotationFromXYZW:function(body,x,y,z,w){
	var btQuaternion=AmmoUtils.getSharedBtQuaternion(x,y,z,w);
	AmmoUtils.setRotation(body,btQuaternion);
}

,setRotation:function(body,btQuaternion){
	var transform=AmmoUtils.getSharedBtTransform();
	body.getMotionState().getWorldTransform(transform);//need position
	transform.setRotation(btQuaternion);
	
	body.setCenterOfMassTransform(transform);
	body.getMotionState().setWorldTransform(transform);
}
//Bone bone,@Nullable Vector3 position,Quaternion rotation,double scaleFactor
,updateBone:function(bone,position,rotation,scaleFactor,tmp){
	scaleFactor=scaleFactor!==undefined?scaleFactor:1;
	
	bone.updateMatrixWorld(true);
	
	var matrixWorld=bone.matrixWorld;
	
	var q2=new THREE.Quaternion().setFromRotationMatrix(matrixWorld);
	q2.conjugate();
	q2.multiply(rotation);
	var q3=new THREE.Quaternion().setFromRotationMatrix(bone.matrix);
	q2.multiply(q3);
	bone.quaternion.copy(q2);
	
	
	
	
	if(position!=null){
		var v1=new THREE.Vector3();
		v1.copy(position).divideScalar(scaleFactor);//some scale modifying,
		
		//bone.worldToLocal(v1);//what is this? vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );
		
		v1.applyMatrix4( new THREE.Matrix4().getInverse( matrixWorld) );
		
		v1.add(bone.position);
	
		bone.position.copy(v1);
		
		
	}
	
	bone.updateMatrixWorld(true);
}

,getWorldTransform:function(bm,vec3,quaternion){
	vec3=vec3!==undefined?vec3:new THREE.Vector3();
	quaternion=quaternion!==undefined?quaternion:new THREE.Quaternion();
	
	var transform=AmmoUtils.getSharedBtTransform();
	bm.getBody().getMotionState().getWorldTransform(transform);
	
	AmmoUtils.copyToVector3(transform.getOrigin(),vec3);
	AmmoUtils.copyToQuaternion(transform.getRotation(),quaternion);
	
	return {
		position:vec3,
		rotation:quaternion
	}
},forceDampingRotation:function(body,dampx,dampy,dampz,quaternion,euler){
	euler=euler!==undefined?euler:new THREE.Euler();
	quaternion=quaternion!==undefined?quaternion:new THREE.Quaternion();
	var transform=AmmoUtils.getSharedBtTransform();
	body.getMotionState().getWorldTransform(transform);//need position
	
	
	AmmoUtils.copyToQuaternion(transform.getRotation(),quaternion);
	euler.setFromQuaternion(quaternion);
	euler.x=euler.x*dampx;
	euler.y=euler.y*dampx;
	euler.z=euler.z*dampx;
	
	quaternion.setFromEuler(euler);
	var btQuaternion=AmmoUtils.copyFromQuaternion(null,quaternion);
	transform.setRotation(btQuaternion);
	
	body.setCenterOfMassTransform(transform);
	body.getMotionState().setWorldTransform(transform);
},clearBothVelocity:function(body){
	var vec=AmmoUtils.getSharedBtVector3(0,0,0);
	body.setLinearVelocity(vec);
	body.setAngularVelocity(vec);
}
};