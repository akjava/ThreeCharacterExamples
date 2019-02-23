var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Video Texture"));
	
	var bg=new Sidebar.BackgroundVideo(ap);
	container.add(bg)
	bg.loadVideo("","../../../dataset/texture/video.webm");
	
	return container;
}
