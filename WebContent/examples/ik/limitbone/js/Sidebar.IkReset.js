Sidebar.IkReset=function(ap){
	var resetPanel=new UI.TitlePanel("Reset Pose");
	
	
	var buttonRow=new UI.ButtonRow("Reset All",function(){
		AnimeUtils.resetPose(ap.skinnedMesh);
		ap.signals.poseChanged.dispatch();
	});
	resetPanel.add(buttonRow);
	var resetSelection=new UI.Button("Reset Selection");
	resetSelection.onClick(function(){
		var index=ap.ikControler.boneSelectedIndex;
		BoneUtils.resetBone(ap.skinnedMesh,index);
		ap.signals.boneRotationChanged.dispatch(index);
	});
	buttonRow.add(resetSelection);
	
	var resetIks=new UI.Button("Reset Iks");
	resetIks.onClick(function(){
		if(ap.ikControler.ikTarget!=null){
			ap.ikControler.ikIndices.forEach(function(index){
				BoneUtils.resetBone(ap.skinnedMesh,index);
			});
		}
		ap.signals.poseChanged.dispatch();
	});
	buttonRow.add(resetIks);
	return resetPanel;
}