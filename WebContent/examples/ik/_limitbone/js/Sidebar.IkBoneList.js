Sidebar.IkBoneList=function(ap){
	ap.signals.transformSelectionChanged.add(function(target){
		
		boneListButtons.forEach(function(button){
			boneListRow.remove(button);
		});
		boneListButtons=[];

		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		if(target!=null){
			if(ap.ikControler.ikTarget==null){
				//console.log("invalidly call sidebar first");//other type selected
				return;
			}
			
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
	
	},undefined,0);
	var boneListButtons=[];
	var ikBoneList=new UI.TitlePanel("Ik Bone List");

	var boneListRow=new UI.Row();
	ikBoneList.add(boneListRow);
	return ikBoneList;
}