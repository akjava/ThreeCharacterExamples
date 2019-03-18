//btRigidBody body, Mesh mesh
AmmoBodyAndMesh = function(body,mesh){
	this.body=body;
	this.mesh=mesh;
	this._transform=new Ammo.btTransform();
	//this._quaternion=new THREE.Quaternion();
	
	//this.bodyScalar=1;//TODO not support yet
	this.rotationSync=false;
	this.shapeType=0;
	this.forceSyncWhenHidden=true;
	this.disableSync=false;
	this.syncBodyToMesh=true;//or sync mesh to body
	
	
	this.syncWorldMatrix=false;
	
	this._matrix=new THREE.Matrix4();
	this._position=new THREE.Vector3();
	this._rotation=new THREE.Quaternion();
	this._scale=new THREE.Vector3(1,1,1);
	
	this.syncBone=false;
	this.targetBone=null;
	this.syncBonePosition=false;
	this.defaultBoneRotation=null;//not support yet
	
	this._tmpQuaternion=null;
	

	this.syncBoneRatio=undefined;
}

Object.assign( AmmoBodyAndMesh.prototype, {
	constructor:AmmoBodyAndMesh,
	
	//from ammo-world to three.js
	syncTransform:function(ammoControler){
		if(this.disableSync){
			return;
		}
		if(this.body==null || this.mesh==null){
			return;
		}
		
		if(this.mesh.material.visible==false && this.forceSyncWhenHidden==false){
			return;
		}
		
		
		
		if(this.syncBodyToMesh){
			var transform=this._transform;
			
			this.body.getMotionState().getWorldTransform(transform);
			
			if(this.syncWorldMatrix){//TODO recheck
				//this._position.set(transform.getOrigin().x()/this.bodyScalar, transform.getOrigin().y()/this.bodyScalar,transform.getOrigin().z()/this.bodyScalar);
				this._position.set(transform.getOrigin().x(), transform.getOrigin().y(),transform.getOrigin().z());
				
				this._rotation.set(transform.getRotation().x(), transform.getRotation().y(), transform.getRotation().z(), transform.getRotation().w());
				this._matrix.compose(this._position,this._rotation,this._scale);
				
				var inverse=ammoControler.getMeshContainerMatrixWorldInverse();
				this._matrix.multiplyMatrices( inverse, this._matrix );
				this._position.setFromMatrixPosition(this._matrix );
				this._rotation.setFromRotationMatrix(this._matrix );
				this.mesh.position.copy(this._position);
				
				if(this.rotationSync){
					this.mesh.quaternion.copy(this._rotation);
				}
			}else{
			//this.mesh.position.set(transform.getOrigin().x()/this.bodyScalar, transform.getOrigin().y()/this.bodyScalar,transform.getOrigin().z()/this.bodyScalar);
			this.mesh.position.set(transform.getOrigin().x(), transform.getOrigin().y(),transform.getOrigin().z());
			
			
			if(this.rotationSync){
				//var q=this._quaternion
				//transform.getRotation().copyTo(q);
				this.mesh.quaternion.set(transform.getRotation().x(), transform.getRotation().y(), transform.getRotation().z(), transform.getRotation().w());
			}
		}
		}else{
			//sync mesh to body
			var p=this.mesh.position;
			var q=this.mesh.quaternion;
			
			if(this.syncWorldMatrix){
				//var inverse=ammoControler.getMeshContainerMatrixWorldInverse();
				//this._matrix.multiplyMatrices( inverse, mesh.matrixWorld );
				this._position.setFromMatrixPosition(this.mesh.matrixWorld );
				this._rotation.setFromRotationMatrix(this.mesh.matrixWorld );
				
				p=this._position;
				q=this._rotation;
			}
			
			var transform=AmmoUtils.getSharedBtTransform();
			if(this.rotationSync){
				var btQuaternion=AmmoUtils.getSharedBtQuaternion(q.x,q.y,q.z,q.w);
				transform.setRotation(btQuaternion);
			}else{
				//get old transform
				var tmpt=this._transform;
				this.body.getMotionState().getWorldTransform(tmpt);
				
				transform.setRotation(tmpt.getRotation());
			}
			
			AmmoUtils.copyFromXYZ(transform.getOrigin(),p.x,p.y,p.z);
			this.body.setCenterOfMassTransform(transform);
			this.body.getMotionState().setWorldTransform(transform);
		}
		
		
		//limited working,maybe scalling
		if(this.syncBone && this.targetBone!=null){
			/*
			 * why separated here.
			 * Case:sphere1 - sphere2 -sphere3  from bone1-bone2
			 * sphere1(static)
			 * sphere2(dynamic containe bone1-rot,bone2-position)
			 * sphere3(dynamic contain bone2-rot)
			 */
			
			/*if(this.positionTargetBone){
				//trying 
				var matrixWorld=null;
				var beforePos=this.positionTargetBone.position.clone();
				var beforeRotq=this.positionTargetBone.quaternion.clone();
				this.positionTargetBone.position.copy(this.positionTargetBone.userData.defaultPosition);
				this.positionTargetBone.rotation.set(0,0,0);
				this.positionTargetBone.updateMatrixWorld(true);
				matrixWorld=this.positionTargetBone.matrixWorld;
				
				var pos=new THREE.Vector3().copy(this.getMesh().position);
				//console.log("mesh",pos);
				pos.applyMatrix4( new THREE.Matrix4().getInverse( matrixWorld) );
			//	console.log("inverted",pos);
				pos.add(this.positionTargetBone.userData.defaultPosition);
				this.positionTargetBone.userData.needUpdatePosition=pos;
				this.positionTargetBone.position.copy(beforePos);
				this.positionTargetBone.quaternion.copy(beforeRotq);
				this.positionTargetBone.updateMatrixWorld(true);
			}*/
			
			
			this.targetBone.rotation.set(0,0,0);//for vrm TODO
			this.targetBone.position.copy(this.targetBone.userData.defaultPosition);//when made?
			this.targetBone.updateMatrixWorld(true);
			var matrixWorld=this.targetBone.matrixWorld;
			
			
			if(this.defaultBoneRotation==null){
				this.defaultBoneRotation=new THREE.Euler();
			}
			if(this._tmpQuaternion==null){
				this._tmpQuaternion=new THREE.Quaternion();
			}
			
			var logging=false;
			function printQ(q,message){
				if(!logging)
					return;
				var tmp=new THREE.Euler();
				tmp.setFromQuaternion(q);
				AppUtils.printDeg(tmp,message);
				return tmp;
			}
			
			var euler=this.defaultBoneRotation;
			var rotate=this.getMesh().rotation;
			var order=this.getMesh().rotation.order;
			
			var newQ=null;
			if(this.syncBodyToMesh){
				//TODO this one is slow
				//newQ=BoneUtils.makeQuaternionFromXYZRadian(rotate.x,rotate.y,rotate.z,euler,order);
				newQ=this.getMesh().quaternion.clone();
			}else{
				var transform=this._transform;
				this.body.getMotionState().getWorldTransform(transform);
				//TODO support default order;
				newQ=this._tmpQuaternion.set(transform.getRotation().x(), transform.getRotation().y(), transform.getRotation().z(), transform.getRotation().w());
				
			}
			
			//var newQ=this.getMesh().quaternion.clone();
			//printQ(newQ);
			printQ(newQ,"ammo");
		
			//TODO optimize
			
			var wq=this.targetBone.parent.getWorldQuaternion(this._rotation);
			printQ(wq,"minus-"+this.targetBone.parent.name);
			//printQ(wq);
			
			if(!this.syncBodyToMesh){
				//logging=true;
			}
			newQ.multiply(wq.inverse());
			printQ(newQ,"set "+this.targetBone.name);
			
			this.targetBone.quaternion.copy(newQ);
			
			//testlimit
			
			
			
			if(this.syncBoneRatio){
				var rot=this.targetBone.rotation;
				rot.set(rot.x*syncRatio,rot.y*syncRatio,rot.z*syncRatio);
			}
			
			
			
			if(this.syncBonePosition){
				var pos=this._position.copy(this.getMesh().position);
				pos.applyMatrix4( new THREE.Matrix4().getInverse( matrixWorld) );
				pos.add(this.targetBone.position);
				if(this.syncBoneRatio){
					var diff=pos.sub(this.targetBone.position);
					diff.multiplyScalar(syncRatio).add(this.targetBone.position);
					this.targetBone.position.copy(diff);
				}else{
					this.targetBone.position.copy(pos);
				}
			}
			
			
		
			
			
			this.targetBone.updateMatrixWorld(true);
		}
		
	},
	getBody:function(){
		return this.body;
	},
	getMesh:function(){
		return this.mesh;
	}
});

AmmoBodyAndMesh.TYPE_SPHERE=0;
AmmoBodyAndMesh.TYPE_BOX=1;
AmmoBodyAndMesh.TYPE_CAPSULE=2;
AmmoBodyAndMesh.TYPE_CYLINDER=3;
AmmoBodyAndMesh.TYPE_CONE = 4;


//return AmmoBoxBodyAndMesh
//Vector3 size,double mass,double x,double y,double z,Material material
AmmoBodyAndMesh.createBox=function(size,mass,x,y,z,material){
	var vec3=new Ammo.btVector3(size.x/2, size.y/2, size.z/2);
	var body=AmmoBodyAndMesh.makeBoxBody(vec3,mass,x,y,z);
	Ammo.destroy(vec3);
	
	var mesh=new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z),material);
	mesh.position.set(x, y, z);
	var box= new AmmoBoxBodyAndMesh(size.clone(),body, mesh);
	
	
	return box;
}

//return btRigidBody
//btVector3 halfSize,double mass,double x,double y,double z
//TODO support rotate
AmmoBodyAndMesh.makeBoxBody=function(halfSize,mass,x,y,z){
var pos=new Ammo.btVector3(x, y, z);
var form = new Ammo.btTransform();
  form.setIdentity();
  form.setOrigin(pos);
 
  var box = new Ammo.btBoxShape(halfSize);
  var localInertia = new Ammo.btVector3(0, 0, 0);//
  if(mass!=0){
  	box.calculateLocalInertia(mass,localInertia);
  }
  
  var body= new Ammo.btRigidBody(
      new Ammo.btRigidBodyConstructionInfo(
          mass, 
          new Ammo.btDefaultMotionState(form), 
          box, 
          localInertia 
      )
  );
  
  
  //btSphere has nothing special method
  //body._sphereShape=sphere;
  
  body._mass=mass;

  //only can destroying here,sphere cant destroy
  Ammo.destroy(form);
  Ammo.destroy(localInertia);
  
  return body;
};

//return SphereBodyAndMesh
//double radius,double mass,double x,double y,double z,Material material
AmmoBodyAndMesh.createSphere=function(radius,mass,x,y,z,material){
	var body=this.makeSphereBody(radius,mass,x,y,z);
	
	var mesh=new THREE.Mesh(new THREE.SphereGeometry(radius, 10, 10),material);
	mesh.renderOrder=1;
	mesh.position.set(x, y, z);
	var sphere= new AmmoSphereBodyAndMesh(radius,body, mesh);
	
	
	return sphere;
}

//return btRigidBody
//double radius,double mass,double x,double y,double z
AmmoBodyAndMesh.makeSphereBody=function(radius,mass,x,y,z){
var pos=new Ammo.btVector3(x, y, z);
var form = new Ammo.btTransform();
    form.setIdentity();
    form.setOrigin(pos);
   
    var sphere = new Ammo.btSphereShape(radius);
   
    var localInertia = new Ammo.btVector3(0, 0, 0);//
    if(mass!=0){
    	sphere.calculateLocalInertia(mass,localInertia);
    }
    var state=new Ammo.btDefaultMotionState(form);
    var info=new Ammo.btRigidBodyConstructionInfo(
            mass, 
            state, 
            sphere, 
            localInertia 
        );
        
    var body= new Ammo.btRigidBody(
        info
    );
    //btSphere has nothing special method
    //body._sphereShape=sphere;
    
    body._mass=mass;
    body._sphere=sphere;

    //only can destroying here,sphere cant destroy
    Ammo.destroy(form);
    //Ammo.destroy(info); //can't destroy
    //Ammo.destroy(state); //can't destroy
    Ammo.destroy(localInertia);
    
    return body;
}

//double radius,double height,double mass,double x,double y,double z,Material material
AmmoBodyAndMesh.createCylinder=function( radius, height, mass, x, y, z, material){
	var vec3=new Ammo.btVector3(radius, height/2, radius);
	var body=AmmoBodyAndMesh.makeCylinderBody(vec3,mass,x,y,z);
	AmmoUtils.destroy(vec3);
	
	var mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 10),material);
	mesh.position.set(x, y, z);
	
	//TODO ?
	var box= new AmmoBoxBodyAndMesh(new THREE.Vector3(radius, height, 0),body, mesh,AmmoBodyAndMesh.TYPE_CYLINDER);
	
	
	return box;
}
//btVector3 halfSize,double mass,double x,double y,double z
AmmoBodyAndMesh.makeCylinderBody=function(halfSize,mass,x,y,z){
var pos=new Ammo.btVector3(x, y, z);
var form = new Ammo.btTransform();
  form.setIdentity();
  form.setOrigin(pos);
 
  var box = new Ammo.btCylinderShape(halfSize);
  var localInertia = new Ammo.btVector3(0, 0, 0);//
  if(mass!=0){
  	box.calculateLocalInertia(mass,localInertia);
  }
  
  var body= new Ammo.btRigidBody(
      new Ammo.btRigidBodyConstructionInfo(
          mass, 
          new Ammo.btDefaultMotionState(form), 
          box, 
          localInertia 
      )
  );
  
  
  //btSphere has nothing special method
  //body._sphereShape=sphere;
  
  body._mass=mass;//no idea?

  //only can destroying here,sphere cant destroy
  Ammo.destroy(form);
  Ammo.destroy(localInertia);
  
  return body;
};
//double radius,double halfHeight,double mass,Vector3 position,Quaternion rotation,Material material
AmmoBodyAndMesh.createCapsule=function(radius,halfHeight,mass,x,y,z,material){
	var body=AmmoBodyAndMesh.makeCapsuleBody(radius,halfHeight,mass,x,y,z);

	
	var mesh=new THREE.Mesh(AmmoBodyAndMesh.createCapsuleGeometry(radius,halfHeight),material);
	mesh.position.set(x, y, z);
	
	var box= new AmmoCapsuleBodyAndMesh(radius,halfHeight,body, mesh,AmmoBodyAndMesh.TYPE_CAPSULE);
	
	return box;
}

//double radius,double height,double mass,double x,double y,double z
AmmoBodyAndMesh.makeCapsuleBody=function(radius,height,mass,x,y,z){
var pos=new Ammo.btVector3(x, y, z);
var form = new Ammo.btTransform();
  form.setIdentity();
  form.setOrigin(pos);
  
  /* need?
  if(rotation){
  	form.setRotation(rotation);
  }
  */
 
  var box = new Ammo.btCapsuleShape(radius,height-(radius*2));
  var localInertia = new Ammo.btVector3(0, 0, 0);//
  if(mass!=0){
  	box.calculateLocalInertia(mass,localInertia);
  }
  
  var body= new Ammo.btRigidBody(
      new Ammo.btRigidBodyConstructionInfo(
          mass, 
          new Ammo.btDefaultMotionState(form), 
          box, 
          localInertia 
      )
  );
  
  
  //btSphere has nothing special method
  //body._sphereShape=sphere;
  
  body._mass=mass;

  //only can destroying here,sphere cant destroy
  Ammo.destroy(form);
  Ammo.destroy(localInertia);
  
  return body;
}

AmmoBodyAndMesh.createCapsuleGeometry=function( radius, height){
	var move=height/2-radius;
	var cylinder=new THREE.CylinderGeometry(radius, radius, Math.max(0.0001, height-radius*2), 10);
	var sphere=new THREE.SphereGeometry(radius, 6,6);
	var moveUpMatrix=new THREE.Matrix4().makeTranslation(0, -move, 0);
	sphere.applyMatrix(moveUpMatrix);
	cylinder.merge(sphere);
	
	var sphere2=new THREE.SphereGeometry(radius, 6,6);
	var downUpMatrix=new THREE.Matrix4().makeTranslation(0, move, 0);
	sphere2.applyMatrix(downUpMatrix);
	cylinder.merge(sphere2);
	return cylinder;
}
//double radius,double height,double mass,double x,double y,double z,Material material
AmmoBodyAndMesh.createCone=function(radius,height,mass,x,y,z,material){
	
	var body=AmmoBodyAndMesh.makeConeBody(radius,height,mass,x,y,z);
	
	
	var mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius/10, radius, height, 10),material);
	mesh.position.set(x, y, z);
	var box= new AmmoBoxBodyAndMesh(new THREE.Vector3(radius, height, 0),body, mesh,AmmoBodyAndMesh.TYPE_CONE);
	
	
	return box;
}

//double radius,double height,double mass,double x,double y,double z
AmmoBodyAndMesh.makeConeBody=function (radius,height,mass,x,y,z){
var pos=new Ammo.btVector3(x, y, z);
var form = new Ammo.btTransform();
  form.setIdentity();
  form.setOrigin(pos);
 
  var box = new Ammo.btConeShape(radius,height);
  var localInertia = new Ammo.btVector3(0, 0, 0);//
  if(mass!=0){
  	box.calculateLocalInertia(mass,localInertia);
  }
  
  var body= new Ammo.btRigidBody(
      new Ammo.btRigidBodyConstructionInfo(
          mass, 
          new Ammo.btDefaultMotionState(form), 
          box, 
          localInertia 
      )
  );
  
  
  //btSphere has nothing special method
  //body._sphereShape=sphere;
  
  body._mass=mass;

  //only can destroying here,sphere cant destroy
  Ammo.destroy(form);
  Ammo.destroy(localInertia);
  
  return body;
};

/*
public static BoxBodyAndMesh createCone(double radius,double height,double mass,double x,double y,double z,Material material){
	
	btRigidBody body=makeConeBody(radius,height,mass,x,y,z);
	
	
	Mesh mesh=THREE.Mesh(THREE.CylinderGeometry(radius/10, radius, height, 10),material);
	mesh.setPosition(x, y, z);
	BoxBodyAndMesh box= new BoxBodyAndMesh(THREE.Vector3(radius, height, 0),body, mesh,TYPE_CONE);
	
	
	return box;
}


*/