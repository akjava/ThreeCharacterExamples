Sidebar.IkControl=function(ap){
var scope=this;
this.selectedIkName=null;

var titlePanel=new UI.TitlePanel("Ik Control");

this.endSite=false;
var ikList=new UI.ListRow("Iks",[],function(v){
	scope.selectedIk=v;
	endsite.setValue(ap.ikControler.isEnableEndSiteByName(v));
	setSelection(v);
	ap.signals.ikSelectionChanged.remove(onIkSelectionChanged);
	ap.signals.ikSelectionChanged.dispatch(v);
	ap.signals.ikSelectionChanged.add(onIkSelectionChanged);
});	
titlePanel.add(ikList);

var endsite=new UI.CheckboxRow("Enable EndSite",false,function(v){
	//update endsite;
	ap.ikControler.setEndSiteEnabled(ikList.getValue(),v);

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

ap.getSignal("loadingModelFinished").add(function(){
	var keys=ap.ikControler.getIkNames();
	
	ikList.setList(keys);
	setSelection(keys[0]);
	
},undefined,-100);



var onIkSelectionChanged=function(name){
	if(name==null){
		return;
	}
	setSelection(name);
};
ap.getSignal("ikSelectionChanged").add(onIkSelectionChanged);

function getOppositedBone(bone){
	var boneList=ap.ikControler.getBoneList();
	var oppositeName=BoneUtils.getOpositeLRName(bone.name);
	if(oppositeName==null){
		return;
	}
	var bone=BoneUtils.findBoneByEndsName(boneList,oppositeName);
	return bone;
}

var buttons=new UI.ButtonRow("Copy from Opposite",function(){
	var indices=ap.ikControler.getEffectedBoneIndices(scope.selectedIkName);
	
	var boneList=ap.ikControler.getBoneList();
	indices.forEach(function(index){
		var bone=boneList[index];
		var opposite=getOppositedBone(bone);
		if(opposite!=null){
			var rot=opposite.rotation;
			bone.rotation.copy(BoneUtils.flipHorizontalRotation(opposite.rotation));
			
			if(ap.signals.boneRotationChanged)//Optional
				
				ap.signals.boneRotationChanged.dispatch(index);
			if(ap.ikControler.logging){
				console.log("Sidebar.IkControl dispatch boneRotationChanged",index);
			}
		}
	});
	ap.ikControler.resetAllIkTargets();
});
buttons.button.setDisabled(true);

var swap=new UI.Button("swap").onClick(function(){
	var indices=ap.ikControler.getEffectedBoneIndices(scope.selectedIkName);
	
	var boneList=ap.ikControler.getBoneList();
	indices.forEach(function(index){
		var bone=boneList[index];
		var opposite=getOppositedBone(bone);
		if(opposite!=null){
			BoneUtils.swapHorizontalBone(bone,opposite);
			var oppositeIndex=boneList.indexOf(opposite);
			ap.getSignal("boneRotationChanged").dispatch(index);
			if(ap.ikControler.logging){
				console.log("Sidebar.IkControl dispatch boneRotationChanged",index);
			}
			ap.signals.boneRotationChanged.dispatch(oppositeIndex);
			if(ap.ikControler.logging){
				console.log("Sidebar.IkControl dispatch boneRotationChanged",oppositeIndex);
			}
			ap.getSignal("boneRotationFinished").dispatch(index);
			if(ap.ikControler.logging){
				console.log("Sidebar.IkControl dispatch boneRotationFinished",index);
			}
			ap.signals.boneRotationFinished.dispatch(oppositeIndex);
			if(ap.ikControler.logging){
				console.log("Sidebar.IkControl dispatch boneRotationFinished",oppositeIndex);
			}
		}
		
		ap.ikControler.resetAllIkTargets();
	});
});
buttons.add(swap);
swap.setDisabled(true);

var flip=new UI.Button("Flip-Horizontal").onClick(function(){
	var indices=ap.ikControler.getEffectedBoneIndices(scope.selectedIkName);
	
	var boneList=ap.ikControler.getBoneList();
	indices.forEach(function(index){
		var bone=boneList[index];
		bone.rotation.y*=-1;
		bone.rotation.z*=-1;
		ap.getSignal("boneRotationChanged").dispatch(index);
		if(ap.ikControler.logging){
			console.log("Sidebar.IkControl dispatch boneRotationChanged",index);
		}
		ap.getSignal("boneRotationFinished").dispatch(index);
		if(ap.ikControler.logging){
			console.log("Sidebar.IkControl dispatch boneRotationFinished",index);
		}
	});
	
	ap.ikControler.resetAllIkTargets();
});
buttons.add(flip);

titlePanel.add(buttons);

return titlePanel;
}