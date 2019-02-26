var IkRatioRow=function(ap){
	var row=new UI.Row();
	
	
	var bone=null;
	var ratio=new UI.NumberButtons("Ratio",0,1,0.1,1,function(v){
		ap.ikControler.setBoneRatio(bone.name,v);
	},[0.01,0.1,0.5,1]);
	ratio.number.setWidth("40px");
	row.add(ratio);
	ratio.setDisabled(true);
	
	ap.getSignal("boneSelectionChanged").add(function(index){
		if(index==undefined){
			ratio.setDisabled(true);
			return;
		}
		bone=BoneUtils.getBoneList(ap.skinnedMesh)[index];
			
		var v=ap.ikControler.getBoneRatio(bone.name);
		ratio.setValue(v);
		ratio.setDisabled(false);
	});
	return row;
}