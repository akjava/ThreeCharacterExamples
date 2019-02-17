Sidebar.ClipPlayer=function(ap){
	var titlePanel=new UI.TitlePanel("ClipPlayer");
	ap.clip=null;
	
	ap.clipAutoStart=true;
	titlePanel.add(new Sidebar.ClipAutoStartRow(ap));
	
	var loadClipRow=new LoadClipRow(function(clip){
		ap.clip=clip;
		if(ap.clipAutoStart ){
			if(clip!=null){
				ap.signals.clipPlayerPlayed.dispatch();
			}else{
				ap.signals.clipPlayerStopped.dispatch();
			}
		}
	});
	
	titlePanel.add(loadClipRow);
	
	var clipPlayerRow=new ClipPlayerRow(ap);
	titlePanel.add(clipPlayerRow);
	
	return titlePanel;
}

Sidebar.ClipAutoStartRow=function(ap){
	var autoStart=new UI.CheckboxRow("Auto Start",ap.clipAutoStart,function(v){
		ap.clipAutoStart=v;
	});
	
	ap.signals.loadingModelFinished.add(function(){
		if(ap.clipAutoStart && ap.clip!=null){
			if(ap.signals.clipPlayerPlayed){
				ap.signals.clipPlayerPlayed.dispatch();
			}	
		}
	},undefined,-100);
	return autoStart;
}