//http://stackoverflow.com/a/8412989/57883
var parseXml;
if (typeof window.DOMParser != "undefined") {
    parseXml = function(xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
          parseXml = function(xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
} else {
    throw new Error("No XML parser found");
}

 function type(obj) {
    var obj_type = typeof obj;
    return ({
        is: function (type) {
            return obj_type === type;
        },
        is_object: function () {
            return obj_type === "object";
        },
        is_func: function () {
            return obj_type === "function";
        },
        is_string: function () {
            return obj_type === "string";
        }
    });
};

function maybe(item,message) {
    var _message=message;
    return ({
        result: function (accessor, __default) {
            if (!item) return type(accessor).is_func() ? __default : accessor;
            else return type(accessor).is_func() ? accessor(item) : item;
        },message:message,
        _: function (accessor,message) {
            if (!item) return maybe(null,_message);
            if (!accessor && type(item).is_func()) {

                return maybe(item(),message);
            }
            if (type(accessor).is_string()) {
                if (item.hasOwnProperty(accessor)) return maybe(item[accessor],message);
                var result = item[accessor];
                if (result) return maybe(item[accessor].call(item),message);

                return maybe(result,message);
            }
            if (type(accessor).is_func()) {

                return maybe(accessor(item),message);
            }

            return maybe(item[accessor],message);
        }
    });
};
var maybeDefine= function(owner,identifier,definition){
    if(!owner[identifier])
        owner[identifier]=definition;
};
maybeDefine(String.prototype,'beforeLast',function(value){
      var index= this.lastIndexOf(value);
      if(index===-1)
        throw "value not found:"+value+" in "+this;
      return this.substring(0,index);
    });

maybeDefine(String.prototype,'afterLast',function(value){
      var index= this.lastIndexOf(value);
      if(index===-1)
        throw "value not found:"+value+" in "+this;
      return this.substring(index,value+length);
    });

maybeDefine(String.prototype,'after',function(value){
      var index= this.indexOf(value);
      if(index===-1)
        throw "value not found:"+value+" in "+this;
      return this.substring(index+value.length);
    });
maybeDefine(String.prototype,'before',function(value){
      var index= this.indexOf(value);
      if(index===-1)
        throw "value not found:"+value+" in "+this;
      return this.substring(0,index);
    });
maybeDefine(String.prototype,'beforeOrSelf',function(value){
     var index= this.indexOf(value);
     if(index===-1)
        return this;
    return this.substring(0,index);
});

    //https://github.com/knockout/knockout/blob/master/src/utils.js
    if(!Array.prototype.arrayFirst){
      Array.prototype.arrayFirst=function (predicate, predicateOwner) {
            var array= this || [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i]))
                    return array[i];
            return null;
        };
    }
    if(!Array.prototype.arrayMap){
      Array.prototype.arrayMap=function (mapping) {
            var array = this || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i]));
            return result;
        };
    }
    
