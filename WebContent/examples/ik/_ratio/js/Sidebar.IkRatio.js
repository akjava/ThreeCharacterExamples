Sidebar.IkRatio=function(ap){
	var panel=new BoneSelectionPanel(ap,function(bone,index){
		var v=ap.ikControler.getBoneRatio(bone.name);
		ratio.setValue(v);
	});
	panel.text.setTextContent("Ik Ratio");
	
	
	
	var ratio=new UI.NumberButtons("Ratio",0,1,0.1,1,function(v){
		ap.ikControler.setBoneRatio(bone.name,v);
	},[0.01,0.1,0.5,1]);
	panel.add(ratio);
	
	return panel;
}