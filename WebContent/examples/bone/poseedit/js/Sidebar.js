var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Pose Edit"));
	
	
	
    var ikPanel=new Sidebar.IkLBasic(application);
    ikPanel.add(new Sidebar.IkSolve(ap));
    
	var exportPanel=new Sidebar.Export(ap);
	var importPanel=new Sidebar.Import(ap);
	var backgroundImagePanel=new BackgroundImagePanel(ap);
	
	
	var rootTranslate=new Sidebar.RootTranslate(ap);
	var editPanel=new BoneEditPanel2(ap);
	editPanel.buttons.setDisplay("none");
	
	var lRButtonRow=Sidebar.LRButtonRow(ap);
	editPanel.add(lRButtonRow);
	
	var ikReset=new Sidebar.IkReset(ap);
	var IkBoneList=new Sidebar.IkBoneList(ap);
	
	var transparent=new Sidebar.Transparent(ap);
	var ground=new Sidebar.Ground(ap);
	
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}
	
var visiblePanel=new UI.Panel();
var visibleTransform=new UI.CheckboxRow("Visible transform controler",true,function(v){
	ap.translateControler.material.visible=v;
	ap.rotatationControler.setVisible(v);
});
visiblePanel.add(visibleTransform);

var poseTab = new UI.Text( 'Pose' ).onClick( onClick );
tabs.add( poseTab);
var pose= new UI.Span().add(
		visiblePanel,rootTranslate,editPanel,ikReset,IkBoneList,ground
	);
container.add( pose);

var settingsTab = new UI.Text( 'Settings' ).onClick( onClick );
tabs.add( settingsTab);
var settings= new UI.Span().add(
		transparent,new Sidebar.Texture(ap)
	);
container.add( settings);

var ioTab = new UI.Text( 'IO' ).onClick( onClick );
tabs.add( ioTab);
var io= new UI.Span().add(
		exportPanel,importPanel,backgroundImagePanel
	);
container.add( io);

var ikTab = new UI.Text( 'Ik' ).onClick( onClick );
tabs.add( ikTab);
var ik= new UI.Span().add(
		ikPanel
	);
container.add( ik);

function select( section ) {
	//move here
	poseTab.setClass( '' );
	pose.setDisplay( 'none' );
	settingsTab.setClass( '' );
	settings.setDisplay( 'none' );
	ioTab.setClass( '' );
	io.setDisplay( 'none' );
	ikTab.setClass( '' );
	ik.setDisplay( 'none' );
	switch ( section ) {



	case 'Pose':
					poseTab.setClass( 'selected' );
					pose.setDisplay( '' );
					break;
	

	case 'Settings':
					settingsTab.setClass( 'selected' );
					settings.setDisplay( '' );
					break;
	

	case 'IO':
					ioTab.setClass( 'selected' );
					io.setDisplay( '' );
					break;
	

	case 'Ik':
					ikTab.setClass( 'selected' );
					ik.setDisplay( '' );
					break;
	}
	//
	}
select('Pose');
	
	

    



	
	

	

	
	

	

	

	
	
	return container;
}
