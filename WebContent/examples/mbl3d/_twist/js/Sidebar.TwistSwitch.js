Sidebar.TwistSwitch=function(ap){
	var container=new UI.TitlePanel("Twist Switch");
	
	var row=new UI.Row();
	container.add(row);
	var bt=null;
	ap.signals.boneSelectionChanged.add(function(index){
		var bone=ap.selectedBone;
		
		var isTwist=Mbl3dUtils.isTwistBoneName(bone.name);
		var hasTwist=Mbl3dUtils.hasTwistBoneName(bone.name);
		
		var converted=Mbl3dUtils.convertToTwistBoneName(bone.name);
		var backed=Mbl3dUtils.convertToUnTwistBoneName(converted);
		
		//console.log(bone.name,isTwist,hasTwist,converted,backed);
		
		if(bt!=null){
			row.remove(bt);
		}
		
		if(isTwist){
			var newIndex=BoneUtils.findBoneIndexByEndsName(BoneUtils.getBoneList(ap.skinnedMesh),backed);
			bt=new UI.Button(backed);
			bt.onClick(function(){
				ap.signals.boneSelectionChanged.dispatch(newIndex);
			});
			row.add(bt);
		}else if(hasTwist){
			var newIndex=BoneUtils.findBoneIndexByEndsName(BoneUtils.getBoneList(ap.skinnedMesh),converted);
			bt=new UI.Button(converted);
			bt.onClick(function(){
				ap.signals.boneSelectionChanged.dispatch(newIndex);
			});
			row.add(bt);
		}else{
			bt=null;
		}
		
		
	});
	
	
	return container;
}