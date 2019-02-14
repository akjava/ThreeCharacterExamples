Sidebar.ControlerCheck=function(ap){
	var titlePanel=new UI.TitlePanel("Controler Check");
	//enable all / disable all
	var ik=new UI.CheckboxRow("Ik Enabled",true,function(v){
		ap.ikControler.setEnabled(v);
	});
	titlePanel.add(ik);
	return titlePanel;
}