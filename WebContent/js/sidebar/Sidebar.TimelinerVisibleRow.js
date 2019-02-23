Sidebar.TimelinerVisibleRow=function(ap){
	var visible=true;
	var resize=false;
	
	function update(){
		ap.timeliner.setVisible(visible);
		if(resize){
			if(visible){
				ap.core.setId("viewport2");
			}else{
				ap.core.setId("viewport");
			}
			ap.signals.windowResize.dispatch();
		}
	}
	
	var bt=new UI.ButtonRow("TimeLiner Switch Show/Hide",function(){
		visible=!visible;
		update();
	});
	
	
	var resizeCheck=new UI.CheckboxText("Resize",false,function(v){
		resize=v;
		update();
	});
	
	bt.add(resizeCheck);
	return bt;
}