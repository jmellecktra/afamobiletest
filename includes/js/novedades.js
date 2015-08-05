$(document).ready(function () {
    //MostrarDivBloqueo();
	if (!localStorage.getItem("storageListaNovedades")) {
		OcultarDivBloqueo();
		processError('', 1000, '');
		return;
	}

	if (navigator.userAgent.match(/(Mobile|iPhone|iPod|iPad|Android|BlackBerry)/)) {
		document.isIndex = false;
		document.addEventListener("deviceready", mobileEventsHandler, false);
	}

    CargarHtmlFechaMenuPrincipal();

    var listaNovedadesGuardada = localStorage.getItem("storageListaNovedades");
    listaNovedades = eval('(' + listaNovedadesGuardada + ')');
    CargarTodasNovedadesHtml();

    onresizeBody();
	OcultarDivBloqueo();
});

function onresizeBody() {
    var altura = ($(document).height() - ($('#header').outerHeight() + $('#StatusBar').outerHeight()));
    $('#divResultadoNovedades').css('height', altura);
}

function CargarTodasNovedadesHtml() {
    var resultadoDiv = '';
    if (!listaNovedades) {
		processError('', 1000, '');
	}
	var indiceNovedades = -1;
	$(listaNovedades).each(function () {
		indiceNovedades++;
		resultadoDiv += '<div class="row">';
		resultadoDiv += '<div class="col-xs-1 cssColImgNovedades">';
		if (this.url != '') {
			resultadoDiv += '<a href="javascript:loadURL(\'' + this.url + '\');" >';
			resultadoDiv += '<img src="img/material/icono-doc-link.svg" alt="novedades" class="cssImgNovedades" />';
			resultadoDiv += '</a>';
		} else {
			resultadoDiv += '<img src="img/material/icono-doc.svg" alt="novedades" class="cssImgNovedades" />';
		}
		// resultadoDiv += '<img src="img/material/icono-doc.svg" alt="novedades" class="cssImgNovedades" />';
		resultadoDiv += '</div>';

		resultadoDiv += '<div class="col-xs-11 ">';

		// Primer fila novedades
		resultadoDiv += '<div class="row">';
		if (indiceNovedades == 0) {
			resultadoDiv += '<div class="col-xs-11 cssNovedadesTitulo">';
			resultadoDiv += this.titulo;
			resultadoDiv += '</div>';
			resultadoDiv += '<div class="col-xs-1 " onclick="onclickFullScreenNovedadesAbajo()">'; //onclick="onclickFullScreenNovedadesAbajo()"
			//resultadoDiv += '<img src="img/material/ampliarAbajo.svg" alt="ampliar bajo" class="cssImgAmpliar" />';
			resultadoDiv += '<input type="button" class="cssImgImputButtonAchicar"  onclick="onclickFullScreenNovedadesAbajo(); return false;"/>';
			resultadoDiv += '</div>';
		} else {
			resultadoDiv += '<div class="col-xs-12 cssNovedadesTitulo">';
			resultadoDiv += this.titulo;
			resultadoDiv += '</div>';
		}
		resultadoDiv += '</div>';
		resultadoDiv += '<div class="row ">';

		resultadoDiv += '<div class="col-xs-12">';
		resultadoDiv += '<table>';
		resultadoDiv += '<tr>';
		resultadoDiv += '<td>';
		resultadoDiv += '<div class="cssNovedadesFecha">';
		resultadoDiv += obtenerFechaMostrar(this.fecha);
		resultadoDiv += '</div>';
		resultadoDiv += '</td>';
		resultadoDiv += '<td>';
		resultadoDiv += '<div class="cssNovedadesCategoria">';
		resultadoDiv += this.descripcionCategoria;
		resultadoDiv += '</div>';
		resultadoDiv += '</td>';
		resultadoDiv += '</tr>';
		resultadoDiv += '</table>';
		resultadoDiv += '</div>';

		resultadoDiv += '</div>';
		resultadoDiv += '<div class="row">';
		resultadoDiv += '<div class="col-xs-12 cssNovedadesDescripcion">';
		resultadoDiv += this.descripcion;
		resultadoDiv += '</div>';
		resultadoDiv += '</div>';
		resultadoDiv += '</div>';
	});
    $('#divResultadoNovedades').html(resultadoDiv);
}

function onclickFullScreenNovedadesAbajo() {
    //window.location.href = "index.html?r=1";
    RedireccionarPagIndex();
}