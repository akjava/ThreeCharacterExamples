var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Limit Ik Bone"));
	
	var ikLimitIO=new Sidebar.IkLimitIO(application);
	container.add(ikLimitIO);
	
	
	var ikPanel=new UI.TitlePanel("Ik");
	container.add(ikPanel);
	
	var maxAngle=new UI.NumberButtons("Max Angle",0.1,45,1,ap.maxAngle,function(v){
		ap.maxAngle=v;
	},[0.1,1,5]);
	ikPanel.add(maxAngle);
	var iteration=new UI.IntegerButtons("Iteration",1,100,1,ap.iteration,function(v){
		ap.iteration=v;
	},[5,10,50]);
	ikPanel.add(iteration);
	
	var solveIkRow=new UI.ButtonRow("Solve Selected Ik",function(){
		ap.signals.solveIkCalled.dispatch();
	});
	ikPanel.add(solveIkRow);
	
	var lockPanel=new UI.TitlePanel("Lock Ik Rotation");
	container.add(lockPanel);
	var lockRow=new UI.Row();
	lockPanel.add(lockRow);
	var ikLockX=new UI.CheckboxText("X",ap.ikLockX,function(v){
		ap.ikLockX=v;
	});
	lockRow.add(ikLockX);
	var ikLockY=new UI.CheckboxText("Y",ap.ikLockY,function(v){
		ap.ikLockY=v;
	});
	lockRow.add(ikLockY);
	var ikLockZ=new UI.CheckboxText("Z",ap.ikLockZ,function(v){
		ap.ikLockZ=v;
	});
	lockRow.add(ikLockZ);
	
	var limitPanel=new BoneLimitPanel(application);
	container.add(limitPanel);
	
	ap.ikLimitMin=limitPanel.minRotation;
	ap.ikLimitMax=limitPanel.maxRotation;
	
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
		if(ap.ikTarget!=null){
			ap.ikIndices.forEach(function(index){
				BoneUtils.resetBone(ap.skinnedMesh,index);
			});
		}
		
	});
	buttonRow.add(resetIks);
	
	ap.signals.transformSelectionChanged.add(function(target){
	
		boneListButtons.forEach(function(button){
			boneListRow.remove(button);
		});
		boneListButtons=[];
		
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		if(target!=null){
			ap.ikIndices.forEach(function(index){
				var name=boneList[index].name;
				var bt=new UI.Button(name);
				bt.onClick(function(){
					ap.signals.boneSelectionChanged.dispatch(index);
				});
				boneListRow.add(bt);
				boneListButtons.push(bt);
			});
		}
	
	});
	var boneListButtons=[];
	var ikBoneList=new UI.TitlePanel("Ik Bone List");
	container.add(ikBoneList);
	var boneListRow=new UI.Row();
	ikBoneList.add(boneListRow);
	
	
	return container;
}
