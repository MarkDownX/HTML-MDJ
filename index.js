var isNode = !Window;
var htmlparser = require("htmlparser2");
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
          };
          if(name === "a"){
            thisTag.href = attribs.href;
          };
          thisTag.data = attribs["data-mdx"];
          thisLine.push(thisTag);
        }else{
          thisLineTag = name;
          isInLine = true;
          lines.push({id: attribs.id, classes: attribs.classes, pos: attribs["data-mdx-pos"], content: [], type: name});
        };
    },
    ontext: function(text){
        thisLine.push(text);
    },
    onclosetag: function(name){
         if(thisLineOpen.length > 0){
           thisLineOpen.pop()
         };
        if(thisLineOpen.length > 0){
          thisLine.push({name: name, isClosing: true});
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
