Sidebar.Ik=function(ap){
	var ikPanel=new UI.TitlePanel("Ik");
	
	var maxAngle=new UI.NumberButtons("Max Angle",0.1,45,1,ap.maxAngle,function(v){
		ap.maxAngle=v;
	},[0.1,1,5]);
	ikPanel.add(maxAngle);
	var iteration=new UI.IntegerButtons("Iteration",1,100,1,ap.iteration,function(v){
		ap.iteration=v;
	},[5,10,50]);
	ikPanel.add(iteration);
return ikPanel;	
}