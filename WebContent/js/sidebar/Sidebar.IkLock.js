Sidebar.IkLock=function(ap){
	var container=new UI.TitlePanel("Ik Lock");
	
	var lockPanel=new UI.Subtitle("Lock Ik Axis");
	container.add(lockPanel);
	var lockRow=new UI.Row();
	container.add(lockRow);
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
	
	var scope=this;
	this.boneSelectedIndex=0;
	
	var boneIkEnabledPanel=new UI.Subtitle("Bone Ik Enabled Any or Selected");
	container.add(boneIkEnabledPanel);

	var selectedOnlyCheck=new UI.SwitchRow("Only Selected Bone","Any Bone",ap.ikControler.ikBoneSelectedOnly,function(v){
		ap.ikControler.ikBoneSelectedOnly=v;
	});
	container.add(selectedOnlyCheck);
	
	
	var lockBonePanel=new UI.Subtitle("Lock Individual Bone Rotation");
	container.add(lockBonePanel);
	
	function getSelectedBoneName(index){
		return BoneUtils.getBoneList(ap.skinnedMesh)[index].name;
	}
	
	
	
	//TODO switch and color
	var lockedCheck=new UI.CheckboxRow("",false,function(v){
		var name=getSelectedBoneName(scope.boneSelectedIndex);
		ap.ikControler.boneLocked[name]=v;
	});
	container.add(lockedCheck);
	
	var boneSelectionChanged=function(index){
		if(index==undefined){
			return;
		}
		
		scope.boneSelectedIndex=index;
		var name=getSelectedBoneName(index);

		var value=ap.ikControler.boneLocked[name]!==undefined?ap.ikControler.boneLocked[name]:false;
		lockedCheck.checkbox.setValue(value);
		lockedCheck.text.setValue(name);
	};
	
	ap.getSignal("boneSelectionChanged").add(boneSelectionChanged);
	
	return container;
}