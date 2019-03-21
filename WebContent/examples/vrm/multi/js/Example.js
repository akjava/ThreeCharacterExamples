Example=function(application){
	var scope=this;
	var ap=application;
	ap.renderer.gammaOutput=true;
	
	//default camera,TODO change by signal
	ap.camera.position.set( 0, 100, -260 );//z is opposite
	ap.controls.target.set(0,90,0);
	ap.controls.update();
	
	var url='../../../dataset/vrm/Alicia/AliciaSolid.vrm';
	var url='../../../dataset/vrm/3207836450134888583.vrm';
	
	ap.modelUrl=ap.defaultModelUrl==undefined?url:ap.defaultModelUrl; //defaultModelUrl set by sidebar

	//light
	ap.scene.add(new THREE.AmbientLight(0xaaaaaa));//use basic material
	
	
	Logics.loadingModelStartedForVrm(ap);
	
	ap.getSignal("loadingModelStarted").add(function(){
		if(ap.skinnedMesh){
			ap.skinnedMesh=null;//stop remove
		}
	});
	
	
	//just standing pose so far
	function changePose(model){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		
		var map=VrmUtils.createHumanBoneNameToGeneralBoneNameMap(ap);
		var leftarm=map["leftUpperArm"];
		BoneUtils.findBoneByBoneName(boneList,leftarm).rotation.z=THREE.Math.degToRad(78);
		var rightarm=map["rightUpperArm"];
		BoneUtils.findBoneByBoneName(boneList,rightarm).rotation.z=THREE.Math.degToRad(-78);
		
	}
	
	
	scope.roughness=0.25;
	scope.metalness=0.25;
	
	ap.humanoidBoneControler=new HumanoidBoneControler(ap);
	var models=[];
	var posX=45;
	var posY=0;
	var posZ=0;
	var line=1;
	var chara=0;
	ap.getSignal("loadingModelFinished").add(function(model){
		
		var bs=VrmUtils.parseBlendShapes(ap.vrm);
		model.userData.blendShapes=bs;
		model.userData.hasMorphTargets=VrmUtils.getHasMorphTargets(model);
		
		var itemcount=0;
		model.traverse(function(obj){
			itemcount++;
		});
		//console.log(model.name,itemcount);
		
		models.push(model);
		model.position.x=posX;
		model.position.y=posY;
		model.position.z=posZ;
		
		if(line<3){
			posX-=30;
			
		}else{
			posX-=40;
		}
		
		chara++;
		if(line==1){
			if(chara>3){
				line=2;
				posX=30;
				posY+=25;
				posZ+=15;
			}
		}else if(line==2){
			if(chara>3+3){
				line=3;
				posY+=15;
				posZ+=15;
				posX=60;
			}
		}else{
			
		}
		
		
		
		
		changePose(model);
		
		//change hair material
		function getMaterial(target){
			target.userData.oldMaterial=target.material;
			return new THREE.MeshStandardMaterial({skinning:true,color:target.material.color.getHex(),map:target.material.map,roughness:scope.roughness,metalness:scope.metalness});
		}
		
		var meshs=VrmUtils.getSkinnedMeshes(model);
		meshs.forEach(function(mesh){
			if(mesh.name.startsWith("Hair")){
				//somehow so much
				mesh.material=getMaterial(mesh);
			}
		});
		
		loadNext();
		
	});
	
	
	ap.getSignal("VrmBlendShapeChanged").add(function(map){
		
		models.forEach(function(model){
			VrmUtils.clearMorphs(model.userData.hasMorphTargets);
			
			if(map){
				Object.keys(map).forEach(function(key){
					var shape=VrmUtils.getBlendShapeByName(model.userData.blendShapes,key);
					if(shape!=null && map[key]!=0){
						VrmUtils.applyBlendShape(model,shape,map[key]);
					}else{
						if(key!=="")
							console.log("shape not found",key);
					}
						
				});
			}
		});
		
		
	});
	
	
	ap.getSignal("cameraControlerChanged").dispatch(new THREE.Vector3(0, 164, -77),new THREE.Vector3(0,164,0))
	
	var items=["1165698526245646263","3207836450134888583","8918153411318051453","4342408832165294509",
	
		"5511912363803693014","3544163897481662496","7962706299924486305",
		"6412725501417852127","385739062748265390","4401746383402484197","8813340418701262954"
		];
		
	var baseUrl='../../../../three.js-example/dataset/';
	
	var index=0;
	function loadNext(){
		if(index<items.length){
			ap.getSignal("loadingModelStarted").dispatch(baseUrl+items[index]+".vrm");
		}
		index++;
	}
	
	loadNext();
	
	ap.getSignal("bgImageLoadingStarted").dispatch('../../../dataset/texture/bg/boxsky1.jpg');
	
	

}