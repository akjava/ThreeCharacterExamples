var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Ik EndSite"));
	

	
	
    var ikPanel=new Sidebar.IkLBasic(application);
    container.add(ikPanel);
	
	var solveIkRow=new UI.ButtonRow("Solve Selected Ik",function(){
		ap.signals.solveIkCalled.dispatch();
	});
	ikPanel.add(solveIkRow);

	var resetAndSolve=new UI.Button("Reset & Solve x5");
	resetAndSolve.onClick(function(){
		if(ap.ikControler.ikTarget!=null){
			ap.ikControler.ikIndices.forEach(function(index){
				BoneUtils.resetBone(ap.skinnedMesh,index);
			});
		}
		ap.boneAttachControler.update();
		
		ap.signals.solveIkCalled.dispatch();
		ap.signals.solveIkCalled.dispatch();
		ap.signals.solveIkCalled.dispatch();
		ap.signals.solveIkCalled.dispatch();
		ap.signals.solveIkCalled.dispatch();
	});
	
	solveIkRow.add(resetAndSolve);
	
	
	
	
	
	

	
	
	var resetPanel=new UI.TitlePanel("Reset Pose");
	container.add(resetPanel);
	
	var buttonRow=new UI.ButtonRow("Reset All",function(){
		AnimeUtils.resetPose(ap.skinnedMesh);
		ap.signals.poseChanged.dispatch();
	});
	resetPanel.add(buttonRow);
	var resetSelection=new UI.Button("Reset Selection");
	resetSelection.onClick(function(){
		BoneUtils.resetBone(ap.skinnedMesh,ap.boneSelectedIndex);
	});
	buttonRow.add(resetSelection);
	
	var resetIks=new UI.Button("Reset Iks");
	resetIks.onClick(function(){
		if(ap.ikControler.ikTarget!=null){
			ap.ikControler.ikIndices.forEach(function(index){
				BoneUtils.resetBone(ap.skinnedMesh,index);
			});
		}
		
	});
	buttonRow.add(resetIks);
	

	var iks=new Sidebar.Iks(ap);
	container.add(iks);
	
	return container;
}
