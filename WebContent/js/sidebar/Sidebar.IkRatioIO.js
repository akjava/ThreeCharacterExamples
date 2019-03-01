Sidebar.IkRatioIO=function(ap){
	var titlePanel=new UI.TitlePanel("IkRatio Load & Export");

	
	
	var jsonList=new ListLoadJsonDiv("../../../dataset/mbl3d/ikratio/",
			["","lowerarm1.json","lowerarm2.json","clavicle1.json","clavicle2.json","upperarm.json","hand1.jspn","hand2.json"],function(json){
		
		if(json==null){
			ap.ikControler.clearBoneRatio();
		
		}else{
			ap.ikControler.setBoneRatioFromJson(json);
		}
		
		var index=ap.boneSelectedIndex;
		ap.getSignal("boneSelectionChanged").dispatch(index);
		
	});
	titlePanel.add(jsonList);
	
	
	var exportDiv=new ExportJsonDiv(ap,function(fileName){
		return ap.ikControler.getBoneRatioAsJson();
	});
	titlePanel.add(exportDiv);
	
	return titlePanel;
}