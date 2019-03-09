//Scene,btDiscreteDynamicsWorld
var AmmoControler=function(object3d,world){
	if(object3d == undefined ){
		console.error("AmmoControler:object3d is undefined");
	}
	if(world == undefined ){
		console.error("AmmoControler:world is undefined");
	}
	this.scene=object3d;
	this.world=world;
	this.fixedTimeStep=1.0/60;
	this.scaleFactor=1;//for bone sync
	/**
	 * if substeps not 0 need fixedTimeStep
	 * some how large substeps need small fixedTimeStep or would stop
	 * exp. substeps=4,fixedTimeStep=1.0/120
	 */
	this.substeps=0;//
	
	this.autoSyncingBodies=[];
	this.autoSyncingConstraints=[];
	this.garbage=[];
	//TODO set container
	this._matrixWorldInv=new THREE.Matrix4();
	
	this._enabled=true;
}


//step time
AmmoControler.prototype = {

		constructor: AmmoControler,
		
	getMeshContainer:function(){
			return this.scene;
		},
	getMeshContainerMatrixWorldInverse:function(){
			return this._matrixWorldInv;
		},
		printCount:function(){
			console.log("AmmoControler:","autoSyncingBodies",this.autoSyncingBodies.length,"autoSyncingConstraints",this.autoSyncingConstraints.length);
		},
update:function(delta,force){
	if(!this._enabled && !force){
		return;
	}
	var scope=this;
	delta = delta !== undefined? delta : 1.0/60;
	//more see https://github.com/bulletphysics/bullet3/blob/master/src/BulletDynamics/Dynamics/btDiscreteDynamicsWorld.cpp
	if(this.substeps!=0){
		this.world.stepSimulation(delta, this.substeps,this.fixedTimeStep);	
	}else{
		this.world.stepSimulation(delta, this.substeps);
	}
	
	//update matrix world inverse
	this._matrixWorldInv.getInverse( this.getMeshContainer().matrixWorld );
	
	
	this.autoSyncingBodies.forEach(function(object){
		object.syncTransform(scope);
	});
	
	this.autoSyncingConstraints.forEach(function(object){
		object.sync();
	});
	
	this.deleteGarbages();
},
setEnabled:function(v){
	this._enabled=v;
},
isEnabled:function(){
	return this._enabled;
},
deleteGarbages:function(){
	this.garbage.forEach(function(object){
		AmmoUtils.destroy(object);
	});
	this.garbage=[];
},
makeTemporaryTransform:function(){
	var bt= new Ammo.btTransform();
	bt.setIdentity();
	this.garbage.push(bt);
	return bt;
},
makeTemporaryVector3:function( x, y, z){
	var v3=new Ammo.btVector3(x, y, z);
	this.garbage.push(v3);
	return v3;
}
,

//Vector3 size,double mass,double x,double y,double z,Material material
createBox:function(size,mass,x,y,z,material){
	var object=  AmmoBodyAndMesh.createBox(size, mass, x, y, z, material);
	this.addBodyMesh(object);
	return object;
},
//double radius,double height,double mass,double x,double y,double z,Material material
createCylinder(radius,height,mass,x,y,z,material){
	var object=  AmmoBodyAndMesh.createCylinder(radius,height, mass, x, y, z, material);
	this.addBodyMesh(object);
	return object;
},
//double radius,double height,double mass,double x,double y,double z,Material material
createCapsule(radius,height, mass, x, y, z, material){
	var object=  AmmoBodyAndMesh.createCapsule(radius,height, mass, x, y, z, material);
	this.addBodyMesh(object);
	return object;
},
//double radius,double height,double mass,double x,double y,double z,Material material
createCone(radius,height, mass, x, y, z, material){
	var object=  AmmoBodyAndMesh.createCone(radius,height, mass, x, y, z, material);
	this.addBodyMesh(object);
	return object;
},


//BodyAndMesh object,int colliedType,int colliedWith
addBodyMesh:function(object,colliedType,colliedWith){
	colliedType = colliedType !== undefined ? colliedType : -1;
	colliedWith = colliedWith !== undefined ? colliedWith : -1;
	
	
	if(object.getMesh()!=null){
	   this.scene.add( object.getMesh());
	}
	if(object.getBody()!=null){
		if(colliedType!=-1 && colliedWith!=-1){
			this.world.addRigidBody(object.getBody(),colliedType,colliedWith);
		}else{
			this.world.addRigidBody(object.getBody());
		}
	}
	
	this.autoSyncingBodies.push(object);
}
,
//double radius,double mass,double x,double y,double z,Material material
createSphere:function(radius,mass,x,y,z,material,group,mask){
	if(!radius){
		 console.error("createSphere:need radius");
	}
	var object=  AmmoBodyAndMesh.createSphere(radius, mass, x, y, z, material);
	this.addBodyMesh(object,group,mask);
	return object;
},

_removeFromAutoSyncingBodies:function(data){
	var scope=this;
	this.autoSyncingBodies.some(function(v, i){
	    if (v==data) scope.autoSyncingBodies.splice(i,1);    
	});
},
//BodyAndMesh data
destroyBodyAndMesh:function(data){
	if(data==undefined || data==null){
		console.error("undefined or null data:",data);
		return;
	}
	if(data.getMesh()!=null){
		if(data.getMesh().parent){
			data.getMesh().parent.remove(data.getMesh());
		}
	}
	
	//remove at
	this._removeFromAutoSyncingBodies(data);
	
	this.garbage.push(data._transform);//no need anymore
	this.destroyRigidBody(data.getBody());
},

//btRigidBody body
destroyRigidBody:function(body){
	this.world.removeRigidBody(body);
	this.garbage.push(body);
},
//btTypedConstraint constraint
destroyConstraint:function(constraint){
	this.world.removeConstraint(constraint);
	
	this.garbage.push(constraint);
},
_removeFromAutoSyncingConstraints:function(data){
	var scope=this;
	this.autoSyncingConstraints.some(function(v, i){
	    if (v==data) scope.autoSyncingConstraints.splice(i,1);    
	});
},
//ConstraintAndLine data
destroyConstraintAndLine:function( data){
	if(data.getLine()!=null){
		this.scene.remove(data.getLine());
	}
	this._removeFromAutoSyncingConstraints(data);
	this.destroyConstraint(data.getConstraint());
},
//return ConstraintAndLine
//BodyAndMesh body1,Vector3 pivot0Vector

createPoint2PointConstraint:function( body1, pivot0Vector){
	var pivot0=AmmoUtils.copyFromVector3(null,pivot0Vector);
	var constraint= new Ammo.btPoint2PointConstraint(body1.getBody(), pivot0);
	this.world.addConstraint(constraint);

	
	var geo = new THREE.Geometry();
	geo.vertices.push( new THREE.Vector3(  ));
	geo.vertices.push( new THREE.Vector3(  ));
	
	var material=new THREE.LineBasicMaterial({color:0xaaaaaa});
	
	var joint = new THREE.Line( geo,material);
	this.scene.add(joint);
	
	
	var cm=new AmmoConstraintAndLine(constraint,joint,body1,null);
	cm.setPivot0(pivot0Vector);
	
	this.autoSyncingConstraints.push(cm);
	
	return cm;
},
//return ConstraintAndLine;
//BodyAndMesh body1,BodyAndMesh body2,btTransform frameInA,btTransform frameInB,boolean disableCollisionsBetweenLinkedBodies
createGeneric6DofConstraint:function(body1,body2,frameIn1,frameIn2,disableCollisionsBetweenLinkedBodies,useLinearReferenceFrameA){
	if(useLinearReferenceFrameA==undefined || useLinearReferenceFrameA==null){
		useLinearReferenceFrameA=true;
	}
	
	var constraint= new Ammo.btGeneric6DofConstraint(body1.getBody(), body2.getBody(), frameIn1, frameIn2, useLinearReferenceFrameA);
	this.world.addConstraint(constraint, disableCollisionsBetweenLinkedBodies);
	
	
	var geo = new THREE.Geometry();//var geo = new THREE.Geometry();
	geo.vertices.push( new THREE.Vector3(  ));
	geo.vertices.push( new THREE.Vector3(  ));
	
	var material=new THREE.LineBasicMaterial({color:0xaaaaaa,linewidth:10});
	
	var joint = new THREE.Line( geo,material);
	this.scene.add(joint);
	
	
	var cm=new AmmoConstraintAndLine(constraint,joint,body1,body2);
	this.autoSyncingConstraints.push(cm);
	
	return cm;
},
createGeneric6DofSpringConstraint:function(body1,body2,frameIn1,frameIn2,disableCollisionsBetweenLinkedBodies,useLinearReferenceFrameA){
	if(useLinearReferenceFrameA==undefined || useLinearReferenceFrameA==null){
		useLinearReferenceFrameA=true;
	}
	
	var constraint= new Ammo.btGeneric6DofSpringConstraint(body1.getBody(), body2.getBody(), frameIn1, frameIn2, useLinearReferenceFrameA);
	this.world.addConstraint(constraint, disableCollisionsBetweenLinkedBodies);
	
	
	var geo = new THREE.Geometry();//var geo = new THREE.Geometry();
	geo.vertices.push( new THREE.Vector3(  ));
	geo.vertices.push( new THREE.Vector3(  ));
	
	var material=new THREE.LineBasicMaterial({color:0x333333,linewidth:10});
	
	var joint = new THREE.Line( geo,material);
	this.scene.add(joint);
	
	
	var cm=new AmmoConstraintAndLine(constraint,joint,body1,body2);
	this.autoSyncingConstraints.push(cm);
	
	return cm;
},
setGravity:function(x,y,z){
	var btVector3=AmmoUtils.getSharedBtVector3(x,y,z);
	
	this.world.setGravity(btVector3);
}
,
setVisible:function(visible){
	this.setVisibleAll(visible);
},
setVisibleAll:function(visible){
	this.autoSyncingBodies.forEach(function(object){
		if(object.getMesh()){
			object.getMesh().material.visible=visible;
		};
	});
	
	this.autoSyncingConstraints.forEach(function(object){
		if(object.getLine()){
			object.getLine().material.visible=visible;
		};
	});
},
/*
 
 	function syncBones(){
		var bones=ap.skinnedMesh.skeleton.bones;
		ap.skinnedMesh.skeleton.pose();
		//no need [0] root
		for(var i=0;i<bones.length;i++){
			ap.scene.add(ap.skinnedMesh);
			ap.scene.updateMatrixWorld();
			var name=bones[i].name;
			var bm=application[name];
			ap.ammoControler.updateBone(bones[i], bm);
			ap.group.add(ap.skinnedMesh);
		}
	};
 
 */
//Bone bone,BodyAndMesh bm,btTransform transform,double divided,boolean enablePosition
updateBone:function(bone,bm,enablePosition){
	enablePosition=enablePosition!==undefined?enablePosition:true;
	//use shared
	var vq=AmmoUtils.getWorldTransform(bm);
	AmmoUtils.updateBone(bone, enablePosition?vq.position:null, vq.rotation,this.scaleFactor,this.scene);
	
	return vq;
}

}

