var BoneSelectionPanel=function(application,onUpdate){
	var ap=application;
	var scope=this;
	
	this.mesh=null;
	this.selectedBoneName=null;
	
	var container=new UI.TitlePanel("Bone Selection");
	
	if(ap.signals.boneSelectionChanged==undefined){
		console.error("Need signals.boneSelectionChanged");
		return;
	}
	
	var boneSelectRow=new UI.Row();
	container.add(boneSelectRow);
	var boneSelect=new UI.Select2();
	boneSelectRow.add(boneSelect);
	
	function onBoneSelectionChanged(index){
		boneSelect.setValue(index);
		execBoneSelectionChanged(index);
	}
	
	function execBoneSelectionChanged(index){
		if(scope.mesh==null){
			console.error("BoneSelectionPanel: no mesh");
			return;
		}
		if(index==undefined){
			return;
		}
		var bone=BoneUtils.getBoneList(scope.mesh)[index];
		onUpdate(bone,index);
	}
	
	boneSelect.onChange(function(){
		var index=parseInt(boneSelect.getValue());
		execBoneSelectionChanged(index);
		ap.signals.boneSelectionChanged.remove(onBoneSelectionChanged);
		ap.signals.boneSelectionChanged.dispatch(index);
		ap.signals.boneSelectionChanged.add(onBoneSelectionChanged);
	});
	
	ap.signals.boneSelectionChanged.add(onBoneSelectionChanged);
	
	ap.signals.skinnedMeshChanged.add(function(mesh){
		scope.mesh=mesh;
	
		var options=BoneUtils.getBoneNameOptions(mesh);
		
		boneSelect.setOptions(options);
		var value=Object.values(options)[0];
		boneSelect.setValue(value);
		
		onBoneSelectionChanged(value);
	});
	
	return container;
}