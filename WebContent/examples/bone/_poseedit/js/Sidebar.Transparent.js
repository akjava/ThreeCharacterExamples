Sidebar.Transparent=function(ap){
	var titlePanel=new UI.TitlePanel("Mesh Transparent");
	var opacity=new UI.NumberButtons("Opacity",0,1,1,1,function(v){
		ap.skinnedMesh.material.opacity=v;
	},[0,0.5,0.75,1]);
	titlePanel.add(opacity);
	return titlePanel;
}