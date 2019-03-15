var AbsoluteRotateDiv=function(ap){

	var panel=new UI.Div();


	function rotate(){
		ap.getSignal("objectRotated").dispatch(angleX.getValue(),angleY.getValue(),angleZ.getValue(),panel);
	}
	
	ap.getSignal("objectRotated").add(function(x,y,z){
		
		angleX.setValue(x);
		angleY.setValue(y);
		angleZ.setValue(z);
	});
	
	ap.getSignal("loadingModelFinished").add(function(){
		//rotate(),some how not stable
		angleX.setValue(0);
		angleY.setValue(0);
		angleZ.setValue(0);
	},undefined,-100);
	
	
	var row=new UI.Row();
	panel.add(row);
	
	


		var angleX=new UI.NumberButtons("X",-180,180,10,0,function(v){
			rotate();
		},[-90,-45,0,45,90,180]);
		angleX.text.setWidth("15px");
		angleX.number.setWidth("45px");
		panel.add(angleX);
		
		panel.getAngleX=function(){
			return angleX.getValue();
		}
		panel.setAngleX=function(v){
			angleX.number.setValue(v);
		}
		
		
		
		var angleY=new UI.NumberButtons("Y",-180,180,10,0,function(v){
			rotate();
		},[-90,-45,0,45,90,180]);
		
		angleY.text.setWidth("15px");
		angleY.number.setWidth("45px");
		panel.add(angleY);
		panel.getAngleY=function(){
			return angleY.getValue();
		}
		panel.setAngleY=function(v){
			angleY.number.setValue(v);
		}
		
		
		
		var angleZ=new UI.NumberButtons("Z",-180,180,10,0,function(v){
			rotate();
		},[-90,-45,0,45,90,180]);
		angleZ.text.setWidth("15px");
		angleZ.number.setWidth("45px");
		panel.add(angleZ);
		panel.getAngleZ=function(){
			return angleZ.getValue();
		}
		panel.setAngleZ=function(v){
			angleZ.number.setValue(v);
		}
		
		return panel;
}