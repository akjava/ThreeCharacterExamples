var LoadPosePanel=function(ap,title,buttonTitle,onLoad,onReset,accepts){
	var loadClipPanel=new LoadClipPanel(title,onLoad,onReset,accepts);
	var buttonRow=new UI.ButtonRow(buttonTitle,function(){

		var mixer=ap.mixer;
		var clip=loadClipPanel.clip;
		
		
		
		var mixer=ap.mixer;
		var clip=loadClipPanel.clip;
		if(mixer==undefined){
			console.error("ap.mixer is undefined");
			return;
		}
		mixer.stopAllAction();
		
		var root=mixer.getRoot();
		//TODO check is SkinnedMesh
		AnimeUtils.resetPose(root);
		AnimeUtils.resetMesh(root);
		
		
		if(clip!=null){
			AnimeUtils.clipToPose(clip,root);
		}
		
	});
	loadClipPanel.add(buttonRow);
	return loadClipPanel;
}