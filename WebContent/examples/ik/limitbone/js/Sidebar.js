var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Limit Ik Bone"));
	
	var ikLimitIO=new Sidebar.IkLimitIO(application);
	container.add(ikLimitIO);
	
	
    var ikPanel=new Sidebar.IkLBasic(application);
    container.add(ikPanel);
	
    ikPanel.add(new Sidebar.IkSolve(ap));
	
	
	
	
	var lockPanel=new UI.TitlePanel("Lock Ik All Bone Rotation");
	container.add(lockPanel);
	var lockRow=new UI.Row();
	lockPanel.add(lockRow);
	var ikLockX=new UI.CheckboxText("X",ap.ikControler.ikLockX,function(v){
		ap.ikControler.ikLockX=v;
	});
	lockRow.add(ikLockX);
	var ikLockY=new UI.CheckboxText("Y",ap.ikControler.ikLockY,function(v){
		ap.ikControler.ikLockY=v;
	});
	lockRow.add(ikLockY);
	var ikLockZ=new UI.CheckboxText("Z",ap.ikControler.ikLockZ,function(v){
		ap.ikControler.ikLockZ=v;
	});
	lockRow.add(ikLockZ);
	
	
	var boneIkEnabledPanel=new UI.TitlePanel("Bone Ik Enabled Any or Selected");
	container.add(boneIkEnabledPanel);

	var selectedOnlyCheck=new UI.SwitchRow("Only Selected Bone","Any Bone",ap.ikControler.ikBoneSelectedOnly,function(v){
		ap.ikControler.ikBoneSelectedOnly=v;
	});
	boneIkEnabledPanel.add(selectedOnlyCheck);
	
	
	
	var lockBonePanel=new UI.TitlePanel("Lock Individual Bone Rotation");
	container.add(lockBonePanel);
	
	function getSelectedBoneName(){
		return BoneUtils.getBoneList(ap.skinnedMesh)[ap.boneSelectedIndex].name;
	}
	
	
	
	//TODO switch and color
	var lockedCheck=new UI.CheckboxRow("",false,function(v){
		var name=getSelectedBoneName();
		ap.ikControler.boneLocked[name]=v;
	});
	lockBonePanel.add(lockedCheck);
	
	var boneSelectionChanged=function(){
		var name=getSelectedBoneName();
		var value=ap.ikControler.boneLocked[name]!==undefined?ap.ikControler.boneLocked[name]:false;
		lockedCheck.checkbox.setValue(value);
		lockedCheck.text.setValue(name);
	};
	
	ap.signals.boneSelectionChanged.add(boneSelectionChanged);
	
	var limitPanel=new BoneLimitPanel(application);
	container.add(limitPanel);
	

	
	
	container.add(new Sidebar.IkReset(ap));
	
	ap.signals.transformSelectionChanged.add(function(target){
	
		boneListButtons.forEach(function(button){
			boneListRow.remove(button);
		});
		boneListButtons=[];
		
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		if(target!=null){
			if(ap.ikControler.ikTarget==null){
				console.log("invalidly call sidebar first");
				return;
			}
			
			ap.ikControler.ikIndices.forEach(function(index){
				
				var name=boneList[index].name;
				var bt=new UI.Button(name);
				bt.onClick(function(){
					ap.signals.boneSelectionChanged.dispatch(index);
				});
				boneListRow.add(bt);
				boneListButtons.push(bt);
			});
		}
	
	},undefined,0);
	var boneListButtons=[];
	var ikBoneList=new UI.TitlePanel("Ik Bone List");
	container.add(ikBoneList);
	var boneListRow=new UI.Row();
	ikBoneList.add(boneListRow);
	
	var ikLimitList=new Sidebar.IkLimitList(application);
	container.add(ikLimitList);
	
	return container;
}
