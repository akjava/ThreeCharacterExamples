Sidebar.Ammo=function(ap){
	var container=new UI.TitlePanel("Ammo");
	var gravity=new UI.Subtitle("Gravity");
	container.add(gravity);
	var scope=this;
	this.xg=0;
	this.yg=0;
	this.zg=0;
	
	function updateGravity(){
		AmmoUtils.setGravity(ap.ammoControler.world,scope.xg,scope.yg,scope.zg);
	}
	
	var xg=new UI.NumberButtons("x",-50,50,10,0,function(v){
		scope.xg=v;
		updateGravity();
	},[-10,0,10]);
	container.add(xg);
	var yg=new UI.NumberButtons("y",-50,50,10,0,function(v){
		scope.yg=v;
		updateGravity();
	},[-10,-9.8,0,10]);
	container.add(yg);
	var zg=new UI.NumberButtons("z",-50,50,10,0,function(v){
		scope.zg=v;
		updateGravity();
	},[-10,0,10]);
	container.add(zg);
	
	ap.getSignal("ammoInitialized").add(function(){
		var gravity=ap.ammoControler.gravity;
		xg.setValue(gravity.x);
		yg.setValue(gravity.y);
		zg.setValue(gravity.z);
	});
	
	ap.ammoFps=60;
	container.add(new UI.Subtitle("Simulate Step"));
	var fps=new UI.NumberButtons("FPS",1,240,10,ap.ammoFps,function(v){
		ap.ammoFps=v;
	},[30,60,120]);
	container.add(fps);
	var substeps=new UI.IntegerButtons("SubSteps",0,100,10,0,function(v){
		ap.ammoControler.substeps=v;
	},[0,1,4,10]);
	container.add(substeps);
	var fixed=new UI.NumberButtons("fixedTimeStep",1,1920,10,60,function(v){
		ap.ammoControler.fixedTimeStep=1.0/v;
	},[120,960,1920]);
	container.add(fixed);
	
	return container;
}