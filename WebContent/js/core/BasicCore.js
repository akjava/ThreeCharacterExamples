var BasicCore = function ( ap ) {
	MinCore.call(this,ap);
	
	Logics.loadingModelStartedForGltfFbxLoader(ap);
	
	return ap.core;
}