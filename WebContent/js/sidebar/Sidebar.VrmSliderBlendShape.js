Sidebar.VrmSliderBlendShape=function(ap){
	var container=new UI.TitlePanel("Slider BlendShape");
	
	var names=[];
	names=names.concat(VrmUtils.blendShapeNames);
	
	
	function update(){
		ap.getSignal("VrmBlendShapeChanged").remove(onChanged);
		ap.getSignal("VrmBlendShapeChanged").dispatch(values);
		ap.getSignal("VrmBlendShapeChanged").add(onChanged);
	}
	
	var values={};
	var checks={};
	
	var onChanged=function(vs){
		Object.values(checks).forEach(function(check){
			check.setValue(0);
		});
		
		Object.keys(vs).forEach(function(key){
			var check=checks[key];
			if(check){
				check.setValue(vs[key]);
			}
		});
		
		names.forEach(function(name){
			values[name]=vs[name]?vs[name]:0;
		});
	}
	
	ap.getSignal("VrmBlendShapeChanged").add(onChanged);
	
	
	names.forEach(function(name){
		var intensityBts=new UI.NumberButtons(name,0,1,1,0,function(v){
			values[name]=v;
			update();
		},[0,0.5,0.75,1]);
		checks[name]=intensityBts;
		
		intensityBts.text.setWidth("65px");
		intensityBts.number.setWidth("50px");
		
		container.add(intensityBts);
	});
	
	
	return container;
}