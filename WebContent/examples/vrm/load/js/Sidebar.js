var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Load Example"));
	
	container.add(new Sidebar.VrmLicense(ap));
	
	var skeletonPanel=new UI.TitlePanel("Skeleton");
	container.add(skeletonPanel);
	var checkRow=new UI.CheckboxRow("Visible",false,function(v){
		ap.skeletonHelper.material.visible=v;
	});
	skeletonPanel.add(checkRow);
	
	container.add(new Sidebar.VrmModel(ap));
	
	return container;
}
