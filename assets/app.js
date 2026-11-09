/* ES5-only slideshow for old Android Browser / WebView (Android 4.x). */
(function(){
"use strict";
var photos=[],seen={},position=-1,timer=null,progressTimer=null,paused=false,seconds=12,loading=false,page=1,picsumPage=1,query="landscape nature mountains";
var img=document.getElementById("wallpaper"),statusNode=document.getElementById("status"),credit=document.getElementById("credit");
function byId(id){return document.getElementById(id);}
function setStatus(s){statusNode.innerHTML=s;}
function requestJSON(url,callback){
  var xhr=new XMLHttpRequest();
  xhr.onreadystatechange=function(){
    if(xhr.readyState===4){
      if(xhr.status>=200&&xhr.status<300){
        try{callback(null,JSON.parse(xhr.responseText));}catch(e){callback(e,null);}
      }else{callback(new Error("HTTP "+xhr.status),null);}
    }
  };
  xhr.open("GET",url,true);xhr.setRequestHeader("Accept","application/json");xhr.send(null);
}
function addItem(item){if(item&&item.url&&!seen[item.id]){seen[item.id]=true;photos.push(item);}}
function shuffle(a){var i,j,t;for(i=a.length-1;i>0;i--){j=Math.floor(Math.random()*(i+1));t=a[i];a[i]=a[j];a[j]=t;}}
function loadCommons(){
 var url="https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch="+encodeURIComponent(query+" filetype:bitmap")+"&gsrnamespace=6&gsrlimit=40&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1600&format=json&origin=*";
 requestJSON(url,function(err,data){
  var pages,obj,ii,meta,title,items=[],i;
  if(!err&&data&&data.query&&data.query.pages){
   pages=data.query.pages;
   for(i in pages){if(pages.hasOwnProperty(i)){
    obj=pages[i];ii=obj.imageinfo&&obj.imageinfo[0];
    if(ii&&ii.thumburl){
      meta=ii.extmetadata||{};title=(obj.title||"").replace(/^File:/,"");
      items.push({id:"wiki"+obj.pageid,url:ii.thumburl,title:title,author:strip(meta.Artist&&meta.Artist.value)||"Wikimedia Commons",license:strip(meta.LicenseShortName&&meta.LicenseShortName.value),source:"Wikimedia Commons",link:"https://commons.wikimedia.org/wiki/"+encodeURIComponent(obj.title.replace(/ /g,"_")),width:ii.width||0,height:ii.height||0});
    }
   }}
  }
  for(i=0;i<items.length;i++){addItem(items[i]);}
  page++;
  if(photos.length===0){loadPicsum();}else{shuffle(photos);setStatus(photos.length+" AFBEELDINGEN / ẢNH");if(position<0)showNext();}
 });
}
function strip(s){return String(s||"").replace(/<[^>]*>/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").replace(/^\s+|\s+$/g,"");}
function loadNASA(){
 var url="https://images-api.nasa.gov/search?q="+encodeURIComponent(query)+"&media_type=image&page=1";
 requestJSON(url,function(err,data){
  var items,i,entry,m,link;
  if(!err&&data&&data.collection&&data.collection.items){
   items=data.collection.items;
   for(i=0;i<items.length;i++){
    entry=items[i];m=entry.data&&entry.data[0];link=entry.links&&entry.links[0]&&entry.links[0].href;
    if(m&&link)addItem({id:"nasa"+m.nasa_id,url:link,title:m.title||"NASA image",author:m.center||"NASA",source:"NASA",link:"https://images.nasa.gov/details/"+m.nasa_id});
   }
  }
  if(photos.length){shuffle(photos);setStatus(photos.length+" ẢNH ĐÃ TẢI");if(position<0)showNext();}else{loadPicsum();}
 });
}
function loadPicsum(){
 var url="https://picsum.photos/v2/list?page="+picsumPage+"&limit=50";
 requestJSON(url,function(err,data){var i,x;if(!err&&data&&data.length){for(i=0;i<data.length;i++){x=data[i];addItem({id:"picsum"+x.id,url:"https://picsum.photos/id/"+x.id+"/1600/900",title:"Ảnh ngẫu nhiên",author:x.author||"Picsum",source:"Lorem Picsum",link:x.url,width:x.width,height:x.height});}}
 picsumPage++;if(photos.length){shuffle(photos);setStatus(photos.length+" ẢNH ĐÃ TẢI");if(position<0)showNext();}else{setStatus("KHÔNG KẾT NỐI ĐƯỢC NGUỒN ẢNH");}
 });
}
function schedule(){
 if(timer)clearTimeout(timer);if(progressTimer)clearInterval(progressTimer);
 if(paused)return;
 var start=(new Date()).getTime(),duration=seconds*1000;
 byId("progressbar").style.width="0%";
 progressTimer=setInterval(function(){var p=((new Date()).getTime()-start)/duration*100;if(p>100)p=100;byId("progressbar").style.width=p+"%";},150);
 timer=setTimeout(function(){showNext();},duration);
}
function showNext(){
 if(!photos.length){setStatus("ĐANG TÌM ẢNH...");return;}
 position++;if(position>=photos.length){position=0;shuffle(photos);}
 display(photos[position]);
 if(photos.length-position<8&&!loading){loading=true;loadMore();}
}
function showPrevious(){if(!photos.length)return;position--;if(position<0)position=photos.length-1;display(photos[position]);}
function display(item){
 var test=new Image();
 test.onload=function(){
  img.src=item.url;img.style.opacity="1";
  byId("caption").innerHTML=escapeHTML(item.title||"Khám phá thế giới qua từng khung hình.");
  credit.innerHTML=escapeHTML(item.author||item.source)+" &nbsp;|&nbsp; "+escapeHTML(item.source||"")+" "+(item.license?"| "+escapeHTML(item.license):"");
  byId("count").innerHTML=("000"+(position+1)).slice(-3);
  byId("headline").innerHTML="Explore<br><em>the infinite.</em>";
  schedule();
 };
 test.onerror=function(){if(photos.length>1){position++;if(position>=photos.length)position=0;display(photos[position]);}};
 test.src=item.url;
}
function escapeHTML(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function loadMore(){
 /* Keep the request volume low on old projectors. */
 requestJSON("https://picsum.photos/v2/list?page="+picsumPage+"&limit=30",function(err,data){
  var i,x;if(!err&&data&&data.length){for(i=0;i<data.length;i++){x=data[i];addItem({id:"picsum"+x.id,url:"https://picsum.photos/id/"+x.id+"/1600/900",title:"Ảnh ngẫu nhiên",author:x.author||"Picsum",source:"Lorem Picsum",link:x.url,width:x.width,height:x.height});}}
  picsumPage++;loading=false;setStatus(photos.length+" ẢNH TRONG DANH SÁCH");
 });
}
function togglePlay(){paused=!paused;byId("play").innerHTML=paused?"TIẾP TỤC":"TẠM DỪNG";if(paused){if(timer)clearTimeout(timer);if(progressTimer)clearInterval(progressTimer);}else{schedule();}}
function fullscreen(){
 var el=document.documentElement;
 if(el.requestFullscreen){el.requestFullscreen();}
 else if(el.webkitRequestFullScreen){el.webkitRequestFullScreen();}
 else if(el.mozRequestFullScreen){el.mozRequestFullScreen();}
 else if(el.msRequestFullscreen){el.msRequestFullscreen();}
}
byId("next").onclick=showNext;byId("prev").onclick=showPrevious;byId("play").onclick=togglePlay;byId("full").onclick=fullscreen;
byId("speed").onchange=function(){seconds=parseInt(this.value,10)||12;if(!paused)schedule();};
setStatus("ĐANG TẢI ẢNH...");
/* Start multiple independent public sources; no API keys are used. */
loadCommons();
setTimeout(function(){if(photos.length<5)loadNASA();},1800);
setTimeout(function(){if(photos.length<5)loadPicsum();},3500);
})();
