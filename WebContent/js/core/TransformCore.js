var TransformCore = function ( ap ) {
	MinTransformCore.call(this,ap);
	Logics.loadingModelStartedForGltfFbxLoader(ap);
	return ap.core;
}