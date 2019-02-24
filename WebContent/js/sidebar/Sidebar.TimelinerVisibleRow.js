Sidebar.TimelinerVisibleRow=function(ap){
	var visible=true;
	var resize=true;
	
	
	ap.getSignal("timelinerVisible").add(function(v,r){
		visible=v;
		resize=r;
		update();
	})
	
	
	
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
	
	
	var resizeCheck=new UI.CheckboxText("Resize",resize,function(v){
		resize=v;
		update();
	});
	
	bt.add(resizeCheck);
	

	
	
	
	return bt;
}