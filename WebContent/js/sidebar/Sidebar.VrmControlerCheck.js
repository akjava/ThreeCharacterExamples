Sidebar.VrmControlerCheck=function(ap){
	var titlePanel=new UI.TitlePanel("Controler Check");
	
	function setValue(v){
		ik.setValue(v);
		if(ap.ikControler)
		ap.ikControler.setEnabled(v);
		ap.ikControlerVisible=v;
		
		rotate.setValue(v);
		if(ap.rotationControler)
			ap.rotationControler.setEnabled(v);
		ap.rotationControlerVisible=v;
		
		
		translate.setValue(v);
		if(ap.translateControler)
		ap.translateControler.setEnabled(v);
		ap.translateControlerVisible=v;
		
		console.log(ap.translateControlerVisible);
		
		if(!v){
			ap.signals.transformSelectionChanged.dispatch(null);
		}
		
		ap.getSignal("guideVisibleChanged").dispatch(v);
	}
	
	var buttonRow=new UI.ButtonRow("Hide",function(){
		setValue(false);
	});
	titlePanel.add(buttonRow);
	var show=new UI.Button("Show Most").onClick(function(){
		setValue(true);
	});
	buttonRow.add(show);
	
	
	//enable all / disable all
	if(ap.ikControlerVisible==undefined)
		ap.ikControlerVisible=true;
	var ik=new UI.CheckboxRow("Ik Enabled",ap.ikControlerVisible,function(v){
		ap.ikControler.setEnabled(v);
	});
	titlePanel.add(ik);
	
	if(ap.rotationControlerVisible==undefined)
		ap.rotationControlerVisible=true;
	var rotate=new UI.CheckboxRow("Rotate Enabled",ap.rotationControlerVisible,function(v){
		ap.rotationControlerVisible=v;
		ap.rotationControler.setEnabled(v);
	});
	titlePanel.add(rotate);
	
	if(ap.translateControlerVisible==undefined)
		ap.translateControlerVisible=true;
	var translate=new UI.CheckboxRow("Translate Enabled",ap.translateControlerVisible,function(v){
		ap.translateControlerVisible=v;
		ap.translateControler.setEnabled(v);
	});
	titlePanel.add(translate);
	
	if(ap.ammoVisible==undefined)
		ap.ammoVisible=false;
	
	var ammoRow=new UI.Row();
	titlePanel.add(ammoRow);
	var ammo=new UI.CheckboxSpan("Ammo Visible",ap.ammoVisible,function(v){
		ap.ammoVisible=v;
		ap.ammoControler.setVisibleAll(v);
	});
	ammo.text.setWidth("100px");
	ammoRow.add(ammo);
	
	var ammoDepthTest=new UI.CheckboxSpan("Transparent",false,function(v){
		ap.secondaryAnimationControler.setAmmoDepthTest(v);
	});
	ammoDepthTest.text.setWidth("80px");
	ammoRow.add(ammoDepthTest);
	
	
	return titlePanel;
}