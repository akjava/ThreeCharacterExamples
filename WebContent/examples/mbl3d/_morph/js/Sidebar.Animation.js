Sidebar.Animation=function(app){
	var container=new UI.TitlePanel("Animation");
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

var clipTab = new UI.Text( 'Clip' ).onClick( onClick );
tabs.add( clipTab);
var clip= new UI.Span().add(
		new Sidebar.Clip(application)
	);
container.add( clip);

var morphTab = new UI.Text( 'Morph' ).onClick( onClick );
tabs.add( morphTab);
var morph= new UI.Span().add(
		new Sidebar.Morph(application)
	);
container.add( morph);

var poseTab = new UI.Text( 'Pose' ).onClick( onClick );
//tabs.add( poseTab);
var pose= new UI.Span().add(
		
	);
//container.add( pose);//TODO

function select( section ) {
	clipTab.setClass( '' );
	clip.setDisplay( 'none' );
	morphTab.setClass( '' );
	morph.setDisplay( 'none' );
	poseTab.setClass( '' );
	pose.setDisplay( 'none' );
	//move here
	switch ( section ) {

	

	case 'Clip':
					clipTab.setClass( 'selected' );
					clip.setDisplay( '' );
					break;
	

	case 'Morph':
					morphTab.setClass( 'selected' );
					morph.setDisplay( '' );
					break;
	

	case 'Pose':
					poseTab.setClass( 'selected' );
					pose.setDisplay( '' );
					break;
	}
	
	}
	select('Morph');

	return container;
}


