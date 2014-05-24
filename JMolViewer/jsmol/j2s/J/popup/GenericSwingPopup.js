Clazz.declarePackage ("J.popup");
Clazz.load (["javajs.api.GenericMenuInterface", "java.util.Hashtable", "JU.List"], "J.popup.GenericSwingPopup", ["java.util.StringTokenizer", "JU.PT", "$.SB", "J.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.helper = null;
this.strMenuStructure = null;
this.allowSignedFeatures = false;
this.isJS = false;
this.isApplet = false;
this.isSigned = false;
this.thisx = 0;
this.thisy = 0;
this.isTainted = true;
this.menuName = null;
this.popupMenu = null;
this.thisPopup = null;
this.htCheckbox = null;
this.buttonGroup = null;
this.currentMenuItemId = null;
this.htMenus = null;
this.SignedOnly = null;
Clazz.instantialize (this, arguments);
}, J.popup, "GenericSwingPopup", null, javajs.api.GenericMenuInterface);
Clazz.prepareFields (c$, function () {
this.htCheckbox =  new java.util.Hashtable ();
this.htMenus =  new java.util.Hashtable ();
this.SignedOnly =  new JU.List ();
});
$_M(c$, "initSwing", 
function (title, bundle, applet, isJS, isSigned) {
this.isJS = isJS;
this.isApplet = (applet != null);
this.isSigned = isSigned;
this.allowSignedFeatures = (!this.isApplet || isSigned);
this.menuName = title;
this.popupMenu = this.helper.menuCreatePopup (title, applet);
this.thisPopup = this.popupMenu;
this.htMenus.put (title, this.popupMenu);
this.addMenuItems ("", title, this.popupMenu, bundle);
try {
this.jpiUpdateComputedMenus ();
} catch (e) {
if (Clazz.exceptionOf (e, NullPointerException)) {
} else {
throw e;
}
}
}, "~S,J.popup.PopupResource,~O,~B,~B");
$_M(c$, "addMenuItems", 
function (parentId, key, menu, popupResourceBundle) {
var id = parentId + "." + key;
var value = popupResourceBundle.getStructure (key);
if (J.util.Logger.debugging) J.util.Logger.debug (id + " --- " + value);
if (value == null) {
this.menuCreateItem (menu, "#" + key, "", "");
return;
}var st =  new java.util.StringTokenizer (value);
var item;
while (value.indexOf ("@") >= 0) {
var s = "";
while (st.hasMoreTokens ()) s += " " + ((item = st.nextToken ()).startsWith ("@") ? popupResourceBundle.getStructure (item) : item);

value = s.substring (1);
st =  new java.util.StringTokenizer (value);
}
while (st.hasMoreTokens ()) {
item = st.nextToken ();
if (!this.checkKey (item)) continue;
if ("-".equals (item)) {
this.menuAddSeparator (menu);
continue;
}var label = popupResourceBundle.getWord (item);
var newItem = null;
var script = "";
var isCB = false;
label = this.appFixLabel (label == null ? item : label);
if (label.equals ("null")) {
continue;
}if (item.indexOf ("Menu") >= 0) {
if (item.indexOf ("more") < 0) this.helper.menuAddButtonGroup (null);
var subMenu = this.menuNewSubMenu (label, id + "." + item);
this.menuAddSubMenu (menu, subMenu);
if (item.indexOf ("Computed") < 0) this.addMenuItems (id, item, subMenu, popupResourceBundle);
this.appCheckSpecialMenu (item, subMenu, label);
newItem = subMenu;
} else if (item.endsWith ("Checkbox") || (isCB = (item.endsWith ("CB") || item.endsWith ("RD")))) {
script = popupResourceBundle.getStructure (item);
var basename = item.substring (0, item.length - (!isCB ? 8 : 2));
var isRadio = (isCB && item.endsWith ("RD"));
if (script == null || script.length == 0 && !isRadio) script = "set " + basename + " T/F";
newItem = this.menuCreateCheckboxItem (menu, label, basename + ":" + script, id + "." + item, false, isRadio);
this.rememberCheckbox (basename, newItem);
if (isRadio) this.helper.menuAddButtonGroup (newItem);
} else {
script = popupResourceBundle.getStructure (item);
if (script == null) script = item;
newItem = this.menuCreateItem (menu, label, script, id + "." + item);
}this.htMenus.put (item, newItem);
if (item.startsWith ("SIGNED")) {
this.SignedOnly.addLast (newItem);
if (!this.allowSignedFeatures) this.menuEnable (newItem, false);
}this.appCheckItem (item, newItem);
}
}, "~S,~S,javajs.api.SC,J.popup.PopupResource");
$_M(c$, "updateSignedAppletItems", 
function () {
for (var i = this.SignedOnly.size (); --i >= 0; ) this.menuEnable (this.SignedOnly.get (i), this.allowSignedFeatures);

});
$_M(c$, "checkKey", 
($fz = function (key) {
{
return (key.indexOf("JAVA") < 0 && !(key.indexOf("NOGL") &&
this.viewer.isWebGL));
}}, $fz.isPrivate = true, $fz), "~S");
$_M(c$, "rememberCheckbox", 
($fz = function (key, checkboxMenuItem) {
this.htCheckbox.put (key + "::" + this.htCheckbox.size (), checkboxMenuItem);
}, $fz.isPrivate = true, $fz), "~S,javajs.api.SC");
$_M(c$, "updateButton", 
function (b, entry, script) {
var ret = [entry];
var icon = this.getEntryIcon (ret);
entry = ret[0];
b.init (entry, icon, script, this.thisPopup);
this.isTainted = true;
}, "javajs.api.SC,~S,~S");
$_M(c$, "getEntryIcon", 
function (ret) {
var entry = ret[0];
if (!entry.startsWith ("<")) return null;
var pt = entry.indexOf (">");
ret[0] = entry.substring (pt + 1);
var fileName = entry.substring (1, pt);
return this.getImageIcon (fileName);
}, "~A");
$_M(c$, "addMenuItem", 
function (menuItem, entry) {
return this.menuCreateItem (menuItem, entry, "", null);
}, "javajs.api.SC,~S");
$_M(c$, "menuSetLabel", 
function (m, entry) {
m.setText (entry);
this.isTainted = true;
}, "javajs.api.SC,~S");
$_M(c$, "menuSetCheckBoxValue", 
($fz = function (source) {
var isSelected = source.isSelected ();
var what = source.getActionCommand ();
this.checkForCheckBoxScript (source, what, isSelected);
this.appUpdateSpecialCheckBoxValue (source, what, isSelected);
this.isTainted = true;
}, $fz.isPrivate = true, $fz), "javajs.api.SC");
$_V(c$, "menuClickCallback", 
function (source, script) {
this.processClickCallback (source, script);
}, "javajs.api.SC,~S");
$_M(c$, "processClickCallback", 
function (source, script) {
this.appRestorePopupMenu ();
if (script == null || script.length == 0) return;
if (script.equals ("MAIN")) {
this.show (this.thisx, this.thisy, true);
return;
}var id = this.menuGetId (source);
if (id != null) {
script = this.appFixScript (id, script);
this.currentMenuItemId = id;
}this.appRunScript (script);
}, "javajs.api.SC,~S");
$_V(c$, "menuCheckBoxCallback", 
function (source) {
this.appRestorePopupMenu ();
this.menuSetCheckBoxValue (source);
var id = this.menuGetId (source);
if (id != null) {
this.currentMenuItemId = id;
}}, "javajs.api.SC");
$_M(c$, "checkForCheckBoxScript", 
($fz = function (item, what, TF) {
if (!item.isEnabled ()) return;
if (what.indexOf ("##") < 0) {
var pt = what.indexOf (":");
if (pt < 0) {
J.util.Logger.error ("check box " + item + " IS " + what);
return;
}var basename = what.substring (0, pt);
if (this.appIsSpecialCheckBox (item, basename, what, TF)) return;
what = what.substring (pt + 1);
if ((pt = what.indexOf ("|")) >= 0) what = (TF ? what.substring (0, pt) : what.substring (pt + 1)).trim ();
what = JU.PT.rep (what, "T/F", (TF ? " TRUE" : " FALSE"));
}this.appRunScript (what);
}, $fz.isPrivate = true, $fz), "javajs.api.SC,~S,~B");
$_M(c$, "menuCreateItem", 
function (menu, entry, script, id) {
var item = this.helper.getMenuItem (entry);
item.addActionListener (this.helper);
return this.newMenuItem (item, menu, entry, script, id);
}, "javajs.api.SC,~S,~S,~S");
$_M(c$, "menuCreateCheckboxItem", 
function (menu, entry, basename, id, state, isRadio) {
var jmi = (isRadio ? this.helper.getRadio (entry) : this.helper.getCheckBox (entry));
jmi.setSelected (state);
jmi.addItemListener (this.helper);
return this.newMenuItem (jmi, menu, entry, basename, id);
}, "javajs.api.SC,~S,~S,~S,~B,~B");
$_M(c$, "menuAddSeparator", 
function (menu) {
menu.add (this.helper.getMenuItem (null));
this.isTainted = true;
}, "javajs.api.SC");
$_M(c$, "menuNewSubMenu", 
function (entry, id) {
var jm = this.helper.getMenu (entry);
this.updateButton (jm, entry, null);
jm.setName (id);
jm.setAutoscrolls (true);
return jm;
}, "~S,~S");
$_M(c$, "menuRemoveAll", 
function (menu, indexFrom) {
if (indexFrom <= 0) menu.removeAll ();
 else for (var i = menu.getComponentCount (); --i >= indexFrom; ) menu.remove (i);

this.isTainted = true;
}, "javajs.api.SC,~N");
$_M(c$, "newMenuItem", 
($fz = function (item, menu, text, script, id) {
this.updateButton (item, text, script);
if (id != null && id.startsWith ("Focus")) {
item.addMouseListener (this.helper);
id = menu.getName () + "." + id;
}item.setName (id == null ? menu.getName () + "." : id);
this.menuAddItem (menu, item);
return item;
}, $fz.isPrivate = true, $fz), "javajs.api.SC,javajs.api.SC,~S,~S,~S");
$_M(c$, "setText", 
function (item, text) {
var m = this.htMenus.get (item);
if (m != null) m.setText (text);
return m;
}, "~S,~S");
$_M(c$, "menuAddItem", 
($fz = function (menu, item) {
menu.add (item);
this.isTainted = true;
}, $fz.isPrivate = true, $fz), "javajs.api.SC,javajs.api.SC");
$_M(c$, "menuAddSubMenu", 
function (menu, subMenu) {
this.menuAddItem (menu, subMenu);
}, "javajs.api.SC,javajs.api.SC");
$_M(c$, "menuEnable", 
function (component, enable) {
if (component == null || component.isEnabled () == enable) return;
component.setEnabled (enable);
}, "javajs.api.SC,~B");
$_M(c$, "menuGetId", 
function (menu) {
return menu.getName ();
}, "javajs.api.SC");
$_M(c$, "menuSetAutoscrolls", 
function (menu) {
menu.setAutoscrolls (true);
this.isTainted = true;
}, "javajs.api.SC");
$_M(c$, "menuGetListPosition", 
function (item) {
var p = item.getParent ();
var i;
for (i = p.getComponentCount (); --i >= 0; ) if (this.helper.getSwingComponent (p.getComponent (i)) === item) break;

return i;
}, "javajs.api.SC");
$_M(c$, "show", 
function (x, y, doPopup) {
this.thisx = x;
this.thisy = y;
this.appUpdateForShow ();
this.updateCheckBoxesForShow ();
if (doPopup) this.menuShowPopup (this.popupMenu, this.thisx, this.thisy);
}, "~N,~N,~B");
$_M(c$, "updateCheckBoxesForShow", 
($fz = function () {
for (var entry, $entry = this.htCheckbox.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var key = entry.getKey ();
var item = entry.getValue ();
var basename = key.substring (0, key.indexOf (":"));
var b = this.appGetBooleanProperty (basename);
if (item.isSelected () != b) {
item.setSelected (b);
this.isTainted = true;
}}
}, $fz.isPrivate = true, $fz));
$_V(c$, "jpiGetMenuAsString", 
function (title) {
this.appUpdateForShow ();
var pt = title.indexOf ("|");
if (pt >= 0) {
var type = title.substring (pt);
title = title.substring (0, pt);
if (type.indexOf ("current") >= 0) {
var sb =  new JU.SB ();
var menu = this.htMenus.get (this.menuName);
this.menuGetAsText (sb, 0, menu, "PopupMenu");
return sb.toString ();
}}return this.appGetMenuAsString (title);
}, "~S");
$_M(c$, "menuGetAsText", 
($fz = function (sb, level, menu, menuName) {
var name = menuName;
var subMenus = menu.getComponents ();
var flags = null;
var script = null;
var text = null;
var key = 'S';
for (var i = 0; i < subMenus.length; i++) {
var m = this.helper.getSwingComponent (subMenus[i]);
var type = this.helper.getItemType (m);
switch (type) {
case 4:
key = 'M';
name = m.getName ();
flags = "enabled:" + m.isEnabled ();
text = m.getText ();
script = null;
break;
case 0:
key = 'S';
flags = script = text = null;
break;
default:
key = 'I';
flags = "enabled:" + m.isEnabled ();
if (type == 2 || type == 3) flags += ";checked:" + m.isSelected ();
script = this.appFixScript (m.getName (), m.getActionCommand ());
name = m.getName ();
text = m.getText ();
break;
}
J.popup.GenericSwingPopup.addItemText (sb, key, level, name, text, script, flags);
if (type == 2) this.menuGetAsText (sb, level + 1, this.helper.getSwingComponent (m.getPopupMenu ()), name);
}
}, $fz.isPrivate = true, $fz), "JU.SB,~N,javajs.api.SC,~S");
c$.addItemText = $_M(c$, "addItemText", 
($fz = function (sb, type, level, name, label, script, flags) {
sb.appendC (type).appendI (level).appendC ('\t').append (name);
if (label == null) {
sb.append (".\n");
return;
}sb.append ("\t").append (label).append ("\t").append (script == null || script.length == 0 ? "-" : script).append ("\t").append (flags).append ("\n");
}, $fz.isPrivate = true, $fz), "JU.SB,~S,~N,~S,~S,~S,~S");
c$.convertToMegabytes = $_M(c$, "convertToMegabytes", 
function (num) {
if (num <= 9223372036854251519) num += 524288;
return (Clazz.doubleToInt (num / (1048576)));
}, "~N");
});
