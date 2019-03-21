Sidebar.VrmSimpleBlendShape=function(ap){
	var container=new UI.TitlePanel("Simple BlendShape");
	
	var names=[""];
	names=names.concat(VrmUtils.blendShapeNames);
	var list=new UI.ListRow("name",names,function(v){
		
		update();
		
	});
	container.add(list);
	
	function update(){
		var key=list.getValue();
		var map={};
		map[key]=intensityBts.getValue();
		ap.getSignal("VrmBlendShapeChanged").dispatch(map);
	}
	
	var intensityBts=new UI.NumberButtons("Intensity",0,1,1,1,function(v){
		update();
	},[0.1,0.5,0.75,1]);
	intensityBts.text.setWidth("60px");
	intensityBts.number.setWidth("50px");
	
	container.add(intensityBts);
	
	return container;
}