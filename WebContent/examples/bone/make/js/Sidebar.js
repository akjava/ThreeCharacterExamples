var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Simple Bone Make"));
	
	var boneAnimation=new BoneRotateAnimationPanel(application);
	container.add(boneAnimation);
	
	return container;
}
