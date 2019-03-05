var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Physics Breast Bone Animation2"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("Main");
	
	main.add(new Sidebar.BoneRotateAnimationPanel(ap));
	
	ap.ammoVisible=false;
	var panel=new UI.Panel();
	main.add(panel);
	panel.add(new UI.CheckboxRow("Ammo Visible",false,function(v){
		ap.ammoVisible=v;
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	}));
	main.add(new Sidebar.Breast(ap));
	
	var sub=tab.addItem("Sub");
	sub.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	
	sub.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	sub.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub.add(new Sidebar.ClipPlayer(ap));
	sub.add(new Sidebar.SimpleLight(ap));
	
	return container;
}
