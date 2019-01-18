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
	
	var mbl3dPoseEditor=new Mbl3dPoseEditor(ap,scale);
	mbl3dPoseEditor.loadMesh(url,material);
	

	
	

	
	

}