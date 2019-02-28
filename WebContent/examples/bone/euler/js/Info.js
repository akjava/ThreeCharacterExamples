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
	container.setFontSize( '24px' );
	container.setColor( '#fff' );
	container.setWidth('300px');
	
	signals.rendered.add( update );

	var texts={};
	var orders=BoneUtils.orders;
	orders.forEach(function(order){
		var text = new UI.Text( '' ).setMarginLeft( '6px' );
		container.add(text);
		container.add(new UI.Break());
		texts[order]=text;
	});
	
	var boneIndex=0;
	ap.getSignal("boneSelectionChanged").add(function(index){
		if(index==undefined){
			return;
		}
		boneIndex=index;
	});
	
	var euler=new THREE.Euler();
	
	function update() {
		if(!ap.skinnedMesh){
			return;
		}
		var bone=BoneUtils.getBoneList(ap.skinnedMesh)[boneIndex];
		var orders=BoneUtils.orders;
		var q=bone.quaternion;
		orders.forEach(function(order){
			euler.order=order;
			euler.setFromQuaternion(q);
			var degs=AppUtils.radToDeg(euler);
			var text=texts[order];
			value=order+":"+degs.x.toFixed(2)+","+degs.y.toFixed(2)+","+degs.z.toFixed(2)
			text.setValue(value);
		});
	}

	return container;

};
