var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Turn Arm"));
	
	
	
    var ikPanel=new Sidebar.IkLBasic(application);
    container.add(ikPanel);
	
    ikPanel.add(new Sidebar.IkSolve(ap));
	
	
	
	
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

	var selectedOnlyCheck=new UI.SwitchRow("Only Selected Bone","Any Bone",ap.ikControler.ikBoneSelectedOnly,function(v){
		ap.ikControler.ikBoneSelectedOnly=v;
	});
	boneIkEnabledPanel.add(selectedOnlyCheck);
	
	
	
	var lockBonePanel=new UI.TitlePanel("Lock Individual Bone Rotation");
	container.add(lockBonePanel);
	
	function getSelectedBoneName(index){
		return BoneUtils.getBoneList(ap.skinnedMesh)[index].name;
	}
	
	
	
	//TODO switch and color
	var lockedCheck=new UI.CheckboxRow("",false,function(v){
		var name=getSelectedBoneName();
		ap.ikControler.boneLocked[name]=v;
	});
	lockBonePanel.add(lockedCheck);
	
	var boneSelectionChanged=function(index){
		if(index==undefined){
			return;
		}
		var name=getSelectedBoneName(index);
		var value=ap.ikControler.boneLocked[name]!==undefined?ap.ikControler.boneLocked[name]:false;
		lockedCheck.checkbox.setValue(value);
		lockedCheck.text.setValue(name);
	};
	
	ap.signals.boneSelectionChanged.add(boneSelectionChanged);
	
	

	
	
	container.add(new Sidebar.IkReset(ap));
	
	container.add(new Sidebar.IkBoneList(ap));
	
	container.add(new Sidebar.TurnArm(ap));
	
	return container;
}
