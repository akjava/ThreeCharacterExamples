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
	
	return titlePanel;
}