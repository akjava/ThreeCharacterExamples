var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	
	var div=new UI.Div();
	div.setClass("appname");
	container.add(div);
	var title=new UI.Span();
	title.dom.textContent="TimeLinear Morph";
	div.add(title);

	
	
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

var editorTab = new UI.Text( 'Editor' ).onClick( onClick );
tabs.add( editorTab);
var editor= new UI.Span().add(
		new Sidebar.TimelinerVisibleRow(ap),
		new Sidebar.MorphMbl3dEditor(application),
		new Sidebar.Camera(application)
	);
container.add( editor);

var settingTab = new UI.Text( 'Setting' ).onClick( onClick );
tabs.add( settingTab);
var setting= new UI.Span().add(
		new Sidebar.Hair(application),
		new Sidebar.Material(application),
		new Sidebar.Light(application)
	);
container.add( setting);

var inputOutputTab = new UI.Text( 'InputOutput' ).onClick( onClick );
tabs.add( inputOutputTab);
var inputOutput= new UI.Span().add(
		new Sidebar.Texture(application),
		new Sidebar.TimelinerClipExport(application),
		new Sidebar.ExportMorphFrameClip(ap),
		new Sidebar.Import(ap)
	);
container.add( inputOutput);

function select( section ) {
	//move here
	editorTab.setClass( '' );
	editor.setDisplay( 'none' );
	settingTab.setClass( '' );
	setting.setDisplay( 'none' );
	inputOutputTab.setClass( '' );
	inputOutput.setDisplay( 'none' );
	switch ( section ) {

	

	case 'Editor':
					editorTab.setClass( 'selected' );
					editor.setDisplay( '' );
					break;
	

	case 'Setting':
					settingTab.setClass( 'selected' );
					setting.setDisplay( '' );
					break;
	

	case 'InputOutput':
					inputOutputTab.setClass( 'selected' );
					inputOutput.setDisplay( '' );
					break;
	}
	// move 
	}
select('Editor');
	
	
	
	
	
	/*
	 * TODO support glb
	 */
	//var model=new Sidebar.Model(application);
	//container.add(model);
	
	
	
	return container;
}
