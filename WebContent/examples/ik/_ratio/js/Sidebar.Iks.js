Sidebar.Iks=function(ap){
var scope=this;
this.selectedIkName=null;

var titlePanel=new UI.TitlePanel("Iks");

this.endSite=false;
var ikList=new UI.ListRow("Iks",[],function(v){
	scope.selectedIk=v;
	endsite.setValue(ap.ikControler.isEnableEndSiteByName(v));
});	
titlePanel.add(ikList);

var endsite=new UI.CheckboxRow("Enable EndSite",false,function(v){
	//update endsite;
	ap.ikControler.setEndSiteEnabled(ikList.getValue(),v);
	ap.signals.poseChanged.dispatch();//for reset ik position
});
titlePanel.add(endsite);

function setSelection(name){
	scope.selectedIk=name;
	ikList.setValue(name);
	endsite.setValue(ap.ikControler.isEnableEndSiteByName(name));
	scope.selectedIkName=name;
	
	//button update
	var indices=ap.ikControler.iks[scope.selectedIkName];
	var boneList=ap.ikControler.getBoneList();
	var bone=boneList[indices[0]];//check first one only
	var opposite=getOppositedBone(bone);
	if(opposite!=null){
		buttons.button.setDisabled(false);
		swap.setDisabled(false);
	}else{
		buttons.button.setDisabled(true);
		swap.setDisabled(true);
	}
}

ap.signals.ikInitialized.add(function(){
	var keys=ap.ikControler.getIkNames();
	
	ikList.setList(keys);
	setSelection(keys[0]);
	
})

ap.signals.ikSelectionChanged.add(function(name){
	if(name==null){
		return;
	}
	setSelection(name);
});

function getOppositedBone(bone){
	var boneList=ap.ikControler.getBoneList();
	var oppositeName=BoneUtils.getOppositeLRName(bone.name);
	if(oppositeName==null){
		return;
	}
	var bone=BoneUtils.findBoneByEndsName(boneList,oppositeName);
	return bone;
}

var buttons=new UI.ButtonRow("Copy from Opposite",function(){
	var indices=ap.ikControler.iks[scope.selectedIkName];
	
	var boneList=ap.ikControler.getBoneList();
	indices.forEach(function(index){
		var bone=boneList[index];
		var opposite=getOppositedBone(bone);
		if(opposite!=null){
			var rot=opposite.rotation;
			bone.rotation.copy(BoneUtils.flipHorizontalRotation(opposite.rotation));
			
			if(ap.signals.boneRotationChanged)//Optional
				ap.signals.boneRotationChanged.dispatch(index);
		}
	});
	ap.signals.poseChanged.dispatch();
});
buttons.button.setDisabled(true);

var swap=new UI.Button("swap").onClick(function(){
	var indices=ap.ikControler.iks[scope.selectedIkName];
	
	var boneList=ap.ikControler.getBoneList();
	indices.forEach(function(index){
		var bone=boneList[index];
		var opposite=getOppositedBone(bone);
		if(opposite!=null){
			BoneUtils.swapHorizontalBone(bone,opposite);
			var oppositeIndex=boneList.indexOf(opposite);
			if(ap.signals.boneRotationChanged){//Optional
				ap.signals.boneRotationChanged.dispatch(index);
				ap.signals.boneRotationChanged.dispatch(oppositeIndex);
			}
				
		}
	});
	ap.signals.poseChanged.dispatch();
});
buttons.add(swap);
swap.setDisabled(true);

titlePanel.add(buttons);

return titlePanel;
}