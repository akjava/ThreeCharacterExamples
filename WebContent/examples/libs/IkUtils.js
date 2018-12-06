/*
 * 
 * CCD-IK
 * based on Inverse kinematics and geometric constraints for articulated figure manipulation
 * http://summit.sfu.ca/item/5706
 * and
 * https://mukai-lab.org/content/CcdParticleInverseKinematics.pdf
 * 
 * Original Java Code ,Ported to Javascript by same author
 * https://github.com/akjava/gwt-three.js-test/blob/master/src/com/akjava/gwt/three/client/gwt/boneanimation/ik/CDDIK.java
 * Copyright (C) 2016-2018 aki@akjava.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var IkUtils={
		_sharedQuaternion:new THREE.Quaternion(),
		_jointVector:new THREE.Vector3(),
		_targetVector:new THREE.Vector3(),
		_axis:new THREE.Vector3(),
		_euler:new THREE.Euler(),
		minAngle: THREE.Math.degToRad(0.01),//avoid small change vibration
		logging:false,
		//Vector3(World) lastJointPos,Vector3(World) jointPos,Quaternion(Local) jointRotQ,Vector3(World) targetPos
		/*
		 * simple return difference,Nullable
		 */
		calculateAngles:function(lastJointPos,jointPos,jointRotQ,targetPos){

			IkUtils._jointVector.copy(lastJointPos);
			var jointVector=IkUtils._jointVector.sub(jointPos).normalize();
			IkUtils._targetVector.copy(targetPos);
			var targetVector=IkUtils._targetVector.sub(jointPos).normalize();
			
			var acv=jointVector.dot(targetVector);
			var angle=Math.acos(acv);
			
			if(angle<=IkUtils.minAngle){
				
				if(IkUtils.logging){
					console.log("calculateAngles: lower than minAngle:",angle);
				}
				return null;
			}
			
			var axis=IkUtils._axis.crossVectors(jointVector,targetVector);
			axis.normalize();
			var q=IkUtils._sharedQuaternion.setFromAxisAngle(axis,angle);
			return q;
		},
		stepCalculate:function(lastJointPos,jointPos,jointRotQ,targetPos,maxDegree){
			var q=IkUtils.calculateAngles(lastJointPos,jointPos,jointRotQ,targetPos);
			if(q==null){
				IkUtils._sharedQuaternion.copy(jointRotQ);
				return IkUtils._sharedQuaternion;
			}
			
			//limit maximum
			if(maxDegree!==undefined && maxDegree>0){
				var rad=THREE.Math.degToRad(maxDegree);
				var euler=IkUtils._euler.setFromQuaternion(q);
				
				var max=Math.abs(euler.x);
				if(Math.abs(euler.y)>max){
					max=Math.abs(euler.y);
				}
				if(Math.abs(euler.z)>max){
					max=Math.abs(euler.z);
				}
				if(max>rad){
					var r=max/rad;
					euler.x=euler.x/r;
					euler.y=euler.y/r;
					euler.z=euler.z/r;
				}
				q.setFromEuler(euler);
			}
			
			//marge original rotate
			return q.multiply(jointRotQ);
		}
}