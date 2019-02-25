var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Rotate Control"));
	
	
	container.add(new Sidebar.MeshRotate(ap));
	
	var boneRotate=new Sidebar.BoneRotate(ap);
	boneRotate.add(new LRBoneRow(ap));

	container.add(boneRotate);
	
	container.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	ap.signals.loadingModelFinished.add(function(){
		ap.rotationControler.logging=true;
	},undefined,-1);
	
	container.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	container.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	container.add(new Sidebar.SimpleLight(ap));
	return container;
}
