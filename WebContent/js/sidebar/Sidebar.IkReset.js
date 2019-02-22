Sidebar.IkReset=function(ap){
	var resetPanel=new UI.TitlePanel("Reset Ik");
	var buttonRow=new UI.Row();
	resetPanel.add(buttonRow);
	var resetIks=new UI.Button("Reset Selected Ik");
	resetIks.onClick(function(){
		if(ap.ikControler.ikTarget!=null){
			var indices=ap.ikControler.getEffectedBoneIndices(ap.ikControler.getIkNameFromTarget(ap.ikControler.ikTarget));
			indices.forEach(function(index){
				BoneUtils.resetBone(ap.skinnedMesh,index);
				ap.getSignal("boneRotationChanged").dispatch(index);//selected ik not resetted
				ap.getSignal("boneRotationFinished").dispatch(index);
			});
			//manually reset
			ap.ikControler.resetAllIkTargets();
		}
	});
	buttonRow.add(resetIks);
	return resetPanel;
}