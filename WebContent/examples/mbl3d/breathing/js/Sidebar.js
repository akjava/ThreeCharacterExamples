var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Breathing Animation"));
	
	var scalePanel=new UI.TitlePanel("Animation Control");
	container.add(scalePanel);
	var row=new UI.Row();
	scalePanel.add(row);
	var bt=new UI.Button("Start All").onClick( function () {

		ap.signals.animationStarted.dispatch();

	} );
	row.add(bt);
	var bt=new UI.Button("Stop All").onClick( function () {

		ap.signals.animationStopped.dispatch();

	} );
	row.add(bt);
	
	

	var morph=new Sidebar.Morph(ap);
	container.add(morph);
	
	//for emulate softbody
	var scale=new Sidebar.Scale(ap);
	container.add(scale);
	//for emulate softbody too
	var translate=new Sidebar.Translate(ap);
	container.add(translate);
	var rotate=new Sidebar.Rotate(ap);
	container.add(rotate);
	
	var exportPanel=new Sidebar.Export(ap);
	container.add(exportPanel);
	
	var p1=new UI.Panel();
	var bt=new UI.Button("hello").onClick( function () {

		var value=[0,1,0];
		var time1=[0,1,8];
		var time2=[0,2,4];
		
		var trackName1=".morphTargetInfluences["+19+"]";
		var trackName2=".morphTargetInfluences["+25+"]";
		
		
		
		var track1=new THREE.NumberKeyframeTrack(trackName1,time1,value);
		var track2=new THREE.NumberKeyframeTrack(trackName2,time2,value);
		var tracks=[track1,track2];
		
		var mixedClip=new THREE.AnimationClip("tmp", -1, tracks);
		
		
		//console.log(clip);
		var mixer=ap.mixer;
		
		//mixer.stopAllAction();
		mixer.uncacheClip(mixedClip);
		var r=mixer.clipAction(mixedClip).play();
		console.log(r);
	} );
	//p1.add(bt);
	container.add(p1);
	return container;
}
