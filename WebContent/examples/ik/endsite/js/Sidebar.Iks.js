Sidebar.Iks=function(ap){
var scope=this;

var titlePanel=new UI.TitlePanel("Iks");

this.endSite=false;
var ikList=new UI.ListRow("Iks",[],function(v){
	scope.selectedIk=v;
	endsite.setValue(ap.ikControler.isEnableEndSiteByName(v));
});	
titlePanel.add(ikList);

var endsite=new UI.CheckboxRow("Enable EndSite",false,function(v){
	//update endsite;
	ap.ikControler.setEndSiteEnabled(ikList.getValue(),v);
	ap.signals.poseChanged.dispatch();//for reset ik position
});
titlePanel.add(endsite);

ap.signals.ikInitialized.add(function(){
	var keys=ap.ikControler.getIkNames();
	scope.selectedIk=keys[0];
	ikList.setList(keys);
	ikList.setValue(keys[0]);
	endsite.setValue(ap.ikControler.enableEndSite(keys[0]));
	
})

return titlePanel;
}