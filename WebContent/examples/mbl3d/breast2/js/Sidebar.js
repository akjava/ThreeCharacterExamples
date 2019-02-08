var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Physics Breast Bone Animation2"));
	
	
	var breast=new Sidebar.Breast(ap);
	container.add(breast);
	
	
	var animePanel=new BoneRotateAnimationPanel(application,{duration:10});
	container.add(animePanel);
	
	var control=new UI.TitlePanel("Body");
	container.add(control);
	var meshTransparent=new UI.NumberButtons("Transparent",0,1,1,application.meshTransparent,function(v){
		application.meshTransparent=v;
		application.signals.meshTransparentChanged.dispatch();
	},[0,0.5,0.9,1.0]);
	control.add(meshTransparent);
	
	
	
	var visibleAmmo=new UI.CheckboxRow("Visible Ammo",application.visibleAmmo,function(v){
		application.visibleAmmo=v;
		application.signals.visibleAmmoChanged.dispatch();
	});
	control.add(visibleAmmo);
	var autoResetPosition=new UI.CheckboxRow("Auto Reset Position",application.autoResetPosition,function(v){
		application.autoResetPosition=v;
	});
	control.add(autoResetPosition);
	
	
	var stiffness=new UI.NumberButtons("stiffness",0,1000,100,application.stiffness,function(v){
		application.stiffness=v;
		application.signals.springChanged.dispatch();
	},[0,1,10,100,1000]);
	stiffness.text.setWidth("60px");
	control.add(stiffness);
	
	var damping=new UI.NumberButtons("damping",0,1000,100,application.damping,function(v){
		application.damping=v;
		application.signals.springChanged.dispatch();
	},[0,.1,1,10,100]);
	damping.text.setWidth("60px");
	control.add(damping);
	
	var bodyDamping=new UI.NumberButtons("bodyDamping",0,1,1,application.bodyDamping,function(v){
		application.bodyDamping=v;
		application.signals.springChanged.dispatch();
	},[0,.1,.5,.75,1]);
	bodyDamping.number.setWidth("30px");
	control.add(bodyDamping);
	
	var meshTransform=new Sidebar.MeshTransform(ap);
	container.add(meshTransform);
	
	//test
	var test=new UI.ButtonRow("reset initial pos",function(){
		var vec=new THREE.Vector3();
		function reset(box){
			var pos=box.getMesh().userData.resetBox.getWorldPosition(vec);
			AmmoUtils.setPosition(box.getBody(),pos.x,pos.y,pos.z);	
		}
		
		reset(ap.breastBox);
		reset(ap.breastBoxL);
	});
	container.add(test);
	
	return container;
}
