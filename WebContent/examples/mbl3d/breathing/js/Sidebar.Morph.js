Sidebar.Morph=function(ap){
var scope=this;
var container = new UI.TitlePanel("Morph");

var tabs = new UI.Div();
tabs.setId( 'tabs' );

container.add( tabs );

function onClick( event ) {

	select( event.target.textContent );

}

var nostrisTab = new UI.Text( 'Nostris' ).onClick( onClick );
tabs.add( nostrisTab);
var nostris= new UI.Span().add(
		new Sidebar.Morph.Editor(ap,"nostris")
);
container.add( nostris);

var mouthInflatedTab = new UI.Text( 'MouthInflated' ).onClick( onClick );
tabs.add( mouthInflatedTab);
var mouthInflated= new UI.Span().add(
		new Sidebar.Morph.Editor(ap,"mouthInflated")
);
container.add( mouthInflated);

var deglutitionTab = new UI.Text( 'Deglutition' ).onClick( onClick );
tabs.add( deglutitionTab);
var deglutition= new UI.Span().add(
		new Sidebar.Morph.Editor(ap,"deglutition")
);
container.add( deglutition);

var chestTab = new UI.Text( 'Chest' ).onClick( onClick );
tabs.add( chestTab);
var chest= new UI.Span().add(
		new Sidebar.Morph.Editor(ap,"chest")
);
container.add( chest);

var abdomTab = new UI.Text( 'Abdom' ).onClick( onClick );
tabs.add( abdomTab);
var abdom= new UI.Span().add(
		new Sidebar.Morph.Editor(ap,"abdom")
);
container.add( abdom);

function select( section ) {
	nostrisTab.setClass( '' );
	nostris.setDisplay( 'none' );
	mouthInflatedTab.setClass( '' );
	mouthInflated.setDisplay( 'none' );
	deglutitionTab.setClass( '' );
	deglutition.setDisplay( 'none' );
	chestTab.setClass( '' );
	chest.setDisplay( 'none' );
	abdomTab.setClass( '' );
	abdom.setDisplay( 'none' );
	//move here
	switch ( section ) {

	

	case 'Nostris':
					nostrisTab.setClass( 'selected' );
					nostris.setDisplay( '' );
					break;
	

	case 'MouthInflated':
					mouthInflatedTab.setClass( 'selected' );
					mouthInflated.setDisplay( '' );
					break;


	case 'Deglutition':
					deglutitionTab.setClass( 'selected' );
					deglutition.setDisplay( '' );
					break;


	case 'Chest':
					chestTab.setClass( 'selected' );
					chest.setDisplay( '' );
					break;


	case 'Abdom':
					abdomTab.setClass( 'selected' );
					abdom.setDisplay( '' );
					break;
	}
	// move
	}

select('Nostris');




//FOR GLB
this.abdomExpansion_max_index=1;
this.abdomExpansion_min_index=2;
this.chestExpansion_max=15;
this.chestExpansion_min=16;
this.nostrilsExpansion_max=71;
this.nostrilsExpansion_min=72;
this.deglutition_max=17;
this.deglutition_min=18;
this.mouthInflated_max=48;
this.mouthInflated_min=49;


var keys=["abdomExpansion_max_index","abdomExpansion_min_index",
		  "chestExpansion_max","chestExpansion_min",
		  "nostrilsExpansion_max","nostrilsExpansion_min",
		  "deglutition_max","deglutition_min",
		  "mouthInflated_max","mouthInflated_min"];

//set for fbx
keys.forEach(function(key){
	scope[key]=scope[key]-1;
});

var row=new UI.Row();
container.add(row);
var bt=new UI.Button("Start Morph Only").onClick( function () {
	ap.signals.animationStopped.dispatch();
	ap.signals.morphAnimationStarted.dispatch();
});

ap.signals.morphAnimationStarted.add(function(){
	//chest Expansion
	//ap.signals.scaleAnimationStarted.dispatch();
	var mixed=[];
	
	if(ap.abdomExpansionEnabled){
		//abdom is oposite
		var clip=AnimeUtils.makeTwoMorphAnimation(scope.abdomExpansion_max_index,scope.abdomExpansion_min_index,ap.abdomExpansionMin,ap.abdomExpansionMax,ap.abdomExpansionInTime,ap.abdomExpansionOutTime);
		mixed=mixed.concat(clip.tracks);
	}
	if(ap.chestExpansionEnabled){
		var clip=AnimeUtils.makeTwoMorphAnimation(scope.chestExpansion_min,scope.chestExpansion_max,ap.chestExpansionMin,ap.chestExpansionMax,ap.chestExpansionInTime,ap.chestExpansionOutTime);
		mixed=mixed.concat(clip.tracks);
	}
	if(ap.nostrisExpansionEnabled){
		var clip=AnimeUtils.makeTwoMorphAnimation(scope.nostrilsExpansion_min,scope.nostrilsExpansion_max,ap.nostrisExpansionMin,ap.nostrisExpansionMax,ap.nostrisExpansionInTime,ap.nostrisExpansionOutTime);	
		mixed=mixed.concat(clip.tracks);
	}
	//deglutition oposite
	if(ap.deglutitionExpansionEnabled){
		var clip=AnimeUtils.makeTwoMorphAnimation(scope.deglutition_max,scope.deglutition_min,ap.deglutitionExpansionMin,ap.deglutitionExpansionMax,ap.deglutitionExpansionInTime,ap.deglutitionExpansionOutTime);
		mixed=mixed.concat(clip.tracks);
	}
	if(ap.mouthInflatedExpansionEnabled){
		var clip=AnimeUtils.makeTwoMorphAnimation(scope.mouthInflated_min,scope.mouthInflated_max,ap.mouthInflatedExpansionMin,ap.mouthInflatedExpansionMax,ap.mouthInflatedExpansionInTime,ap.mouthInflatedExpansionOutTime);	
		mixed=mixed.concat(clip.tracks);
	}
	
	
	
	var mixedClip=new THREE.AnimationClip("MorphAnimation", -1, mixed);

	ap.morphClipDuration=mixedClip.duration;


	//console.log(clip);
	var mixer=ap.mixer;
	//mixer.stopAllAction();
	mixer.uncacheClip(mixedClip);
	ap.animationAction=mixer.clipAction(mixedClip).play();

} );
row.add(bt);
var bt=new UI.Button("Stop All").onClick( function () {

	ap.signals.animationStopped.dispatch();

} );
row.add(bt);
return container;
}
	