var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Ik Preset"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("Main");
	
	main.add(new Sidebar.IkControl(ap));
	main.add(new IkRotateRow(ap));
	main.add(new Sidebar.IkBasic(ap));
	main.add(new IkSolveRow(ap));
	main.add(new Sidebar.IkReset(ap));
	
	main.add(new Sidebar.IkBoneList(ap));
	var boneRotate=new Sidebar.BoneRotate(ap,false);
	boneRotate.add(new LRBoneRow(ap));
	main.add(boneRotate);
	
	
	
	
	var titlePanel=new UI.TitlePanel("IkPreset Load & Export");
	main.add(titlePanel);
	
	
	var jsonList=new ListLoadJsonDiv("../../../dataset/mbl3d/preset/",
			["","simple.json"],function(json){
		console.log(json);
		if(json==null){
			ap.ikControler.setPresets(new IkPresets(ap.ikControler));
		}else{
			var presets=IkPresets.parse(json,ap.ikControler);
			console.log(presets);
			ap.ikControler.setPresets(presets);
		}
		
		ap.signals.transformSelectionChanged.dispatch(null);//refresh table
	});
	titlePanel.add(jsonList);
	
	
	var exportDiv=new ExportJsonDiv(ap,function(fileName){
		var ikPresets=ap.ikControler.getPresets();
		var json=ikPresets.toJSON();
		return JSON.stringify(json);
	});
	titlePanel.add(exportDiv);
	
	main.add(new Sidebar.IkPreset(ap));
	var ikPresets=new IkPresets(ap.ikControler);
	ap.ikControler.setPresets(ikPresets);
	console.log(ap.ikControler);
	
	ap.signals.transformSelectionChanged.add(function(target){
		if(target!=null && target.userData.transformSelectionType=="IkPreset"){
			target.userData.IkPresetOnClick(target);
			
			var ikName=target.userData.IkPresetIkName;
			var newTarget=ap.ikControler.getIkTargetFromName(ikName);
			
			//after bone changed reselect  ik
			ap.signals.transformSelectionChanged.dispatch(newTarget);
		}
		
		ap.ikControler.getPresets().updateVisibleAll();
	},undefined,-1);//after ikcontroler
	

	
	
	
	
	var sub2=tab.addItem("Sub");
	
	sub2.add(new Sidebar.MeshRotate(ap));
	sub2.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	
	
	sub2.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);

	sub2.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub2.add(new Sidebar.SimpleLight(ap));
	return container;
}
