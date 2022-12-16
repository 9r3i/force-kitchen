/**
 * ini.js
 * ~ ini string format
 * authored by 9r3i
 * https://github.com/9r3i/ini.js
 * started at december 11th 2022
 * license: MIT
 *   https://github.com/9r3i/ini.js/blob/master/LICENSE
 */
function ini(){
this.version='1.0.0';
/* value */
this.value=function(str){
  if(str===null){
    return 'null';
  }else if(str===false){
    return 'false';
  }else if(str===true){
    return 'true';
  }
  str=str.toString();
  if(!str.match(/"|\n/g)){
    return str;
  }
  return '"'+str
    .replace(/\n/g,'\\n')
    .replace(/"/g,'\\"')
    +'"';
};
/* build an ini string */
this.build=function(data,nested){
  if(typeof data!=='object'||data===null
    ||Array.isArray(data)){
    return;
  }
  var res=[];
  for(var k in data){
    var v=data[k],
    col=k+'='+this.value(v);
    if(nested){
      col='['+k+']\n';
      for(var i in v){
        col+=i+'='+this.value(v[i]);
      }
    }res.push(col);
  }return res.join('\n');
};
/* parse without section */
this.parseNoSection=function(data){
  if(typeof data!=="string"){return {};}
  var ln=data.split(/\r\n|\r|\n/g),
  res={};
  for(var p of ln){
    var m=p.match(/^\s*([^=]+?)\s*=\s*(.*?)\s*$/);
    if(!m){continue;}
    res[m[1]]=m[2].match(/^"/)&&m[2].match(/"$/)
      ?m[2].substr(1,m[2].length-2)
        .replace(/\\"/g,'"')
        .replace(/\\n/g,'\n')
      :m[2];
  }return res;
};
/** 
 * ini.js
 * ~ parse ini from string (nested only)
 * ~ this could be parse multiline ini values
 * @parameters:
 *   data = string of ini data string
 * 
    
    ** actually this is my old code, wrote 5 years ago
    ** started at november 18th 2017
    ** update at september 7th 2018
 */
this.parse=function(data){
  if(typeof data!=="string"){return;}
  var ex=data.split(/\r\n|\r|\n/g);
  var res={},store='',index='',pin='';
  for(var i in ex){
    if(ex[i]==''&&index==''){continue;}
    else if(ex[i].match(/^;/g)){continue;}
    else if(ex[i].match(/^\[(.*)\]/ig)){
      pin=ex[i].replace(/^\[/ig,'').replace(/\]\s*$/ig,'');
      res[pin]={};
    }else if(ex[i].match(/^.+=\s*/ig)&&index==''){
      var mt=ex[i].match(/^(.+)=\s*"(.*)"\s*$/ig);
      var mi=ex[i].match(/^[^=]+/ig);
      if(mt&&mi){
        index=mi[0].replace(/^\s+|\s+$/ig,'');
        res[pin][index]=mt[0].substr(mi[0].length).replace(/^\s*=\s*"|\s*"\s*$/ig,'');
        index='';
        continue;
      }
      var exi=ex[i].match(/^.+=\s*/ig);
      if(mi){
        index=mi[0].replace(/^\s+|\s+$/ig,'');
      }else{
        index=exi[0].replace(/=\s*$/ig,'').replace(/^\s+|\s+$/ig,'');
      }
      exi=ex[i].replace(/^.+=\s*/ig,'');
      if(exi.match(/^".*"\s*$/ig)){
        res[pin][index]=exi.substr(1).replace(/"\s*$/ig,'');
        index='';
      }else if(exi.match(/^"/ig)){
        store=exi.substr(1)+'\r\n';
      }else{
        if(typeof res[pin]==='undefined'){continue;}
        res[pin][index]=exi.replace(/^\s+|\s+$/ig,'');
        index='';
      }exi=null;
    }else if(ex[i].match(/"\s*$/ig)&&index!==''){
      if(typeof res[pin]==='undefined'){continue;}
      store+=ex[i].replace(/"\s*$/ig,'')+'\r\n';
      res[pin][index]=store;
      store='',index='';
    }else if(index!==''){
      store+=ex[i]+'\r\n';
    }
  }return res;
};
}
