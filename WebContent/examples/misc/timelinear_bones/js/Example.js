Example=function(application){
	var ap=application;
	var scope=this;
	var scale=100;
	
	ap.camera.position.set( 0, 1*scale, 2.5*scale );
	ap.controls.target.set(0,1*scale,0);
	ap.controls.update();
	
	//var url="../../../dataset/mbl3d/models/anime2_nomorph.glb";
	var url="../../../dataset/mbl3d/models/anime2_female.fbx";
	
	var material=new THREE.MeshPhongMaterial({color:0x888888,skinning:true,transparent:true,opacity:1,depthTest: true});
	
	//handle texture
	ap.signals.loadingTextureStarted.add (function () {
		if(ap.textureUrl!=null){
			ap.texture=new THREE.TextureLoader().load(ap.textureUrl);
			ap.texture.flipY = true;//FBX
			ap.texture.minFilter=THREE.LinearFilter;
		}else{
			ap.texture=null;
		}
	} );
	
	ap.signals.loadingTextureFinished.add (function () {
		ap.skinnedMesh.material.map=ap.texture;
		ap.skinnedMesh.material.needsUpdate=true;
	} );
	

	var lastEuler=new THREE.Euler();
	ap.signals.transformChanged.add(function(){
		//console.log(ap.transformControls.axis);//null,X,Y,Z
	});

	
	var geo = new THREE.EdgesGeometry( new THREE.BoxGeometry(5,5,5) ); // or WireframeGeometry( geometry )

	var mat = new THREE.LineBasicMaterial( { color: 0xaaaaaa, linewidth: 2,transparent:true,opacity:1.0,depthTest:true,visible:false } );

	this.wireframe = new THREE.LineSegments( geo, mat );

	ap.scene.add( this.wireframe );
	
	var objectTransformControler=new ObjectTransformControler(ap);
	ap.signals.skinnedMeshChanged.add(function(mesh){
		mesh.userData.transformSelectionType="ObjectTransform"
	});
	
	var mbl3dPoseEditor=new Mbl3dPoseEditor(ap,scale,objectTransformControler);
	mbl3dPoseEditor.loadMesh(url,material);
	
	
	var onUpdate=function(){
		ap.skinnedMesh.updateMatrixWorld(true);
		ap.signals.rendered.dispatch();//Timeliner mixer and default mixer conflicted and it make fps slow.
	}
	
	ap.signals.skinnedMeshChanged.add(function(){
		var trackInfo = [

			{
				type: THREE.VectorKeyframeTrack,
				label:'Mesh Position',
				propertyPath: '.position',
				initialValue: [ 0, 0, 0 ],
				interpolation: THREE.InterpolateSmooth
			},

			{
				type: THREE.QuaternionKeyframeTrack,
				label:'Mesh Quaternion',
				propertyPath: '.quaternion',
				initialValue: [ 0, 0, 0, 1 ],
				interpolation: THREE.InterpolateLinear

			}

		];
		//for bones
		var bones=BoneUtils.getBoneList(ap.skinnedMesh);
		for(var i=0;i<bones.length;i++){
			var name=bones[i].name;
			if(Mbl3dUtils.isFingerBoneName(name) || Mbl3dUtils.isTwistBoneName(name)){
				continue;
			}
			var info={type: THREE.QuaternionKeyframeTrack,
					label:name,
					propertyPath:".bones["+i+"].quaternion",
					initialValue: [ 0, 0, 0, 1 ],
					interpolation: THREE.InterpolateLinear
					}
			trackInfo.push(info);
		}
		
		//order changes,TODO include finger 
		var arms=["clavicle","upperarm","lowerarm","hand"];

		for(var i=0;i<bones.length;i++){
			bones[i].rotation.order="XZY";
		}
		
		arms.forEach(function(name){
			var lrs=["_L","_R"];
			lrs.forEach(function(lr){
				var boneName=name+lr;
				var index=BoneUtils.findBoneIndexByEndsName(bones,boneName);
				bones[index].rotation.order="YZX";
			});
		});
		
		
		var timeliner=new Timeliner( new THREE.TimelinerController( ap.skinnedMesh, trackInfo, onUpdate ) );
		ap.timeliner=timeliner;
		
		timeliner.context.dispatcher.fire('totalTime.update',3);
		timeliner.context.timeScale=120;
		timeliner.context.fileName="boneAnimation";
		
		ap.signals.skinnedMeshTransformeFinished.add(function(target){
			console.log("mesh changed",target.userData.transformMode);
		});
		
		ap.signals.boneTranslateFinished.add(function(index){
			console.log("bone translate changed",index);
		});
		
		ap.signals.boneRotationFinished.add(function(index){
			console.log("bone rotation changed",index);
		});
		
		
		
	});
	
}