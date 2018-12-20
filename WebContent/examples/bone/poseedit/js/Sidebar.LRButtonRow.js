Sidebar.LRButtonRow=function(ap){
	
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
			console.log(index);
			ap.signals.boneSelectionChanged.dispatch(index);
		}
		
	});
	buttonRow.button.setDisabled(true);
	
	var copyFrom=new UI.Button("Copy from").onClick(function(){
		
	});
	buttonRow.add(copyFrom);
	copyFrom.setDisabled(true);
	
	var swap=new UI.Button("Swap").onClick(function(){
		
	});
	buttonRow.add(swap);
	swap.setDisabled(true);
	
	ap.signals.boneSelectionChanged.add(function(index){
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