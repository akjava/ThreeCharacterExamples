Sidebar.Export=function(ap){
	var container = new UI.TitlePanel("Export");
	var row=new UI.Row();
	container.add(row);
	
	function mergeTrack(ap){
		var clips=[];
		ap.signals.translateAnimationStarted.dispatch();
		clips.push(ap.animationAction._clip);
		ap.signals.scaleAnimationStarted.dispatch();
		clips.push(ap.animationAction._clip);
		ap.signals.morphAnimationStarted.dispatch();
		clips.push(ap.animationAction._clip);
		ap.signals.animationStopped.dispatch();
		
		var duration=0;
		clips.forEach(function(clip){
			
			if(clip.duration>duration){
				duration=clip.duration;
			}
		});
		
		var tracks=[];
		clips.forEach(function(clip){
			var loop=duration/clip.duration;
			
			clip.tracks.forEach(function(track){
				var newtrack=AnimeUtils.makeLoopedTrack(track,loop);
				tracks.push(newtrack);
			});
		});
		
		
		
		
		var mixedClip=new THREE.AnimationClip("MergedAnimation", -1, tracks);
		return mixedClip;
		
	}
	
	
	var row=new UI.Row();
	container.add(row);
	var bt=new UI.Button("Make Download").onClick( function () {
		span.dom.innerHTML = ''
		var clip=mergeTrack(ap);
		var jsonText=JSON.stringify(THREE.AnimationClip.toJSON(clip));
		var link=AppUtils.generateTextDownloadLink(jsonText,"animation.json","animation.json",true);
		span.dom.appendChild(link);

	} );
	row.add(bt);
	bt.setMarginRight("6px");
	var span=new UI.Span();
	row.add(span);


	
	return container;
}