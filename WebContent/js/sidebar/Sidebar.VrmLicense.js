Sidebar.VrmLicense=function(ap){
	var container=new UI.TitlePanel("Vrm Character License");
	
	var vroidcom="https://hub.vroid.com/";
	
	var title=new UI.TextRow("Title","");
	container.add(title);
	var author=new UI.TextRow("Author","");
	container.add(author);

	var usageRow=new UI.Row();
	container.add(usageRow);
	var commercialUssageName=new UI.TextSpan("CoU","").setMarginRight("12px");
	commercialUssageName.text.setWidth("32px");
	usageRow.add(commercialUssageName);
	
	var sexualUssageName=new UI.TextSpan("SeU","").setMarginRight("12px");
	sexualUssageName.text.setWidth("32px");
	usageRow.add(sexualUssageName);
	
	var violentUssageName=new UI.TextSpan("ViU","").setMarginRight("12px");
	violentUssageName.text.setWidth("32px");
	usageRow.add(violentUssageName);
	
	
	
	
	var contactInformationRow=new UI.Row();
	contactInformationRow.add(new UI.Text("Contact Info").setWidth("150px"));
	var contactInformation=new UI.Input("");
	contactInformation.setWidth("110px");
	contactInformationRow.add(contactInformation);
	container.add(contactInformationRow);
	
	var otherLicenseUrlRow=new UI.Row();
	otherLicenseUrlRow.add(new UI.Text("Other License URL").setWidth("150px"));
	var otherLicenseUrl=new UI.Input("");
	otherLicenseUrl.setWidth("110px");
	otherLicenseUrlRow.add(otherLicenseUrl);
	container.add(otherLicenseUrlRow);
	
	var otherPermissionUrlRow=new UI.Row();
	
	otherPermissionUrlRow.add(new UI.Text("Other Permission URL").setWidth("150px"));
	
	var otherPermissionUrl=new UI.Input("");
	otherPermissionUrl.setWidth("110px");
	otherPermissionUrlRow.add(otherPermissionUrl);
	container.add(otherPermissionUrlRow);
	
	var permissionBt=new UI.Button("hub.vroid.com").onClick(function(){
		window.open(otherPermissionUrl.getValue());
	});
	otherPermissionUrlRow.add(permissionBt);
	permissionBt.setDisplay("none");
	
	
	
	ap.getSignal("loadingModelFinished").add(function(model){
		
		var meta=ap.vrm.userData.gltfExtensions.VRM.meta;
		title.setValue(meta.title);
		author.setValue(meta.author);
		contactInformation.setValue(meta.contactInformation);
		sexualUssageName.setValue(meta.sexualUssageName);
		violentUssageName.setValue(meta.violentUssageName);
		commercialUssageName.setValue(meta.commercialUssageName);
		otherLicenseUrl.setValue(meta.otherLicenseUrl);
		otherPermissionUrl.setValue(meta.otherPermissionUrl);
		if(meta.otherPermissionUrl.startsWith(vroidcom)){//easy to check
			permissionBt.setDisplay("");
			otherPermissionUrl.setDisplay("none");
		}else{
			permissionBt.setDisplay("none");
			otherPermissionUrl.setDisplay("");
		}
	});
	
	return container;
}