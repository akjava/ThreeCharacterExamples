var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Physics Breast Bone Animation1"));
	
	container.add(new Sidebar.MeshTransform(ap,false));
	
	
	ap.damping=100;
	ap.stiffness=1000;
	ap.meshTransparent=1;
	ap.bothBreast=false;
	ap.moveSameDirection=true;
	ap.visibleAmmo=true;
	ap.bodyDamping=0.1;
	
	
	
	var control=new UI.TitlePanel("Body");
	container.add(control);
	var meshTransparent=new UI.NumberButtons("Transparent",0,1,1,application.meshTransparent,function(v){
		application.meshTransparent=v;
		ap.skinnedMesh.material.opacity=application.meshTransparent;
	},[0,0.5,0.9,1.0]);
	control.add(meshTransparent);
	
	var bothBreast=new UI.CheckboxRow("Move Both Breast",application.bothbreast,function(v){
		application.bothBreast=v;
	});
	control.add(bothBreast);
	var moveSameDirection=new UI.CheckboxRow("Move Same Direction",application.bothbreast,function(v){
		application.moveSameDirection=v;
	});
	control.add(moveSameDirection);
	
	var visibleAmmo=new UI.CheckboxRow("Visible Ammo",application.visibleAmmo,function(v){
		ap.ammoControler.setVisibleAll(v);
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
	
	//var meshTransform=new Sidebar.MeshTransform(ap);
	//container.add(meshTransform);
	
	//test
	var test=new UI.ButtonRow("Reset Breast to initial pos",function(){
		var pos=ap.resetBox.getWorldPosition(new THREE.Vector3());
		AmmoUtils.setPosition(ap.breastBox.getBody(),pos.x,pos.y,pos.z);
		
	});
	container.add(test);
	
	
	container.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.initializeAmmo(ap);
	
	
	container.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	container.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	container.add(new Sidebar.ClipPlayer(ap));
	container.add(new Sidebar.SimpleLight(ap));
	return container;
}
