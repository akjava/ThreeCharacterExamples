Example=function(application){
	var ap=application;
	var scope=this;
	var scale=100;
	
	ap.camera.position.set( 0, 1*scale, 2.5*scale );
	ap.controls.target.set(0,1*scale,0);
	ap.controls.update();
	
	//var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,transparent:false,opacity:1,depthTest: true});
	
	
	this.container=null;//add mesh here
	var boneList;
	

	
	
	
	
	AppUtils.loadMesh(url,function(mesh){
		try{
		console.log("loadGltfMesh:",url);
		var container=new THREE.Group();
		this.container=container;//try to not modify Application.js
		ap.scene.add(container);
		ap.container=container;
		
		var isGltf=mesh.isGltf;//set before convert
		
		//mesh part,modify bone and try to same size both glb & fbx
		mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
		mesh.material=material;
		mesh.renderOrder = 0;
		container.add(mesh);
		ap.skinnedMesh=mesh;
		
		
		
		if(isGltf){
			mesh.scale.set(scale,scale,scale);
		}
		boneList=BoneUtils.getBoneList(mesh);
		
		
		ap.signals.skinnedMeshChanged.dispatch(mesh);
		
		
		
		
		
		
		
		
		//init mixer
		ap.mixer=new THREE.AnimationMixer(mesh);
		ap.clock=new THREE.Clock();
		
		ap.signals.rendered.add(function(){
			if(ap.mixer){
				var delta = ap.clock.getDelta();
				ap.mixer.update(delta);
			}
		});
		
		//init attach controler
		var boxSize=0.05*scale;
		scope.boneAttachControler=new BoneAttachControler(mesh,{color: 0x008800,boxSize:boxSize});
		ap.boneAttachControler=scope.boneAttachControler;
		scope.boneAttachControler.setVisible(false);
		
		ap.ikControler.boneAttachControler=scope.boneAttachControler;
		ap.ikControler.ap=ap;
		this.container.add(scope.boneAttachControler.object3d);
		

		ap.signals.boneSelectionChanged.add(function(index){
			ap.ikControler.boneSelectedIndex=index;
		});
		
		
		
		
		
		
		ap.signals.poseChanged.add(function(){
			ap.ikControler.resetAllIkTargets();
		});
		
		
		//initialize ik

		
		
		
		var mbl3dik=new Mbl3dIk(ap);
		ap.ikControler.ikTargets=mbl3dik.ikTargets;
		
		function onTransformSelectionChanged(target){
			
			if(target!=null && target.userData.transformSelectionType=="IkCandiate"){
				var index=target.userData.IkCandiateIndex;
				target.userData.IkCandiateOnClick(index);
				ap.transformControls.detach();
			}
			
		}
		
		
		scope.target=null;
		ap.signals.transformSelectionChanged.add(function(target){
			scope.target=target;
			if(target==null){
				ap.transformControls.detach();
			}
			
			ap.ikControler.onTransformSelectionChanged(target);
			onTransformSelectionChanged(target);
		},undefined,1);//need high priority to call first
		

		
		
		
		
		ap.signals.solveIkCalled.add(function(){
			ap.ikControler.solveIk(true);
		});
		
		var lastTargetMovedPosition=new THREE.Vector3();
		
		
		
		ap.signals.transformChanged.add(function(){	
			ap.ikControler.solveIk();
		});
		
		
		//candiate
		var datas=[new THREE.Vector3(20,0,0),new THREE.Vector3(45,-75,0),new THREE.Vector3(-15,-120,15),new THREE.Vector3(0,0,0)];
		var name="LeftArm";
		
		var indices=ap.ikControler.iks[name];
		var boneList=ap.ikControler.boneAttachControler.boneList;
		var parentMesh=null;
		var box=null;
		for(var i=0;i<indices.length;i++){
			
			var index=indices[i];
			var bone=boneList[index];
			
			var parentIndex=boneList.indexOf(bone.parent);
			var parent=boneList[parentIndex];
			
			var pos=ap.ikControler.boneAttachControler.containerList[index].position;
			var parentPos=ap.ikControler.boneAttachControler.containerList[parentIndex].position;
		
			var diff=pos.clone().sub(parentPos);
			var needLineToParent=true;
			if(parentMesh==null){
				parentMesh=ap.ikControler.boneAttachControler.containerList[parentIndex];
				needLineToParent=false;
			}
			box=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial({color:0x000088,depthTest:false,transparent:true,opacity:.5}));
			box.name=String(i);
			box.renderOrder = 1;
			box.position.copy(diff);
			parentMesh.add(box);
			box.userData.transformSelectionType="IkCandiate";
			ap.objects.push(box);
			box.userData.IkCandiateIndex=Number(i);
			box.userData.IkCandiateOnClick=function(loopIndex){
				for(var j=0;j<indices.length && j<=loopIndex;j++){
					var index2=indices[j];
					var bone2=boneList[index2];
					
					var rad2=AppUtils.degToRad(datas[j]);
					bone2.rotation.set(rad2.x,rad2.y,rad2.z);
				}
				ap.ikControler.resetAllIkTargets();
			}
			
			
			var rad=AppUtils.degToRad(datas[i]);
			box.rotation.set(rad.x,rad.y,rad.z);
			
			if(needLineToParent){
				var line=AppUtils.lineTo(parentMesh,box);
				line.material.depthTest=false;	
			}
			
			parentMesh=box;
			
		}
		
	} catch(e) {
		  console.error(e);
		}
	});
	
	
	
	ap.signals.rendered.add(function(){
		
		if(scope.boneAttachControler){
			scope.boneAttachControler.update();
		}
		
	});
	
	

}