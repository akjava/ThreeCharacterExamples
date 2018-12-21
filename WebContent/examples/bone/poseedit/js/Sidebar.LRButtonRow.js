Sidebar.LRButtonRow=function(ap){
	var scope=this;
	this.boneSelectedIndex=0;
	function getSelectedBone(index){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		
		return boneList[index];
	}
	function getOppositedBone(index){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var selectedBone=getSelectedBone(index);
		
		var oppositeName=BoneUtils.getOpositeLRName(selectedBone.name);
		if(oppositeName==null){
			return;
		}
		var bone=BoneUtils.findBoneByEndsName(boneList,oppositeName);
		return bone;
	}
	
	var buttonRow=new UI.ButtonRow("Swith",function(){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var bone=getOppositedBone(ap.ikControler.boneSelectedIndex);
		
		if(bone==null){
			return;
		}
		var index=boneList.indexOf(bone);
		if(index!=-1){
			ap.signals.boneSelectionChanged.dispatch(index);
		}
		
	});
	buttonRow.button.setDisabled(true);
	
	var copyFrom=new UI.Button("Copy from").onClick(function(){
		
		var index=scope.boneSelectedIndex;
		var bone=getSelectedBone(index);
		var opposite=getOppositedBone(index);
		var rot=opposite.rotation;
		bone.rotation.copy(BoneUtils.flipHorizontalRotation(opposite.rotation));
		ap.signals.boneRotationChanged.dispatch(index);
	});
	buttonRow.add(copyFrom);
	copyFrom.setDisabled(true);
	
	var swap=new UI.Button("Swap").onClick(function(){
		var index=scope.boneSelectedIndex;
		var bone=getSelectedBone(index);
		var opposite=getOppositedBone(index);
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var oppositeIndex=boneList.indexOf(opposite);
		
		BoneUtils.swapHorizontalBone(bone,opposite);
		
		ap.signals.boneRotationChanged.dispatch(index);
		ap.signals.boneRotationChanged.dispatch(oppositeIndex);
	});
	buttonRow.add(swap);
	swap.setDisabled(true);
	
	ap.signals.boneSelectionChanged.add(function(index){
		scope.boneSelectedIndex=index;
		var bone=getOppositedBone(index);
		if(bone!=null){
			//buttonRow.button.setTextContent("Switch:"+oppositeName); //possible long
			buttonRow.button.setDisabled(false);
			copyFrom.setDisabled(false);
			swap.setDisabled(false);
		}else{
			buttonRow.button.setDisabled(true);
			copyFrom.setDisabled(true);
			swap.setDisabled(true);
		}
	});
	
	return buttonRow;
}