var Sidebar = function ( application ) {
	var ap=application;
	var scope=this;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Pose A-B Play"));
	
	var tab=new UI.Tab();
	container.add(tab);
	
	this.time=5;
	this.abaAnimation=true;
	this.meshAnimation=true;
	this.initBone=null;
	
	ap.signals.loadingModelFinished.add(function(mesh){
		scope.initBone=AnimeUtils.cloneSkeletonStructure(mesh);
	});
	
	function updateABClip(){
		var clipA=poseA.getClip();
		var clipB=poseB.getClip();
		var mesh=scope.initBone;//
		
		var dummy=AnimeUtils.cloneSkeletonStructure(mesh);
		var boneList=BoneUtils.getBoneList(dummy);
		
		var indices=AnimeUtils.boneListToIndices(boneList);
		
		if(clipA!=null){
			AnimeUtils.clipToPose(clipA,dummy);
		}
		var startRotates=AnimeUtils.boneListToQuaternions(boneList);
		var startPositions=[boneList[0].position];
		
		
		var dummy2=AnimeUtils.cloneSkeletonStructure(mesh);
		boneList=BoneUtils.getBoneList(dummy2);
		if(clipB!=null){
			AnimeUtils.clipToPose(clipB,dummy2);
		}
		var endRotates=AnimeUtils.boneListToQuaternions(boneList);
		var endPositions=[boneList[0].position];
		
		var clip1=AnimeUtils.makeRotateBoneAnimation(indices,startRotates,endRotates,scope.time,scope.time,scope.abaAnimation);
		var clip2=AnimeUtils.makeTranslateBoneAnimation([0],startPositions,endPositions,scope.time,scope.time,scope.abaAnimation);
		
		
		
		var clip;
		if(scope.meshAnimation){
			var clip3=AnimeUtils.makeMeshTransformAnimation(dummy,dummy2,scope.time,scope.time,scope.abaAnimation);
			clip=AnimeUtils.concatClips([clip1,clip2,clip3],"PoseClip");
		}else{
			clip=AnimeUtils.concatClips([clip1,clip2],"PoseClip");
		}
		
		/*clip.tracks.forEach(function(track){
			track.setInterpolation(scope.interpolate);
		});*/
		
		ap.clip=clip;
	}
	
	function onClipUpload(clip){
		poseA.clipToPose(clip);
		updateABClip();
	}
	
	var main=tab.addItem("Main");
	var poseA=new Sidebar.LoadPosePanel(ap,"PoseA","Preview this pose",onClipUpload);
	var poseB=new Sidebar.LoadPosePanel(ap,"PoseB","Preview this pose",onClipUpload);
	
	
	
	main.add(poseA);//TODO onload
	main.add(poseB);//TODO onload
	
	var ab=new UI.TitlePanel("A-B Animation");
	main.add(ab);
	var timeRow=new UI.NumberButtons("time",0.01,10,1,scope.time,function(v){scope.time=v;updateABClip();},[0.1,0.5,1,5]);
	ab.add(timeRow);
	var player=new ClipPlayerRow(ap);
	ab.add(player);
	
	var sub1=tab.addItem("Sub1");
	sub1.add(new Sidebar.Model(ap));
	sub1.add(new Sidebar.TextureMaps(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.materialChangedForTextureMaps(ap);
	
	var sub=tab.addItem("Sub2");
	sub.add(new Sidebar.CameraControler(ap));
	sub.add(new Sidebar.Hair(ap));
	sub.add(new Sidebar.ShadowLight(ap));
	sub.add(new Sidebar.MaterialType(ap));
	sub.add(new Sidebar.OutlineEffect(ap));
	Logics.loadingHairFinished(ap);
	
	//tab.select("Sub");
	
	return container;
}
