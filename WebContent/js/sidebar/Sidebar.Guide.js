Sidebar.Guide=function(ap){
	var container=new UI.TitlePanel("Guide");
	var group=new THREE.Group();
	ap.scene.add(group);
	
	var row=new UI.Row();
	container.add(row);
	
	var color=0x004400;
	
	var addBt=new UI.ButtonSpan("Add",function(){
		AppUtils.clearAllThreeChildren(group);
		ap.boneAttachControler.getBoneList().forEach(function(bone){
			if(Mbl3dUtils.isCoreBoneName(bone.name)){
				var container=ap.boneAttachControler.getContainerByBoneName(bone.name);
				//somehow line faild
				var sphere=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:color,depthTest:false,transparent:true,opacity:.5}));
				sphere.name=bone.name;
				sphere.position.copy(container.position);
				group.add(sphere);
				
			}
			btRow.button.setDisabled(false);
		});
	});
	row.add(addBt);
	var hideBt=new UI.SwitchSpan("Hide Guides","Show Guides",true,function(v){
		setVisibleGuide(v);
	});
	row.add(hideBt);
	
	function setVisibleGuide(v){
		group.children.forEach(function(child){
			child.material.visible=v;
		});
	}
	ap.getSignal("guideVisibleChanged").add(function(v){
		setVisibleGuide(v);
		hideBt.setValue(v);
	});
	
	
	var btRow=new UI.ButtonRow("Sync Selected Bone Position",function(){
		var index=ap.boneSelectedIndex;
		var bone=ap.boneAttachControler.getBoneList()[index];
		var boneName=bone.name;
		var bonePos=ap.boneAttachControler.getContainerByBoneName(boneName).position;
		var guidePos=group.getObjectByName(boneName).position;
		var diff=guidePos.clone().sub(bonePos).divide(ap.skinnedMesh.scale);
		var rootPos=ap.boneAttachControler.getBoneList()[0].position;
		rootPos.add(diff);
		ap.getSignal("boneTranslateChanged").dispatch(0);
		ap.getSignal("boneTranslateFinished").dispatch(0);
	});
	container.add(btRow);
	btRow.button.setDisabled(true);
	
	return container;
}