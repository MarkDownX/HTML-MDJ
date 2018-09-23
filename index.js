var isNode = !Window;
var htmlparser = require("htmlparser2");
function mdj2html(mdj){
  var html = "";
  var allowedTags = ["embed","applet","object","script","base","form"];
  for(var i = 0;i < mdj.length;i++){
    if(unsafeTags.indexOf(mdj[i].tag) > -1){html += "<p style='color:red'>Possibly dangerous code was removed here due to the unsafe tag: <" + mdj[i].tag + "></p>";continue;};
    html += "<" + mdj[i].tag + (mdj[i].indent ? (" data-mdj-indent='" + mdj[i].indent + "' style='margin-left:" + mdj[i].indent + "'") : "") + (mdj[i].id ? ("id='" + mdj[i].id + "'") : "") +  + (mdj[i].classes ? ("class='" + mdj[i].classes + "'") : "");
    if(mdj[i].pos){
      var positions = mdj[i].pos.split(",");
      html += " data-mdj-pos='" + mdj[i].pos + "'";
      if(!isNaN(positions[0])){
        html += " style='position: fixed;top: " + positions[0] + "%";
        if(!isNaN(positions[1])){
          html += ";left: " + positions[1] + "%";
          if(!isNaN(positions[2])){
          html += ";width: " + positions[2] + "%";
          if(!isNaN(positions[3])){
            html += ";height: " + positions[3] + "%";
            }
          }
        }
        html += "'"
      }
    };
    html += ">";
    
    html += "</" + mdj[i].tag + ">"
  };
  return html;
}
function html2mdj(html) {
  var lines = [];
  var isInLine = false;
  var thisLine = [];
  var thisLineOpen = [];
  var thisLineTag = "";
  var closingNotNeeded = ["BR","HR","IMG","AREA","BASE","COL","COMMAND","EMBED","INPUT","KEYGEN","LINK","MENUITEM","META","PARAM","SOURCE","TRACK","WBR"];
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs){
        if(isInLine){
          if(closingNotNeeded.indexOf(name) === -1){thisLineOpen.push(name)};
          var thisTag = {tag: name};
          if(name === "img"){
            thisTag.src = attribs.src;
            thisTag.width = attribs["data-mdx-width"];
          };
          if(name === "a"){
            thisTag.href = attribs.href;
          };
          thisTag.data = attribs["data-mdx"];
          thisTag.value = attribs["data-mdx-value"];
          thisLine.push(thisTag);
        }else{
          thisLineTag = name;
          isInLine = true;
          lines.push({id: attribs.id, classes: attribs.class, indent: attribs["data-mdx-indent"], pos: attribs["data-mdx-pos"], content: [], tag: name});
        };
    },
    ontext: function(text){
        thisLine.push(text);
    },
    onclosetag: function(name){
         if(thisLineOpen.length > 0){
           thisLineOpen.pop()
         };
        if(thisLineTag !== name){
          thisLine.push({tag: name, isClosing: true});
        }else{
          isInLine = false;
          lines[lines.length - 1].content = thisLine;
          thisLineTag === "";
        };
     }
  }, {decodeEntities: true});
  parser.write(html);
  parser.end();
  return lines;
}
if(isNode){
  exports.html2mdj = html2mdj;
  exports.mdj2html = mdj2html;
};
