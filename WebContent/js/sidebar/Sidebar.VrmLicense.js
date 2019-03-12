Sidebar.VrmLicense=function(ap){
	var container=new UI.TitlePanel("Vrm Character License");
	
	
	
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
	contactInformation.setWidth("120px");
	contactInformationRow.add(contactInformation);
	container.add(contactInformationRow);
	
	var otherLicenseUrlRow=new UI.Row();
	otherLicenseUrlRow.add(new UI.Text("Other License URL").setWidth("150px"));
	var otherLicenseUrl=new UI.Input("");
	otherLicenseUrl.setWidth("120px");
	otherLicenseUrlRow.add(otherLicenseUrl);
	container.add(otherLicenseUrlRow);
	
	var otherPermissionUrlRow=new UI.Row();
	
	otherPermissionUrlRow.add(new UI.Text("Other Permission URL").setWidth("150px"));
	
	var otherPermissionUrl=new UI.Input("");
	otherPermissionUrl.setWidth("120px");
	otherPermissionUrlRow.add(otherPermissionUrl);
	container.add(otherPermissionUrlRow);
	
	
	
	
	
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
	});
	
	return container;
}