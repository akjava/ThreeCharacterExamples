Sidebar.LoadPosePanel=function(ap,title,buttonTitle,onLoad,onReset,accepts){
	var container=new UI.TitlePanel(title);
	
	function clipToPose(clip){
		var root=ap.skinnedMesh;
		
		AnimeUtils.resetPose(root);
		AnimeUtils.resetMesh(root);
		
		
		if(clip!=null){
			AnimeUtils.clipToPose(clip,root);
		}
	}
	container.clipToPose=clipToPose;
	container.getClip=function(){
		return loadClipRow.clip;
	}
	onLoad=onLoad==undefined?clipToPose:onLoad;
	
	var loadClipRow=new LoadClipRow(onLoad,onReset,accepts);
	container.add(loadClipRow);
	
	
	var buttonRow=new UI.ButtonRow(buttonTitle,function(){
		var clip=loadClipRow.clip;
		clipToPose(clip);
	});
	container.add(buttonRow);
	return container;
}