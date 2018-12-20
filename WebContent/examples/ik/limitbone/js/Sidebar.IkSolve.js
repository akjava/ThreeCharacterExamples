Sidebar.IkSolve=function(ap){
	var solveIkRow=new UI.ButtonRow("Solve Selected Ik",function(){
		ap.signals.solveIkCalled.dispatch();
	});
	

	var resetAndSolve=new UI.Button("Reset & Solve x5");
	resetAndSolve.onClick(function(){
		if(ap.ikControler.ikTarget!=null){
			ap.ikControler.ikIndices.forEach(function(index){
				BoneUtils.resetBone(ap.skinnedMesh,index);
			});
		}
		ap.ikControler.boneAttachControler.update();
		
		ap.signals.solveIkCalled.dispatch();
		ap.signals.solveIkCalled.dispatch();
		ap.signals.solveIkCalled.dispatch();
		ap.signals.solveIkCalled.dispatch();
		ap.signals.solveIkCalled.dispatch();
	});
	
	solveIkRow.add(resetAndSolve);
	return solveIkRow;
}