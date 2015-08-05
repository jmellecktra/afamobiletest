$(document).ready(function () {
	if (!localStorage.getItem("storageListaInformes")) {
		OcultarDivBloqueo();
		processError('', 1000, '');
		return;
	}

	if (navigator.userAgent.match(/(Mobile|iPhone|iPod|iPad|Android|BlackBerry)/)) {
		document.isIndex = false;
		document.addEventListener("deviceready", mobileEventsHandler, false);
	}
	
	CargarHtmlFechaMenuPrincipal();

    var listaInformesGuardada = localStorage.getItem("storageListaInformes");
    listaInformes = eval('(' + listaInformesGuardada + ')');
    CargarPantallaCompletaInformeHtml();

	onresizeBody();
    OcultarDivBloqueo();
});

function CargarPantallaCompletaInformeHtml() {
    var informesHtml = '';
    for (var i = 0; i < listaInformes.length; i++) {
        informesHtml += '<div id="divInformeTitulo" class="cssInformeTitulo">' + listaInformes[i].titulo + '</div>';
        informesHtml += '<div id="divInformeFecha" class="cssInformeFecha">' + obtenerFechaMostrar(listaInformes[i].fecha) + '</div>';
        informesHtml += '<div id="divInformeDescripcion" class="cssInformeDescripcion">' + listaInformes[i].texto;
        if (listaInformes[i].url != '') {
            informesHtml += '<div id="divInformeUrl" class="cssInformeUrl" onclick="onclickDescargarPDF(\'' + listaInformes[i].url + '\');">'; //+ 
            //informesHtml += '<a href="javascript:loadURL(\'' + listaInformes[i].url + '\');" >';
            informesHtml += '<div class="btnDescargarPDF" >';
            informesHtml += '<img class="cssImgDescargarPDF" alt="descargar" src="img/material/ampliarAbajo.svg" />';
            informesHtml += ' &nbsp;&nbsp;VER MAS';
            informesHtml += '</div>';
            informesHtml += '</div>';
        }
        informesHtml += '</div>';
        break;
    }
    $('#divResultadoInforme').html(informesHtml);
}

function onclickDescargarPDF(pUrl) {
    var strUrl = pUrl;
    if (/http:/.test(strUrl)) {

    } else {
        strUrl = 'http://' + strUrl;
    }

    $('#divInformeUrl').addClass('cssInformeUrlActivo');
    setTimeout(function () {
        $('#divInformeUrl').removeClass('cssInformeUrlActivo');
    }, 800);
    loadURL(strUrl);
}

function onresizeBody() {
    var altura = ($(document).height() - ($('#header').outerHeight() + $('#StatusBar').outerHeight()));//- ($('#divInformeFecha').height() +$('#cssInformeTitulo').height())
    $('#divResultadoInforme').css('height', altura);
    $('#divInformeDescripcion').css('height', $('#divResultadoInforme').innerHeight() - ($('#divInformeFecha').outerHeight() + $('#divInformeTitulo').outerHeight()));
}

function onclickFullScreenInformesAbajo() {
    RedireccionarPagIndex();
}