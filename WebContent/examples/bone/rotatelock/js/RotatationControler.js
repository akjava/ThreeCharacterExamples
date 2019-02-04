var RotatationControler=function(ap,boneAttachControler){
	var scope=this;
	this.ap=ap;
	this.boneAttachControler=boneAttachControler;
	this.rotationControls={};
	this.boneIndex=0;
	this.lastEuler=new THREE.Euler();
	
	//selection indicater
	var geo = new THREE.EdgesGeometry( new THREE.BoxGeometry(5,5,5) ); // or WireframeGeometry( geometry )

	var mat = new THREE.LineBasicMaterial( { color: 0xaaaaaa, linewidth: 2,transparent:true,opacity:1.0,depthTest:false,visible:false } );

	this.wireframe = new THREE.LineSegments( geo, mat );

	ap.scene.add( this.wireframe );
}
RotatationControler.prototype.initialize=function(boneFilter){
	var scope=this;
	var ap=this.ap;
	var e=new THREE.Euler();
	boneFilter=boneFilter!==undefined?boneFilter:function(){return true};
	var index=0;
	var boneList=this.boneAttachControler.boneList;
	boneList.forEach(function(bone){
		if(boneFilter(bone)){
			var sphere=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:0x880000,depthTest:false,transparent:true,opacity:.5}));
			sphere.renderOrder=1;
			scope.rotationControls[bone.name]=sphere;
			scope.boneAttachControler.containerList[index].add(sphere);
			sphere.userData.transformSelectionType="BoneRotation";
			sphere.userData.boneIndex=index;
			sphere.quaternion.copy(boneList[index].quaternion);
			var cbone=index;
			
			sphere.quaternion.onChange(function(){
				var euler=e.setFromQuaternion(sphere.quaternion,bone.rotation.order);
	
				var r=scope.lastEuler;
				var max=Math.abs(euler.x);
				if(euler.y>max){
					max=Math.abs(euler.y);
				}
				if(euler.z>max){
					max=Math.abs(euler.z);
				}
				
				//TODO limit
				euler.set(euler.x+r.x,euler.y+r.y,euler.z+r.z);
				var rotation=ap.skinnedMesh.skeleton.bones[cbone].rotation;
				rotation.copy(euler);
				ap.signals.boneRotationChanged.dispatch(cbone);
				
			});
			ap.objects.push(sphere);
		}
		index++;
	});
}

RotatationControler.prototype.onTransformSelectionChanged=function(target){
	var ap=this.ap;
	var scope=this;
	if(target==null){
		this.wireframe.material.visible=false;
	}else if(target.userData.transformSelectionType=="BoneRotation"){
		ap.transformControls.setMode( "rotate" );
		ap.transformControls.attach(target);
		var boneIndex=target.userData.boneIndex;
		this.boneIndex=boneIndex;
		ap.signals.boneSelectionChanged.dispatch(boneIndex);
		
		this.refreshSphere();
		
		this.wireframe.position.copy(scope.boneAttachControler.containerList[boneIndex].position);
		this.wireframe.material.visible=true;
	}else{//other
		this.wireframe.material.visible=false;
	}
}
RotatationControler.prototype.onTransformStarted=function(target){
	if(target!=null && target.userData.transformSelectionType=="BoneRotation"){
		this.wireframe.material.color.set(0xffffff);
		this.refreshSphere();
	}
}
RotatationControler.prototype.onTransformFinished=function(target){
if(target!=null && target.userData.transformSelectionType=="BoneRotation"){
	this.wireframe.material.color.set(0xaaaaaa);
	this.refreshSphere();
	}
}
RotatationControler.prototype.setVisible=function(v){
	Object.values(this.rotationControls).forEach(function(object){
		object.material.visible=v;
	})
}

RotatationControler.prototype.refreshSphere=function(){
	var bone=this.boneAttachControler.boneList[this.boneIndex];
	this.lastEuler.copy(bone.rotation);
	var rotC=this.rotationControls[bone.name];
	rotC.rotation.set(0,0,0);
}