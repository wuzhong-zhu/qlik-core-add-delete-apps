var url, prefix,connectionType;
$(document).ready(function() {
  initialize()
  run()
});


function initialize(){
  url = $( "#url" ).val();
  prefix = $( "#prefix" ).val();
  connectionType = "ws"
  if ($('#isSecure').is(":checked")){
    connectionType = "wss"
  }

  $( "#url,#app,#prefix, #isSecure" ).change(function() {
    url = $( "#url" ).val();
    prefix = $( "#prefix" ).val();
    connectionType = "ws"
    if ($('#isSecure').is(":checked")){
      connectionType = "wss"
    }
  })
  $( "#createAppButton" ).click(function() {
    createApp();
    $( "#popup" ).hide()
  });
  $( "#openPopupButton" ).click(function() {
    $( "#popup" ).show()
  });
  $( "#closePopupButton" ).click(function() {
    $( "#popup" ).hide()
  });
}


function createApp(){
  var appName = $( "#appName" ).val();
  console.log("creating app "+appName+" @ "+connectionType+":"+url+"/"+prefix)
  $.get('https://unpkg.com/enigma.js@2.2.0/schemas/12.34.11.json')
    .then(schema => {
      const session = enigma.create({
        schema,
        url: connectionType+'://'+url+'/'+prefix+'/',
        createSocket: url => new WebSocket(url)
      });
      session.open()
        .then(global => {
          console.log(global)
          return global.createApp({qAppName:appName})
        })
        .then(ret => {
          console.log(ret)
          run()
        })
    })
}

function deleteApp(appId){
  console.log("deleting app "+appId+" @ "+connectionType+":"+url+"/"+prefix)
  $.get('https://unpkg.com/enigma.js@2.2.0/schemas/12.34.11.json')
    .then(schema => {
      const session = enigma.create({
        schema,
        url: connectionType+'://'+url+'/'+prefix+'/',
        createSocket: url => new WebSocket(url)
      });
      session.open()
        .then(global => {
          console.log(global)
          return global.deleteApp({qAppId:appId})
        })
        .then(ret => {
          console.log(ret)
        })
    })
}

function run(){
  $("#chart1").empty();
  console.log("Connecting to "+connectionType+":"+url+"/"+prefix)
  $.get('https://unpkg.com/enigma.js@2.2.0/schemas/12.34.11.json')
    .then(schema => {
      const session = enigma.create({
        schema,
        url: connectionType+'://'+url+'/'+prefix+'/',
        createSocket: url => new WebSocket(url)
      });
      session.open()
        .then(global => {
          global.getDefaultAppFolder().then(a=>{console.log(a)})
          console.log(global)
          return global.getDocList()
        })
        .then(apps => {
          console.log(apps)
          listDocs(apps)
    })
  })
}
///var/lib/docker/overlay2/5fe99a0e6b2529e22527424d665cc372628a3a0da72c325054445deaa6957cfa/merged/home/nobody/Qlik/Sense/Apps
//mv tempapp.qvf /var/lib/docker/overlay2/5fe99a0e6b2529e22527424d665cc372628a3a0da72c325054445deaa6957cfa/merged/home/nobody/Qlik/Sense/Apps

function listDocs(data)
{
  var tableText = "<table>"
  tableText += "<tr>"
  tableText+="<th>ID</th>"
  tableText+="<th>Doc name</th>"
  tableText+="<th>App title</th>"
  tableText+="<th>App size</th>"
  tableText+="<th>Last reload time</th>"
  tableText+="</tr>"
  data.forEach(function(elem){
    tableText += "<tr>"
    tableText +="<td>"+elem.qDocId+"</td>"
    tableText +="<td>"+elem.qDocName+"</td>"
    tableText +="<td>"+elem.qTitle+"</td>"
    tableText +="<td>"+elem.qFileSize+"</td>"
    tableText +="<td>"+elem.qLastReloadTime+"</td>"
    tableText +="<td><button class='deleteBtn' value='"+elem.qDocId+"'>"+"delete</button></td>"
    tableText += "</tr>"    
  })
  tableText += "</table>"
  $("#chart1").append(tableText);
  $( ".deleteBtn").click(function() {
    console.log(this.value)
    deleteApp(this.value);
    run();
  });
  console.log(tableText)
}