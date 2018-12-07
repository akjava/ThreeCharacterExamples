var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Ik Bone"));
	
	var ikPanel=new UI.TitlePanel("Ik");
	container.add(ikPanel);
	
	var maxAngle=new UI.NumberButtons("Max Angle",0.1,45,1,ap.maxAngle,function(v){
		ap.maxAngle=v;
	},[0.1,1,5]);
	ikPanel.add(maxAngle);
	var iteration=new UI.IntegerButtons("Iteration",1,100,1,ap.iteration,function(v){
		ap.iteration=v;
	},[5,10,50]);
	ikPanel.add(iteration);
	
	return container;
}
