Clazz.declarePackage ("J.adapter.smarter");
Clazz.load (["JU.P3"], "J.adapter.smarter.XtalSymmetry", ["java.lang.Boolean", "$.Float", "java.util.Hashtable", "JU.BS", "$.M3", "$.M4", "$.P3i", "$.PT", "$.SB", "$.V3", "J.adapter.smarter.Atom", "J.api.Interface", "J.util.BSUtil", "$.Escape", "$.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.ac = null;
this.symmetry = null;
this.notionalUnitCell = null;
this.symmetryRange = 0;
this.doCentroidUnitCell = false;
this.centroidPacked = false;
this.applySymmetryToBonds = false;
this.latticeCells = null;
this.ptSupercell = null;
this.fmatSupercell = null;
this.doNormalize = true;
this.doPackUnitCell = false;
this.rminx = 0;
this.rminy = 0;
this.rminz = 0;
this.rmaxx = 0;
this.rmaxy = 0;
this.rmaxz = 0;
this.ptOffset = null;
this.unitCellOffset = null;
this.minXYZ = null;
this.maxXYZ = null;
this.minXYZ0 = null;
this.maxXYZ0 = null;
this.checkAll = false;
this.bondCount0 = 0;
this.dtype = 3;
this.unitCellTranslations = null;
this.latticeOp = 0;
this.latticeOnly = false;
this.noSymmetryCount = 0;
this.firstSymmetryAtom = 0;
this.ptTemp = null;
this.mTemp = null;
Clazz.instantialize (this, arguments);
}, J.adapter.smarter, "XtalSymmetry");
Clazz.prepareFields (c$, function () {
this.notionalUnitCell =  Clazz.newFloatArray (6, 0);
this.ptOffset =  new JU.P3 ();
});
Clazz.makeConstructor (c$, 
function () {
});
$_M(c$, "set", 
function (atomSetCollection) {
this.ac = atomSetCollection;
this.getSymmetry ();
return this;
}, "J.adapter.smarter.AtomSetCollection");
$_M(c$, "getSymmetry", 
function () {
return (this.symmetry == null ? (this.symmetry = J.api.Interface.getSymmetry ()) : this.symmetry);
});
$_M(c$, "setSymmetry", 
function (symmetry) {
return (this.symmetry = symmetry);
}, "J.api.SymmetryInterface");
$_M(c$, "setSymmetryRange", 
($fz = function (factor) {
this.symmetryRange = factor;
this.ac.setAtomSetCollectionAuxiliaryInfo ("symmetryRange", Float.$valueOf (factor));
}, $fz.isPrivate = true, $fz), "~N");
$_M(c$, "setLatticeCells", 
function (acr) {
this.latticeCells = acr.latticeCells;
var isLatticeRange = (this.latticeCells[0] <= 555 && this.latticeCells[1] >= 555 && (this.latticeCells[2] == 0 || this.latticeCells[2] == 1 || this.latticeCells[2] == -1));
this.doNormalize = this.latticeCells[0] != 0 && (!isLatticeRange || this.latticeCells[2] == 1);
this.applySymmetryToBonds = acr.applySymmetryToBonds;
this.doPackUnitCell = acr.doPackUnitCell;
this.doCentroidUnitCell = acr.doCentroidUnitCell;
this.centroidPacked = acr.centroidPacked;
if (acr.strSupercell != null) this.setSuperCell (acr.strSupercell);
 else this.ptSupercell = acr.ptSupercell;
}, "J.adapter.smarter.AtomSetCollectionReader");
$_M(c$, "setSupercellFromPoint", 
function (pt) {
this.ptSupercell = pt;
J.util.Logger.info ("Using supercell " + J.util.Escape.eP (pt));
}, "JU.P3");
$_M(c$, "setSuperCell", 
($fz = function (supercell) {
if (this.fmatSupercell != null) return;
this.fmatSupercell =  Clazz.newFloatArray (16, 0);
if (this.symmetry.getMatrixFromString (supercell, this.fmatSupercell, true, 0) == null) {
this.fmatSupercell = null;
return;
}J.util.Logger.info ("Using supercell \n" + JU.M4.newA16 (this.fmatSupercell));
}, $fz.isPrivate = true, $fz), "~S");
$_M(c$, "setNotionalUnitCell", 
($fz = function (info, matUnitCellOrientation, unitCellOffset) {
this.notionalUnitCell =  Clazz.newFloatArray (info.length, 0);
this.unitCellOffset = unitCellOffset;
for (var i = 0; i < info.length; i++) this.notionalUnitCell[i] = info[i];

this.ac.haveUnitCell = true;
this.ac.setAtomSetAuxiliaryInfo ("notionalUnitcell", this.notionalUnitCell);
this.ac.setGlobalBoolean (2);
this.getSymmetry ().setUnitCell (this.notionalUnitCell);
if (unitCellOffset != null) {
this.symmetry.setOffsetPt (unitCellOffset);
this.ac.setAtomSetAuxiliaryInfo ("unitCellOffset", unitCellOffset);
}if (matUnitCellOrientation != null) {
this.symmetry.setUnitCellOrientation (matUnitCellOrientation);
this.ac.setAtomSetAuxiliaryInfo ("matUnitCellOrientation", matUnitCellOrientation);
}}, $fz.isPrivate = true, $fz), "~A,JU.M3,JU.P3");
$_M(c$, "addSpaceGroupOperation", 
function (acr, xyz) {
if (acr != null) this.setLatticeCells (acr);
this.symmetry.setSpaceGroup (this.doNormalize);
return this.symmetry.addSpaceGroupOperation (xyz, 0);
}, "J.adapter.smarter.AtomSetCollectionReader,~S");
$_M(c$, "setLatticeParameter", 
function (latt) {
this.symmetry.setSpaceGroup (this.doNormalize);
this.symmetry.setLattice (latt);
}, "~N");
$_M(c$, "applySymmetryFromReader", 
function (acr, readerSymmetry) {
this.ac.setCoordinatesAreFractional (acr.iHaveFractionalCoordinates);
this.setNotionalUnitCell (acr.notionalUnitCell, acr.matUnitCellOrientation, acr.unitCellOffset);
this.ac.setAtomSetSpaceGroupName (acr.spaceGroup);
this.setSymmetryRange (acr.symmetryRange);
if (acr.doConvertToFractional || acr.fileCoordinatesAreFractional) {
this.setLatticeCells (acr);
var doApplySymmetry = true;
if (acr.ignoreFileSpaceGroupName || !acr.iHaveSymmetryOperators) {
if (!acr.merging || readerSymmetry == null) readerSymmetry = acr.getNewSymmetry ();
doApplySymmetry = readerSymmetry.createSpaceGroup (acr.desiredSpaceGroupIndex, (acr.spaceGroup.indexOf ("!") >= 0 ? "P1" : acr.spaceGroup), acr.notionalUnitCell);
} else {
acr.doPreSymmetry ();
readerSymmetry = null;
}if (doApplySymmetry) {
if (readerSymmetry != null) this.symmetry.setSpaceGroupFrom (readerSymmetry);
this.applySymmetryLattice (acr.ms);
if (readerSymmetry != null) this.ac.setAtomSetSpaceGroupName (readerSymmetry.getSpaceGroupName ());
}}if (acr.iHaveFractionalCoordinates && acr.merging && readerSymmetry != null) {
this.ac.toCartesian (readerSymmetry);
this.ac.setCoordinatesAreFractional (false);
acr.addVibrations = false;
}return this.symmetry;
}, "J.adapter.smarter.AtomSetCollectionReader,J.api.SymmetryInterface");
$_M(c$, "applySymmetryLattice", 
($fz = function (ms) {
if (!this.ac.coordinatesAreFractional || this.symmetry.getSpaceGroup () == null) return;
var maxX = this.latticeCells[0];
var maxY = this.latticeCells[1];
var maxZ = Math.abs (this.latticeCells[2]);
if (this.fmatSupercell != null) {
this.rminx = 3.4028235E38;
this.rminy = 3.4028235E38;
this.rminz = 3.4028235E38;
this.rmaxx = -3.4028235E38;
this.rmaxy = -3.4028235E38;
this.rmaxz = -3.4028235E38;
var ptx = this.setSym (0, 1, 2);
var pty = this.setSym (4, 5, 6);
var ptz = this.setSym (8, 9, 10);
this.minXYZ = JU.P3i.new3 (Clazz.floatToInt (this.rminx), Clazz.floatToInt (this.rminy), Clazz.floatToInt (this.rminz));
this.maxXYZ = JU.P3i.new3 (Clazz.floatToInt (this.rmaxx), Clazz.floatToInt (this.rmaxy), Clazz.floatToInt (this.rmaxz));
this.applyAllSymmetry (ms);
var atoms = this.ac.atoms;
var atomCount = this.ac.atomCount;
var iAtomFirst = this.ac.getLastAtomSetAtomIndex ();
for (var i = iAtomFirst; i < atomCount; i++) this.symmetry.toCartesian (atoms[i], true);

this.setNotionalUnitCell ([0, 0, 0, 0, 0, 0, ptx.x, ptx.y, ptx.z, pty.x, pty.y, pty.z, ptz.x, ptz.y, ptz.z], null, this.ac.getAtomSetAuxiliaryInfoValue (-1, "unitCellOffset"));
this.ac.setAtomSetSpaceGroupName ("P1");
this.symmetry.setSpaceGroup (this.doNormalize);
this.symmetry.addSpaceGroupOperation ("x,y,z", 0);
for (var i = iAtomFirst; i < atomCount; i++) this.symmetry.toFractional (atoms[i], true);

this.ac.haveAnisou = false;
this.ac.setAtomSetAuxiliaryInfo ("matUnitCellOrientation", null);
this.doPackUnitCell = false;
}this.minXYZ =  new JU.P3i ();
this.maxXYZ = JU.P3i.new3 (maxX, maxY, maxZ);
this.applyAllSymmetry (ms);
this.fmatSupercell = null;
}, $fz.isPrivate = true, $fz), "J.adapter.smarter.MSInterface");
$_M(c$, "setSym", 
($fz = function (i, j, k) {
var pt =  new JU.P3 ();
pt.set (this.fmatSupercell[i], this.fmatSupercell[j], this.fmatSupercell[k]);
this.setSymmetryMinMax (pt);
this.symmetry.toCartesian (pt, false);
return pt;
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
$_M(c$, "setSymmetryMinMax", 
($fz = function (c) {
if (this.rminx > c.x) this.rminx = c.x;
if (this.rminy > c.y) this.rminy = c.y;
if (this.rminz > c.z) this.rminz = c.z;
if (this.rmaxx < c.x) this.rmaxx = c.x;
if (this.rmaxy < c.y) this.rmaxy = c.y;
if (this.rmaxz < c.z) this.rmaxz = c.z;
}, $fz.isPrivate = true, $fz), "JU.P3");
$_M(c$, "isInSymmetryRange", 
($fz = function (c) {
return (c.x >= this.rminx && c.y >= this.rminy && c.z >= this.rminz && c.x <= this.rmaxx && c.y <= this.rmaxy && c.z <= this.rmaxz);
}, $fz.isPrivate = true, $fz), "JU.P3");
$_M(c$, "isWithinCell", 
function (dtype, pt, minX, maxX, minY, maxY, minZ, maxZ, slop) {
return (pt.x > minX - slop && pt.x < maxX + slop && (dtype < 2 || pt.y > minY - slop && pt.y < maxY + slop) && (dtype < 3 || pt.z > minZ - slop && pt.z < maxZ + slop));
}, "~N,JU.P3,~N,~N,~N,~N,~N,~N,~N");
$_M(c$, "symmetryAddAtoms", 
($fz = function (transX, transY, transZ, baseCount, pt, iCellOpPt, cartesians, ms) {
var isBaseCell = (baseCount == 0);
var addBonds = (this.bondCount0 > this.ac.bondIndex0 && this.applySymmetryToBonds);
var atomMap = (addBonds ?  Clazz.newIntArray (this.noSymmetryCount, 0) : null);
if (this.doPackUnitCell) this.ptOffset.set (transX, transY, transZ);
var range2 = this.symmetryRange * this.symmetryRange;
var checkRangeNoSymmetry = (this.symmetryRange < 0);
var checkRange111 = (this.symmetryRange > 0);
var checkSymmetryMinMax = (isBaseCell && checkRange111);
checkRange111 = new Boolean (checkRange111 & !isBaseCell).valueOf ();
var nOperations = this.symmetry.getSpaceGroupOperationCount ();
if (nOperations == 1) this.ac.checkSpecial = false;
var checkSpecial = this.ac.checkSpecial;
var checkSymmetryRange = (checkRangeNoSymmetry || checkRange111);
var checkDistances = (checkSpecial || checkSymmetryRange);
var addCartesian = (checkSpecial || checkSymmetryMinMax);
var symmetry = this.symmetry;
if (checkRangeNoSymmetry) baseCount = this.noSymmetryCount;
var atomMax = this.firstSymmetryAtom + this.noSymmetryCount;
var ptAtom =  new JU.P3 ();
var code = null;
var subSystemId = '\u0000';
for (var iSym = 0; iSym < nOperations; iSym++) {
if (isBaseCell && iSym == 0 || this.latticeOnly && iSym > 0 && iSym != this.latticeOp) continue;
var pt0 = (checkSpecial ? pt : checkRange111 ? baseCount : 0);
for (var i = this.firstSymmetryAtom; i < atomMax; i++) {
var a = this.ac.atoms[i];
if (a.ignoreSymmetry) continue;
if (this.ac.bsAtoms != null && !this.ac.bsAtoms.get (i)) continue;
if (ms == null) {
symmetry.newSpaceGroupPoint (iSym, a, ptAtom, transX, transY, transZ);
} else {
symmetry = ms.getAtomSymmetry (a, this.symmetry);
symmetry.newSpaceGroupPoint (iSym, a, ptAtom, transX, transY, transZ);
code = symmetry.getSpaceGroupOperationCode (iSym);
if (code != null) {
subSystemId = code.charAt (0);
symmetry = ms.getSymmetryFromCode (code);
if (symmetry.getSpaceGroupOperationCount () == 0) this.finalizeSymmetry (symmetry);
}}var special = null;
var cartesian = JU.P3.newP (ptAtom);
symmetry.toCartesian (cartesian, false);
if (this.doPackUnitCell) {
symmetry.toUnitCell (cartesian, this.ptOffset);
ptAtom.setT (cartesian);
symmetry.toFractional (ptAtom, false);
if (!this.isWithinCell (this.dtype, ptAtom, this.minXYZ0.x, this.maxXYZ0.x, this.minXYZ0.y, this.maxXYZ0.y, this.minXYZ0.z, this.maxXYZ0.z, 0.02)) continue;
}if (checkSymmetryMinMax) this.setSymmetryMinMax (cartesian);
if (checkDistances) {
var minDist2 = 3.4028235E38;
if (checkSymmetryRange && !this.isInSymmetryRange (cartesian)) continue;
var j0 = (this.checkAll ? this.ac.atomCount : pt0);
var name = a.atomName;
var id = (code == null ? a.altLoc : subSystemId);
for (var j = j0; --j >= 0; ) {
var d2 = cartesian.distanceSquared (cartesians[j]);
if (checkSpecial && d2 < 0.0001) {
special = this.ac.atoms[this.firstSymmetryAtom + j];
if ((special.atomName == null || special.atomName.equals (name)) && special.altLoc == id) break;
special = null;
}if (checkRange111 && j < baseCount && d2 < minDist2) minDist2 = d2;
}
if (checkRange111 && minDist2 > range2) continue;
}var atomSite = a.atomSite;
if (special != null) {
if (addBonds) atomMap[atomSite] = special.index;
special.bsSymmetry.set (iCellOpPt + iSym);
special.bsSymmetry.set (iSym);
} else {
if (addBonds) atomMap[atomSite] = this.ac.atomCount;
var atom1 = this.ac.newCloneAtom (a);
atom1.setT (ptAtom);
atom1.atomSite = atomSite;
if (code != null) atom1.altLoc = subSystemId;
atom1.bsSymmetry = J.util.BSUtil.newAndSetBit (iCellOpPt + iSym);
atom1.bsSymmetry.set (iSym);
if (addCartesian) cartesians[pt++] = cartesian;
var tensors = a.tensors;
if (tensors != null) {
atom1.tensors = null;
for (var j = tensors.size (); --j >= 0; ) {
var t = tensors.get (j);
if (t == null) continue;
if (nOperations == 1) atom1.addTensor (t.copyTensor (), null, false);
 else this.addRotatedTensor (atom1, t, iSym, false, symmetry);
}
}}}
if (addBonds) {
var bonds = this.ac.bonds;
var atoms = this.ac.atoms;
for (var bondNum = this.ac.bondIndex0; bondNum < this.bondCount0; bondNum++) {
var bond = bonds[bondNum];
var atom1 = atoms[bond.atomIndex1];
var atom2 = atoms[bond.atomIndex2];
if (atom1 == null || atom2 == null) continue;
var iAtom1 = atomMap[atom1.atomSite];
var iAtom2 = atomMap[atom2.atomSite];
if (iAtom1 >= atomMax || iAtom2 >= atomMax) this.ac.addNewBondWithOrder (iAtom1, iAtom2, bond.order);
}
}}
return pt;
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,~N,~N,~A,J.adapter.smarter.MSInterface");
$_M(c$, "applyAllSymmetry", 
($fz = function (ms) {
if (this.ac.atomCount == 0) return;
this.noSymmetryCount = (this.ac.baseSymmetryAtomCount == 0 ? this.ac.getLastAtomSetAtomCount () : this.ac.baseSymmetryAtomCount);
this.firstSymmetryAtom = this.ac.getLastAtomSetAtomIndex ();
this.ac.setTensors ();
this.bondCount0 = this.ac.bondCount;
this.finalizeSymmetry (this.symmetry);
var operationCount = this.symmetry.getSpaceGroupOperationCount ();
this.dtype = Clazz.floatToInt (this.symmetry.getUnitCellInfoType (6));
this.symmetry.setMinMaxLatticeParameters (this.minXYZ, this.maxXYZ);
if (this.doCentroidUnitCell) this.ac.setAtomSetCollectionAuxiliaryInfo ("centroidMinMax", [this.minXYZ.x, this.minXYZ.y, this.minXYZ.z, this.maxXYZ.x, this.maxXYZ.y, this.maxXYZ.z, (this.centroidPacked ? 1 : 0)]);
if (this.ptSupercell != null) {
this.ac.setAtomSetAuxiliaryInfo ("supercell", this.ptSupercell);
switch (this.dtype) {
case 3:
this.minXYZ.z *= Clazz.floatToInt (Math.abs (this.ptSupercell.z));
this.maxXYZ.z *= Clazz.floatToInt (Math.abs (this.ptSupercell.z));
case 2:
this.minXYZ.y *= Clazz.floatToInt (Math.abs (this.ptSupercell.y));
this.maxXYZ.y *= Clazz.floatToInt (Math.abs (this.ptSupercell.y));
case 1:
this.minXYZ.x *= Clazz.floatToInt (Math.abs (this.ptSupercell.x));
this.maxXYZ.x *= Clazz.floatToInt (Math.abs (this.ptSupercell.x));
}
}if (this.doCentroidUnitCell || this.doPackUnitCell || this.symmetryRange != 0 && this.maxXYZ.x - this.minXYZ.x == 1 && this.maxXYZ.y - this.minXYZ.y == 1 && this.maxXYZ.z - this.minXYZ.z == 1) {
this.minXYZ0 = JU.P3.new3 (this.minXYZ.x, this.minXYZ.y, this.minXYZ.z);
this.maxXYZ0 = JU.P3.new3 (this.maxXYZ.x, this.maxXYZ.y, this.maxXYZ.z);
if (ms != null) {
ms.setMinMax0 (this.minXYZ0, this.maxXYZ0);
this.minXYZ.set (Clazz.floatToInt (this.minXYZ0.x), Clazz.floatToInt (this.minXYZ0.y), Clazz.floatToInt (this.minXYZ0.z));
this.maxXYZ.set (Clazz.floatToInt (this.maxXYZ0.x), Clazz.floatToInt (this.maxXYZ0.y), Clazz.floatToInt (this.maxXYZ0.z));
}switch (this.dtype) {
case 3:
this.minXYZ.z--;
this.maxXYZ.z++;
case 2:
this.minXYZ.y--;
this.maxXYZ.y++;
case 1:
this.minXYZ.x--;
this.maxXYZ.x++;
}
}var nCells = (this.maxXYZ.x - this.minXYZ.x) * (this.maxXYZ.y - this.minXYZ.y) * (this.maxXYZ.z - this.minXYZ.z);
var cartesianCount = (this.ac.checkSpecial ? this.noSymmetryCount * operationCount * nCells : this.symmetryRange > 0 ? this.noSymmetryCount * operationCount : this.symmetryRange < 0 ? 1 : 1);
var cartesians =  new Array (cartesianCount);
for (var i = 0; i < this.noSymmetryCount; i++) this.ac.atoms[i + this.firstSymmetryAtom].bsSymmetry = JU.BS.newN (operationCount * (nCells + 1));

var pt = 0;
var unitCells =  Clazz.newIntArray (nCells, 0);
this.unitCellTranslations =  new Array (nCells);
var iCell = 0;
var cell555Count = 0;
var absRange = Math.abs (this.symmetryRange);
var checkSymmetryRange = (this.symmetryRange != 0);
var checkRangeNoSymmetry = (this.symmetryRange < 0);
var checkRange111 = (this.symmetryRange > 0);
if (checkSymmetryRange) {
this.rminx = 3.4028235E38;
this.rminy = 3.4028235E38;
this.rminz = 3.4028235E38;
this.rmaxx = -3.4028235E38;
this.rmaxy = -3.4028235E38;
this.rmaxz = -3.4028235E38;
}var symmetry = this.symmetry;
var lastSymmetry = symmetry;
this.latticeOp = symmetry.getLatticeOp ();
this.checkAll = (this.ac.atomSetCount == 1 && this.ac.checkSpecial && this.latticeOp >= 0);
this.latticeOnly = (this.ac.checkLatticeOnly && this.latticeOp >= 0);
var op = symmetry.getSpaceGroupOperation (0);
if (this.doPackUnitCell) this.ptOffset.set (0, 0, 0);
for (var tx = this.minXYZ.x; tx < this.maxXYZ.x; tx++) for (var ty = this.minXYZ.y; ty < this.maxXYZ.y; ty++) for (var tz = this.minXYZ.z; tz < this.maxXYZ.z; tz++) {
this.unitCellTranslations[iCell] = JU.V3.new3 (tx, ty, tz);
unitCells[iCell++] = 555 + tx * 100 + ty * 10 + tz;
if (tx != 0 || ty != 0 || tz != 0 || cartesians.length == 0) continue;
for (pt = 0; pt < this.noSymmetryCount; pt++) {
var atom = this.ac.atoms[this.firstSymmetryAtom + pt];
if (ms != null) {
symmetry = ms.getAtomSymmetry (atom, this.symmetry);
if (symmetry !== lastSymmetry) {
if (symmetry.getSpaceGroupOperationCount () == 0) this.finalizeSymmetry (lastSymmetry = symmetry);
op = symmetry.getSpaceGroupOperation (0);
}}var c = JU.P3.newP (atom);
op.rotTrans (c);
symmetry.toCartesian (c, false);
if (this.doPackUnitCell) {
symmetry.toUnitCell (c, this.ptOffset);
atom.setT (c);
symmetry.toFractional (atom, false);
}atom.bsSymmetry.set (iCell * operationCount);
atom.bsSymmetry.set (0);
if (checkSymmetryRange) this.setSymmetryMinMax (c);
if (pt < cartesianCount) cartesians[pt] = c;
}
if (checkRangeNoSymmetry) {
this.rminx -= absRange;
this.rminy -= absRange;
this.rminz -= absRange;
this.rmaxx += absRange;
this.rmaxy += absRange;
this.rmaxz += absRange;
}cell555Count = pt = this.symmetryAddAtoms (0, 0, 0, 0, pt, iCell * operationCount, cartesians, ms);
}


if (checkRange111) {
this.rminx -= absRange;
this.rminy -= absRange;
this.rminz -= absRange;
this.rmaxx += absRange;
this.rmaxy += absRange;
this.rmaxz += absRange;
}iCell = 0;
for (var tx = this.minXYZ.x; tx < this.maxXYZ.x; tx++) for (var ty = this.minXYZ.y; ty < this.maxXYZ.y; ty++) for (var tz = this.minXYZ.z; tz < this.maxXYZ.z; tz++) {
iCell++;
if (tx != 0 || ty != 0 || tz != 0) pt = this.symmetryAddAtoms (tx, ty, tz, cell555Count, pt, iCell * operationCount, cartesians, ms);
}


if (iCell * this.noSymmetryCount == this.ac.atomCount - this.firstSymmetryAtom) this.appendAtomProperties (iCell);
this.setSymmetryOps ();
this.ac.setAtomSetAuxiliaryInfo ("presymmetryAtomIndex", Integer.$valueOf (this.firstSymmetryAtom));
this.ac.setAtomSetAuxiliaryInfo ("presymmetryAtomCount", Integer.$valueOf (this.noSymmetryCount));
this.ac.setAtomSetAuxiliaryInfo ("latticeDesignation", symmetry.getLatticeDesignation ());
this.ac.setAtomSetAuxiliaryInfo ("unitCellRange", unitCells);
this.ac.setAtomSetAuxiliaryInfo ("unitCellTranslations", this.unitCellTranslations);
this.notionalUnitCell =  Clazz.newFloatArray (6, 0);
this.reset ();
}, $fz.isPrivate = true, $fz), "J.adapter.smarter.MSInterface");
$_M(c$, "appendAtomProperties", 
($fz = function (nTimes) {
var p = this.ac.getAtomSetAuxiliaryInfoValue (-1, "atomProperties");
if (p == null) {
return;
}for (var entry, $entry = p.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var key = entry.getKey ();
var data = entry.getValue ();
var s =  new JU.SB ();
for (var i = nTimes; --i >= 0; ) s.append (data);

p.put (key, s.toString ());
}
}, $fz.isPrivate = true, $fz), "~N");
$_M(c$, "finalizeSymmetry", 
($fz = function (symmetry) {
var name = this.ac.getAtomSetAuxiliaryInfoValue (-1, "spaceGroup");
symmetry.setFinalOperations (name, this.ac.atoms, this.firstSymmetryAtom, this.noSymmetryCount, this.doNormalize);
if (name == null || name.equals ("unspecified!")) this.ac.setAtomSetSpaceGroupName (symmetry.getSpaceGroupName ());
}, $fz.isPrivate = true, $fz), "J.api.SymmetryInterface");
$_M(c$, "setSymmetryOps", 
($fz = function () {
var operationCount = this.symmetry.getSpaceGroupOperationCount ();
if (operationCount > 0) {
var symmetryList =  new Array (operationCount);
for (var i = 0; i < operationCount; i++) symmetryList[i] = "" + this.symmetry.getSpaceGroupXyz (i, this.doNormalize);

this.ac.setAtomSetAuxiliaryInfo ("symmetryOperations", symmetryList);
}this.ac.setAtomSetAuxiliaryInfo ("symmetryCount", Integer.$valueOf (operationCount));
}, $fz.isPrivate = true, $fz));
$_M(c$, "applySymmetryBio", 
function (thisBiomolecule, notionalUnitCell, applySymmetryToBonds, filter) {
if (this.latticeCells != null && this.latticeCells[0] != 0) {
J.util.Logger.error ("Cannot apply biomolecule when lattice cells are indicated");
return;
}var particleMode = (filter.indexOf ("BYCHAIN") >= 0 ? 1 : filter.indexOf ("BYSYMOP") >= 0 ? 2 : 0);
this.doNormalize = false;
var biomts = thisBiomolecule.get ("biomts");
if (biomts.size () < 2) return;
this.symmetry = null;
if (!Float.isNaN (notionalUnitCell[0])) this.setNotionalUnitCell (notionalUnitCell, null, this.unitCellOffset);
this.getSymmetry ().setSpaceGroup (this.doNormalize);
this.addSpaceGroupOperation (null, "x,y,z");
var name = thisBiomolecule.get ("name");
this.ac.setAtomSetSpaceGroupName (name);
var len = biomts.size ();
this.applySymmetryToBonds = applySymmetryToBonds;
this.bondCount0 = this.ac.bondCount;
var addBonds = (this.bondCount0 > this.ac.bondIndex0 && applySymmetryToBonds);
var atomMap = (addBonds ?  Clazz.newIntArray (this.ac.atomCount, 0) : null);
this.firstSymmetryAtom = this.ac.getLastAtomSetAtomIndex ();
var atomMax = this.ac.atomCount;
var ht =  new java.util.Hashtable ();
var nChain = 0;
var atoms = this.ac.atoms;
switch (particleMode) {
case 1:
for (var i = atomMax; --i >= this.firstSymmetryAtom; ) {
var id = Integer.$valueOf (atoms[i].chainID);
var bs = ht.get (id);
if (bs == null) {
nChain++;
ht.put (id, bs =  new JU.BS ());
}bs.set (i);
}
this.ac.bsAtoms =  new JU.BS ();
for (var i = 0; i < nChain; i++) {
this.ac.bsAtoms.set (atomMax + i);
var a =  new J.adapter.smarter.Atom ();
a.set (0, 0, 0);
a.radius = 16;
this.ac.addAtom (a);
}
var ichain = 0;
for (var e, $e = ht.entrySet ().iterator (); $e.hasNext () && ((e = $e.next ()) || true);) {
var a = atoms[atomMax + ichain++];
var bs = e.getValue ();
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) a.add (atoms[i]);

a.scale (1 / bs.cardinality ());
a.atomName = "Pt" + ichain;
a.chainID = e.getKey ().intValue ();
}
this.firstSymmetryAtom = atomMax;
atomMax += nChain;
break;
case 2:
this.ac.bsAtoms =  new JU.BS ();
this.ac.bsAtoms.set (atomMax);
var a = atoms[atomMax] =  new J.adapter.smarter.Atom ();
a.set (0, 0, 0);
for (var i = atomMax; --i >= this.firstSymmetryAtom; ) a.add (atoms[i]);

a.scale (1 / (atomMax - this.firstSymmetryAtom));
a.atomName = "Pt";
a.radius = 16;
this.firstSymmetryAtom = atomMax++;
break;
}
if (filter.indexOf ("#<") >= 0) {
len = Math.min (len, JU.PT.parseInt (filter.substring (filter.indexOf ("#<") + 2)) - 1);
filter = JU.PT.rep (filter, "#<", "_<");
}for (var iAtom = this.firstSymmetryAtom; iAtom < atomMax; iAtom++) atoms[iAtom].bsSymmetry = J.util.BSUtil.newAndSetBit (0);

for (var i = 1; i < len; i++) {
if (filter.indexOf ("!#") >= 0) {
if (filter.indexOf ("!#" + (i + 1) + ";") >= 0) continue;
} else if (filter.indexOf ("#") >= 0 && filter.indexOf ("#" + (i + 1) + ";") < 0) {
continue;
}var mat = biomts.get (i);
for (var iAtom = this.firstSymmetryAtom; iAtom < atomMax; iAtom++) {
if (this.ac.bsAtoms != null && !this.ac.bsAtoms.get (iAtom)) continue;
try {
var atomSite = atoms[iAtom].atomSite;
var atom1;
if (addBonds) atomMap[atomSite] = this.ac.atomCount;
atom1 = this.ac.newCloneAtom (atoms[iAtom]);
if (this.ac.bsAtoms != null) this.ac.bsAtoms.set (atom1.index);
atom1.atomSite = atomSite;
mat.rotTrans (atom1);
atom1.bsSymmetry = J.util.BSUtil.newAndSetBit (i);
if (addBonds) {
for (var bondNum = this.ac.bondIndex0; bondNum < this.bondCount0; bondNum++) {
var bond = this.ac.bonds[bondNum];
var iAtom1 = atomMap[atoms[bond.atomIndex1].atomSite];
var iAtom2 = atomMap[atoms[bond.atomIndex2].atomSite];
if (iAtom1 >= atomMax || iAtom2 >= atomMax) this.ac.addNewBondWithOrder (iAtom1, iAtom2, bond.order);
}
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
this.ac.errorMessage = "appendAtomCollection error: " + e;
} else {
throw e;
}
}
}
if (i > 0) this.symmetry.addBioMoleculeOperation (mat, false);
}
this.noSymmetryCount = atomMax - this.firstSymmetryAtom;
this.ac.setAtomSetAuxiliaryInfo ("presymmetryAtomIndex", Integer.$valueOf (this.firstSymmetryAtom));
this.ac.setAtomSetAuxiliaryInfo ("presymmetryAtomCount", Integer.$valueOf (this.noSymmetryCount));
this.ac.setAtomSetAuxiliaryInfo ("biosymmetryCount", Integer.$valueOf (len));
this.ac.setAtomSetAuxiliaryInfo ("biosymmetry", this.symmetry);
this.finalizeSymmetry (this.symmetry);
this.setSymmetryOps ();
this.reset ();
}, "java.util.Map,~A,~B,~S");
$_M(c$, "reset", 
($fz = function () {
this.ac.coordinatesAreFractional = false;
this.ac.setAtomSetAuxiliaryInfo ("hasSymmetry", Boolean.TRUE);
this.ac.setGlobalBoolean (1);
}, $fz.isPrivate = true, $fz));
$_M(c$, "addRotatedTensor", 
function (a, t, iSym, reset, symmetry) {
if (this.ptTemp == null) {
this.ptTemp =  new JU.P3 ();
this.mTemp =  new JU.M3 ();
}return a.addTensor ((J.api.Interface.getOptionInterface ("util.Tensor")).setFromEigenVectors (symmetry.rotateAxes (iSym, t.eigenVectors, this.ptTemp, this.mTemp), t.eigenValues, t.isIsotropic ? "iso" : t.type, t.id), null, reset);
}, "J.adapter.smarter.Atom,J.util.Tensor,~N,~B,J.api.SymmetryInterface");
$_M(c$, "setTensors", 
function () {
var n = this.ac.atomCount;
for (var i = this.ac.getLastAtomSetAtomIndex (); i < n; i++) {
var a = this.ac.atoms[i];
a.addTensor (this.symmetry.getTensor (a.anisoBorU), null, false);
}
});
Clazz.defineStatics (c$,
"PARTICLE_NONE", 0,
"PARTICLE_CHAIN", 1,
"PARTICLE_SYMOP", 2);
});
