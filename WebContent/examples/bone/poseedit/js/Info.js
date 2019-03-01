/**
 * @author mrdoob / http://mrdoob.com/
 */

var Info = function ( application ) {
	var ap=application;
	var signals = application.signals;

	var container = new UI.Panel();
	container.setId( 'info' );
	container.setPosition( 'absolute' );
	container.setRight( '300px' );
	container.setTop( '10px' );
	container.setFontSize( '16px' );
	container.setColor( '#fff' );
	container.setWidth('120px');
	
	signals.rendered.add( update );

	var selection=new UI.Text("");//.setMarginLeft("16px");
	container.add(new UI.Text("Selected"),new UI.Break(),selection);
	
	ap.getSignal("transformSelectionChanged").add(function(target){
		if(target==null){
			selection.setValue("");
		}else{
			selection.setValue(target.name);
		}
	});
	
	function update() {
	
	}

	return container;

};
