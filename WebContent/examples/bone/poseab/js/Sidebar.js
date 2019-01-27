var Sidebar = function ( application ) {
	var ap=application;
	var scope=this;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Pose A-B Play"));
	//TODO support A-B-A A-B check
	this.poseA=null;
	this.poseB=null;
	//this.interpolate=THREE.InterpolateLinear;quaternion not support this
	this.initMesh=null;
	this.time=0.5;
	this.abaAnimation=true;
	this.meshAnimation=true;
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
		var startPositions=[boneList[0].position];
		
		
		var dummy2=AnimeUtils.cloneSkeletonStructure(scope.initMesh);
		boneList=BoneUtils.getBoneList(dummy2);
		if(scope.poseB!=null){
			AnimeUtils.clipToPose(scope.poseB,dummy2);
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
		ap.clipPlayerRow.setDuration(clip.duration);
	}
	
	var loadPoseA=new LoadPosePanel(ap,"Pose A","Preview this Pose",function(clip){
		ap.clipPlayerRow.stop();
		scope.poseA=clip;
		if(clip!=null)
			AnimeUtils.clipToPose(clip,ap.skinnedMesh);
		else{
			AnimeUtils.resetPose(ap.skinnedMesh);
			AnimeUtils.resetMesh(ap.skinnedMesh);
		}
			
		updateClip();
	});
	container.add(loadPoseA);
	var loadPoseA=new LoadPosePanel(ap,"Pose B","Preview this Pose",function(clip){
		ap.clipPlayerRow.stop();
		scope.poseB=clip;
		if(clip!=null)
			AnimeUtils.clipToPose(clip,ap.skinnedMesh);
		else{
			AnimeUtils.resetPose(ap.skinnedMesh);
			AnimeUtils.resetMesh(ap.skinnedMesh);
		}
			
		updateClip();
	});
	container.add(loadPoseA);
	
	var options={InterpolateLinear:THREE.InterpolateLinear,InterpolateSmooth:THREE.InterpolateSmooth,InterpolateDiscrete:THREE.InterpolateDiscrete};
	
	var animationOptions=new UI.TitlePanel("Animation Options");
	container.add(animationOptions);
	
	//quaternion not supported
	var interpolate=new UI.Select2Row("interpolate",options,function(v){scope.interpolate=v;updateClip();},THREE.InterpolateLinear);
	//animationOptions.add(interpolate);
	
	var timeRow=new UI.NumberButtons("time",0.01,10,1,scope.time,function(v){scope.time=v;updateClip();},[0.1,0.5,1,5]);
	animationOptions.add(timeRow);
	
	var meshCheck=new UI.CheckboxRow("Mesh Animation",scope.meshAnimation,function(v){scope.meshAnimation=v;updateClip();});
	animationOptions.add(meshCheck);
	
	var abaCheck=new UI.CheckboxRow("A-B-A Animation",scope.abaAnimation,function(v){scope.abaAnimation=v;updateClip();});
	animationOptions.add(abaCheck);
	
	var clipPlayerRow=new ClipPlayerRow(ap);
	container.add(clipPlayerRow);
	ap.clipPlayerRow=clipPlayerRow;
	
	
	return container;
}
