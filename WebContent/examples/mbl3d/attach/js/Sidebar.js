var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Attach Item"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("Main");
	main.add(new Sidebar.ControlerCheck(ap));
	main.add(new Sidebar.Obj(ap));
	main.add(new Sidebar.ObjTransform(ap));
	
	
	
	
	
	
	
	var finger=tab.addItem("Finger");
	finger.add(new Sidebar.RotateFingers(ap));
	ap.fingerPresetsControler=new FingerPresetsControler(ap,new FingerPresets());
	
	var sub=tab.addItem("Sub");
	sub.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	
	sub.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	sub.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub.add(new Sidebar.SimpleLight(ap));
	
	
	var lastUploaded=null;
	
	ap.objUrl="../../../dataset/mbl3d/obj/axe.obj";
	
	//auto load
	var titlePanel=new UI.TitlePanel("Obj Target List");
	main.add(titlePanel);
	var list=new UI.List([],function(){
		
	});
	titlePanel.add(list);
	
	
	ap.getSignal("loadingModelFinished").add(function(mesh){
		var boneList=BoneUtils.getBoneList(mesh);
		var coreNames=[];
		boneList.forEach(function(bone){
			var name=bone.name;
			if(!Mbl3dUtils.isTwistBoneName(name) && !Mbl3dUtils.isFingerBoneName(name)){
				coreNames.push(name);
			}
		})
		list.setList(coreNames);
		list.setValue("hand_R");
		
		ap.getSignal("loadingObjStarted").dispatch(ap.objUrl);
	},-1);
	
	
	ap.getSignal("loadingObjFinished").add(function(obj){
		if(lastUploaded!=null){
			lastUploaded.parent.remove(lastUploaded);
		}
		ap.getSignal("objTransformTargetChanged").dispatch(obj);
		
		if(obj!=null)
			ap.boneAttachControler.getContainerByBoneEndName(list.getValue()).add(obj);
		
		lastUploaded=obj;
	},undefined,-100);
	
	return container;
}
