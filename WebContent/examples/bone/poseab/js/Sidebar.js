var Sidebar = function ( application ) {
	var ap=application;
	var scope=this;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Pose A-B Play"));
	//TODO support A-B-A A-B check
	this.poseA=null;
	this.poseB=null;
	
	this.initMesh=null;
	ap.signals.skinnedMeshChanged.add(function(mesh){
		scope.initMesh=AnimeUtils.cloneSkeletonStructure(mesh);
	});
	
	function updateClip(){
		
		
		var dummy=AnimeUtils.cloneSkeletonStructure(scope.initMesh);
		var boneList=BoneUtils.getBoneList(dummy);
		
		var indices=AnimeUtils.boneListToIndices(boneList);
		
		if(scope.poseA!=null){
			AnimeUtils.clipToPose(scope.poseA,dummy);
		}
		var startRotates=AnimeUtils.boneListToQuaternions(boneList);
		
		
		dummy=AnimeUtils.cloneSkeletonStructure(scope.initMesh);
		boneList=BoneUtils.getBoneList(dummy);
		if(scope.poseB!=null){
			AnimeUtils.clipToPose(scope.poseB,dummy);
		}
		var endRotates=AnimeUtils.boneListToQuaternions(boneList);
		var time=0.5;//TODO create Number
		
		var clip=AnimeUtils.makeRotateBoneAnimation(indices,startRotates,endRotates,time,time);
		ap.clip=clip;
	}
	
	var loadPoseA=new LoadPosePanel(ap,"Pose A","Previe this Pose",function(clip){
		scope.poseA=clip;
		if(clip!=null)
			AnimeUtils.clipToPose(clip,ap.skinnedMesh);
		else
			AnimeUtils.resetPose(ap.skinnedMesh);
		updateClip();
	});
	container.add(loadPoseA);
	var loadPoseA=new LoadPosePanel(ap,"Pose B","Previe this Pose",function(clip){
		scope.poseB=clip;
		if(clip!=null)
			AnimeUtils.clipToPose(clip,ap.skinnedMesh);
		else
			AnimeUtils.resetPose(ap.skinnedMesh);
		updateClip();
	});
	container.add(loadPoseA);
	
	var clipPlayerRow=new ClipPlayerRow(ap);
	container.add(clipPlayerRow);
	
	return container;
}
