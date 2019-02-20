Sidebar.ControlerCheck=function(ap){
	var titlePanel=new UI.TitlePanel("Controler Check");
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
	
	var tmp=new UI.ButtonRow("test",function(){
		ap.breastControler.newBreast();
	});
	titlePanel.add(tmp);
	
	return titlePanel;
}