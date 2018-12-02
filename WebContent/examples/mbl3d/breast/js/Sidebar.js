var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Physics Breast Bone Animation"));
	
	var animePanel=new BoneRotateAnimationPanel(application,{duration:10});
	container.add(animePanel);
	
	var control=new UI.TitlePanel("Body");
	container.add(control);
	var meshTransparent=new UI.NumberButtons("Transparent",0,1,1,application.meshTransparent,function(v){
		application.meshTransparent=v;
		application.signals.meshTransparentChanged.dispatch();
	},[0,0.5,0.9,1.0]);
	control.add(meshTransparent);
	
	var bothBreast=new UI.CheckboxRow("Move Both Breast",application.bothbreast,function(v){
		application.bothBreast=v;
	});
	control.add(bothBreast);
	
	var visibleAmmo=new UI.CheckboxRow("Visible Ammo",application.visibleAmmo,function(v){
		application.visibleAmmo=v;
		application.signals.visibleAmmoChanged.dispatch();
	});
	control.add(visibleAmmo);
	
	
	var stiffness=new UI.NumberButtons("stiffness",0,1000,100,application.stiffness,function(v){
		application.stiffness=v;
		application.signals.springChanged.dispatch();
	},[0,1,10,100]);
	control.add(stiffness);
	
	var damping=new UI.NumberButtons("damping",0,1000,100,application.damping,function(v){
		application.damping=v;
		application.signals.springChanged.dispatch();
	},[0,.1,1,10]);
	control.add(damping);
	
	var bodyDamping=new UI.NumberButtons("bodyDamping",0,1,1,application.bodyDamping,function(v){
		application.bodyDamping=v;
		application.signals.springChanged.dispatch();
	},[0,.1,.5,1]);
	control.add(bodyDamping);
	
	
	
	return container;
}
