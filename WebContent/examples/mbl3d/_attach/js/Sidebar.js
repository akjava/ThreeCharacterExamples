var Sidebar = function ( application ) {
	var ap=application;
	
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Attach Item(Not Completed)"));
	
	var animePanel=new BoneRotateAnimationPanel(application,{duration:3});
	container.add(animePanel);
	
	function makePoseByEndsName(boneList,name,x,y,z,object){
		var index=String(BoneUtils.findBoneIndexByEndsName(boneList,name));
		
		object[index]=BoneUtils.makeQuaternionFromXYZDegree(x,y,z);
		return object;
	}
	
	ap.signals.boneAnimationStarted.add(function(){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		//hand pose
		var object={};
		//gpp
		
		//makePoseByEndsName(boneList,"thumb01_L",15,-20,0,object);
		/*
		makePoseByEndsName(boneList,"thumb03_R",45,0,0,object);
		makePoseByEndsName(boneList,"thumb02_R",45,0,0,object);*/
		
		var clip=AnimeUtils.makeRotationPose(object);
		
		AnimeUtils.startClip(ap.mixer,clip);
	});
	
	
	
	
	//ui
	var boneEditor=new BoneEditPanel(application);
	container.add(boneEditor);
	
	
	
	
	
	ap.signals.boneAnimationFinished.add(function(){
		boneEditor.applyAllRotation();
	});
	
	ap.signals.boneAnimationStarted.add(function(){
		boneEditor.applyAllRotation();
	});
	
	

	
	return container;
}
