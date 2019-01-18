Sidebar.IkLBasic=function(ap){

	var ikPanel=new UI.TitlePanel("Ik Basic");

	var enabled=new UI.CheckboxRow("Enabled",true,function(v){
		var values=ap.ikControler.getIkTargetsValue();
		values.forEach(function(target){
			target.material.visible=v;
			var name=ap.ikControler.getIkNameFromTarget(target);
			var enableEndSite=ap.ikControler.isEnableEndSiteByName(name);
			if(enableEndSite){
				ap.ikControler.setEndSiteVisible(name,v);
			}
		});
	});
	ikPanel.add(enabled);
	
	var minAngle=new UI.NumberButtons("Min Angle",0.0001,1,0.001,IkUtils.minAngle,function(v){
		IkUtils.minAngle=THREE.Math.degToRad(v);
	},[0.001,0.01,0.1]);
	ikPanel.add(minAngle);
	minAngle.number.precision=5;
	minAngle.number.setValue(minAngle.number.getValue());
	minAngle.text.setWidth("70px");
	

	var maxAngle=new UI.NumberButtons("Max Angle",0.1,45,1,ap.ikControler.maxAngle,function(v){
		ap.ikControler.maxAngle=v;
	},[0.1,1,5]);
	ikPanel.add(maxAngle);
	maxAngle.text.setWidth("70px");
	var iteration=new UI.IntegerButtons("Iteration",1,100,1,ap.ikControler.iteration,function(v){
		ap.ikControler.iteration=v;
	},[25,50,100]);
	ikPanel.add(iteration);
	iteration.text.setWidth("70px");
	
	var followOtherIkTargets=new UI.CheckboxRow("Follow Other IkTargets",ap.ikControler.followOtherIkTargets,function(v){
		ap.ikControler.followOtherIkTargets=v;
	});
	ikPanel.add(followOtherIkTargets);
	return ikPanel;
}