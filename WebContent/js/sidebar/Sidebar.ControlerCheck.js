Sidebar.ControlerCheck=function(ap){
	var titlePanel=new UI.TitlePanel("Controler Check");
	
	function setValue(v){
		ik.setValue(v);
		ap.ikControler.setEnabled(v);
		rotate.setValue(v);
		ap.rotationControler.setEnabled(v);
		translate.setValue(v);
		ap.translateControler.setEnabled(v);
		
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
	var ik=new UI.CheckboxRow("Ik Enabled",true,function(v){
		ap.ikControler.setEnabled(v);
	});
	titlePanel.add(ik);
	var rotate=new UI.CheckboxRow("Rotate Enabled",true,function(v){
		ap.rotationControler.setEnabled(v);
	});
	titlePanel.add(rotate);
	
	var translate=new UI.CheckboxRow("Translate Enabled",true,function(v){
		ap.translateControler.setEnabled(v);
	});
	titlePanel.add(translate);
	
	var ammo=new UI.CheckboxRow("Ammo Visible",false,function(v){
		ap.ammoControler.setVisibleAll(v);
	});
	titlePanel.add(ammo);
	
	var breast=new UI.CheckboxRow("Breast Enabled",true,function(v){
		ap.breastControler.resetPosition();
		ap.ammoControler.update();
		ap.ammoControler.setEnabled(v);
		ap.breastControler.setEnabled(v);
		
	});
	titlePanel.add(breast);
	
	ap.signals.loadingModelFinished.add(function(){
		//TODO keep last value
		
		setValue(true);
		
	},undefined,-100);//later
	
	return titlePanel;
}