Sidebar.DoubleClipPlayer=function(ap){
	var titlePanel=new UI.TitlePanel("Double Clip Player");
	ap.clip=null;
	var clip1=null;
	var clip2=null;
	
	ap.clipAutoStart=true;
	titlePanel.add(new Sidebar.ClipAutoStartRow(ap));
	
	function updateClip(){
		
		if(clip1==null && clip2==null){
			ap.clip=null;
		}else{
			if(clip1!=null && clip2!=null){
				
				ap.clip=AnimeUtils.concatClips([clip1,clip2],"mixed");

			}else{
				if(clip1==null){
					ap.clip=clip2;
				}else{
					ap.clip=clip1;
				}
			}
		}
	}
	
	var loadClipRow1=new LoadClipRow(function(clip){
		clip1=clip;
		updateClip();
		if(ap.clipAutoStart ){
			if(clip!=null){
				ap.signals.clipPlayerPlayed.dispatch();
			}else{
				ap.signals.clipPlayerStopped.dispatch();
			}
		}
	});
	titlePanel.add(loadClipRow1);
	
	var loadClipRow2=new LoadClipRow(function(clip){
		clip2=clip;
		updateClip();
		if(ap.clipAutoStart ){
			if(clip!=null){
				ap.signals.clipPlayerPlayed.dispatch();
			}else{
				ap.signals.clipPlayerStopped.dispatch();
			}
		}
	});
	
	titlePanel.add(loadClipRow2);
	
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