var IkBoneLimitInfoDiv=function(ap){
	var div=new UI.Div();
	
	var minRow=new UI.Row();
	div.add(minRow);
	
	minRow.add(new UI.Text("Min:").setWidth("30px"));
	minRow.add(new UI.Text("x").setWidth("9px"));
	var mix=new UI.Text("").setWidth("30px");
	minRow.add(mix);
	minRow.add(new UI.Text("y").setWidth("9px"));
	var miy=new UI.Text("").setWidth("30px");
	minRow.add(miy);
	minRow.add(new UI.Text("z").setWidth("9px"));
	var miz=new UI.Text("").setWidth("30px");
	minRow.add(miz);
	
	minRow.add(new UI.Text("Max:").setWidth("30px"));
	minRow.add(new UI.Text("x").setWidth("9px"));
	var mxx=new UI.Text("").setWidth("26px");
	minRow.add(mxx);
	minRow.add(new UI.Text("y").setWidth("9px"));
	var mxy=new UI.Text("").setWidth("26px");
	minRow.add(mxy);
	minRow.add(new UI.Text("z").setWidth("9px"));
	var mxz=new UI.Text("").setWidth("26px");
	minRow.add(mxz);
	
	ap.getSignal("boneSelectionChanged").add(function(index){
		if(index==undefined||index<0){
			mix.setValue("");
			miy.setValue("");
			miz.setValue("");
		}
		var ikmin=ap.ikControler.ikLimitMin;
		var ikmax=ap.ikControler.ikLimitMax;
		
		var name=BoneUtils.getBoneList(ap.skinnedMesh)[index].name;
		
		var min=ikmin[name];
		var max=ikmax[name];
		
		min=min==undefined?{x:-180,y:-180,z:-180}:min;
		max=max==undefined?{x:180,y:180,z:180}:max;
		
		mix.setValue(min.x);
		miy.setValue(min.y);
		miz.setValue(min.z);
		
		mxx.setValue(max.x);
		mxy.setValue(max.y);
		mxz.setValue(max.z);
	});
	
	
	
	return div;
}