var allplayers=allplayers||{};
(function(b){allplayers.api=function(a){var c={path:"https://www.pdup.allplayers.com/api/v1/rest"};c.group_path=c.path+"/groups";a=b.extend(c,a);allplayers.base.call(this,null,a)};allplayers.api.prototype=new allplayers.base;allplayers.api.prototype.constructor=allplayers.api;allplayers.api.prototype.get=function(a,c){b.getJSON(a,function(a,b){b=="success"?c(a):this.log("Error: "+b)})};allplayers.api.prototype.getGroups=function(a,c){var b=this.options.group_path+".jsonp?";b+=a?'search="'+encodeURIComponent(a)+
'"&':"";b+="callback=?";this.get(b,c)};allplayers.api.prototype.getGroup=function(a,c,b){a=this.options.group_path+"/"+a+".jsonp?";a+=c?jQuery.param(c)+"&":"";a+="callback=?";this.get(a,b)};allplayers.api.prototype.saveGroup=function(a){this.log("Saving Group");this.log(a)};allplayers.api.prototype.getGroupAlbums=function(a,c,b){a=this.options.group_path+"/"+a+"/albums.jsonp?";a+=c?jQuery.param(c)+"&":"";a+="callback=?";this.get(a,b)};allplayers.api.prototype.getGroupEvents=function(a,b,d){a=this.options.group_path+
"/"+a+"/events.jsonp?";a+=b?jQuery.param(b)+"&":"";a+="callback=?";this.get(a,d)};allplayers.api.prototype.getGroupMembers=function(a,b,d){a=this.options.group_path+"/"+a+"/members.jsonp?";a+=b?jQuery.param(b)+"&":"";a+="callback=?";this.get(a,d)};allplayers.api.prototype.getGroupPhotos=function(a,b,d){a=this.options.group_path+"/"+a+"/photos.jsonp?";a+=b?jQuery.param(b)+"&":"";a+="callback=?";this.get(a,d)};allplayers.api.prototype.getEvents=function(){};allplayers.api.prototype.saveEvent=function(a){this.log("Saving Event");
this.log(a)}})(jQuery);allplayers=allplayers||{};(function(){allplayers.base=function(b,a){this.api=b;this.options=a};allplayers.base.prototype.log=function(b){console.log(b)}})(jQuery);allplayers=allplayers||{};
(function(b){var a={};allplayers.calendars={};if(!b.fn.allplayers_calendar)b.fn.allplayers_calendar=function(a){return b(this).each(function(){allplayers.calendars[b(this).selector]||new allplayers.calendar(b(this),a)})};allplayers.calendar=function(c,d){var e=this,d=b.extend(a,d,{header:{left:"prev,next today",center:"title",right:"month,agendaWeek,agendaDay"},editable:true,dayClick:this.onDayClick,eventClick:this.onEventClick,eventDragStop:function(a){a.obj.update(a);a.obj.save()},eventResizeStop:function(a){a.obj.update(a);
a.obj.save()},events:function(a,b,c){e.getEvents(a,b,c)}});allplayers.calendars[d.id]=this;this.uuid="";this.api=new allplayers.api;c.fullCalendar(d)};allplayers.calendar.prototype.onDayClick=function(){console.log("Day has been clicked")};allplayers.calendar.prototype.onEventClick=function(){console.log("Event has been clicked")};allplayers.calendar.prototype.getUUID=function(a){if(this.uuid)a.call(this);else{var b=this;this.api.getGroups("towncenter",function(e){b.uuid=e[0].uuid;a.call(b)})}};allplayers.calendar.prototype.getEvents=
function(a,b,e){var f=b.getFullYear(),g=b.getMonth();this.getUUID(function(){var a=this;this.api.getGroupEvents(this.uuid,{month:f+"-"+g,fields:"*",limit:0,offset:0},function(b){for(var c=b.length,d=null;c--;)d=new allplayers.event(a.api,a.options,b[c]),b[c].allDay=false,b[c].obj=d;e(b)})})}})(jQuery);allplayers=allplayers||{};
(function(b){allplayers.entity=function(a,b){this.description=this.title=this.uuid="";allplayers.base.call(this,a,b)};allplayers.entity.prototype=new allplayers.base;allplayers.entity.prototype.constructor=allplayers.entity;allplayers.entity.prototype.update=function(a){b.extend(true,this,a)}})(jQuery);allplayers=allplayers||{};
(function(){allplayers.event=function(b,a,c){this.allDay=false;this.end=this.start=null;allplayers.entity.call(this,b,a);this.update(c)};allplayers.event.prototype=new allplayers.entity;allplayers.event.prototype.constructor=allplayers.event;allplayers.event.prototype.save=function(){this.api.saveEvent(this)}})(jQuery);allplayers=allplayers||{};
(function(){allplayers.group=function(b,a,c){this.location=new allplayers.location(b,a);this.list_in_directory=this.activity_level=0;this.active=false;this.secondary_color=this.primary_color=this.accept_amex=this.approved_for_payment=this.registration_fees_enabled="";this.node_status=0;this.url=this.uri=this.logo="";this.groups_above_uuid=[];allplayers.entity.call(this,b,a);this.update(c)};allplayers.group.prototype=new allplayers.entity;allplayers.group.prototype.constructor=allplayers.group;allplayers.group.prototype.save=
function(){this.api.saveGroup(this)}})(jQuery);allplayers=allplayers||{};
(function(){allplayers.groups=function(b,a){allplayers.base.call(this,b,a)};allplayers.groups.prototype=new allplayers.base;allplayers.groups.prototype.constructor=allplayers.groups;allplayers.groups.prototype.getGroups=function(b,a){this.api.getGroups(b,function(b){for(var d=[],e=b.length;e--;)d.push(new allplayers.group(this.options,this.api,b[e]));a(d)})};allplayers.groups.prototype.getGroup=function(b){this.api.getGroup(b,function(a){return new allplayers.group(this.options,this.api,a)})}})(jQuery);
allplayers=allplayers||{};(function(){allplayers.location=function(b,a){this.longitude=this.latitude=this.country=this.zip=this.state=this.city=this.street="";allplayers.entity.call(this,b,a)};allplayers.location.prototype=new allplayers.entity;allplayers.location.prototype.constructor=allplayers.location})(jQuery);
