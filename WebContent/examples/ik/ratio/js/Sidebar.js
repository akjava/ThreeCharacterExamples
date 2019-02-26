var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Ik Ratio"));
	
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
	
	var div=new UI.Div();
	main.add(div);
	
	var bone=null;
	var ratio=new UI.NumberButtons("Ratio",0,1,0.1,1,function(v){
		ap.ikControler.setBoneRatio(bone.name,v);
	},[0.01,0.1,0.5,1]);
	div.add(ratio);
	
	ap.getSignal("boneSelectionChanged").add(function(index){
		if(index==undefined){
			return;
		}
		bone=BoneUtils.getBoneList(ap.skinnedMesh)[index];
			
		var v=ap.ikControler.getBoneRatio(bone.name);
		ratio.setValue(v);
	});
	
	
	
	var titlePanel=new UI.TitlePanel("IkRatio Load & Export");
	main.add(titlePanel);
	
	
	var jsonList=new ListLoadJsonDiv("../../../dataset/mbl3d/ikratio/",
			["","lowerarm1.json","lowerarm2.json","clavicle1.json","clavicle2.json","upperarm.json"],function(json){
		
		if(json==null){
			ap.ikControler.clearBoneRatio();
			console.log(ap.ikControler.ikBoneRatio);
		}else{
			ap.ikControler.setBoneRatioFromJson(json);
			console.log(ap.ikControler.ikBoneRatio);
		}
		
	});
	titlePanel.add(jsonList);
	
	
	var exportDiv=new ExportJsonDiv(ap,function(fileName){
		return ap.ikControler.getBoneRatioAsJson();
	});
	titlePanel.add(exportDiv);
	

	
	
	
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
