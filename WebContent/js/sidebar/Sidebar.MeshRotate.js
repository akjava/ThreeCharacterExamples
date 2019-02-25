Sidebar.MeshRotate=function(ap){
	var title=new UI.TitlePanel("Mesh Rotate");
	var absoluteRotateDiv=new AbsoluteRotateDiv(ap);
	title.add(absoluteRotateDiv);
	ap.getSignal("objectRotated").add(function(x,y,z,target){
		if(target!=absoluteRotateDiv){
			return;
		}
		var degs={x:x,y:y,z:z};
		var rads=AppUtils.degToRad(degs);
		ap.skinnedMesh.rotation.set(rads.x,rads.y,rads.z);
	});
	return title;
}