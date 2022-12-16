


/** require object and method -- kitchen.init */
window.kitchen=window.kitchen||{
  init:async function(theme){
    var kkey=ForceWebsite.config.kitchen.key;
  	if(!ForceWebsite.query.hasOwnProperty(kkey)){
	    return;
	  }
    var ccontent=theme.web.pkey?theme.content:theme.clogin;
    theme.putHTML(ccontent);
    var files=[
      "ini.js",
    ];
    theme.loadFiles(files,true);
    setTimeout(e=>{
      
    },(100*files.length)+300);
  },
};

/**
 * Kitchen Object
 * ~ a kitchen helper for Force Website's Kitchen
 * authored by 9r3i
 * https://github.com/9r3i
 * started at december 11th 2022
 * @requires:
 *   Force - https://github.com/9r3i/force
 *   ForceWebsite - https://github.com/9r3i/force-website
 */
window.Kitchen=window.Kitchen||{
  version:'1.0.0',
  MENU_WIDTH:620,
  text:{
    login:'login',
    menu:'menu',
  },
  fa:function(){
    Kitchen.externalPage(
      ForceWebsite.kitchen.path+'fa.html',
      'Font-Awesome');
  },
  first:function(){
    setTimeout(e=>{
      ForceWebsite.go(ForceWebsite.kkey+'=dashboard');
    },500);
  },
  table:function(){
    var tbody=ForceWebsite.buildElement('tbody'),
    thead=ForceWebsite.buildElement('thead'),
    tfoot=ForceWebsite.buildElement('tfoot'),
    table=ForceWebsite.buildElement('table',null,{
      'class':'table',
      'cellpadding':'0px',
      'cellspacing':'0px',
      'border':'0px',
    },[thead,tbody,tfoot]);
    table.body=tbody;
    table.head=thead;
    table.foot=tfoot;
    table.addRowText=function(key,value,option){
      var td1=ForceWebsite.buildElement('td',key),
      td2=ForceWebsite.buildElement('td',value),
      td3=ForceWebsite.buildElement('td',option),
      trow=ForceWebsite.buildElement('tr',null,{},[td1,td2,td3]);
      trow.appendTo(this.body);
      return {
        row:trow,
        key:td1,
        value:td2,
        option:td3,
      };
    };
    table.addRow=function(){
      var td1=ForceWebsite.buildElement('td'),
      td2=ForceWebsite.buildElement('td',null,{},[]),
      td3=ForceWebsite.buildElement('td',null,{},[]),
      trow=ForceWebsite.buildElement('tr',null,{},[td1,td2,td3]);
      trow.appendTo(this.body);
      return {
        row:trow,
        key:td1,
        value:td2,
        option:td3,
      };
    };
    return table;
  },
  selectTypeOption:function(el,dtype){
    if(!el||typeof el.appendChild!=='function'){
      return null;
    }
    var dtypes=[
      'text','number','date','time',
      'datetime','color','plain','html'
    ];
    dtype=typeof dtype==='string'
      &&dtypes.indexOf(dtype)>=0?dtype:'text';
    var opts={
      text    : {tag: 'input', type: 'text', title: 'Text'},
      number  : {tag: 'input', type: 'number', title: 'Number'},
      date    : {tag: 'input', type: 'date', title: 'Date'},
      time    : {tag: 'input', type: 'time', title: 'Time'},
      datetime: {tag: 'input', type: 'datetime-local', title: 'Date-Time'},
      color   : {tag: 'input', type: 'color', title: 'Color'},
      plain   : {tag: 'textarea', type: 'plain', title: 'Long Text'},
      html    : {tag: 'textarea', type: 'html', title: 'Rich Text'},
    },
    dtag=opts[dtype].tag,
    dinput=ForceWebsite.buildElement(dtag,null,{
      type: 'text',
      placeholder: 'Text',
      'data-input': 'value',
    }),
    sel=ForceWebsite.buildElement('select');
    dinput.appendTo(el);
    for(var opt in opts){
      var op=opts[opt];
      ForceWebsite.buildElement('option',op.title,{
        value:opt,
      }).appendTo(sel);
    }
    sel.value=dtype;
    sel.input=dinput;
    sel.target=el;
    sel.opts=opts;
    sel.onchange=function(e){
      var op=this.opts[this.value],
      oinput=this.input,
      dval=this.input.value;
      ForceWebsite.clearElement(this.target);
      this.input=ForceWebsite.buildElement(op.tag,null,{
        type: op.type,
        placeholder: op.title,
        'data-input': 'value',
      });
      this.input.value=dval;
      this.input.onchange=oinput.onchange;
      this.input.appendTo(this.target);
      if(this.value=='html'&&typeof editor==='function'){
        var id='textarea-'+(new Date).getTime();
        this.input.id=id;
        (new editor).init(ForceWebsite.plug,id);
      }
    };
    return sel;
  },
  dataReadableRow:function(table,dtype){
      var frow=table.addRow(),
      del=ForceWebsite.buildElement('div',null,{
        'class':'button button-red',
      },[
        ForceWebsite.buildElement('i',null,{
          'class':'fa fa-trash',
        })
      ]),
      pel=ForceWebsite.buildElement('input',null,{
        'type':'text',
        'placeholder':'Key',
        'data-input':'key',
      }),
      sel=Kitchen.selectTypeOption(frow.value,dtype);
      sel.appendTo(frow.option);
      del.appendTo(frow.option);
      pel.appendTo(frow.key);
      del.row=frow;
      del.onclick=async function(e){
        var yes=await ForceWebsite.Force.confirm('Delete this row?');
        if(!yes){return;}
        this.row.row.parentNode.removeChild(this.row.row);
      };
      frow.select=sel;
      frow.inputKey=pel;
      return frow;
  },
  dataReadableTable:function(el,type){
    if(typeof el!=='object'||el===null
      ||typeof el.appendChild!=='function'){
      return null;
    }
    var data=null,
    readable=['json','url','ini'];
    type=typeof type==='string'
      &&readable.indexOf(type)>=0?type:'json';
    if(type=='json'){
      try{data=JSON.parse(el.value);}catch(e){}
    }else if(type=='url'){
      data=ForceWebsite.Force.parseQuery(el.value);
    }else if(type=='ini'){
      data=(new ini).parseNoSection(el.value);
    }
    data=typeof data==='object'&&data!==null
        &&!Array.isArray(data)?data:{};
    var table=Kitchen.table(),
    badd=ForceWebsite.buildElement('div',null,{
      'class':'button button-blue',
    },[
      ForceWebsite.buildElement('i',null,{
        'class':'fa fa-plus',
      }),
    ]),
    frow=table.addRow();
    badd.appendTo(frow.option);
    frow.key.innerText='Key';
    frow.value.innerText='Value';
    frow.key.classList.add('row-header');
    frow.value.classList.add('row-header');
    badd.onclick=function(e){
      var row=Kitchen.dataReadableRow(table);
      row.select.input.onchange=function(e){
        data=Kitchen.dataOnChangeAll();
        if(type=='json'){
          el.value=JSON.stringify(data);
        }else if(type=='url'){
          el.value=ForceWebsite.Force.buildQuery(data);
        }else if(type=='ini'){
          el.value=(new ini).build(data);
        }
      };
      row.inputKey.onchange=row.select.input.onchange;
    };
    for(var k in data){
      var v=data[k];
      v=v===null?'null'
       :v===false?'false'
       :v===true?'true'
       :v.toString();
      var dtype=v.match(/\n/)?'plain':'text',
      row=Kitchen.dataReadableRow(table,dtype);
      row.inputKey.value=k;
      row.select.input.value=v;
      row.select.input.onchange=function(e){
        data=Kitchen.dataOnChangeAll();
        if(type=='json'){
          el.value=JSON.stringify(data);
        }else if(type=='url'){
          el.value=ForceWebsite.Force.buildQuery(data);
        }else if(type=='ini'){
          el.value=(new ini).build(data);
        }
      };
      row.inputKey.onchange=row.select.input.onchange;
    }
    return table;
  },
  dataOnChangeAll:function(){
    var res={},
    keys=document.querySelectorAll('[data-input="key"]'),
    values=document.querySelectorAll('[data-input="value"]');
    if(keys.length!==values.length){
      return res;
    }
    for(var i=0;i<keys.length;i++){
      var k=keys[i].value,
      v=values[i].value;
      if(v.match(/^[\d\.]+$/)){
        v=parseFloat(v);
      }else if(v.match(/^true$/i)){
        v=true;
      }else if(v.match(/^false$/i)){
        v=false;
      }else if(v.match(/^null$/i)){
        v=null;
      }
      res[k]=v;
    }
    return res;
  },
  dataTypeChange:function(dcon,oval,type,id){
    var readable=['json','url','ini'],
    textarea=ForceWebsite.buildElement('textarea',null,{
      'name':'content',
      'placeholder':'Content',
    });
    textarea.value=oval;
    ForceWebsite.clearElement(dcon);
    textarea.appendTo(dcon);
    if(type=='text'){
      textarea.id='kitchen-textarea';
      textarea.classList.remove('page-hide');
      if(typeof editor==='function'){
        (new editor).init(ForceWebsite.plug);
      }
    }else if(readable.indexOf(type)>=0){
      textarea.classList.add('page-hide');
      var table=Kitchen.dataReadableTable(textarea,type);
      table.appendTo(dcon);
    }else if(type=='base64'){
      textarea.classList.add('page-hide');
      var txa=ForceWebsite.buildElement('textarea',null,{
        placeholder: 'Content (decoded)',
      });
      txa.appendTo(dcon);
      txa.value=atob(textarea.value);
      txa.style.height='350px';
      txa.onkeyup=function(e){
        textarea.value=btoa(this.value);
      };
    }else{
      textarea.classList.add('page-hide');
      /* ----- upload file ----- */
      var upload=Kitchen.uploadFile(type,textarea);
      upload.main.appendTo(dcon);
      if(id){
        upload.url=ForceWebsite.contentURL(id,true);
        upload.review();
      }
    }
    return textarea;
  },
  editDataType:function(){
    /* ----- data-type ----- */
    var dtype=document.getElementById('data-type'),
    dcontent=document.getElementById('data-content'),
    idel=document.querySelector('input[name="id"]'),
    ocontent=document.querySelector('textarea[name="content"]');
    if(!dtype||!dcontent){return;}
    dtype.value=dtype.dataset.value;
    var textarea=Kitchen.dataTypeChange(
        dcontent,
        ocontent.value,
        dtype.value,
        idel.value
      );
    dtype.onchange=function(e){
      var oval=textarea.value;
      textarea=Kitchen.dataTypeChange(
        dcontent,
        oval,
        this.value,
        idel.value
      );
    };
  },
  editDataPicture:function(){
    var pic=document.querySelector('input[name="picture"]');
    if(!pic){return;}
    var ndel=ForceWebsite.buildElement('div',null,{
      'class':'edit-delete',
      'title':'Delete this picture',
    },[
      ForceWebsite.buildElement('i',null,{
        'class':'fa fa-trash',
      }),
    ]),
    nview=ForceWebsite.buildElement('div',null,{
      'class':'edit-post-preview',
    }),
    src=ForceWebsite.imageURL(pic.dataset.id),
    img=new Image;
    pic.parentNode.insertBefore(nview,pic);
    img.src=src;
    nview.appendChild(img);
    nview.appendChild(ndel);
    ndel.dataset.id=pic.dataset.id;
    img.onerror=function(e){
      ForceWebsite.clearElement(nview);
    };
    ndel.onclick=async function(e){
      var _this=this,
      yes=await ForceWebsite.Force.confirm('Delete this picture?');
      if(!yes){return;}
      
      ForceWebsite.request('website.pictureDelete',async function(r){
        await ForceWebsite.Force.alert(r);
        if(r.toString().match(/^error/i)){
          return;
        }ForceWebsite.clearElement(_this.parentNode);
      },{id:this.dataset.id});
    };
    pic.onchange=function(e){
      var file=this.files[0],
      fr=new FileReader,
      img=new Image;
      if(file.type!='image/jpeg'){
        ForceWebsite.Force.splash('Error: File must be image/jpeg.');
        return;
      }
      if(file.size>Math.pow(1024,2)){
        ForceWebsite.Force.splash('Error: File is too large.');
        return;
      }
      fr.onloadend=function(e){
        ForceWebsite.clearElement(nview);
        img.src=e.target.result;
        nview.appendChild(img);
        nview.appendChild(ndel);
        Kitchen.uploadPicture(pic.dataset.id,e.target.result);
      };fr.readAsDataURL(file);
    };
  },
  editDataAfter:async function(r){
    await ForceWebsite.Force.alert(r);
  },
  editDataBefore:function(){
    Kitchen.editDataPicture();
    Kitchen.editDataType();
  },
  editData:function(){
    window.tinymce=null;
    window.CKEDITOR=null;
    setTimeout(e=>{
      Kitchen.editDataBefore();
    },500);
  },
  uploadFile:function(type,textarea){
    var el=null,
    types={
      text:'text/*',
      image:'image/*',
      audio:'audio/mpeg',
      video:'video/mp4',
      font:'font/*',
      message:'message/*',
      gzip:'application/gzip',
      binary:'application/octet-stream',
      ini:'text/*',
      json:'text/*',
    },
    accept=types.hasOwnProperty(type)?types[type]:'*/*',
    input=ForceWebsite.buildElement('input',null,{
      'class':'kitchen-input-file',
      'type':'file',
      'accept':accept,
    }),
    mask=ForceWebsite.buildElement('div',null,{
      'class':'kitchen-input-mask',
      'data-text':'Click here to upload file',
    }),
    view=ForceWebsite.buildElement('div',null,{
      'class':'kitchen-input-view'
    }),
    progress=ForceWebsite.buildElement('progress',null,{
      'class':'kitchen-input-progress'
    }),
    parent=ForceWebsite.buildElement('div',null,{
      'class':'kitchen-input-main',
    },[
      view,
      ForceWebsite.buildElement('div',null,{
        'class':'kitchen-input-submain'
      },[mask,input]),
    ]),
    res={
      main:parent,
      mask:mask,
      input:input,
      view:view,
      progress:progress,
      accept:accept,
      type:type,
      textarea:textarea,
      url:null,
      file:null,
      preview:null,
      review:null,
    },
    ol=null;
    input.data=res;
    res.review=function(pre){
      var _this=this,
      type=pre?this.file.type:this.type,
      url=this.url;
      if(!pre){
        ForceWebsite.clearElement(this.view);
      }
      if(type.match(/^image/)){
        var img=new Image;
        img.src=url;
        this.view.appendChild(img);
      }else if(type.match(/^audio/)){
        var audio=new Audio(url);
        audio.controls=true;
        this.view.appendChild(audio);
      }else if(type.match(/^video/)){
        var video=ForceWebsite.buildElement('video',null,{
          src:url,
        });
        video.controls=true;
        this.view.appendChild(video);
      }else if(type.match(/(gzip|binary|octet\-stream)/)){
        var text=ForceWebsite.buildElement('a',null,{
          href:url,
          target:'_blank',
        },[
          ForceWebsite.buildElement('i',null,{
            'class':'fa fa-download'
          }),
          document.createTextNode('Download'),
        ]),
        outer=ForceWebsite.buildElement('div',null,{
          'class':'kitchen-input-outer',
        },[text]);
        this.view.appendChild(outer);
      }else if(type.match(/^text/)){
        var text=ForceWebsite.buildElement('pre',null,{
          src:url,
        });
        this.view.appendChild(text);
      }else{
        var text=ForceWebsite.buildElement('div',
          'Nothing to show.',{
            'class':'kitchen-input-nothing',
          });
        this.view.appendChild(text);
      }
    };
    res.preview=function(){
      var _this=this;
      this.review(true);
    };
    input.onchange=function(e){
      if(this.files.length<1){
        return;
      }
      var _this=this,
      fr=new FileReader;
      this.data.file=this.files[0];
      fr.onloadend=function(e){
        _this.data.url=e.target.result;
        _this.data.preview();
      };
      fr.readAsDataURL(this.files[0]);
      ForceWebsite.clearElement(this.data.view);
      this.data.progress.appendTo(this.data.view);
      ForceWebsite.upload(this.files[0],r=>{
        ForceWebsite.Force.alert(r);
        _this.data.progress.remove();
        _this.data.textarea.value=r;
      },e=>{
        _this.data.progress.max=e.total;
        _this.data.progress.value=e.loaded;
      });
    };
    return res;
  },
  uploadPicture:function(id,src){
    ForceWebsite.request('website.pictureUpload',function(r){
      ForceWebsite.Force.splash(r);
    },{
      id:id,
      data:src,
    });
  },
  newDataAfter:async function(r){
    await ForceWebsite.Force.alert(r);
    if(!r.toString().match(/^error/i)){
      ForceWebsite.go(ForceWebsite.kkey+'=data');
    }
  },
  newDataBefore:function(){
    /* ----- data-type ----- */
    var dtype=document.getElementById('data-type'),
    dcontent=document.getElementById('data-content');
    if(!dtype||!dcontent){return;}
    var textarea=Kitchen.dataTypeChange(
        dcontent,
        '',
        dtype.value
      );
    dtype.onchange=function(e){
      var oval=textarea.value;
      textarea=Kitchen.dataTypeChange(
        dcontent,
        oval,
        this.value
      );
    };
  },
  newData:function(){
    window.tinymce=null;
    window.CKEDITOR=null;
    setTimeout(e=>{
      Kitchen.newDataBefore();
    },50);
  },
  allData:function(){
    ForceWebsite.fetch('website.all',function(r){
      if(!Array.isArray(r)){
        ForceWebsite.Force.splash('Error: Failed to fetch data.');
        return;
      }
      var i=r.length,
      dtall=[],
      dl=document.querySelector('#data-length'),
      pl=document.querySelector('#posts-list');
      if(dl){dl.innerText=i;}
      if(!pl){return;}
      while(i--){
        var pa=Kitchen.parseLine(r[i]);
        if(pa){
          pa.appendTo(pl);
          dtall.push(pa);
        }
      }
      setTimeout(e=>{
        var dtype=document.getElementById('data-type');
        if(dtype){dtype.onchange=function(e){
          for(var i=0;i<dtall.length;i++){
            if(dtall[i].dataset.type==dtype.value
              ||dtype.value=='all'){
              dtall[i].classList.remove('page-hide');
            }else{
              dtall[i].classList.add('page-hide');
            }
          }
        };}
      },500);
    });
  },
  parseLine:function(p){
    if(typeof p!=='object'||p===null){return false;}
    var buildElement=ForceWebsite.buildElement,
    textNode=function(text){
      return document.createTextNode(text);
    },
    faTypes={
      text:'file-text-o',
      image:'file-image-o',
      audio:'file-audio-o',
      video:'file-video-o',
      gzip:'file-archive-o',
      json:'file-code-o',
      url:'file-code-o',
      ini:'file-code-o',
      base64:'file-o',
      binary:'file-o',
    },
    raw=buildElement('button',null,{
      'class':'button-yellow',
      'title':'Raw this data',
      'data-id':p.id,
    },[
      buildElement('i',null,{
        'class':'fa fa-send',
      }),
      textNode('Raw'),
    ]),
    del=buildElement('button',null,{
      'class':'button-red',
      'title':'Delete this data',
      'data-id':p.id,
    },[
      buildElement('i',null,{
        'class':'fa fa-trash',
      }),
      textNode('Delete'),
    ]),
    edit=buildElement('button',null,{
      'class':'button-green',
      'title':'Edit this data',
      'data-id':p.id,
    },[
      buildElement('i',null,{
        'class':'fa fa-edit',
      }),
      textNode('Edit'),
    ]),
    view=buildElement('button',null,{
      'class':'button-blue',
      'title':'View this data',
      'data-url':'?p='+p.slug
    },[
      buildElement('i',null,{
        'class':'fa fa-search',
      }),
      textNode('View'),
    ]),
    ph=buildElement('div',null,{
      'class':'post-data-head',
      'title':p.title,
    },[
      buildElement('i',null,{
        'class':'fa fa-'+faTypes[p.type],
      }),
      textNode(p.title),
    ]),
    pdetail=[p.id,p.time,p.type].join(' \u2015 '),
    pd=buildElement('div',pdetail,{
      'class':'post-data-detail',
    }),
    pb=buildElement('div',null,{
      'class':'post-data-body',
    },[view,edit,del,raw]),
    pa=buildElement('div',null,{
      'class':'post-data-each',
      'id':'data-'+p.id,
      'data-type':p.type,
    },[ph,pd,pb]);
    raw.onclick=function(e){
      var url=ForceWebsite.contentURL(this.dataset.id);
      return window.open(url,'_blank');
    };
    view.onclick=function(e){
      return window.open(this.dataset.url,'_blank');
    };
    edit.onclick=function(e){
      return ForceWebsite.go(ForceWebsite.kkey
        +'=edit&id='+this.dataset.id);
    };
    del.onclick=async function(e){
      var yes=await ForceWebsite.Force.confirm('Delete this data?');
      if(!yes){return;}
      var _this=this;
      this.disabled=true;
      this.dataset.html=this.innerHTML;
      this.innerText='Deleting...';
      ForceWebsite.request('website.dataDelete',function(r){
        ForceWebsite.Force.splash(r);
        if(!r.toString().match(/^error/i)){
          var bd=document.getElementById('data-'+_this.dataset.id);
          if(bd){bd.parentElement.removeChild(bd);}
          return;
        }
        _this.disabled=false;
        _this.innerHTML=_this.dataset.html;
      },{id:this.dataset.id});
    };
    return pa;
  },
  mainContent:function(query,text){
    var file='html/login.html',
    kkey=ForceWebsite.config.kitchen.key,
    image=Kitchen.loaderImageURL(),
    mainID='page-loader',
    contentMain='<div class="'+mainID+'" id="'+mainID+'">'
      +'<img src="'+image+'" /> Loading...'
      +'</div>';
    if(typeof text==='string'&&text==Kitchen.text.login){
      file='html/login.html';
    }else if(query.hasOwnProperty(kkey)){
      file='html/'+query.kitchen+'.html';
      if(query.kitchen==''){
        file='html/dashboard.html';
      }
      setTimeout(e=>{
        var menuButton=document.getElementById('menu-button');
        if(menuButton){
          menuButton.onclick=Kitchen.menuShow;
        }
        Kitchen.menuMovable('menu');
        Kitchen.plugMenu();
        ForceWebsite.anchorInit();
      },500);
    }
    ForceWebsite.kitchen.loadHTML(file,r=>{
      var mainTag=document.getElementById(mainID).parentNode;
      mainTag.innerHTML=r;
      var forms=document.querySelectorAll('form');
      for(var form of forms){
        form.onsubmit=Kitchen.formSubmit;
      }
      ForceWebsite.finishing();
      setTimeout(e=>{
        document.body.classList.remove('dont-scroll');
        document.body.scroll({
          top: 0,
          left: 0,
          behavior:'smooth',
        });
      },500);
    });
    return contentMain;
  },
  plugPage:function(query){
    if(!query.hasOwnProperty('ns')){
      return 'Error: Require plugin namespace.';
    }
    if(typeof window[query.ns]==='function'){
      var plug=new window[query.ns];
      if(typeof plug.kitchen==='function'){
        setTimeout(e=>{
          ForceWebsite.body=document.getElementById('website-content');
          return plug.kitchen(ForceWebsite.plug);
        },500);
        return '<div class="title">Plugin: '+query.ns+'</div>';
      }
    }
    return 'Error: Invalid plugin.';
  },
  plugMenu:function(){
    var plugs=ForceWebsite.Force.plugin,
    mel=document.getElementById('menu');
    for(var ns of plugs.plug){
      var bplug=document.getElementById('plugin-'+ns);
      if(bplug){continue;}
      if(typeof window[ns]==='function'){
        var param=plugs.param[ns],
        plug=new window[ns](param);
        if(typeof plug.kitchen==='function'){
          bplug=ForceWebsite.buildElement('a',null,{
            'href':ForceWebsite.kkey+'=plug&ns='+ns,
            'data-title':ns,
            'id':'plugin-'+ns,
          },[
            ForceWebsite.buildElement('div',null,{
              'class':'menu-each',
            },[
              ForceWebsite.buildElement('i',null,{
                'class':'fa fa-plug menu-external'
              }),
              ForceWebsite.buildElement('div',ns+'*',{
                'class':'menu-text'
              }),
            ]),
          ]);
          bplug.appendTo(mel);
        }
      }
    }
  },
  account:async function(r){
    await ForceWebsite.Force.alert(r);
    if(r.toString().match(/^error/i)){
      return;
    }return ForceWebsite.go(ForceWebsite.kkey+'=dashboard');
  },
  callback:async function(r){
    await ForceWebsite.Force.alert(r);
  },
  login:async function(r){
    if(r.toString().match(/^error/i)){
      var body=document.getElementById('website-login');
      body.classList.add('login-shake');
      await ForceWebsite.Force.alert(r);
      body.classList.remove('login-shake');
      return;
    }
    localStorage.setItem('website-pkey',r.pkey);
    localStorage.setItem('website-uname',r.uname);
    ForceWebsite.pkey=r.pkey;
    ForceWebsite.uname=r.uname;
    return ForceWebsite.go(ForceWebsite.kkey+'=dashboard');
  },
  logout:async function(){
    var yes=await ForceWebsite.Force.confirm('Logout?');
    if(!yes){
      return ForceWebsite.go(ForceWebsite.kkey+'=dashboard');
    }
    localStorage.removeItem('website-pkey');
    localStorage.removeItem('website-uname');
    ForceWebsite.pkey=null;
    return ForceWebsite.go(ForceWebsite.kkey+'=login');
  },
  formSubmit:function(e){
    e.preventDefault();
    var form=ForceWebsite.kitchenFormHelper(e),
    callback=form.data.hasOwnProperty('callback')
      &&Kitchen.hasOwnProperty(form.data.callback)
      ?Kitchen[form.data.callback]
      :function(){},
    before=form.data.hasOwnProperty('before')
      &&Kitchen.hasOwnProperty(form.data.before)
      ?Kitchen[form.data.before]
      :function(){},
    method=form.data.hasOwnProperty('method')
      ?form.data.method:'website.unknown';
    form.submitter.value=form.submitter.dataset.before;
    form.submitter.innerText=form.submitter.dataset.before;
    form.send(method,r=>{
      form.submitter.value=form.submitter.dataset.after;
      form.submitter.innerText=form.submitter.dataset.after;
      return callback(r);
    },before);
    return false;
  },
  menuHide:function(){
    var menu=document.getElementById('menu'),
    shade=document.getElementById('menu-shadow');
    if(!shade||!menu){return;}
    document.body.classList.remove('dont-scroll');
    menu.classList.remove('menu-show');
    shade.parentElement.removeChild(shade);
  },
  menuShow:function(){
    var menu=document.getElementById('menu'),
    shade=document.createElement('div');
    if(!menu){return;}
    menu.classList.add('menu-show');
    shade.classList.add('menu-shadow');
    shade.id='menu-shadow';
    shade.onclick=function(e){
      menu.classList.remove('menu-show');
      document.body.classList.remove('dont-scroll');
      this.parentElement.removeChild(this);
    };
    document.body.appendChild(shade);
    document.body.classList.add('dont-scroll');
  },
  menuMovable:function(id){
    if(!window.hasOwnProperty('ontouchstart')){return;}
    var el=document.getElementById(id);
    if(!el){return;}
    window.ontouchend=function(e){
      if(!window.MENU_MOVABLE_LEFT){return;}
      if(window.EXTERNAL_OPEN){
        window.MENU_MOVABLE_LEFT=false;
        return;
      }
      var isHide=window.MENU_MOVABLE_LEFT.hide;
      var x=e.changedTouches?e.changedTouches[0].pageX:e.screenX;
      var left=(x-window.MENU_MOVABLE_LEFT.x)+window.MENU_MOVABLE_LEFT.l;
      window.MENU_MOVABLE_LEFT=false;
      if(!isHide){
        Kitchen.menuShow();
      }
      else if(left<-100){
        Kitchen.menuHide();
      }
    };
    window.ontouchstart=function(e){
      if(window.EXTERNAL_OPEN
        ||Kitchen.MENU_WIDTH<window.innerWidth){
        return;
      }
      var x=e.changedTouches?e.changedTouches[0].pageX:e.screenX;
      var l=el.offsetLeft;
      if(l===0||x>15){
        if(x>250){
          window.MENU_MOVABLE_LEFT={x:x,l:l,el:el,hide:true};
        }return;
      }window.MENU_MOVABLE_LEFT={x:x,l:l,el:el,hide:false};
    };
  },
  loader:function(open,text){
    var id='website-loader',
    ld=document.getElementById(id);
    if(!open){
      if(ld){ld.parentElement.removeChild(ld);}
      return false;
    }text=typeof text==='string'?text:'Loading...';
    if(!ld){
      var ld=document.createElement('div');
      ld.classList.add(id);
      ld.id=id;
    }ld.dataset.text=text;
    document.body.appendChild(ld);
    return true;
  },
  externalPage:function(url,title){
    if(typeof url!=='string'){return false;}
    title=typeof title==='string'?title:'Untitled';
    var id='website-frame',
    frame=document.querySelector('iframe#'+id),
    fc=document.querySelector('#'+id+'-close'),
    fh=document.querySelector('#'+id+'-head');
    if(frame){frame.parentElement.removeChild(frame);}
    if(fh){fh.parentElement.removeChild(fh);}
    if(fc){fc.parentElement.removeChild(fc);}
    frame=document.createElement('iframe');
    frame.id=id;
    frame.classList.add(id);
    frame.src=url;
    frame.onload=function(){
      Kitchen.loader(false);
    };
    frame.onerror=function(){
      Kitchen.loader(false);
    };
    document.body.appendChild(frame);
    Kitchen.loader(true);
    fh=document.createElement('div');
    fh.classList.add(id+'-head');
    fh.id=id+'-head';
    fh.dataset.title=title;
    document.body.appendChild(fh);
    fc=document.createElement('div');
    fc.classList.add(id+'-close');
    fc.id=id+'-close';
    fc.title='Close';
    document.body.appendChild(fc);
    if(!document.body.classList.contains('dont-scroll')){
      document.body.classList.add('dont-scroll');
    }
    var dt=document.querySelector('title');
    if(dt){
      var baseTitle=dt.innerText;
      fc.dataset.title=baseTitle;
      dt.innerText=title;
    }
    window.EXTERNAL_OPEN=true;
    fc.onclick=function(e){
      document.body.classList.remove('dont-scroll');
      this.parentElement.removeChild(this);
      if(frame){frame.parentElement.removeChild(frame);}
      if(fh){fh.parentElement.removeChild(fh);}
      if(dt){dt.innerText=this.dataset.title;}
      window.EXTERNAL_OPEN=false;
      return true;
    };return true;
  },
  externalPageClose:function(){
    var id='website-frame',
    frame=document.querySelector('iframe#'+id),
    fc=document.querySelector('#'+id+'-close'),
    fh=document.querySelector('#'+id+'-head'),
    dt=document.querySelector('title');
    document.body.classList.remove('dont-scroll');
    window.EXTERNAL_OPEN=false;
    if(frame){frame.parentElement.removeChild(frame);}
    if(fh){fh.parentElement.removeChild(fh);}
    if(fc){
      if(dt){dt.innerText=fc.dataset.title;}
      fc.parentElement.removeChild(fc);
    }return true;
  },
  loaderImageURL:function(){
    return 'data:image/gif;base64,R0lGODlhEAALAMQfAPDw8N/f3/b29paWloiIiPT09IuLi25ublpaWtDQ0JiYmFhYWHZ2du7u7uzs7NPT07+/v66urlxcXHFxcXx8fObm5vLy8ufn5+Dg4MDAwNvb29TU1PPz8+Xl5eTk5AAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCwAfACwAAAAAEAALAAAFPeAnjmRpnmTVdZW4rm53VRUABGJgYyIGWBgfgPcREgOWIfLWs+E+upvwacw5o0+sdRgMulStD61yQZnPpRAAIfkECQsAHwAsAAAAABAACwAABSeghCDSZ56ouTAMkr4fwrowurY1KuO5udO926LnYw2JP2JsphSRlCEAIfkECQsAHwAsAAAAABAACwAABTvgJ44HshzjGA1DJCIEgaTikCTDG8+0jesy2seX+8AICyERmOw9fsad8lY88lLLaJC2agGvQhICgaKFAAAh+QQJCwAfACwAAAAAEAALAAAFQeAnjqQ4IdJUftGgRCJiEMiqPM8QG0ZdDjjFrmcLiiQ8H+m2EX5kxJJi0zwmi9XnVfrIIgi0VUTxshIkq9UJMQkBACH5BAkLAB8ALAAAAAAQAAsAAAU34CeOZGme1HFQJuB5jXgQxmF6guDJRn3nHRmBYCvhdDyfEShUko7Bz4xoanQ6MWmveBqlVt1uCAAh+QQJCwAfACwAAAAAEAALAAAFROAnjmRpniRwXYCoVpaYZFByCUIl3sIlQppAhqf7VHC+D1AzRO5wxYyGyUseeyIpFfrEKqcZQIXlulRanwQkk0C536UQACH5BAkLAB8ALAAAAAAQAAsAAAVE4CeOZGmeZNN1jah2jtt5qsV5YscVnejtHt3Nx7HgPpWCpfIrHIVHj7LSKQw/zSjQYzHmOJwe1kbz0GTnTyPYQrnfpBAAIfkECQsAHwAsAAAAABAACwAABUPgJ45kaZ5k43mN2HRd+6msx3GV6BVWJ3Ycy+rm+3QKOJ2FM2QqncZgBcgpeizCH3JlKRQry++NBZO9Yi5PRYZqu0chADs=';
  },
  loaderImageHTML:function(){
    var mainID='page-loader',
    image=Kitchen.loaderImageURL(),
    contentMain='<div class="'+mainID+'" id="'+mainID+'">'
      +'<img src="'+image+'" /> Loading...'
      +'</div>';
    return contentMain;
  },
  frontThemeVersion:function(){
    var ns=ForceWebsite.theme.namespace;
    if(window.hasOwnProperty(ns)
      &&typeof window[ns]==='object'
      &&window[ns]!==null
      &&window[ns].hasOwnProperty('version')
      &&typeof window[ns].version==='string'){
      return window[ns].version;
    }return '[not-available]';
  },
  frontThemeURI:function(){
    var ns=ForceWebsite.theme.namespace;
    if(window.hasOwnProperty(ns)
      &&typeof window[ns]==='object'
      &&window[ns]!==null
      &&window[ns].hasOwnProperty('uri')
      &&typeof window[ns].uri==='string'){
      return window[ns].uri;
    }return '[not-available]';
  },
  pluginList:function(){
    var res=[],
    plugs=ForceWebsite.plug.plug;
    for(var plug of plugs){
      res.push('<li>'+plug+'</li>');
    }return res.join('\n');
  },
  information:function(){
    return 'No information for now. All is up-to-date.';
  },
  clearAllCache:async function(){
    var text='Are you sure?\nThis is gonna make you logout.',
    yes=await ForceWebsite.Force.confirm(text);
    if(!yes){return;}
    localStorage.clear();
    ForceWebsite.pkey=null;
    return ForceWebsite.go(ForceWebsite.kkey+'=login');
  },
};


