Sidebar.Ground=function(ap){
	var scope=this;
	this.margin=0;
	var titlePanel=new UI.TitlePanel("Ground");
	var visibleRow=new UI.CheckboxRow("Visible",true,function(v){
		mesh.material.visible=v;
		grid.material.visible=v;
	});
	visibleRow.text.setWidth("40px");
	visibleRow.checkbox.setWidth("20px");
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
	
	
	var groundMargin=new UI.NumberSpan("Margin",0,10,1,this.margin,function(v){
		scope.margin=v;
	});
	groundMargin.text.setWidth("60px");
	groundMargin.number.setWidth("30px");
	visibleRow.add(groundMargin);
	
	var over=0xffff00;
	var near=0xe59400;
	var normal=0x880000;
	
	var vec=THREE.Vector3();
	function updateColor(){
		Object.values(ap.rotationControler.rotationControls).forEach(function(object){
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
	ap.getSignal("boneRotationChanged").add(function(){
		updateColor();
		});
	ap.getSignal("boneTranslateChanged").add(function(){
		updateColor();
		});
	
	ap.getSignal("loadingModelFinished").add(function(){
		
		ap.ikControler.boneAttachControler.computeBoundingBox();
		var box=ap.ikControler.boneAttachControler.boundingBox;
		
		var v=Math.abs(box.min.y);
		v*=2;//magic number todo modifier
		groundMargin.setValue(v);//modifer
		scope.margin=v;
	});
	
	var buttonRow=new UI.ButtonSpan("Land to Ground",function(){
		ap.ikControler.boneAttachControler.computeBoundingBox();
		var box=ap.ikControler.boneAttachControler.boundingBox;
		var min=box.min.y;
		var change=min-scope.margin;
		var pos=ap.skinnedMesh.skeleton.bones[0].position;
		
		
		
		pos.y=pos.y-change/ap.skinnedMesh.scale.x;
		ap.getSignal("boneTranslateChanged").dispatch();//for translate-controler
		ap.getSignal("boneTranslateFinished").dispatch();//for ik controler,timeliner
		
	});
	visibleRow.add(buttonRow);
	
	return titlePanel;
}