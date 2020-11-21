// ========================================================== //
// ========================== doGet ========================= //
function doGet(e){
var op = e.parameter.action;
var sss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0")
if(op=="datauser")
  return datauser_value(e,sss);
if(op == "inputdaftar")
  return inputdaftar_value(e,sss)
if(op =="notepadkehtml")
  return notepadkehtml_value(e)
if(op =="verifikasiemail")
  return verifikasiemail_value(e)
if(op=="riwayatmateri")
  return riwayatmateri_value(e,sss);
if(op =="previewriwayat")
  return previewriwayat_value(e);

 if(op=="datasiswasudahmengerjakan")
    return datasiswasudahmengerjakan_value(e,sss); 
  if(op == "respon_nilai")
  return responnilai_value(e)
if (op == "lihatnilai")
  return ceknilai(e)
  
if (op == "lembarjawaban")  
  return lembarjawaban_value(e)
  
if(op == "koreksiessay")
  return koreksiessay_value(e)

if(op=="lihatanjangsana")
  return lihatanjangsana_value(e,sss);
 }

function doPost(e){
  var sss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0")
  var op = e.parameter.action;
if(op == "inputdaftar")
    return inputdaftar_value(e,sss)
if(op == "uploadmateri")
  return uploadText(e)
if (op == "siswakirimnilai")
    return siswakirimnilai_value(e)
if (op =="pasangstatus")
  return pasangstatus_value(e)
if (op =="komeninorang")
  return komeninorang_value(e)

if(op=="uploadmediastatus")
  return uploadmediastatus_value(e)
if(op=="kirimsuka")
  return kirimsuka_value(e)
  
  if(op == "editdaftar")
    return editdaftar_value(e,sss)
}
//=================================================================================================================
//                           MENGEDIT DATA USER BARU (EDIT DATANYA)
//=================================================================================================================
function editdaftar_value(e){
var t = e.parameter;
  var f = e.parameters;
  var namafolder="Pendaftar";
  var folder;
  var folders = DriveApp.getFoldersByName(namafolder);
  if(folders.hasNext()){
  folder = folders.next();
  }else{
  folder = DriveApp.createFolder(namafolder);
   }
  
  folder.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
  
  var namasubfolder = [t.sekolah];
  var subfolder;
  var subfolders = folder.getFoldersByName(namasubfolder);
  if(subfolders.hasNext()){
  subfolder = subfolders.next()
  }
  else{
  subfolder = folder.createFolder(namasubfolder)
  }
  
  
  if(f.hasOwnProperty("data")){
    var dataid = []
    for(var i = 0 ; i < f.data.length ; i++){
      var data64 = Utilities.base64Decode(f.data[i]);
      
      var typeMime = f.mimeType[i];
      var namafile =f.filename[i];
      if(typeMime == "data:text/plain"){
        var x ="text/plain";
        var blob = Utilities.newBlob(data64, x, namafile+".txt");
        //var isisel = blob.getAs(MimeType.HTML).getDataAsString();
        //buatdataexcel(isisel);
      }
      
      if(typeMime.indexOf("image") > -1){
      var blob = Utilities.newBlob(data64, typeMime, namafile)}
                                         
      var file = subfolder.createFile(blob);
      var idFile = file.getId();
     dataid.push(idFile);
      
      if(f.filename[i] == "idnp_dataanak" ){t["idnp_datasiswa"] = idFile}
      if(f.filename[i].indexOf("avatar") > -1){t["idpoto_potoguru"] = idFile}

    } 
  }
  
 
  
  
  delete t.data;
  
  
 var tes =  recordSSedit(t);
  var surel = t.email;
  var username = t.username;
  var baris = t.brs;
  var password = t.password;
  kirimemail(surel,baris, username,password)
  var output = "Data Berhasil di baris " + tes;
  var result = JSON.stringify(output);
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JAVASCRIPT);
 
}
///==============================================================================================
//                                 EDIT DATA USER
//==============================================================================================
function recordSSedit(t){
   var ss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0").getSheetByName("user");
  //var ss = sss.getSheetByName("user");
  var kolomakhir = ss.getLastColumn();
  var headerawal = ss.getRange(1, 1, 1, kolomakhir).getValues()[0];
  
  // tentukan dulu data pada form selain data yang tidak diinginkan.
  var dataparameter = dataSelainSampah(t);
  
  // jika ada header baru yang belum ada di header pertama buat, maka tentukan variable headerbarunya
  var headerbaru = headerawal.slice() ; // ini array headerbaru
  
  // buat array baru sesaui dengan urutan yang ditentukan
  var row = [new Date()];
  

//tujuannya untuk mengurutkan Objek Array (JSON) berdasarkan urutan header kolom headerawal
  for (var i = 1; i< headerawal.length; i++){
    var headernya = headerawal[i];
    var dariinput = getFieldFromData(headernya, t);// t.parameters) ; // t.parameter.headernya --> fungsi ini bisa saja, tapi yang dibutuhkan adalah objek ; //mengoleksi objek dengan key headernya, maka kita pake fungsi luar getFieldformData
    
    // berbeda dengan sebelumnya, jika dulu base64 diganti disini dengan kode if condition, sekarang tidak lagi. Karena kondisi itu sudah di buat di paramater "t"
   //if (headernya === "data" ){row.push("kepanjangan")}else{
    row.push(dariinput);
    //}
  // Jika ada dataSelain sampah ada/kebaca, maka data tersebut harus dihapus;
  var datayangdihapus = dataparameter.indexOf(headernya);
  if (datayangdihapus > -1 ){
    dataparameter.splice(datayangdihapus,1)
  
  }   }
// -------------- selesai mengurutkan array objek  

  
  //kemudian jika ditemukan ada kolom header baru, maka dibuatkan array baru
  for(var j = 0 ; j < dataparameter.length ; j++){
    var headertambahan = dataparameter[j];
    var datatambahan = getFieldFromData(headertambahan, t);//t.parameters);
    row.push(datatambahan);
    headerbaru.push(headertambahan)
  }
  
  // sekarang kita isi ke Spreadsheeet
  //var barisakhir = ss.getLastRow() + 1;
  var barisakhir = t.brs;
  //ss.getRange(barisakhir, 1, numRows, numColumns)
  ss.getRange(barisakhir, 1, 1, row.length).setValues([row])
  
  //untuk header baru jika ada:
  if(headerbaru.length > headerawal.length){
  ss.getRange(1, 1, 1, headerbaru.length).setValues([headerbaru])
  }
  var reshasil = ss.getLastRow();
  return reshasil
//  return headerawal.join(", ")
}

function getFieldFromData(field, data) {
  var values = data[field] || "";
  var output = values.join ? values.join(', ') : values;
  return output;
}

function dataSelainSampah(data){
  return Object.keys(data).filter(function(column) {
    return !(column === 'formDataNameOrder' || column === 'formGoogleSheetName' || column === 'formGoogleSendEmail' || column === 'honeypot' || column === 'brs' );
  });
}

function getDataColumns(data) {
  return Object.keys(data).filter(function(column) {
    return !(column === 'formDataNameOrder' || column === 'formGoogleSheetName' || column === 'formGoogleSendEmail' || column === 'honeypot' || column=='Time_Stamp');
  });
}


///////////////////////////////////////////////////////////////////////////////
///                         USER NGELIKE  DI STATUS ORANG                     //////////
///////////////////////////////////////////////////////////////////////////////
function kirimsuka_value(e){
  var t = e.parameter;
  var col = e.parameter.kol;
  var brs = e.parameter.brs;
  var nama = e.parameter.nama;
  var sukake = (col -12)/5;
  
  var ss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0").getSheetByName("anjangsana");
  
  //isiheader dulu, biarin timpa juga:
  ss.getRange(1, col).setValue("suka" + sukake);
  //isi siapa namanya
  ss.getRange(brs, col).setValue(nama);
 
  
  var result = "Selamat, Anda berhasil menyukai status Sahabat Anda ...."
  result = JSON.stringify({"result":result})
  
 return ContentService
  .createTextOutput( result )
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
}


///////////////////////////////////////////////////////////////////////////////
///                         USER KOMENT DI STATUS ORANG                     //////////
///////////////////////////////////////////////////////////////////////////////
function komeninorang_value(e){
  var t = e.parameter;
  var col = e.parameter.col;
  var brs = e.parameter.brs;
  var headeravatar, headersiapakomen, headerwaktukomen, headerisikomen;
  for (var x in t){
    if(x.indexOf("avatarkomen") > -1){
       headeravatar = x}
    if(x.indexOf("siapakomen") > -1){
       headersiapakomen = x} 
    if(x.indexOf("waktukomen") > -1){
       headerwaktukomen = x} 
    if(x.indexOf("isikomen") > -1){
       headerisikomen = x} 
     }
  
  var ss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0").getSheetByName("anjangsana");
  
  //isiheader dulu, biarin timpa juga:
  ss.getRange(1, col).setValue(headeravatar);
  ss.getRange(1, (col * 1  + 1)).setValue(headersiapakomen);
  ss.getRange(1, (col * 1  + 2)).setValue(headerwaktukomen);
  ss.getRange(1, (col * 1  + 3)).setValue(headerisikomen);
  
  //isi kontennya;
  //tapi tentukan dulu isinya ;
  var isiavatar = getFieldFromData(headeravatar, t);
  var isisiapakomen = getFieldFromData(headersiapakomen, t);
  var isiwaktukomen = getFieldFromData(headerwaktukomen, t);
  var isiisikomen = getFieldFromData(headerisikomen, t);
  
  ss.getRange(brs, col).setValue(isiavatar);
  ss.getRange(brs, (col * 1 + 1)).setValue(isisiapakomen);
  ss.getRange(brs, (col * 1 + 2)).setValue(isiwaktukomen);
  ss.getRange(brs, (col * 1 + 3)).setValue(isiisikomen);
  
   var result = "Selamat, Anda berhasil menyapa ...."
  result = JSON.stringify({"result":result})
  
 return ContentService
  .createTextOutput( result )
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
}

////////////////////////////////////////////////////////////////////////////////////////////////
/// KETIKA USER PENGEN UPLOAD POTO, MAKA DIUPLOAD DULU LALU DIKIRIM BALIK LINK POTONYA //////////
/////////////////////////////////////////////////////////////////////////////////////////////////

function uploadmediastatus_value(e){
var data = Utilities.base64Decode(e.parameter.data);
  var tipemime = e.parameter.mimetype;
  var namafile = e.parameter.namafile;
  var email =e.parameter.email;
  var blob = Utilities.newBlob(data, tipemime, namafile);
  var folderstatuspoto = "status poto " + email;
  var folder, folders = DriveApp.getFoldersByName(folderstatuspoto);
  if(folders.hasNext()){
  folder = folders.next();
  }else{
  folder = DriveApp.createFolder(folderstatuspoto)
  }
  var user = Session.getActiveUser();
  
 

  
  var filepoto = folder.createFile(blob);
  var url = filepoto.getId();// .getDownloadUrl();
  var output = "<img src='https://drive.google.com/uc?export=view&id="+url+"' style='width:100%' class='w3-margin-bottom'>"
 
    var result = JSON.stringify({"result":output})
  
 return ContentService
  .createTextOutput( result )
  .setMimeType(ContentService.MimeType.JAVASCRIPT);  
  folder.setOwner(email).setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW).revokePermissions(user) ; 
}
///////////////////////////////////////////////////////////////////////////////
///                         USER PASANG STATUS                      //////////
///////////////////////////////////////////////////////////////////////////////
function pasangstatus_value(e){
  var t = e.parameter;
  var ss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0").getSheetByName("anjangsana");
  var kolomakhir = ss.getLastColumn();
  var headerawal = ss.getRange(1, 1, 1, kolomakhir).getValues()[0];
  
  // tentukan dulu data pada form selain data yang tidak diinginkan.
  var dataparameter = dataSelainSampah(t);
  
  // jika ada header baru yang belum ada di header pertama buat, maka tentukan variable headerbarunya
  var headerbaru = headerawal.slice() ; // ini array headerbaru
  
  // buat array baru sesaui dengan urutan yang ditentukan
  var row = [new Date()];
  

//tujuannya untuk mengurutkan Objek Array (JSON) berdasarkan urutan header kolom headerawal
  for (var i = 1; i< headerawal.length; i++){
    var headernya = headerawal[i];
    var dariinput = getFieldFromData(headernya, t);// t.parameters) ; // t.parameter.headernya --> fungsi ini bisa saja, tapi yang dibutuhkan adalah objek ; //mengoleksi objek dengan key headernya, maka kita pake fungsi luar getFieldformData
    
    // berbeda dengan sebelumnya, jika dulu base64 diganti disini dengan kode if condition, sekarang tidak lagi. Karena kondisi itu sudah di buat di paramater "t"
   //if (headernya === "data" ){row.push("kepanjangan")}else{
    row.push(dariinput);
    //}
  // Jika ada dataSelain sampah ada/kebaca, maka data tersebut harus dihapus;
  var datayangdihapus = dataparameter.indexOf(headernya);
  if (datayangdihapus > -1 ){
    dataparameter.splice(datayangdihapus,1)
  
  }   }
// -------------- selesai mengurutkan array objek  

  
  //kemudian jika ditemukan ada kolom header baru, maka dibuatkan array baru
  for(var j = 0 ; j < dataparameter.length ; j++){
    var headertambahan = dataparameter[j];
    var datatambahan = getFieldFromData(headertambahan, t);//t.parameters);
    row.push(datatambahan);
    headerbaru.push(headertambahan)
  }
  
  // sekarang kita isi ke Spreadsheeet
  var barisakhir = ss.getLastRow() + 1;
  //ss.getRange(barisakhir, 1, numRows, numColumns)
  ss.getRange(barisakhir, 1, 1, row.length).setValues([row])
  
  //untuk header baru jika ada:
  if(headerbaru.length > headerawal.length){
  ss.getRange(1, 1, 1, headerbaru.length).setValues([headerbaru])
  }
   var result = "Selamat, Sekarang Anda bisa menyapa sahabat guru yang lain ...."
  result = JSON.stringify({"result":result})
  
 return ContentService
  .createTextOutput( result )
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
}

///////////////////////////////////////////////////////////////////////////////
///                         SISWA KIRIM NILAI                      //////////
///////////////////////////////////////////////////////////////////////////////

function siswakirimnilai_value(e){
//simpan ke Drive dulu
  //var foldernilai = "e-Lamaso Nilai"
  var subfoldersekolah = e.parameter.idsekolah;
  var subsubfolderkelas = e.parameter.idkelas;
  var emailguru = e.parameter.emailguru;
  var foldernilai = "e-lamaso " + e.parameter.idtoken + " " + emailguru;
  var foldersiap;
  var folders = DriveApp.getFoldersByName(foldernilai)
  if(folders.hasNext()){
    foldersiap = folders.next()
  }
  else{
    foldersiap = DriveApp.createFolder(foldernilai)
  }
  //foldersiap.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW)
  var user = Session.getActiveUser();
  //foldersiap.setOwner(emailguru).setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW).revokePermissions(user);
  
  var t = e.parameters;
  var f = e.parameter;
  var namafile = e.parameter.namasiswa;
  var data = e.parameter.tekshtmlnilai;
  if(t.hasOwnProperty("tekshtmlnilai")){
     var byte = Utilities.base64Decode(data);
     var typeteks = "text/plain";
     var blob = Utilities.newBlob(byte, typeteks, namafile+".txt" )
     }
  var filenya = foldersiap.createFile(blob);
  var urlfilenya = filenya.getDownloadUrl();//.getUrl()
  var idfilenya = filenya.getId();
  
  delete f.tekshtmlnilai;
  //t.parameter[tekshtmlnilai] = idfilenya;
   //f[arrynamadata[j]] = t.filename[j];/
  //var databaru = [];
  //databaru.push(idfilenya);
  f["html_jawaban"] = idfilenya;
  
  writeSS(f)
  
  var result = "Data Berhasil masuk, Brooo dan ini linknya " + urlfilenya + " dan ini kodebaris id inputnya" ;//+ barisid;
  result = JSON.stringify({"result":result})
  
 return ContentService
  .createTextOutput( result )
  .setMimeType(ContentService.MimeType.JAVASCRIPT);  
  foldersiap.setOwner(emailguru).setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW).revokePermissions(user);
}
///////////////////////////////////////////////////////////////////////////////
///                       Record Nilai di SS  writeSS(t){                      //////////
///////////////////////////////////////////////////////////////////////////////

function writeSS(t){
  var ss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0").getSheetByName("responnilai");
  var kolomakhir = ss.getLastColumn();
  var headerawal = ss.getRange(1, 1, 1, kolomakhir).getValues()[0];
  
  // tentukan dulu data pada form selain data yang tidak diinginkan.
  var dataparameter = dataSelainSampah(t);
  
  // jika ada header baru yang belum ada di header pertama buat, maka tentukan variable headerbarunya
  var headerbaru = headerawal.slice() ; // ini array headerbaru
  
  // buat array baru sesaui dengan urutan yang ditentukan
  var row = [new Date()];
  

//tujuannya untuk mengurutkan Objek Array (JSON) berdasarkan urutan header kolom headerawal
  for (var i = 1; i< headerawal.length; i++){
    var headernya = headerawal[i];
    var dariinput = getFieldFromData(headernya, t);// t.parameters) ; // t.parameter.headernya --> fungsi ini bisa saja, tapi yang dibutuhkan adalah objek ; //mengoleksi objek dengan key headernya, maka kita pake fungsi luar getFieldformData
    
    // berbeda dengan sebelumnya, jika dulu base64 diganti disini dengan kode if condition, sekarang tidak lagi. Karena kondisi itu sudah di buat di paramater "t"
   //if (headernya === "data" ){row.push("kepanjangan")}else{
    row.push(dariinput);
    //}
  // Jika ada dataSelain sampah ada/kebaca, maka data tersebut harus dihapus;
  var datayangdihapus = dataparameter.indexOf(headernya);
  if (datayangdihapus > -1 ){
    dataparameter.splice(datayangdihapus,1)
  
  }   }
// -------------- selesai mengurutkan array objek  

  
  //kemudian jika ditemukan ada kolom header baru, maka dibuatkan array baru
  for(var j = 0 ; j < dataparameter.length ; j++){
    var headertambahan = dataparameter[j];
    var datatambahan = getFieldFromData(headertambahan, t);//t.parameters);
    row.push(datatambahan);
    headerbaru.push(headertambahan)
  }
  
  // sekarang kita isi ke Spreadsheeet
  var barisakhir = ss.getLastRow() + 1;
  //ss.getRange(barisakhir, 1, numRows, numColumns)
  ss.getRange(barisakhir, 1, 1, row.length).setValues([row])
  
  //untuk header baru jika ada:
  if(headerbaru.length > headerawal.length){
  ss.getRange(1, 1, 1, headerbaru.length).setValues([headerbaru])
  }
 // var reshasil = ss.getLastRow();
 // return reshasil
//  return headerawal.join(", ")
}

function getFieldFromData(field, data) {
  var values = data[field] || "";
  var output = values.join ? values.join(', ') : values;
  return output;
}

function dataSelainSampah(data){
  return Object.keys(data).filter(function(column) {
    return !(column === 'formDataNameOrder' || column === 'formGoogleSheetName' || column === 'formGoogleSendEmail' || column === 'honeypot' || column === 'col');
  });
}

///////////////////////////////////////////////////////////////////////////////
///                         KOREKSI ESSAY                      //////////
///////////////////////////////////////////////////////////////////////////////

function koreksiessay_value(e){
var idbaris = e.parameter.brs;
  var rowk = idbaris;
var nilaiEssay = e.parameter.nilaiEssay;
var ss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0").getSheetByName("responnilai");
  ss.getRange(rowk, 8).setValue(nilaiEssay)
//var urlk = ss.getParent().getUrl()


  var output="Data Nilai Essay telah berhasil diperbarui.";

     var result = JSON.stringify({
    "result": output
  });  
    
  return ContentService
  .createTextOutput(e.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT); 

  
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// MEMANGGIL FILE TXT LEMBAR JAWABAN  UNTUK DIKOREKSI ////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lembarjawaban_value(e){
  var html_jawaban = e.parameter.html_jawaban;
  var filedrv = DriveApp.getFileById(html_jawaban);
  var result = filedrv.getAs(MimeType.HTML).getDataAsString();
  //var result = filedrv.getBlob().getDataAsString();
  //var result = filedrv.getBlob();
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JAVASCRIPT)
}


///////////////////////////////////////////////////////////////////////////////
///                         CEK NILAI                       //////////
///////////////////////////////////////////////////////////////////////////////
function responnilai_value(e){
 var ss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0")//.getSheetByName("responnilai")
  var output  = ContentService.createTextOutput(),
      data    = {};
  //NAMA sheet yang ada di Database Dapodik (kalo beda, ganti. Sesuaikan dengan nama sheetnya).
      var sheet="responnilai";

  data.records = readData_(ss, sheet);
  
  var callback = e.parameters.callback;
  
  if (callback === undefined) {
    output.setContent(JSON.stringify(data));
  } else {
    output.setContent(callback + "(" + JSON.stringify(data) + ")");
  }
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  
  return output;
}

///////////////////////////////////////////////////////////////////////////////
///                         UPLOAD MATERI E LAMASO                      //////////
///////////////////////////////////////////////////////////////////////////////
function uploadText(e){
	var buatteksresult = ContentService.createTextOutput();
  var data = e.parameter.basetxt;
      var tglpoto = new Date();
      var tekstglpoto = tglpoto.toLocaleString();
    var file = e.parameter.idmapel;// + tekstglpoto; // ini untuk nama file 
    var email = e.parameter.idkelas ;//"materi "; // ini untuk nama subfolder
    var name = e.parameter.crtToken; // ini untuk nama subsubfolder


    
//-------------    
    var dropbox = "E LAMASO MATERI";
    var folder, folders = DriveApp.getFoldersByName(dropbox);
    
    
 
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
   	folder.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    var subsubfolder;
    var subdropbox = [email];
    var subFolderss = folder.getFoldersByName(subdropbox);
    if (subFolderss.hasNext()){
      subsubfolder = subFolderss.next();
    }else{
      subsubfolder = folder.createFolder(subdropbox);
    }
    
    var subdisubfolder;
    var subdidropbox = [name];
    var subdiFolderss = subsubfolder.getFoldersByName(subdidropbox);
    if (subdiFolderss.hasNext()){
      subdisubfolder = subdiFolderss.next();
    }else{
      subdisubfolder = subsubfolder.createFolder(subdidropbox);
    }
    var urlFolderx = subdisubfolder.getUrl();  
      


//file ke-1
    if (data !== ""){
    var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, file+".txt");
     var file = subdisubfolder.createFile(blob);
    }
    var simpanUrl = file.getUrl();  
    
    var stringnamaFolder = name;
    var linkfolderdiexcel = stringnamaFolder.link(subsubfolder.getUrl());
    
  var namatoken = file.getName(); //nama file di G Drive setelah disimpan (aslinya pake aja idtoken)
  var linkurlbasetxt = file.getUrl();//link dimana file berhasil diupload (diisi di kolom basetxt)
  var idfile = file.getId(); // karena menggunakan nama bisa saja dobel, maka gunakan id aja untuk membedakannya.
  
  
 
  
  // Nama Sheet pada Spreadsheet yang digunakan data absen adalah responses, pake nama sheet ini aja karena javascript luarnya ini.
 
  //var doc = SpreadsheetApp.getActiveSpreadsheet();
  var doc = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0")
    var sheetName = "tugasguru";
    var sheet = doc.getSheetByName(sheetName);
      
    var oldHeader = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var newHeader = oldHeader.slice();
    var fieldsFromForm = getDataColumns(e.parameters);

      var fieldtimestamp = oldHeader[0];
      var outputtimestamp = getFieldFromData(fieldtimestamp, e.parameters);    
    //var time_Stamp = e.parameter.Time_Stamp;

    
      var row = [new Date()]; // untuk mengisi tanggal penginput
    
    
    // coba dari sini:
    var idbaris = sheet.getLastRow()+1;
  var idsekolah = e.parameter.idpendaftar
  //var idsekolah = idsekolahs + 1;
    // loop through the header columns
    for (var i = 1; i < oldHeader.length; i++) { // start at 1 to avoid Timestamp column
      var field = oldHeader[i];
      var output = getFieldFromData(field, e.parameters);
      
      //var carikan = field.indexOf("basetxt");
          
      
      
      if(field == "basetxt"){
        if(output ===""){row.push('kosong')}else{row.push(linkurlbasetxt)}
      }
      //---------------
      else if(field == "idmateri"){row.push(idfile)}
      else if(field == "idbaris"){row.push(idbaris)}
      else if(field == "idtoken"){row.push(idsekolah+"A"+idbaris)}

      else{row.push(output);}
      
      // mark as stored by removing from form fields
      var formIndex = fieldsFromForm.indexOf(field);
      if (formIndex > -1) {
        fieldsFromForm.splice(formIndex, 1);
      }
    }
    
    // set any new fields in our form
    for (var i = 0; i < fieldsFromForm.length; i++) {
      var field = fieldsFromForm[i];
      var output = getFieldFromData(field, e.parameters);
      row.push(output);
      newHeader.push(field);
    }
    
    // more efficient to set values as [][] array than individually
    var nextRow = sheet.getLastRow() + 1; // get next row
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
   
    

    // update header row with any new data
    if (newHeader.length > oldHeader.length) {
      sheet.getRange(1, 1, 1, newHeader.length).setValues([newHeader]);
    }
    
    var barisakhir = sheet.getRange(sheet.getLastRow(),4).getValue();  
//return barisakhir  
   var output = "Terima Kasih, <b style='color:red'>Kode Token</b> Materi e-Lamaso Anda adalah: <br/><br/><b style='border:1px solid red;background-color:aqua;border-radius:7px;padding:5px'>"+ barisakhir+"</b><br/><br/>Kode Token ini adalah kode yang harus siswa Anda untuk dapat mengakses materi Anda tadi.";
  // "Terima Kasih, <b style='color:red'>Kode Token</b> Materi e-Lamaso Anda adalah: <br/><br/><b style='border:1px solid red;background-color:aqua;border-radius:7px;padding:5px'>"+ link+"</b><br/><br/>Kode Token ini adalah kode yang harus siswa Anda untuk dapat mengakses materi Anda tadi."
  var result = JSON.stringify(output);
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JAVASCRIPT);


}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                MEMANGGIL RIWAYAT MATERI UPLOAD
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function riwayatmateri_value(request,ss){
  
 
  var output  = ContentService.createTextOutput(),
      data    = {};
  //NAMA sheet yang ada di Database input pada sheet pertama: responses.
      var sheet="tugasguru";

  data.records = readData_(ss, sheet);
  
  var callback = request.parameters.callback;
  
  if (callback === undefined) {
    output.setContent(JSON.stringify(data));
  } else {
    output.setContent(callback + "(" + JSON.stringify(data) + ")");
  }
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  
  return output;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                    MEMANGGIL FILE TXT LAMASO UNTUK DIJADIKAN KONTEN E-LMASO /                            ////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function previewriwayat_value(e){
  var idmateri = e.parameter.idmateri;
  var filedrv = DriveApp.getFileById(idmateri)
  var result = filedrv.getAs(MimeType.HTML).getDataAsString();
  //var result = filedrv.getBlob().getDataAsString();
  //var result = filedrv.getBlob();
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JAVASCRIPT)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//             MEMANGGIL DATA SISWA YANG SUDAH MENGERJAKAN PADA SESI E-LAMASO AKSES SEKALI            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function datasiswasudahmengerjakan_value(request,ss){
  
 
  var output  = ContentService.createTextOutput(),
      data    = {};
  //NAMA sheet yang ada di Database input pada sheet pertama: responses.
      var sheet="responnilai";

  data.records = readData_(ss, sheet);
  
  var callback = request.parameters.callback;
  
  if (callback === undefined) {
    output.setContent(JSON.stringify(data));
  } else {
    output.setContent(callback + "(" + JSON.stringify(data) + ")");
  }
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  
  return output;
}
 


//=================================================================================================================
//                              LINK ANCHOR KLIK VERIFIKASI
//=================================================================================================================
function verifikasiemail_value(e){
var baris= e.parameter.baris;
var ss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0").getSheetByName("user").getRange(baris, 5).setValue("terverifikasi");
  var output = HtmlService.createHtmlOutput("<b>AKUN TERVERIFIKASI</b><br/><br/>Silakan login kembali di e-Lamaso Publik Anda melalui tautan berikut ini: <a href='https://e-lamaso.github.io/e_lamaso_guru' target='_blank'>e-Lamaso Guru</a>");
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return output;
  // return Content
}

//=================================================================================================================
//             MENAMPILKAN KONTEN NOTEPAD YANG BERISI DATA SISWA AGAR TAMPIL DI HTML DALAM BENTUK TABEL
//=================================================================================================================
function notepadkehtml_value(e){
  var idnp_datasiswa = e.parameter.idnp_datasiswa;
  var filedrv = DriveApp.getFileById(idnp_datasiswa);//DriveApp.getFileById(idnp_datasiswa)
  var result = filedrv.getAs(MimeType.HTML).getDataAsString();
  //var result = filedrv.getBlob().getDataAsString();
  //var result = filedrv.getBlob();
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JAVASCRIPT)
}
function tes(){
var fnp = DriveApp.getFileById("1guHGVcbzmMHQbRw267QyzBwfGwRhjVyy").getAs(MimeType.HTML).getDataAsString();
var fnp_lengt = fnp.split("\r\n");
  for(var i = 0 ; i < fnp_lengt.length ; i++){
  Logger.log(fnp_lengt[i].toUpperCase())
  }
  
}
 // var ss_baru = SpreadsheetApp.create("Tes Buat file Excel")
//  ss_baru.getActiveSheet().getRange(1, 1, 1,2).setValues([dataa]);// .getRange(1, 1, bariskedua, numColumns)tr
//
//=================================================================================================================
//                           MENGINPUT DATA USER BARU (PENDAFTAR BARU) DI TABSHEET USER
//=================================================================================================================
function inputdaftar_value(e){
var t = e.parameter;
  var f = e.parameters;
  var namafolder="Pendaftar";
  var folder;
  var folders = DriveApp.getFoldersByName(namafolder);
  if(folders.hasNext()){
  folder = folders.next();
  }else{
  folder = DriveApp.createFolder(namafolder);
   }
  
  folder.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
  
  var namasubfolder = [t.sekolah];
  var subfolder;
  var subfolders = folder.getFoldersByName(namasubfolder);
  if(subfolders.hasNext()){
  subfolder = subfolders.next()
  }
  else{
  subfolder = folder.createFolder(namasubfolder)
  }
  
  
  if(f.hasOwnProperty("data")){
    var dataid = []
    for(var i = 0 ; i < f.data.length ; i++){
      var data64 = Utilities.base64Decode(f.data[i]);
      
      var typeMime = f.mimeType[i];
      var namafile =f.filename[i];
      if(typeMime == "data:text/plain"){
        var x ="text/plain";
        var blob = Utilities.newBlob(data64, x, namafile+".txt");
        //var isisel = blob.getAs(MimeType.HTML).getDataAsString();
        //buatdataexcel(isisel);
      }
      
      if(typeMime.indexOf("image") > -1){
      var blob = Utilities.newBlob(data64, typeMime, namafile)}
                                         
      var file = subfolder.createFile(blob);
      var idFile = file.getId();
     dataid.push(idFile);
      
      if(f.filename[i] == "idnp_dataanak" ){t["idnp_datasiswa"] = idFile}
      if(f.filename[i].indexOf("avatar") > -1){t["idpoto_potoguru"] = idFile}

    } 
  }
  
 
  
  
  delete t.data;
  
  
 var tes =  recordSS(t);
  var surel = t.email;
  var username = t.username;
  var password = t.password;
  kirimemail(surel,tes, username,password)
  var output = "Data Berhasil di baris " + tes;
  var result = JSON.stringify(output);
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JAVASCRIPT);
 
}
//=================================================================================================================
//                                        KIRIM EMAIL VERIFIKASI
//=================================================================================================================
function kirimemail(email,baris,user, password){
var bodyhtml ="";
  bodyhtml +="<h2>Verifikasi</h2> Terima kasih, Anda telah mendaftar di e-Lamaso Guru. Sebagai pendaftar ke-" + baris + "<br/><br/>";
  bodyhtml +="Berikut ini data login Anda (Gunakan login ini untuk masuk ke e-Lamaso):<br/>";
  bodyhtml +="User = " + user +"<br/>";
  bodyhtml +="Passwod = " + password +  "<br/><br/>";
  bodyhtml +="Sebelumnya, perkenankan saya memberitahukan beberapa hal penting terkait verifikasi email ini. Email ini bertujuan untuk mengenali akun Google Anda."
  bodyhtml +=" Juga bertujuan untuk berbagi file dari kami dengan Google Drive yang Anda daftarkan. Segala bentuk keamanan insya Allah akan kami jaga selama Anda "
  bodyhtml +=" mengeklik tombol verifikasi di bawah ini. <br/><br/>";
 //tes dulu, nanti ganti hrefnya dengan script_url +"action=verifikasiemail"
  bodyhtml +="<a href='https://script.google.com/macros/s/AKfycbwoyfJfDungZUUoAaXas4gJsgVOpOQQDKxR3JFMTDmEIMtQkNM/exec?action=verifikasiemail&baris="+baris+"' target='_blank' style='height:80px;padding:5px;width:50%;margin:auto;background-color:green;color:white;font-weight:700'>VERIFIKASI</a><br/><br/>"
  bodyhtml +="Tentang saya dapat dihubungi di:<br/><a href='https://facebook.com/syahandrianeda' target='_blank'>Facebook a.n Ade Andriansyah</b><br/><a href='https://syahandrianeda.blogspot.com' target='_blank'>Blog Pribadi</a>"
  bodyhtml +="<br/><a href='https://www.youtube.com/channel/UCkZgtjMOx2sLX4bv1PeyYhA' target='_blank'>Youtube</a>";
  
//var sendEmailTo = (typeof email !== "undefined") ? email : "elamasosyahandrianeda@gmail.com";
    
    // send email if to address is set
    //if (sendEmailTo) {
      MailApp.sendEmail({
        to: email,
        subject: "Verifikasi e-LAMASO Publik",
        // replyTo: String(mailData.email), // This is optional and reliant on your form actually collecting a field named `email`
        //htmlBody: formatMailBody(mailData, dataOrder);
        htmlBody: bodyhtml
      });
    //}
}


//=================================================================================================================
//                                        DATA RECORDS PENDAFTAR DI SHEET USER
//=================================================================================================================
function recordSS(t){
   var ss = SpreadsheetApp.openById("14tAB-F2JlTBhdItrcr5ZPEmGlktcV65thf3djcacRd0").getSheetByName("user");
  //var ss = sss.getSheetByName("user");
  var kolomakhir = ss.getLastColumn();
  var headerawal = ss.getRange(1, 1, 1, kolomakhir).getValues()[0];
  
  // tentukan dulu data pada form selain data yang tidak diinginkan.
  var dataparameter = dataSelainSampah(t);
  
  // jika ada header baru yang belum ada di header pertama buat, maka tentukan variable headerbarunya
  var headerbaru = headerawal.slice() ; // ini array headerbaru
  
  // buat array baru sesaui dengan urutan yang ditentukan
  var row = [new Date()];
  

//tujuannya untuk mengurutkan Objek Array (JSON) berdasarkan urutan header kolom headerawal
  for (var i = 1; i< headerawal.length; i++){
    var headernya = headerawal[i];
    var dariinput = getFieldFromData(headernya, t);// t.parameters) ; // t.parameter.headernya --> fungsi ini bisa saja, tapi yang dibutuhkan adalah objek ; //mengoleksi objek dengan key headernya, maka kita pake fungsi luar getFieldformData
    
    // berbeda dengan sebelumnya, jika dulu base64 diganti disini dengan kode if condition, sekarang tidak lagi. Karena kondisi itu sudah di buat di paramater "t"
   //if (headernya === "data" ){row.push("kepanjangan")}else{
    row.push(dariinput);
    //}
  // Jika ada dataSelain sampah ada/kebaca, maka data tersebut harus dihapus;
  var datayangdihapus = dataparameter.indexOf(headernya);
  if (datayangdihapus > -1 ){
    dataparameter.splice(datayangdihapus,1)
  
  }   }
// -------------- selesai mengurutkan array objek  

  
  //kemudian jika ditemukan ada kolom header baru, maka dibuatkan array baru
  for(var j = 0 ; j < dataparameter.length ; j++){
    var headertambahan = dataparameter[j];
    var datatambahan = getFieldFromData(headertambahan, t);//t.parameters);
    row.push(datatambahan);
    headerbaru.push(headertambahan)
  }
  
  // sekarang kita isi ke Spreadsheeet
  var barisakhir = ss.getLastRow() + 1;
  //ss.getRange(barisakhir, 1, numRows, numColumns)
  ss.getRange(barisakhir, 1, 1, row.length).setValues([row])
  
  //untuk header baru jika ada:
  if(headerbaru.length > headerawal.length){
  ss.getRange(1, 1, 1, headerbaru.length).setValues([headerbaru])
  }
  var reshasil = ss.getLastRow();
  return reshasil
//  return headerawal.join(", ")
}

function getFieldFromData(field, data) {
  var values = data[field] || "";
  var output = values.join ? values.join(', ') : values;
  return output;
}

function dataSelainSampah(data){
  return Object.keys(data).filter(function(column) {
    return !(column === 'formDataNameOrder' || column === 'formGoogleSheetName' || column === 'formGoogleSendEmail' || column === 'honeypot' || column === 'brs' );
  });
}

function getDataColumns(data) {
  return Object.keys(data).filter(function(column) {
    return !(column === 'formDataNameOrder' || column === 'formGoogleSheetName' || column === 'formGoogleSendEmail' || column === 'honeypot' || column=='Time_Stamp');
  });
}



//=================================================================================================================
//                                  AMBIL DATA DI SHEET USER UNTUK DITAMPILKAN DI HTML
//=================================================================================================================
//var isisel = blob.getAs(MimeType.HTML).getDataAsString();
        //buatdataexcel(isisel);
function datauser_value(e,sss){
  var output  = ContentService.createTextOutput(),
      data    = {};
  //NAMA sheet yang ada di Database input pada sheet pertama: responses.
      var sheet="user";

  data.records = readData_(sss, sheet);
  
  var callback = e.parameters.callback;
  
  if (callback === undefined) {
    output.setContent(JSON.stringify(data));
  } else {
    output.setContent(callback + "(" + JSON.stringify(data) + ")");
  }
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  
  return output;                        
}
// ------------------------ selesai AMBIL DATA USER ------------------------------- //


//=================================================================================================================
//                                  AMBIL DATA ANJANGSANA
//=================================================================================================================
//var isisel = blob.getAs(MimeType.HTML).getDataAsString();
        //buatdataexcel(isisel);
function lihatanjangsana_value(e,sss){
  var output  = ContentService.createTextOutput(),
      data    = {};
  //NAMA sheet yang ada di Database input pada sheet pertama: responses.
      var sheet="anjangsana";

  data.records = readData_(sss, sheet);
  
  var callback = e.parameters.callback;
  
  if (callback === undefined) {
    output.setContent(JSON.stringify(data));
  } else {
    output.setContent(callback + "(" + JSON.stringify(data) + ")");
  }
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  
  return output;                        
}
// ------------------------ selesai AMBIL DATA USER ------------------------------- //


//=================================================================================================================
//                          FUNGSI UMUM MENGAMBIL DATA DARI SPREADSHEET KE HTML
//=================================================================================================================

function readData_(ss, sheetname, properties) {
  if (typeof properties == "undefined") {
    properties = getHeaderRow_(ss, sheetname);
    properties = properties.map(function(p) { return p.replace(/\s+/g, '_'); });
  }
  var rows = getDataRows_(ss, sheetname),
      data = [];

  for (var r = 0, l = rows.length; r < l; r++) {
    var row     = rows[r],
        record  = {};

    for (var p in properties) {
      record[properties[p]] = row[p];
    }
    
    data.push(record);

  }
  return data;
}

function getDataRows_(ss, sheetname) {
  var sh = ss.getSheetByName(sheetname);

  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}

function getHeaderRow_(ss, sheetname) {
  var sh = ss.getSheetByName(sheetname);

  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];  
} 
// ------------------------- SELESAI FUNGSI UMUM AMBIL DATA DI SPREADSHEET -------------------------------                         