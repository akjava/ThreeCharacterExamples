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
	
	ap.ikLimitMin={};
	ap.ikLimitMax={};
	
	function limitBone(boneList,endName,minX,minY,minZ,maxX,maxY,maxZ){
		var name=BoneUtils.findBoneByEndsName(boneList,endName).name;
		ap.ikLimitMin[name]={};
		ap.ikLimitMax[name]={};
		ap.ikLimitMin[name].x=minX;
		ap.ikLimitMin[name].y=minY;
		ap.ikLimitMin[name].z=minZ;
		ap.ikLimitMax[name].x=maxX;
		ap.ikLimitMax[name].y=maxY;
		ap.ikLimitMax[name].z=maxZ;
	}

	function initlimitBone(){
		
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		/*boneList.forEach(function(bone){
			limitBone(boneList,bone.name,-180,-180,-180,180,180,180);
		});*/
		
		limitBone(boneList,"calf_R",0,0,0,170,0,0);
		limitBone(boneList,"thigh_R",-120,0,-70,120,0,70);
		
		limitBone(boneList,"hand_R",-45,-45,-45,45,45,45);
		limitBone(boneList,"lowerarm_R",0,0,0,0,170,0);
		limitBone(boneList,"upperarm_R",-75,-75,-30,75,75,85);
		limitBone(boneList,"clavicle_R",0,-15,-30,0,0,0);
		
		
		limitBone(boneList,"calf_L",0,0,0,170,0,0);
		limitBone(boneList,"thigh_L",-120,0,-70,120,0,70);
		
		limitBone(boneList,"hand_L",-45,-45,-45,45,45,45);
		limitBone(boneList,"lowerarm_L",0,-170,0,0,0,0);
		limitBone(boneList,"upperarm_L",-75,-75,-85,75,75,30);
		limitBone(boneList,"clavicle_L",0,0,0,0,15,30);
		
		limitBone(boneList,"spine01",-15,-45,-45,15,45,45);
		limitBone(boneList,"spine02",-45,-45,-45,45,45,45);
		limitBone(boneList,"spine03",-45,-45,-45,45,45,45);
		limitBone(boneList,"neck",-45,-45,-45,45,45,45);
		limitBone(boneList,"root",-45,-45,-45,45,45,45);
		
		//copy to default
		Object.keys(ap.ikLimitMin).forEach(function(key){
			ap.ikDefaultLimitMin[key]={};
			ap.ikDefaultLimitMin[key].x=ap.ikLimitMin[key].x;
			ap.ikDefaultLimitMin[key].y=ap.ikLimitMin[key].y;
			ap.ikDefaultLimitMin[key].z=ap.ikLimitMin[key].z;
			ap.ikDefaultLimitMax[key]={};
			ap.ikDefaultLimitMax[key].x=ap.ikLimitMax[key].x;
			ap.ikDefaultLimitMax[key].y=ap.ikLimitMax[key].y;
			ap.ikDefaultLimitMax[key].z=ap.ikLimitMax[key].z;
		});
		
		//send ref
		ap.signals.boneLimitLoaded.dispatch(ap.ikLimitMin,ap.ikLimitMax);
	}
	
	
	AppUtils.loadMesh(url,function(mesh){
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
		
		initlimitBone();
		
		
		
		
		
		
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
		scope.boneAttachControler.setVisible(false);
		
		this.container.add(scope.boneAttachControler.object3d);

		
		function resetIkPosition(name){
			var target=ikTargets[name];
			var indices=ap.iks[name];
			var index=indices[indices.length-1];
			target.position.copy(scope.boneAttachControler.containerList[index].position);
		}
		
		ap.signals.poseChanged.add(function(){
			scope.boneAttachControler.update();
			Object.keys(ikTargets).forEach(function(key){
				resetIkPosition(key);
			});
		});
		
		var ikTargets={};
		
		function registIk(ikName,jointNames){
			var indices=[];
			ap.iks[ikName]=indices;
			jointNames.forEach(function(name){
				var index=BoneUtils.findBoneIndexByEndsName(boneList,name);
				console.log(name,index);
				if(index==-1){
					console.error("registIk:bone not contain,"+name);
				}
				indices.push(index);
			});
			var ikBox=new THREE.Mesh(new THREE.BoxGeometry(5,5,5),new THREE.MeshBasicMaterial({color:0x880000,depthTest:false,transparent:true,opacity:.5}));
			ikBox.renderOrder = 1;
			var index=indices.length-1;
			ikBox.position.copy(scope.boneAttachControler.containerList[indices[indices.length-1]].position);
			ikBox.ikName=ikName;
			ap.objects.push(ikBox);
			ikTargets[ikName]=ikBox;
			ap.scene.add(ikBox);
		}
		
		
		//initialize ik
		ap.iks={};
		ap.ikTarget=null;
		ap.ikIndices=null;
		
		registIk("hip",["root","spine01"]);
		registIk("head",["spine01","spine02","spine03","neck","head"]);
		registIk("leftArm",["clavicle_L","upperarm_L","lowerarm_L","hand_L",,"middle-00_L"]);
		registIk("rightArm",["clavicle_R","upperarm_R","lowerarm_R","hand_R"]);
		registIk("leftLeg",["thigh_L","calf_L","foot_L"]);
		registIk("rightLeg",["thigh_R","calf_R","foot_R"]);
		
		
		
		
		
		
		ap.signals.transformSelectionChanged.add(function(target){
			ap.ikTarget=target;
			
			
			if(target==null){
				ap.ikIndices=null;
				ap.transformControls.detach();
			}else{
				ap.ikIndices=ap.iks[target.ikName];
				ap.transformControls.attach(target);
			}
		},undefined,1);//need high priority to call first
		

		
		var solving=false;
		
		ap.signals.solveIkCalled.add(function(){
			solveIk();
		});
		
		function solveIk(){
			if(ap.ikTarget==null){
				return;
			}
			
			if(solving){
				console.log("busy solving");
				return;
			}
			
			
			
			
			var lastMesh=scope.boneAttachControler.containerList[ap.ikIndices[ap.ikIndices.length-1]];
			var targetMesh=ap.ikTarget;
			
			
			
			var targetPos=targetMesh.position;
			
			if(ap.ikTarget.position.equals(lastMesh.position)){
				return;
			}
			
			var euler=new THREE.Euler();
			for(var j=0;j<ap.iteration;j++){
			
			
			
			
			for(var i=0;i<ap.ikIndices.length-1;i++){
				var lastJointPos=lastMesh.position;
				
				
				var bone=scope.boneAttachControler.boneList[ap.ikIndices[i]];
				var joint=scope.boneAttachControler.containerList[ap.ikIndices[i]];
				var jointPos=joint.position;
				
				
				var jointRotQ=joint.quaternion;
				
				if(targetPos.equals(lastJointPos)){
					if(IkUtils.logging){
						console.log("no need ik, skipped");
					}
					
					return;
				}
				
				var newQ=IkUtils.calculateAngles(lastJointPos,jointPos,jointRotQ,targetPos,ap.maxAngle,false);
				
				var inverseQ=bone.parent.clone().getWorldQuaternion(new THREE.Quaternion()).inverse();
				var newQ=IkUtils.stepCalculate2(inverseQ,lastJointPos,jointPos,targetPos,ap.maxAngle);
				
				
				if(newQ==null){
					newQ=new THREE.Quaternion();
					continue;
				}
				
				
				var euler=new THREE.Euler().setFromQuaternion(newQ);
				
				var r=bone.rotation;
				
				var x=r.x;
				var y=r.y;
				var z=r.z;
				
				function toDegree(v1,v2){
					var tmp=THREE.Math.radToDeg(v1+v2);
					if(tmp>180){
						tmp-=360;
					}
					if(tmp<-180){
						tmp+=180;
					}
					//console.log(v1,v2,tmp);
					return tmp;
				}
				var logging=false;
				var tmpX=toDegree(x,euler.x);
				if(!ap.ikLockX && tmpX >= ap.ikLimitMin[bone.name].x && tmpX<=ap.ikLimitMax[bone.name].x){
					x=x+euler.x;
				//console.log(bone.name,"ok",ap.ikLimitMin[bone.name].x,ap.ikLimitMax[bone.name].x,tmpX);
				}else{
					if(logging)
					console.log(bone.name,"limit-x",ap.ikLimitMin[bone.name].x,ap.ikLimitMax[bone.name].x,tmpX);
				}
				var tmpY=toDegree(y,euler.y);
				if(!ap.ikLockY && tmpY >=ap.ikLimitMin[bone.name].y && tmpY<=ap.ikLimitMax[bone.name].y){
					y=y+euler.y;
				}else{
					if(logging)
					console.log(bone.name,"limit-y",ap.ikLimitMin[bone.name].y,ap.ikLimitMax[bone.name].y,tmpY);
				}
				var tmpZ=toDegree(z,euler.z);
				if(!ap.ikLockZ && tmpZ >=ap.ikLimitMin[bone.name].z && tmpZ<=ap.ikLimitMax[bone.name].z){
					z=z+euler.z;
				}else{
					if(logging)
					console.log(bone.name,"limit-z",ap.ikLimitMin[bone.name].z,ap.ikLimitMax[bone.name].z,tmpZ);
				}
				
				//fix rad
				if(x>Math.PI){
					x-=Math.PI*2;
				}
				if(y>Math.PI){
					y-=Math.PI*2;
				}
				if(z>Math.PI){
					z-=Math.PI*2;
				}
				if(x<-Math.PI){
					x+=Math.PI*2;
				}
				if(y<-Math.PI){
					y+=Math.PI*2;
				}
				if(z<-Math.PI){
					z+=Math.PI*2;
				}
				
				bone.rotation.set(x,y,z);
				
				scope.boneAttachControler.update();
			}
			}
		}
		
		
		ap.signals.transformChanged.add(function(){
			solveIk();
		});
	});
	
	

	
	
	var boneMatrix=new THREE.Matrix4();
	var matrixWorldInv=new THREE.Matrix4();
	ap.signals.rendered.add(function(){
		
		if(scope.boneAttachControler){
			scope.boneAttachControler.update();
			
		}
		
	});
	
	ap.signals.boxVisibleChanged.add(function(){
		boxList.forEach(function(box){
			box.material.visible=ap.visibleBone;
		});
		originBoxList.forEach(function(box){
			box.material.visible=ap.visibleOriginBone;
		});
	})
	

	 application.signals.boneAnimationIndexChanged.add(function(index){
		
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);

		ap.selectedBone=boneList[index];
	 });
	

}