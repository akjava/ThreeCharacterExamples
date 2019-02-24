var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Convert 0 Rotated"));
	
	
	var tab=new UI.Tab();
	
	container.add(tab);
	var main=tab.addItem("Main");
	var sub=tab.addItem("sub");
	
	var panel=new UI.TitlePanel("Convert Check");
	main.add(panel);
	
	//logging
	ap.signals.loadingModelStarted.add(function(){BoneUtils.logging=true;},undefined,100);
	ap.signals.loadingModelFinished.add(function(){BoneUtils.logging=false;},undefined,100);
	
	
	
	panel.add(new UI.Text("Need reload model.without convert 0 rot,euler order not work at fingers").setClass("description"));
	var convertCheck=new UI.CheckboxRow("Convert 0 Rot",true,function(v){
		ap.convertToZeroRotatedBoneMesh=v;
	});
	panel.add(convertCheck);
	var eulerCheck=new UI.CheckboxRow("Convert Euler Order",true,function(v){
		ap.convertBoneEulerOrders=v;
	});
	panel.add(eulerCheck);
	
	var boneCheck=new UI.CheckboxRow("Visible Bone Position",true,function(v){
		ap.boneAttachControler.setVisible(v);
	});
	panel.add(boneCheck);
	
	ap.signals.loadingModelFinished.add(function(){
		ap.boneAttachControler.setVisible(boneCheck.getValue());
	},undefined,-1);//wait boneattach recreate
	
	main.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	
	main.add(new Sidebar.MeshTransform(ap,false));
	
	var ba=new Sidebar.BoneRotateAnimationPanel(ap);
	main.add(ba);
	ba.add(new UI.Description("not good at non 0 rotated,because use absolute rotation"));
	
	sub.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	sub.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub.add(new Sidebar.ClipPlayer(ap));
	sub.add(new Sidebar.SimpleLight(ap));
	return container;
}
