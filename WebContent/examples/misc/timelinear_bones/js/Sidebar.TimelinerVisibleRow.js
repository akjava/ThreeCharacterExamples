Sidebar.TimelinerVisibleRow=function(ap){
	var visible=true;
	var bt=new UI.ButtonRow("TimeLiner Switch Show/Hide",function(){
		visible=!visible;
		ap.timeliner.setVisible(visible);
	});
	return bt;
}