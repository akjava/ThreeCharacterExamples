Sidebar.Scale = function ( application ) {
	var ap=application;
	var base = new UI.TitlePanel("Scale");
	var row=new UI.Row();
	base.add(row);
	var container = new UI.Panel();
	base.add(container);
	container.setHeight("200px");
	
var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}


var upperarmScaleEnabled=new UI.CheckboxText("Upperarm",ap.upperarmScaleEnabled,function(v){
	ap.upperarmScaleEnabled=v;
});
upperarmScaleEnabled.text.setWidth("70px");
row.add(upperarmScaleEnabled);
var breastScaleEnabled=new UI.CheckboxText("Breast",ap.breastScaleEnabled,function(v){
		ap.breastScaleEnabled=v;
});
row.add(breastScaleEnabled);

var thighScaleEnabled=new UI.CheckboxText("Thigh",ap.thighScaleEnabled,function(v){
	ap.thighScaleEnabled=v;
});
row.add(thighScaleEnabled);
	
	
var simpelScaleTab = new UI.Text( 'SimpelScale' ).onClick( onClick );
tabs.add( simpelScaleTab);
var simpelScale= new UI.Span().add(
		new Sidebar.SimpleScale(ap)
	);
container.add( simpelScale);

var randomScaleTab = new UI.Text( 'RandomScale' ).onClick( onClick );
tabs.add( randomScaleTab);
var randomScale= new UI.Span().add(
		new Sidebar.RandomScale(ap)
	);
container.add( randomScale);


function select( section ) {
	//move here
	simpelScaleTab.setClass( '' );
	simpelScale.setDisplay( 'none' );
	randomScaleTab.setClass( '' );
	randomScale.setDisplay( 'none' );
	
	switch ( section ) {


	case 'SimpelScale':
					application.scaleType="simple";
					simpelScaleTab.setClass( 'selected' );
					simpelScale.setDisplay( '' );
					break;
	

	case 'RandomScale':
					application.scaleType="random";
					randomScaleTab.setClass( 'selected' );
					randomScale.setDisplay( '' );
					break;
	}
	
	}

select('SimpelScale');
select('RandomScale');


var row=new UI.Row();
base.add(row);
var bt=new UI.Button("Start Scale Only").onClick( function () {
	ap.signals.animationStopped.dispatch();
	ap.signals.scaleAnimationStarted.dispatch();
} );
row.add(bt);
var bt=new UI.Button("Stop All").onClick( function () {
	ap.signals.animationStopped.dispatch();
} );
row.add(bt);

ap.signals.scaleAnimationStarted.add(function(){
	var mixer=ap.mixer;
	//TODO split indivisual
	
	var bones=[];
	
	if(ap.thighScaleEnabled){
		bones=bones.concat([7,13]);
	}
	if(ap.upperarmScaleEnabled){
		bones=bones.concat([66,41]);
	}
	if(ap.breastScaleEnabled){
		bones=bones.concat([69,70]);
	}
	
	
	var clip=null;
	
	if(ap.scaleType=="simple"){
		clip=AnimeUtils.makeSimpleScaleBoneAnimation(bones,1.0,ap.scale,true,ap.scaleDuration);
	}else{
		clip=AnimeUtils.makeRandomScaleBoneAnimation(bones,ap.minScale,ap.maxScale,ap.randomScaleDuration,ap.randomScaleCount,ap.randomScaleContinue,ap.useScaleRandomSameValue);
	}
	

	ap.scaleClipDuration=clip.duration;
	
	mixer.uncacheClip(clip);
	ap.animationAction=mixer.clipAction(clip).play();
});

return base;
}