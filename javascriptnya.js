var modal = document.getElementById('id01'); // Get the modal
var mySidebar = document.getElementById("mySidebar"); // Get the Sidebar
var overlayBg = document.getElementById("myOverlay"); // Get the DIV with overlay effect
var script_gs = "https://script.google.com/macros/s/AKfycby9g8JcOtMML7krnWiWDj1GfgxcwXj6k3v0TOCqL_dHQPRKg-E/exec";


function w3_open() { // Toggle between showing and hiding the sidebar, and add overlay effect
    if (mySidebar.style.display === 'block') {
        mySidebar.style.display = 'none';
        overlayBg.style.display = "none";
    } else {
        mySidebar.style.display = 'block';
        overlayBg.style.display = "block";
    }
}

function w3_close() { // Close the sidebar with the close button
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
}
$(document).ready(function () {
    document.getElementById("modallogin").style.display = "block";
})

function gurulogin(){
    document.getElementById("modallogin").style.display = "none";
    document.getElementById("mainlogin").style.display = "none";
    document.getElementById("mainjuri").style.display = "block";
    // variable umum:var teksnamaguru = document.frmlogin.namaguru.value
    var valuelogin = document.frmlogin.namaguru.value;
    var jenjangjuri = valuelogin.split("|")[1];// result: TK atau SD atau SMP, dan koordinator
    var namajuri = valuelogin.split("|")[0];
    var peranx = valuelogin.split("|")[2];//result khusus All, SD, SMP, TK
    
    // mengubah identitas juri di teks pembuka
    document.getElementById("namajuritelahlogin").innerHTML = namajuri;
    document.getElementById("jenjangtelahlogin").innerHTML =peranx;
    document.getElementById("peran").innerHTML=jenjangjuri;
    //mengubah identitas di sidebar
    document.getElementById("namasekolah").innerHTML = namajuri;
    document.getElementById("namakota").innerHTML = jenjangjuri+" " +peranx ;
    //sembunyikan barlogin dan tampilkan barlogout
    document.getElementById("barlogin").style.display = "none"
    document.getElementById("barlogout").style.display = "block"
    //ketika variabel jenjangjuri dipilih, maka laman memanggil json dari data Excel Google Drive;
    if(jenjangjuri=="Koordinator" && peranx !== "All"){
        daftaruntukkoordinator(peranx)
    }
    else if(jenjangjuri=="Koordinator" && peranx == "All"){
        daftaruntukketua();
        //alert("untuk koordinator")
    }
    else{
        daftarpeserta(jenjangjuri)
        //alert("untuk juri=" + jenjangjuri)
    }

    


}
function daftaruntukketua(){
    var link = script_gs + "?action=ceknilai"
    $.getJSON(link, function (json) {
        var ut = document.createElement("table");
        ut.setAttribute("class", "versi-table");
        ut.setAttribute("id","tabelpesarta");
        ut.setAttribute("style", "border-collapse:collapse;border:1px solid black");
        //ut.setAttribute("id", "tabel");
        var tr = ut.insertRow(-1);
        var namaheader = Object.keys(json.records[0])
        for (var i = 0; i < namaheader.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = namaheader[i]
            tr.appendChild(th)
        }

        for (var j = 0; j < json.records.length; j++) {
            var trb = ut.insertRow(-1);
            for (k in json.records[0]) {
                var cell = trb.insertCell(-1);
                //kon
                
                cell.innerHTML = json.records[j][k]
            }

        } 
        document.getElementById("tabelpendaftar").innerHTML="";
        document.getElementById("tabelpendaftar").appendChild(ut)
    })
}
function daftaruntukkoordinator(jenjang){
    var URL= script_gs + "?action=tabel" +jenjang;
    /// tabel untuk kordinnator jenjang juri
    var juriSD =["Ade Andriansyah", "Titin S"];
    var juriTK = ["Mimin Utomo","Ririn"];
    var juriSMP =["Haryanto", "Biantoro"];
    var juri1, juri2;
    if(jenjang =="SD"){
        juri1 = juriSD[0];
        juri2 = juriSD[1]
    }
    if(jenjang =="SMP"){
        juri1 = juriSMP[0];
        juri2 = juriSMP[1]
    }
    if(jenjang =="TK"){
        juri1 = juriTK[0];
        juri2 = juriTK[1]
    }
    
    var divtabel = document.getElementById("tabelpendaftar");
    var tabelpeserta = document.createElement("table");
    tabelpeserta.setAttribute("id","tabelpesarta");
    tabelpeserta.setAttribute("class","versi-table");
    tabelpeserta.setAttribute("style", "border-collapse:collapse;border:1px solid black");
    var tr = tabelpeserta.insertRow(-1);
    var th1 = document.createElement("th");
    th1.innerHTML = "No";
    var th2 = document.createElement("th");
    th2.innerHTML = "Nama Peserta";
    var th3 = document.createElement("th");
    th3.innerHTML = "Instansi";
    var th4 = document.createElement("th");
    th4.innerHTML = juri1;
    var th5 = document.createElement("th");
       th5.innerHTML = juri2;
    var th6 = document.createElement("th");
       th6.innerHTML = "Skor Akhir";
    
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    tr.appendChild(th5);
    tr.appendChild(th6);
    document.getElementById("loading").innerHTML="<i class='fa fa-spin fa-spinner' style='font-size:36px'></i> Prosess ..."
    $.getJSON(URL,function(json){
        for(var a = 0; a < json.records.length ; a++){
            var tr2 = tabelpeserta.insertRow(-1);
            var cell = tr2.insertCell(-1);
            cell.innerHTML = a + 1;
            var cell = tr2.insertCell(-1);
            cell.innerHTML = json.records[a].namapeserta;
            var cell = tr2.insertCell(-1);
            cell.innerHTML = json.records[a].instansi;
            var cell = tr2.insertCell(-1);
            cell.innerHTML = "";
            var cell = tr2.insertCell(-1);
            cell.innerHTML = "";
            var cell = tr2.insertCell(-1);
            cell.innerHTML = "";
            
            
            
            
        }
        document.getElementById("loading").innerHTML="";
        var tomboldata = document.createElement("button");
        tomboldata.setAttribute("onclick","rekapjurijenjang('"+jenjang+"')")
        tomboldata.innerHTML="Refresh Data";
        document.getElementById("loading").appendChild(tomboldata);
        var tomboldata1 = document.createElement("button");
        tomboldata1.setAttribute("onclick","SimpanExcel('Koordinator Juri "+jenjang+" oleh "+ document.getElementById('namajuritelahlogin').innerHTML+"')");
        tomboldata1.innerHTML="Simpan Ke Excel";
        document.getElementById("loading").appendChild(tomboldata1);
         var tomboldata2 = document.createElement("button");
        tomboldata2.setAttribute("onclick","Print('"+jenjang+"')");
        tomboldata2.innerHTML="Print";
        document.getElementById("loading").appendChild(tomboldata2);
    
    
    })
    //taruh di div tabelpendaftar
    divtabel.innerHTML="";
    divtabel.appendChild(tabelpeserta)
    
    
}
function rekapjurijenjang(jenjang){
    var namajuritelahlogin = document.getElementById("namajuritelahlogin").innerHTML;
    var baristabeldata = document.getElementById("tabelpesarta").rows;
    var url = script_gs+"?action=ceknilai";
    $.getJSON(url, function(json){
        for (i=1;i<baristabeldata.length;i++){
            for(a=0;a<json.records.length;a++){
        //baristabeldata[i].cells[4].innerHTML = "";
            //if(baristabeldata[i].celss[1].innerHTML == json.records[a].namapeserta && baristabeldata[i].celss[2].innerHTML == json.records[a].instansi){
                //baristabeldata[i].cells[3].innerHTML = "";
                //baristabeldata[i].cells[4].innerHTML = "";
            if(baristabeldata[i].cells[1].innerHTML == json.records[a].namapeserta && baristabeldata[i].cells[2].innerHTML == json.records[a].instansi && baristabeldata[0].cells[3].innerHTML== json.records[a].olehjuri){
            baristabeldata[i].cells[3].setAttribute("style","background-color:yellow");
            baristabeldata[i].cells[3].innerHTML = json.records[a].total;// + baristabeldata[0].cells[3].innerHTML;
            }
            
            if(baristabeldata[i].cells[1].innerHTML == json.records[a].namapeserta && baristabeldata[i].cells[2].innerHTML == json.records[a].instansi && baristabeldata[0].cells[4].innerHTML== json.records[a].olehjuri){
                baristabeldata[i].cells[4].setAttribute("style","background-color:yellow");
                baristabeldata[i].cells[4].innerHTML = json.records[a].total;//+ baristabeldata[0].cells[4].innerHTML;
            }
        }

        if(baristabeldata[i].cells[3].innerHTML!=="" && baristabeldata[i].cells[4].innerHTML !==""){
            baristabeldata[i].cells[5].innerHTML = (baristabeldata[i].cells[3].innerHTML * 1) + (baristabeldata[i].cells[4].innerHTML*1);
        }
        else{
            baristabeldata[i].cells[5].innerHTML ="-"
        }
    }
    })


}

function SimpanExcel(namafile) {
    // var tbl = document.getElementById("tabel_data_token");
    // var namamapel = tbl.rows[1].cells[1].innerHTML;

    $("#tabelpesarta").table2excel({
        //exclude: ".excludeThisClass",
        //name: "Worksheet Name",
        //filename: "SomeFile.xls", // do include extension
        //preserveColors: true // set to true if you want background colors and font colors preserved
        name: "Worksheet Name",
        filename: "Data Nilai  " + namafile + " " + new Date(),
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true,
        preserveColors: true
    });
}

function Print(jenjang) {
    alert("akan mencetak")
    var id = "isipetunjuk";
    var h1 = "";
    var h2 = "";
    var html = document.getElementById("iframeprint");
    var isi = html.contentDocument;
    var headnya = isi.head;
    while (headnya.hasChildNodes()) {
        headnya.removeChild(headnya.firstChild);
    }
    //var bodynya = isi.body;
    //bodynya="";

    var titlee = document.createElement("title");
    var teksjudul = document.createTextNode(":: e-Juri::")
    titlee.appendChild(teksjudul)
    headnya.appendChild(titlee);
    var css = '@page { size: portrait;}';
    //head = document.head || document.getElementsByTagName('head')[0],
    var style = document.createElement('style');
    var cssd = '.w3-circle{border-radius:50%} .versii-table {width:950px;max-width:100%;border-collapse:collapse}.versii-table th,.versii-table td,.versii-table tr {border:1px solid #000;color:#000;padding:5px 10px 5px 10px}.versii-table th{background-color:#eee;color:blue;vertical-align:middle;text-align:center}.versii-table tr:nth-of-type(even) td{border:0;background-color:#fff;border:1px solid #000}versii-table tr:nth-of-type(odd) td{border:0;background-color:#eef;border:1px solid #000}.versi-table {width:auto;max-width:100%;border-collapse:collapse}.versi-table th,.versi-table td,.versi-table tr {border:1px solid #000;color:#000;padding:5px 10px 5px 10px}.versi-table th{background-color:#eee;color:blue;vertical-align:middle;text-align:center}.versi-table tr:nth-of-type(even) td{border:0;background-color:#fff;border:1px solid #000}versi-table tr:nth-of-type(odd) td{border:0;background-color:#eef;border:1px solid #000}';
    style.type = 'text/css';
    style.media = 'print';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));

    }
    var d = new Date();
    var tglakhirr = d.getDate();
    var blnakhirr = d.getMonth();
    var namabulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var thnakhirr = d.getFullYear();
    var tglakhir = d.getDate(); //daysInMonth(blnakhirr+1,thnakhirr);
    // var namakepsekku = document.getElementById('namakepsek').innerHTML;
    // var nipkepsekku = document.getElementById('nipkepsek').innerHTML;
    // var guruapa = document.getElementById("namakota").innerHTML; //document.getElementById("tblguru").innerHTML + " " + document.getElementById("namakota").innerHTML; // document.frmlogin.kelasguru.value;
    // var namaguruku = document.getElementById('namagurux').innerHTML;
    // var nipguruku = document.getElementById('nipgurux').innerHTML;

    headnya.appendChild(style);
    headnya.innerHTML += '<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">';
    headnya.innerHTML += '<link rel="stylesheet" href="https://e-lamaso.github.io/syahandrianeda/css_vidpem.css">';

    var bodynya = isi.body;
    //var teksbody =document.getElementById(id).innerHTML;
    var teksbody = document.getElementById(id).outerHTML;
    bodynya.innerHTML = "";
    bodynya.innerHTML = '<style>' + cssd + '</style>';
    // bodynya.innerHTML += '<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">';
    // bodynya.innerHTML += '<link rel="stylesheet" href="https://e-lamaso.github.io/e_lamaso_guru/e_lamaso_publick.css">';
    bodynya.innerHTML += '<h1 style="text-align:center"> Rekap Nilai Penjurian </h1>';
    bodynya.innerHTML += '<h2 style="text-align:center"> Koordinator Jenjang ' + jenjang  + '</h2>';
    bodynya.innerHTML += document.getElementById("tabelpesarta").outerHTML;//teksbody;
    bodynya.innerHTML += '<br/><br/><br/>';
    // bodynya.innerHTML += '<div style="float:left;position:relative;margin-left:50px;text-align:center">Mengetahui,<br/>Kepala ' + keyidsekolah.innerHTML + '<br/><br/><br/><br/><br/><u><b>' + namakepsekku + '</b></u><br/>NIP. ' + nipkepsekku + '</div>'; //namasekolahku + '<br/><br/><br/><br/><br/><u><b>' + namakepsekku + '</b></u><br/>NIP. ' + nipkepsekku + '</div>';
    // bodynya.innerHTML += '<div style="float:right;position:relative;text-align:center">' + namakotaku + ', ' + tglakhir + ' ' + namabulan[blnakhirr] + ' ' + thnakhirr + '<br/>' + guruapa + '<br/><br/><br/><br/><br/><b><u>' + namaguruku + '</u></b><br/>NIP. ' + nipguruku + '</div>';
    //bodynya.innerHTML+='<br/><br/><br/>'+guruapa+'<br/><br/><br/><b><u>'+namaguruku+'</u></b><br/>NIP. '+nipguruku+'</div>';


    window.frames["iframeprint"].focus();
    window.frames["iframeprint"].print();
}

function Printjuri(jenjang) {
    alert("akan mencetak")
    var id = "isipetunjuk";
    var h1 = "";
    var h2 = "";
    var html = document.getElementById("iframeprint");
    var isi = html.contentDocument;
    var headnya = isi.head;
    while (headnya.hasChildNodes()) {
        headnya.removeChild(headnya.firstChild);
    }
    //var bodynya = isi.body;
    //bodynya="";

    var titlee = document.createElement("title");
    var teksjudul = document.createTextNode(":: e-Juri::")
    titlee.appendChild(teksjudul)
    headnya.appendChild(titlee);
    var css = '@page { size: portrait;}';
    //head = document.head || document.getElementsByTagName('head')[0],
    var style = document.createElement('style');
    var cssd = '.w3-circle{border-radius:50%} .versii-table {width:950px;max-width:100%;border-collapse:collapse}.versii-table th,.versii-table td,.versii-table tr {border:1px solid #000;color:#000;padding:5px 10px 5px 10px}.versii-table th{background-color:#eee;color:blue;vertical-align:middle;text-align:center}.versii-table tr:nth-of-type(even) td{border:0;background-color:#fff;border:1px solid #000}versii-table tr:nth-of-type(odd) td{border:0;background-color:#eef;border:1px solid #000}.versi-table {width:auto;max-width:100%;border-collapse:collapse}.versi-table th,.versi-table td,.versi-table tr {border:1px solid #000;color:#000;padding:5px 10px 5px 10px}.versi-table th{background-color:#eee;color:blue;vertical-align:middle;text-align:center}.versi-table tr:nth-of-type(even) td{border:0;background-color:#fff;border:1px solid #000}versi-table tr:nth-of-type(odd) td{border:0;background-color:#eef;border:1px solid #000}';
    style.type = 'text/css';
    style.media = 'print';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));

    }
    var d = new Date();
    var tglakhirr = d.getDate();
    var blnakhirr = d.getMonth();
    var namabulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var thnakhirr = d.getFullYear();
    var tglakhir = d.getDate(); //daysInMonth(blnakhirr+1,thnakhirr);
    // var namakepsekku = document.getElementById('namakepsek').innerHTML;
    // var nipkepsekku = document.getElementById('nipkepsek').innerHTML;
    // var guruapa = document.getElementById("namakota").innerHTML; //document.getElementById("tblguru").innerHTML + " " + document.getElementById("namakota").innerHTML; // document.frmlogin.kelasguru.value;
    // var namaguruku = document.getElementById('namagurux').innerHTML;
    // var nipguruku = document.getElementById('nipgurux').innerHTML;

    headnya.appendChild(style);
    headnya.innerHTML += '<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">';
    headnya.innerHTML += '<link rel="stylesheet" href="https://e-lamaso.github.io/syahandrianeda/css_vidpem.css">';

    var bodynya = isi.body;
    //var teksbody =document.getElementById(id).innerHTML;
    var teksbody = document.getElementById(id).outerHTML;
    bodynya.innerHTML = "";
    bodynya.innerHTML = '<style>' + cssd + '</style>';
    // bodynya.innerHTML += '<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">';
    // bodynya.innerHTML += '<link rel="stylesheet" href="https://e-lamaso.github.io/e_lamaso_guru/e_lamaso_publick.css">';
    bodynya.innerHTML += '<h1 style="text-align:center"> Rekap Nilai Penjurian </h1>';
    bodynya.innerHTML += '<h2 style="text-align:center"> Juri Jenjang ' + jenjang  + ' oleh '+ document.getElementById('namajuritelahlogin').innerHTML+'</h2>';
    bodynya.innerHTML += document.getElementById("tabelpesarta").outerHTML;//teksbody;
    bodynya.innerHTML += '<br/><br/><br/>';
    // bodynya.innerHTML += '<div style="float:left;position:relative;margin-left:50px;text-align:center">Mengetahui,<br/>Kepala ' + keyidsekolah.innerHTML + '<br/><br/><br/><br/><br/><u><b>' + namakepsekku + '</b></u><br/>NIP. ' + nipkepsekku + '</div>'; //namasekolahku + '<br/><br/><br/><br/><br/><u><b>' + namakepsekku + '</b></u><br/>NIP. ' + nipkepsekku + '</div>';
    // bodynya.innerHTML += '<div style="float:right;position:relative;text-align:center">' + namakotaku + ', ' + tglakhir + ' ' + namabulan[blnakhirr] + ' ' + thnakhirr + '<br/>' + guruapa + '<br/><br/><br/><br/><br/><b><u>' + namaguruku + '</u></b><br/>NIP. ' + nipguruku + '</div>';
    //bodynya.innerHTML+='<br/><br/><br/>'+guruapa+'<br/><br/><br/><b><u>'+namaguruku+'</u></b><br/>NIP. '+nipguruku+'</div>';


    window.frames["iframeprint"].focus();
    window.frames["iframeprint"].print();
}



function daftarpeserta(jenjang){
var URL= script_gs + "?action=tabel" +jenjang;
/// tabel untuk juri
var divtabel = document.getElementById("tabelpendaftar");
var tabelpeserta = document.createElement("table");
tabelpeserta.setAttribute("id","tabelpesarta");
tabelpeserta.setAttribute("class","versi-table");
tabelpeserta.setAttribute("style", "border-collapse:collapse;border:1px solid black");
var tr = tabelpeserta.insertRow(-1);
var th1 = document.createElement("th");
th1.innerHTML = "No";
var th2 = document.createElement("th");
th2.innerHTML = "Nama Peserta";
var th3 = document.createElement("th");
th3.innerHTML = "Instansi";
var th4 = document.createElement("th");
th4.innerHTML = "No. WA";
var th5 = document.createElement("th");
th5.setAttribute("style","background-color:yellow");
th5.innerHTML = "Beri Nilai";

tr.appendChild(th1);
tr.appendChild(th2);
tr.appendChild(th3);
tr.appendChild(th4);
tr.appendChild(th5);
document.getElementById("loading").innerHTML="<i class='fa fa-spin fa-spinner' style='font-size:36px'></i> Prosess ..."
$.getJSON(URL,function(json){
    for(var a = 0; a < json.records.length ; a++){
        var tr2 = tabelpeserta.insertRow(-1);
        var cell = tr2.insertCell(-1);
        cell.innerHTML = a + 1;
        var cell = tr2.insertCell(-1);
        cell.innerHTML = json.records[a].namapeserta;
        var cell = tr2.insertCell(-1);
        cell.innerHTML = json.records[a].instansi;
        var cell = tr2.insertCell(-1);//hp
        var tombolwa = document.createElement("button");
        tombolwa.setAttribute("onclick","kirimwa("+json.records[a].nowa+")");
        tombolwa.innerHTML = json.records[a].nohp
        //cell.innerHTML = "-";
        cell.appendChild(tombolwa);
        var cell = tr2.insertCell(-1);
        cell.innerHTML = "Klik Refresh Data";
        
        
        
    }
    document.getElementById("loading").innerHTML="";
    var tomboldata = document.createElement("button");
    tomboldata.setAttribute("onclick","perlihatkannilai('"+jenjang+"')")
    tomboldata.innerHTML="Refresh Data";
    document.getElementById("loading").appendChild(tomboldata);

    var tomboldata1 = document.createElement("button");
    tomboldata1.setAttribute("onclick","SimpanExcel('Juri "+jenjang+" oleh "+ document.getElementById('namajuritelahlogin').innerHTML+"')");
    tomboldata1.innerHTML="Simpan Ke Excel";
    document.getElementById("loading").appendChild(tomboldata1);
     var tomboldata2 = document.createElement("button");
    tomboldata2.setAttribute("onclick","Printjuri('"+jenjang+"')");
    tomboldata2.innerHTML="Print";
    document.getElementById("loading").appendChild(tomboldata2);



})
//taruh di div tabelpendaftar
divtabel.innerHTML="";
divtabel.appendChild(tabelpeserta)


}

function perlihatkannilai(jenjang){
    var namajuritelahlogin = document.getElementById("namajuritelahlogin").innerHTML;
    var baristabeldata = document.getElementById("tabelpesarta").rows;
    var url = script_gs+"?action=ceknilai";
    $.getJSON(url, function(json){
        for (i=1;i<baristabeldata.length;i++){
            for(a=0;a<json.records.length;a++){
        //baristabeldata[i].cells[4].innerHTML = "";
            //if(baristabeldata[i].celss[1].innerHTML == json.records[a].namapeserta && baristabeldata[i].celss[2].innerHTML == json.records[a].instansi){
            if(baristabeldata[i].cells[1].innerHTML == json.records[a].namapeserta && baristabeldata[i].cells[2].innerHTML == json.records[a].instansi && namajuritelahlogin == json.records[a].olehjuri){
            baristabeldata[i].cells[4].setAttribute("style","background-color:yellow");
            baristabeldata[i].cells[4].innerHTML = json.records[a].total;
            break;
            
            }
            else{
                var tombolnilai = document.createElement("button");
                tombolnilai.setAttribute("onclick","berinilai('"+i+"|"+jenjang+"')")
                tombolnilai.innerHTML = "Beri Skor";

                baristabeldata[i].cells[4].innerHTML = "";
                baristabeldata[i].cells[4].append(tombolnilai);
           }
        }
    }
    })


}
function berinilai(variabelnya){
    var baris = variabelnya.split("|")[0];
    var jenjangx = variabelnya.split("|")[1];

    var barisasli = baris * 1 + 1;
    var barisjson = baris * 1 - 1;;
    var url = script_gs+"?action=tabel"+jenjangx;
    //alert("nilai baris =" + baris +", jenjang=" + jenjangx +", baris asli ss ="+barisasli)
    //panggil modal petunjuk
    document.getElementById("modalpetunjuk").style.display="block";
    isipetunjuk.style.display="block";
    formskor.style.display="block";    
    tombolrefreshmenilai.style.display="none";
    tombolmenilai.style.display="block";
    document.getElementById("judulpetunjuk").innerHTML = "<i class='fa fa-spin fa-spinner' style='font-size:36px'></i> Prosess ...";
    document.getElementById("isipetunjuk").innerHTML="<hr style='border-bottom:5px double red'/>"//"<br/><br/><br/>Script by Ade Andriansyah<br/><br/><br/>"
    $.getJSON(url,function(json){
        var h2judul = document.createElement("h2")
        h2judul.setAttribute("style","text-align:center;background-color:yellow");
        h2judul.innerHTML="Identitas Peserta"
        document.getElementById("isipetunjuk").appendChild(h2judul);

        var tabel = document.createElement("table");
        tabel.setAttribute("class","versi-table")
        
      
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Tanggal Kirim"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = new Date(json.records[barisjson].tanggalkirim).toLocaleString();
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "email"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = json.records[barisjson].email;
        
         var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Nama Peserta"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = json.records[barisjson].namapeserta;  
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Instansi"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = json.records[barisjson].instansi;
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "NIP"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = json.records[barisjson].nip;
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Alamat Instansi"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = json.records[barisjson].alamatinstansi;
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Kirim Pesan WA"
        var cell2 = brs.insertCell(1);
        var tombolwa = document.createElement("button");
        tombolwa.setAttribute("onclick","kirimwa("+json.records[barisjson].nowa+")");
        tombolwa.innerHTML = json.records[a].nohp
        //cell.innerHTML = "-";
        cell2.appendChild(tombolwa);
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Url Video"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = "<a href='"+json.records[barisjson].linkvideo+"' target='_blank'>"+json.records[barisjson].linkvideo+"</a>";
        
        var jsonlink = json.records[barisjson].linkvideo
        var linkoke = jsonlink.indexOf("https://drive.google.com/file/d/");
        var linkfolder = jsonlink.indexOf("https://drive.google.com/drive/u/2/folders");//https://drive.google.com/drive/u/2/folders/14p6rd25l7_SUg5BNA9JGjYhWb2mfufdg;
        var linkyoutub = jsonlink.indexOf("https://youtu.be/");
        //var linktolak = //https://drive.google.com/file/d/1aZO4YfzCd3Rp-YiifWbhTmfJMjX5pdMb/view?usp=sharing
        var tekssel;
        if(linkoke > -1){
            tekssel = "Video Siap Dinilai, jika tidak tampil hak akses dari pengirim masih berstatus DIBATASI"
        }else if(linkfolder > -1){
            tekssel ="link video masih dalam folder atau hak akses dari pengirim belum diberikan"
        }else if(linkyoutub>-1){
            tekssel ="Video telah diunggah di Youtube"
        }else{
            tekssel="Link Video Tidak dikenal"
        }

        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Kesiapan Video"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = tekssel;

        //<iframe src="https://drive.google.com/file/d/1gyIU2BJDQMnc5JBRFDgs4NyVmuDH5Eme/preview" width="640" height="480"></iframe>

        document.getElementById("isipetunjuk").append(tabel);
        var batas = document.createElement("hr")

        batas.setAttribute("style","border-bottom:5px solid blue");
        document.getElementById("isipetunjuk").append(batas);
        
        if(linkoke > -1){
        var linkpreview1 = jsonlink.replace("view","preview");
        var linkpreview = linkpreview1.replace("?usp=sharing","");
//https://drive.google.com/file/d/1gyIU2BJDQMnc5JBRFDgs4NyVmuDH5Eme/view?usp=sharing
            var h2judul = document.createElement("h2")
            h2judul.setAttribute("style","text-align:center;background-color:yellow");
            h2judul.innerHTML="Konten Video"
            document.getElementById("isipetunjuk").appendChild(h2judul);
        var videop = document.createElement("iframe");
        videop.setAttribute("width","95%");
        videop.setAttribute("height","215");
        videop.setAttribute("src",linkpreview)
        document.getElementById("isipetunjuk").append(videop);
        }
        else{

        }

        var h2judul = document.createElement("h2")
        h2judul.setAttribute("style","text-align:center;background-color:yellow");
        h2judul.innerHTML="Input Skor"
        document.getElementById("isipetunjuk").appendChild(h2judul);

        document.getElementById("judulpetunjuk").innerHTML = "Form Penjurian Video Pembelajaran";

        // untuk mengisi form 
        ////tanggalkirim email namapeserta instansi nip alamatinstansi nohp linkvideo jenjang nowa olehjuri
        var isianinput=document.formskor;
        isianinput.reset();
        isianinput.email.value = json.records[barisjson].email;
        isianinput.namapeserta.value = json.records[barisjson].namapeserta;
        isianinput.instansi.value = json.records[barisjson].instansi;
        isianinput.nip.value = json.records[barisjson].nip;
        isianinput.alamatinstansi.value = json.records[barisjson].alamatinstansi;
        isianinput.namapeserta.value = json.records[barisjson].namapeserta;
        isianinput.nohp.value = json.records[barisjson].nohp;
        isianinput.linkvideo.value = json.records[barisjson].linkvideo;
        isianinput.jenjang.value = json.records[barisjson].jenjang;
        isianinput.nowa.value = json.records[barisjson].nowa;
        isianinput.olehjuri.value = document.getElementById("namajuritelahlogin").innerHTML//json.records[barisjson].olehjuri;

    })
}
function peringatanskor(){
    

    var namaform = document.formskor;
    var res = KoleksiFormSiswa(namaform);
    var kirimdataini = new URLSearchParams(res.data);
    var jenjang = document.getElementById("jenjangtelahlogin").innerHTML;
    var url = script_gs + "?action=kirimskor"; // + kirimdataini;
    var xhr = new XMLHttpRequest();
    judulpetunjuk.innerHTML="<i class='fa fa-spin fa-spinner' style='font-size:36px'></i> Prosess kirim...";
    isipetunjuk.style.display="none";
    formskor.style.display="none";
    tombolrefreshmenilai.style.display="block";
    tombolmenilai.style.display="none";

    xhr.open("POST", url, true);
    //xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {
            
            judulpetunjuk.innerHTML = JSON.parse(xhr.responseText).result;//"Terima Kasih, Ananda telah menyelesaikan pembelajaran ini dengan hasil:<br/>Skor PG = " + nilaiPGku.innerHTML; //+ xhr.responseText ;
            perlihatkannilai(jenjang);
        }
    };
    // url encode form data for sending as post data

    xhr.send(kirimdataini);
}

function updateinputskor(){
    var kelasinput = document.getElementsByClassName("classscore");
    
    
    var nilai = 0;
    for (i = 0; i < kelasinput.length; i++) {
        nilai += kelasinput[i].value * 1;
       
    }
    var jumlahsoalessaysebenarnya = 4;
    var nilaiakhir = nilai;//.toFixed(2);//(nilai / jumlahsoalessaysebenarnya).toFixed(2);
    //document.getElementById("nilaiakhiressay").value = nilai;
    document.getElementById("total").value = nilaiakhir;

}

function kirimnilai(){
    var kelasinput = document.getElementsByClassName("classscore");
    var nilai = 0;
    for (i = 0; i < kelasinput.length; i++) {
    var maks = kelasinput[i].getAttribute("max");
    if(kelasinput[i].value =="" ){
        alert("Nilai tidak boleh kosong. Nilai belum terisi pada Aspek Penilaian ke-" + (i*1 + 1))
    }
    else if(kelasinput[i].value > maks){
        alert("Kelebihan, Anda memasukkan nilai "+ kelasinput[i].value+", pada Aspek Penilaian ke-" + (i*1 + 1)+" dengan skor maks=" + maks)
    }else{
    peringatanskor();
    }
       
    }

}
function getLinkWhastapp(number, message) {
    var url = 'https://api.whatsapp.com/send?phone='      + number        + '&text='        + encodeURIComponent(message);  
    return url
  }
function kirimwa(nohp){
    alert("ini pesan nowa " + nohp)
    var teksnya = "e-Juri pesan:  ";
        var urlnya = getLinkWhastapp(nohp, teksnya);
    location.replace(urlnya);
}
function loginelamaso(){
    document.getElementById("modallogin").style.display = "block";
    w3_close();
}
function logoutelamaso(){
    document.getElementById("mainlogin").style.display = "block";
    document.getElementById("mainjuri").style.display = "none";
    w3_close();
    //sembunyikan barlogin dan tampilkan barlogout
    document.getElementById("barlogin").style.display = "block";
    document.getElementById("barlogout").style.display = "none";
   
}


function KoleksiFormSiswa(form) {
    //--------- mendefinisikan beberapa element
    var koleksielement = form.elements;
    //--------- element yang digunakan untuk element spam
    var koleksispam;


    var bidangdata = Object.keys(koleksielement)
        .filter(function (k) {
            if (koleksielement[k].name === "koleksispam") {
                koleksispam = koleksielement[k].value;
                return false;
            }
            return true;
        })
        .map(function (k) {
            if (koleksielement[k].name !== undefined) {
                return koleksielement[k].name;
            } else if (koleksielement[k].length > 0) {
                return koleksielement[k].item(0).name;
            }
        }).filter(function (item, pos, self) {
            return self.indexOf(item) == pos && item;
        });
    console.log(bidangdata);
    var Dataform = {};
    bidangdata.forEach(function (name) {
        var element = koleksielement[name];
        // jika datanya memiliki satu nilai (value), biasanya berupa teks dalam value.
        Dataform[name] = element.value;

        // ketika data value-nya bukan teks, seperti value pada tag input type radio, atau tag select, maka dibuatkan array lagi dengan fungsi tambah array [.push('new Array')
        if (element.length) {
            var data = [];
            for (var i = 0; i < element.length; i++) {
                var item = element.item(i);
                if (item.checked || item.selected) {
                    data.push(item.value);
                }
            }
            console.log(data);
            Dataform[name] = data.join(', ');
        }
    });

    Dataform.formDataNameOrder = JSON.stringify(bidangdata);
    //Dataform.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    //Dataform.formGoogleSendEmail = form.dataset.email || ""; // no email by default

    return {
        data: Dataform
    }; //, koleksispam: koleksispam};
}

/////////////////////////////// GS
