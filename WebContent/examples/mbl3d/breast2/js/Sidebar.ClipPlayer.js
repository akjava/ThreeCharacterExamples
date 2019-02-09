Sidebar.ClipPlayer=function(ap){
	var titlePanel=new UI.TitlePanel("ClipPlayer");
	ap.clip=null;
	
	var loadClipRow=new LoadClipRow(function(clip){
		ap.clip=clip;
	});
	titlePanel.add(loadClipRow);
	
	var clipPlayerRow=new ClipPlayerRow(ap);
	titlePanel.add(clipPlayerRow);
	
	return titlePanel;
}