var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Limit Ik Bone"));
	
	var ikLimitIO=new Sidebar.IkLimitIO(application);
	container.add(ikLimitIO);
	
	
	var ikPanel=new UI.TitlePanel("Ik");
	container.add(ikPanel);
	
	var minAngle=new UI.NumberButtons("Min Angle",0.0001,1,0.001,IkUtils.minAngle,function(v){
		IkUtils.minAngle=THREE.Math.degToRad(v);
	},[0.001,0.01,0.1]);
	ikPanel.add(minAngle);
	minAngle.number.precision=5;
	minAngle.number.setValue(minAngle.number.getValue());
	minAngle.text.setWidth("70px");
	
	var maxAngle=new UI.NumberButtons("Max Angle",0.1,45,1,ap.maxAngle,function(v){
		ap.maxAngle=v;
	},[0.1,1,5]);
	ikPanel.add(maxAngle);
	maxAngle.text.setWidth("70px");
	var iteration=new UI.IntegerButtons("Iteration",1,100,1,ap.iteration,function(v){
		ap.iteration=v;
	},[25,50,100]);
	ikPanel.add(iteration);
	iteration.text.setWidth("70px");
	
	var solveIkRow=new UI.ButtonRow("Solve Selected Ik",function(){
		ap.signals.solveIkCalled.dispatch();
	});
	ikPanel.add(solveIkRow);

	var resetAndSolve=new UI.Button("Reset & Solve Selected x5");
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
	
	
	
	
	var lockPanel=new UI.TitlePanel("Lock Ik All Bone Rotation");
	container.add(lockPanel);
	var lockRow=new UI.Row();
	lockPanel.add(lockRow);
	var ikLockX=new UI.CheckboxText("X",ap.ikControler.ikLockX,function(v){
		ap.ikControler.ikLockX=v;
	});
	lockRow.add(ikLockX);
	var ikLockY=new UI.CheckboxText("Y",ap.ikControler.ikLockY,function(v){
		ap.ikControler.ikLockY=v;
	});
	lockRow.add(ikLockY);
	var ikLockZ=new UI.CheckboxText("Z",ap.ikControler.ikLockZ,function(v){
		ap.ikControler.ikLockZ=v;
	});
	lockRow.add(ikLockZ);
	
	
	var boneIkEnabledPanel=new UI.TitlePanel("Bone Ik Enabled Any or Selected");
	container.add(boneIkEnabledPanel);

	var selectedOnlyCheck=new UI.SwitchRow("Only Selected Bone","Any Bone",ap.ikBoneSelectedOnly,function(v){
		ap.ikBoneSelectedOnly=v;
	});
	boneIkEnabledPanel.add(selectedOnlyCheck);
	
	
	
	var lockBonePanel=new UI.TitlePanel("Lock Individual Bone Rotation");
	container.add(lockBonePanel);
	
	function getSelectedBoneName(){
		return BoneUtils.getBoneList(ap.skinnedMesh)[ap.boneSelectedIndex].name;
	}
	
	
	
	//TODO switch and color
	var lockedCheck=new UI.CheckboxRow("",false,function(v){
		var name=getSelectedBoneName();
		ap.boneLocked[name]=v;
	});
	lockBonePanel.add(lockedCheck);
	
	var boneSelectionChanged=function(){
		var name=getSelectedBoneName();
		var value=ap.boneLocked[name]!==undefined?ap.boneLocked[name]:false;
		lockedCheck.checkbox.setValue(value);
		lockedCheck.text.setValue(name);
	};
	
	ap.signals.boneSelectionChanged.add(boneSelectionChanged);
	
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
		if(ap.ikControler.ikTarget!=null){
			ap.ikControler.ikIndices.forEach(function(index){
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
			ap.ikControler.ikIndices.forEach(function(index){
				
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
	
	var ikLimitList=new Sidebar.IkLimitList(application);
	container.add(ikLimitList);
	
	return container;
}
