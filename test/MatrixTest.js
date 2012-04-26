(function() {
  'use strict';

  module('Matrix');

  test('constants', function() {
    deepEqual(DivSugar.Matrix.UNIT, new DivSugar.Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0));
  });

  test('constructor', function() {
    var mat1 = new DivSugar.Matrix();
    deepEqual(mat1.xAxis, DivSugar.Vector.X_UNIT);
    deepEqual(mat1.yAxis, DivSugar.Vector.Y_UNIT);
    deepEqual(mat1.zAxis, DivSugar.Vector.Z_UNIT);
    deepEqual(mat1.trans, DivSugar.Vector.ZERO);

    var mat2 = new DivSugar.Matrix(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
    deepEqual(mat2.xAxis, new DivSugar.Vector(1, 2, 3));
    deepEqual(mat2.yAxis, new DivSugar.Vector(4, 5, 6));
    deepEqual(mat2.zAxis, new DivSugar.Vector(7, 8, 9));
    deepEqual(mat2.trans, new DivSugar.Vector(10, 11, 12));

    var mat3 = new DivSugar.Matrix(mat2);
    deepEqual(mat3.xAxis, new DivSugar.Vector(1, 2, 3));
    deepEqual(mat3.yAxis, new DivSugar.Vector(4, 5, 6));
    deepEqual(mat3.zAxis, new DivSugar.Vector(7, 8, 9));
    deepEqual(mat3.trans, new DivSugar.Vector(10, 11, 12));
  });

  test('set', function() {
    var mat1 = new DivSugar.Matrix();
    mat1.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
    deepEqual(mat1, new DivSugar.Matrix(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12));

    var mat2 = new DivSugar.Matrix();
    mat2.set(mat1);
    deepEqual(mat2, new DivSugar.Matrix(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12));

    ok(mat1.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12).set(mat2).set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12));
  });

  test('fromQuaternion', function() {
    var quat1 = new DivSugar.Quaternion(0, 0, 0, 1);
    var mat1 = new DivSugar.Matrix();
    mat1.fromQuaternion(quat1);
    deepEqual(mat1, DivSugar.Matrix.UNIT);

    ok(mat1.fromQuaternion(quat1).fromQuaternion(quat1));
  });

  test('orthonormalize', function() {
    var mat1 = new DivSugar.Matrix(0.1, 0.2, 0.3, 0, 3, 3, 0, 0, 0.1, 1, 0, 0);
    var mat2 = new DivSugar.Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0);
    mat1.orthonormalize();
    deepEqual(mat1, mat2);

    ok(mat1.orthonormalize().orthonormalize());
  });

  test('rotateX', function() {
    var mat1 = new DivSugar.Matrix(0, 0, -1, -1, 0, 0, 0, 1, 0, 100, 200, 300);
    var mat2 = new DivSugar.Matrix(0, 0, -1, 0, 1, 0, 1, 0, 0, 100, 200, 300);
    mat1.rotateX(90);
    nearlyEqual(mat1, mat2);

    ok(mat1.rotateX(0).rotateX(0));
  });

  test('rotateY', function() {
    var mat1 = new DivSugar.Matrix(0, 0, -1, -1, 0, 0, 0, 1, 0, 100, 200, 300);
    var mat2 = new DivSugar.Matrix(0, -1, 0, -1, 0, 0, 0, 0, -1, 100, 200, 300);
    mat1.rotateY(90);
    nearlyEqual(mat1, mat2);

    ok(mat1.rotateY(0).rotateY(0));
  });

  test('rotateZ', function() {
    var mat1 = new DivSugar.Matrix(0, 0, -1, -1, 0, 0, 0, 1, 0, 100, 200, 300);
    var mat2 = new DivSugar.Matrix(-1, 0, 0, 0, 0, 1, 0, 1, 0, 100, 200, 300);
    mat1.rotateZ(90);
    nearlyEqual(mat1, mat2);

    ok(mat1.rotateZ(0).rotateZ(0));
  });

  test('scale', function() {
    var mat1 = new DivSugar.Matrix(0, 0, -1, -1, 0, 0, 0, 1, 0, 100, 200, 300);
    var mat2 = new DivSugar.Matrix(0, 0, -2, -3, 0, 0, 0, -1, 0, 100, 200, 300);
    mat1.scale(2, 3, -1);
    deepEqual(mat1, mat2);

    ok(mat1.scale(1, 1, 1).scale(1, 1, 1));
  });

  test('translate', function() {
    var mat1 = new DivSugar.Matrix(0, 0, -1, -1, 0, 0, 0, 1, 0, 100, 200, 300);
    var mat2 = new DivSugar.Matrix(0, 0, -1, -1, 0, 0, 0, 1, 0, 120, 230, 290);
    mat1.translate(10, -20, 30);
    deepEqual(mat1, mat2);

    ok(mat1.translate(0, 0, 0).translate(0, 0, 0));
  });

  test('slerp', function() {
    var ratio;
    var mat1 = new DivSugar.Matrix();
    var mat2 = new DivSugar.Matrix();
    var mat3 = new DivSugar.Matrix();

    for (var ratio = 0; ratio <= 1; ratio += 0.1) {
      mat1.set(DivSugar.Matrix.UNIT);
      mat2.set(DivSugar.Matrix.UNIT).translate(2, 4, 6).rotateX(90);
      mat3.set(DivSugar.Matrix.UNIT).translate(2 * ratio, 4 * ratio, 6 * ratio).rotateX(90 * ratio);
      mat1.slerp(mat2, ratio);
      nearlyEqual(mat1, mat3);

      mat1.set(DivSugar.Matrix.UNIT);
      mat2.set(DivSugar.Matrix.UNIT).translate(2, 4, 6).rotateY(90);
      mat3.set(DivSugar.Matrix.UNIT).translate(2 * ratio, 4 * ratio, 6 * ratio).rotateY(90 * ratio);
      mat1.slerp(mat2, ratio);
      nearlyEqual(mat1, mat3);

      mat1.set(DivSugar.Matrix.UNIT);
      mat2.set(DivSugar.Matrix.UNIT).translate(2, 4, 6).rotateZ(90);
      mat3.set(DivSugar.Matrix.UNIT).translate(2 * ratio, 4 * ratio, 6 * ratio).rotateZ(90 * ratio);
      mat1.slerp(mat2, ratio);
      nearlyEqual(mat1, mat3);
    }

    ok(mat1.slerp(mat2, 0).slerp(mat2, 0.5).slerp(mat2, 1).slerp(mat2, 0));
  });

  test('slerp_noTrans', function() {
    var mat1 = new DivSugar.Matrix();
    var mat2 = new DivSugar.Matrix();
    var mat3 = new DivSugar.Matrix();

    for (var ratio = 0; ratio <= 1; ratio += 0.1) {
      mat1.set(DivSugar.Matrix.UNIT).translate(1, 2, 3);
      mat2.set(DivSugar.Matrix.UNIT).translate(2, 4, 6).rotateX(90);
      mat3.set(DivSugar.Matrix.UNIT).rotateX(90 * ratio);
      mat1.slerp_noTrans(mat2, ratio);
      nearlyEqual(mat1, mat3);

      mat1.set(DivSugar.Matrix.UNIT).translate(1, 2, 3);
      mat2.set(DivSugar.Matrix.UNIT).translate(2, 4, 6).rotateY(90);
      mat3.set(DivSugar.Matrix.UNIT).rotateY(90 * ratio);
      mat1.slerp_noTrans(mat2, ratio);
      nearlyEqual(mat1, mat3);

      mat1.set(DivSugar.Matrix.UNIT).translate(1, 2, 3);
      mat2.set(DivSugar.Matrix.UNIT).translate(2, 4, 6).rotateZ(90);
      mat3.set(DivSugar.Matrix.UNIT).rotateZ(90 * ratio);
      mat1.slerp_noTrans(mat2, ratio);
      nearlyEqual(mat1, mat3);
    }

    ok(mat1.slerp_noTrans(mat2, 0).slerp_noTrans(mat2, 0.5).slerp_noTrans(mat2, 1).slerp_noTrans(mat2, 0));
  });

  test('toLocal', function() {
    var mat1 = new DivSugar.Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 3, 4, 5);
    var mat2 = new DivSugar.Matrix(0, 0, 0.5, 2, 0, 0, 0, -0.5, 0, 1, 2, 3);
    var mat3 = new DivSugar.Matrix(0, 0.5, 0, 0, 0, -2, 2, 0, 0, 4, 1, -4);
    mat1.toLocal(mat2);
    deepEqual(mat1, mat3);

    ok(mat1.toLocal(mat2).toLocal(mat2));
  });

  test('toGlobal', function() {
    var mat1 = new DivSugar.Matrix(0, 0.5, 0, 0, 0, -2, 2, 0, 0, 4, 1, -4);
    var mat2 = new DivSugar.Matrix(0, 0, 0.5, 2, 0, 0, 0, -0.5, 0, 1, 2, 3);
    var mat3 = new DivSugar.Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 3, 4, 5);
    mat1.toGlobal(mat2);
    deepEqual(mat1, mat3);

    ok(mat1.toGlobal(mat2).toGlobal(mat2));
  });

  test('toLocal_noTrans', function() {
    var mat1 = new DivSugar.Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 3, 4, 5);
    var mat2 = new DivSugar.Matrix(0, 0, 0.5, 2, 0, 0, 0, -0.5, 0, 1, 2, 3);
    var mat3 = new DivSugar.Matrix(0, 0.5, 0, 0, 0, -2, 2, 0, 0, 0, 0, 0);
    mat1.toLocal_noTrans(mat2);
    deepEqual(mat1, mat3);

    ok(mat1.toLocal_noTrans(mat2).toLocal_noTrans(mat2));
  });

  test('toGlobal_noTrans', function() {
    var mat1 = new DivSugar.Matrix(0, 0.5, 0, 0, 0, -2, 2, 0, 0, 0, 0, 0);
    var mat2 = new DivSugar.Matrix(0, 0, 0.5, 2, 0, 0, 0, -0.5, 0, 1, 2, 3);
    var mat3 = new DivSugar.Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0);
    mat1.toGlobal_noTrans(mat2);
    deepEqual(mat1, mat3);

    ok(mat1.toGlobal_noTrans(mat2).toGlobal_noTrans(mat2));
  });

  test('lookAt', function() {
    var mat1 = new DivSugar.Matrix();
    var mat2 = new DivSugar.Matrix(0, 1, 0, 0, 0, 1, 1, 0, 0, 5, 2, -3);
    mat1.lookAt(new DivSugar.Vector(5, 2, -3), new DivSugar.Vector(-5, 2, -3), new DivSugar.Vector(1, 0, 10));
    deepEqual(mat1, mat2);

    ok(mat1.lookAt(DivSugar.Vector.ZERO, DivSugar.Vector.Z_UNIT, DivSugar.Vector.Y_UNIT)
      .lookAt(DivSugar.Vector.ZERO, DivSugar.Vector.Z_UNIT, DivSugar.Vector.Y_UNIT));
  });

  test('equal', function() {
    var mat1 = new DivSugar.Matrix(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
    var mat2 = new DivSugar.Matrix(mat1);
    ok(mat1.equal(mat2));

    mat2.set(mat1);
    mat2.xAxis.x += 0.1;
    ok(!mat1.equal(mat2));

    mat2.set(mat1);
    mat2.yAxis.y += 0.1;
    ok(!mat1.equal(mat2));

    mat2.set(mat1);
    mat2.zAxis.z += 0.1;
    ok(!mat1.equal(mat2));

    mat2.set(mat1);
    mat2.trans.x += 0.1;
    ok(!mat1.equal(mat2));
  });

  test('toString', function() {
    var mat1 = new DivSugar.Matrix(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
    strictEqual(mat1.toString(), '((1, 2, 3), (4, 5, 6), (7, 8, 9), (10, 11, 12))');
  });

  test('toCSSTransform', function() {
    var mat1 = new DivSugar.Matrix(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
    strictEqual(mat1.toCSSTransform(), 'matrix3d(1, 2, 3, 0, 4, 5, 6, 0, 7, 8, 9, 0, 10, 11, 12, 1)');
  });
})();
