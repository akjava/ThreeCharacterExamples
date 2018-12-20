Sidebar.Ground=function(ap){
	var scope=this;
	this.margin=0;
	var titlePanel=new UI.TitlePanel("Ground");
	var visibleRow=new UI.CheckboxRow("Visible",true,function(v){
		mesh.material.visible=v;
		grid.material.visible=v;
	});
	titlePanel.add(visibleRow);
	
	var scene=ap.scene;
	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true } ) );
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );
	ap.groundMesh=mesh;

	var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
	grid.material.opacity = 0.2;
	grid.material.transparent = true;
	scene.add( grid );
	
	
	var groundMargin=new UI.NumberRow("Margin",0,10,1,this.margin,function(v){
		scope.margin=v;
	});
	titlePanel.add(groundMargin);
	
	var over=0xffff00;
	var near=0xe59400;
	var normal=0x880000;
	
	var vec=THREE.Vector3();
	function updateColor(){
		Object.values(ap.rotatationControler.rotationControls).forEach(function(object){
			var pos=object.parent.position;
			if(pos.y<scope.margin){
				object.material.color.set(over);
			}else if(pos.y<scope.margin*2){
				object.material.color.set(near);
			}else{
				object.material.color.set(normal);
			}
		});
	}
	ap.signals.boneRotationChanged.add(function(){
		updateColor();
		});
	ap.signals.boneTranslateChanged.add(function(){
		updateColor();
		});
	
	ap.signals.skinnedMeshChanged.add(function(){
		
		ap.ikControler.boneAttachControler.computeBoundingBox();
		var box=ap.ikControler.boneAttachControler.boundingBox;
		
		var v=Math.abs(box.min.y);
		groundMargin.setValue(v);
		scope.margin=v;
	});
	
	var buttonRow=new UI.ButtonRow("Land to Ground",function(){
		ap.ikControler.boneAttachControler.computeBoundingBox();
		var box=ap.ikControler.boneAttachControler.boundingBox;
		var min=box.min.y;
		var change=min-scope.margin;
		var pos=ap.skinnedMesh.skeleton.bones[0].position;
		pos.y=pos.y-change;
		ap.signals.boneTranslateChanged.dispatch();
		
	});
	titlePanel.add(buttonRow);
	
	return titlePanel;
}