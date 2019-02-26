var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("End Site"));
	
	
	container.add(new Sidebar.MeshRotate(ap));
	container.add(new Sidebar.IkControl(ap));
	container.add(new Sidebar.IkBasic(ap));
	container.add(new IkSolveRow(ap));
	container.add(new Sidebar.IkReset(ap));
	
	container.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	ap.signals.loadingModelFinished.add(function(){
		ap.ikControler.logging=true;
	},undefined,-1);
	
	container.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	container.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	container.add(new Sidebar.SimpleLight(ap));
	return container;
}
