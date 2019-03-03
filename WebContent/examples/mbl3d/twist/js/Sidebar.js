var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Twist"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("Main");
	main.add(new Sidebar.BoneRotate(ap));
	main.add(new Sidebar.TwistRatio(ap));
	
	var sub=tab.addItem("Sub");
	sub.add(new Sidebar.ControlerCheck(ap));
	
	sub.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	
	sub.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	sub.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub.add(new Sidebar.MeshTransform(ap));
	Logics.loadingModelFinishedForMeshTransform(ap);
	
	sub.add(new Sidebar.ClipPlayer(ap));
	sub.add(new Sidebar.SimpleLight(ap));
	
	
	return container;
}
