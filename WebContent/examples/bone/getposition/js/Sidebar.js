var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Get Position"));
	
	var title=new UI.TitlePanel("Mesh Rotate");
	container.add(title);
	var absoluteRotateDiv=new AbsoluteRotateDiv(ap);
	title.add(absoluteRotateDiv);
	
	function printPosition(){
		console.log("Bone Attach Controler Positions");
		console.log("Model Name",ap.modelFileName);
		console.log("Mesh Scale ",ap.skinnedMesh.scale);
		console.log("Bone 0 Scale ",BoneUtils.getBoneList(ap.skinnedMesh)[0].scale);
		AppUtils.printDeg(ap.skinnedMesh.rotation,"Mesh Rotation Degree");
		var containerList=ap.boneAttachControler.getContainerList();
		containerList.forEach(function(container){
			AppUtils.printVec(container.position,container.name);
		});
	}
	ap.signals.loadingModelFinished.add(function(){
		ap.boneAttachControler.setVisible(true);
		printPosition();
	},undefined,-100);
	
	ap.getSignal("objectRotated").add(function(x,y,z){
		var degs={x:x,y:y,z:z};
		var rads=AppUtils.degToRad(degs);
		ap.skinnedMesh.rotation.set(rads.x,rads.y,rads.z);
		printPosition();
	});
	
	container.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	
	container.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	container.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	container.add(new Sidebar.SimpleLight(ap));
	return container;
}
