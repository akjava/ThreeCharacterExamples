var Application = function () {
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0x666666 );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, .01, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, -20, 25 );
	this.camera.lookAt( new THREE.Vector3() );
	
	
	this.damping=0.1;
	
	this.clothMass=1;
	
	this.visibleGeometry=true;
	this.visibleAmmo=false;
	this.visibleBall=true;

	this.connectHorizontal=true;
	
	this.totalWidth=10;
	this.totalHeight=10;
	
	this.gridColumns=8;
	this.gridRows=8;//for editer
	this.clothColumns=0;//the value when created cloth
	this.clothRows=0;
	
	this.particleSize=.4;
	
	this.particleRestitution=.1;
	this.particleFriction=.1;
	this.particleDamping=0;
	
	
	this.useLimitVelocity=false;
	this.limitVelocity=5;
	this.frameBRatio=1;//recommended 1.0,but use frameA type do differencet moveing.
	
	
	//constraint
	this.disableCollisionsBetweenLinkedBodies=false;
	this.frameInA=true;//trying
	this.damping=0.1;
	this.stiffness=.1;
	this.linearLimit=.1;
	
	this.angularLimit=1.58;
	
	
	//center ball
	this.ball=null;
	this.ballSize=2;
	this.ballMath=1;
	this.ballMove=2;
	this.ballX=2;
	this.ballY=-8;
	this.ballZ=0;
	
	this.ballRestitution=.1;
	this.ballFriction=.1
	this.ballLinearDamping=1;
	this.ballAngularDamping=1;
	
	this.ammoTimeSteps=60;

	this.lastParticle=null;
	
	this.clothMesh=null;
	

	this.gravityY=-9.8;

	
	var Signal = signals.Signal;

	this.defaultTextureUrl="../../../dataset/texture/patterns/circuit_pattern.png";
	
	this.signals = {
			windowResize: new Signal(),
			rendered:new Signal(),
			loadingTextureStarted:new Signal(),
			loadingTextureFinished:new Signal(),
			ammoSettingUpdated:new Signal(),
			gridSizeChanged:new Signal(),
			ballSizeChanged:new Signal(),
			visibleChanged:new Signal()
	}
	
	var scope=this;
	this.signals.gridSizeChanged.add(function(){
		scope.clothFunction = plane(scope. totalWidth, scope.totalHeight);
		
	});
	this.signals.gridSizeChanged.dispatch();
	
	this.signals.loadingTextureStarted.add (function () {
		if(scope.textureUrl==undefined){
			scope.textureUrl=scope.defaultTextureUrl;
		}
		scope.texture=new THREE.TextureLoader().load(scope.textureUrl);
		scope.texture.wrapS=THREE.RepeatWrapping;
		scope.texture.wrapT=THREE.RepeatWrapping;
		scope.texture.anisotropy=16;
		scope.texture.flipY=false;
		scope.clothMaterial.map=scope.texture;
	} );
	
	this.signals.loadingTextureFinished.add (function () {
		
	} );
	
	
	//from three.js example of webgl_animation_cloth.html
	function plane( width, height ) {

		return function ( u, v, target ) {

			var x = ( u - 0.5 ) * width;
			var y = -( v + 0.5 ) * height;
			var z = 0;

			target.set( x, y, z );

		};

	}
};


Application.prototype = {
		
}