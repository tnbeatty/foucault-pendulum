/**
 *
 */


THREE.CoinGeometry = function(radius, height, radiusSegments, heightSegments, capTexture, sideColor) {
	var sideGeometry = new THREE.CylinderGeometry(radius, radius, height, radiusSegments, heightSegments, true);
	var capGeometry = new THREE.Geometry();
	var r = radius;
	for (var i = 0; i < (radiusSegments); i++) {
		var a = i * 1 / 100 * Math.PI * 2;
		var z = Math.sin(a);
		var x = Math.cos(a);
		var a1 = (i + 1) * 1 / 100 * Math.PI * 2;
		var z1 = Math.sin(a1);
		var x1 = Math.cos(a1);
		capGeometry.vertices.push(
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(x * r, 0, z * r),
			new THREE.Vector3(x1 * r, 0, z1 * r)
		);
		capGeometry.faceVertexUvs[0].push([
			new THREE.Vector2(0.5, 0.5),
			new THREE.Vector2(x / 2 + 0.5, z / 2 + 0.5),
			new THREE.Vector2(x1 / 2 + 0.5, z1 / 2 + 0.5)
		]);
		capGeometry.faces.push(new THREE.Face3(i * 3, i * 3 + 1, i * 3 + 2));
	}
	capGeometry.computeCentroids();
	capGeometry.computeFaceNormals();

	var sideMaterial =
		new THREE.MeshLambertMaterial({
			color: sideColor
		});
	var coinSide =
		new THREE.Mesh(sideGeometry, sideMaterial);

	var capMaterial = new THREE.MeshLambertMaterial({
		map: capTexture
	});
	var capTop = new THREE.Mesh(capGeometry, capMaterial);
	var capBottom = new THREE.Mesh(capGeometry, capMaterial);
	capTop.position.y = 0.5;
	capBottom.position.y = -0.5;
	capTop.rotation.x = Math.PI;
	capBottom.rotation.y = Math.PI;

	var coin = new THREE.Object3D();
	coin.add(coinSide);
	coin.add(capTop);
	coin.add(capBottom);

	return coin;
}