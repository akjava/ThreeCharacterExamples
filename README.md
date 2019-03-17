Three.js Character Animation Example And Tools
===
Sadly my native language is not English.So **READ THE CODE** if you need.
I'm no plan to send pull request because of hard to explain what I made so far.
Feel free to use code via License.

Recently I'm porting from my GWT(Google Web Toolkit) Projects to Three.js style Javascript.
### Code Style
As possible as can,Use similar three.js grammer,not using ES6 style.UI is Use from Three.js Editor source code.
## VRM Examples
[![VRM Test video](http://img.youtube.com/vi/HxU393uhuhI/0.jpg)](http://www.youtube.com/watch?v=HxU393uhuhI "VRM three.js test1")


[VRM](https://akjava.github.io/ThreeCharacterExamples/WebContent/examples/vrm/) - Vrm 3d Character Example

## Not VRM Examples

[Ammo](https://akjava.github.io/ThreeCharacterExamples/WebContent/examples/ammo/) - Basic Simple Ammo Example for understand Character Animation
[Bone](https://akjava.github.io/ThreeCharacterExamples/WebContent/examples/bone/) - Three.js Skeleton Bone System Examples

[MBL3D](https://akjava.github.io/ThreeCharacterExamples/WebContent/examples/mbl3d/) - ManuelBastioniLAB 3D Examples

[CDDIk](https://akjava.github.io/ThreeCharacterExamples/WebContent/examples/ik/) - CDD Ik Examples

[Misc](https://akjava.github.io/ThreeCharacterExamples/WebContent/examples/misc/) - Misc Examples

## If Example not Working
My exaple complexly depends on each other and I did not use any Test tools,That Why some time example broken because of other changing.
So In this case see history and use old code what you want example.

## Model Format
Using Gltf Format has 2 problem.First problem I didnt solve Morph target problem.I'm using gltf-pipeline to compress file,but this is not support morph target.Second Problem is indices weight,some how gltf exported from Blender model's skinning result is not good at some vertex.I have no time to solve problem.

That Why Most of case I'm using FBX Format;perfect skinning,soso goood data compression.
###Bones
I converted bone matrix inside for easy limit-bone-angles,that why export animation not compatible original bone - character.
see BoneUtils.convertToZeroRotatedBoneMesh()

## Usefull Links

https://threejs.org/examples/

https://threejs.org/editor/

[ManuelBastioniLAB](http://www.manuelbastioni.com/) - Example use this character (but project is shutdown so far)

https://github.com/animate1978/MB-Lab (commynity edition of ManuelBastioniLAB 3D)