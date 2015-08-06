$(document).ready(function () {
    //MostrarDivBloqueo();
    var indexCotizacionDestacadaSeleccionada = obtenerStorageIndexCotizacionDestacadaSeleccionda();
	if (indexCotizacionDestacadaSeleccionada == -1) {
		OcultarDivBloqueo();
		processError('', 8000, '');
		return;
	}

    if (!localStorage["storageListaCotizacionesDestacada"]) {
		OcultarDivBloqueo();
		processError('', 1000, '');
		return;
    }

	if (navigator.userAgent.match(/(Mobile|iPhone|iPod|iPad|Android|BlackBerry)/)) {
		document.isIndex = false;
		document.addEventListener("deviceready", mobileEventsHandler, false);
	}

    CargarHtmlFechaMenuPrincipal();

    var cotizacionesDestacadaGuardada = localStorage.getItem("storageListaCotizacionesDestacada");
    cotizacionesDestacada = eval('(' + cotizacionesDestacadaGuardada + ')');
    CargarCotizacionesHistoricaFullscreenHtml(indexCotizacionDestacadaSeleccionada);

    onresizeBody();
    OcultarDivBloqueo();
});

function onresizeBody() {
    var altura = ($(document).height() - ($('#header').outerHeight() + $('#StatusBar').outerHeight()));
    $('#divResultadoTodasCotizacionesHistorica').css('height', altura);
    $('#divRowParteScrollTodosHistoricoCotizaciones').css('height', altura - ($('#divRowTodosHistoricoCotizacionesTitulo').outerHeight() + $('#divRowTodosHistoricoCotizacionesEncabezado').outerHeight()));
}

function CargarCotizacionesHistoricaFullscreenHtml(pIndex) {
    var resultadoDiv = '';
    if (cotizacionesDestacada != null) {
        if (cotizacionesDestacada[pIndex].listaHistorico.length > 0) {
            resultadoDiv += '<div id="divRowTodosHistoricoCotizacionesTitulo" class="row">';
            resultadoDiv += '<div class="col-xs-10 colHistoricoTitulo">';
            resultadoDiv += '&#218;ltimas cotizaciones: ' + cotizacionesDestacada[pIndex].descripcionProducto.toUpperCase();
            resultadoDiv += '</div>';

            resultadoDiv += '<div class="col-xs-2 cssAmpliarAchicar" >';
            resultadoDiv += '<input type="button" class="cssImgImputButtonAchicar"  onclick="onclickFullScreenCotizacionesHistoricaAbajo(); return false;"/>';
            resultadoDiv += '</div>';
 
            resultadoDiv += '</div>';
            resultadoDiv += '<div id="divRowTodosHistoricoCotizacionesEncabezado" class="row cssHistoricoEncabezado">';
            resultadoDiv += '<div class="col-xs-6 colHistoricoEncabezadoFecha">';
            resultadoDiv += 'FECHA';
            resultadoDiv += '</div>';
            resultadoDiv += '<div class="col-xs-6 colHistoricoEncabezadoPrecio">';
            resultadoDiv += 'PRECIO P/TN';
            resultadoDiv += '</div>';
            resultadoDiv += '</div>';

            var cantValorMonedaHistorico = 0;
            for (var i = 0; i < cotizacionesDestacada[pIndex].listaHistorico.length; i++) {
                var cantValorMonedaAUXHistorico = cotizacionesDestacada[pIndex].listaHistorico[i].abreviaturaMoneda.length + String(cotizacionesDestacada[pIndex].listaHistorico[i].valorString).length;
                if (cantValorMonedaHistorico < cantValorMonedaAUXHistorico) {
                    cantValorMonedaHistorico = cantValorMonedaAUXHistorico;
                }
            }

            resultadoDiv += '<div id="divRowParteScrollTodosHistoricoCotizaciones">'; // parte scroll
            var indexHistorico = -1;
            $(cotizacionesDestacada[pIndex].listaHistorico).each(function () {
				//**** CESAR *****
				if (this.codigoProducto == cotizacionesDestacada[pIndex].codigoProducto) {				
					indexHistorico++;
					var strHtmlColorFondo = '';
					if (indexHistorico % 2 == 0) {
						strHtmlColorFondo = ' cssHistoricoImpar ';
					}
	
					resultadoDiv += '<div class="row cssHistorico ' + strHtmlColorFondo + '">';
					resultadoDiv += '<div class="col-xs-6 colHistoricoFecha">';
					resultadoDiv += obtenerFechaMostrar(this.fechaCotizacion);
					resultadoDiv += '</div>';
					resultadoDiv += '<div class="col-xs-6 colHistoricoPrecio">';
	
					var cantValorMonedaAUXHistorico = this.abreviaturaMoneda.length + String(this.valorString).length;
					var strCantValorMonedaHistorico = '';
	
					resultadoDiv += strCantValorMonedaHistorico + this.abreviaturaMoneda + ' ' + this.valorString;
					resultadoDiv += '</div>';
					resultadoDiv += '</div>';
				}
            });
            resultadoDiv += '</div>'; // fin parte scroll
        }
    }
    $('#divResultadoTodasCotizacionesHistorica').html(resultadoDiv);
}

function onclickFullScreenCotizacionesHistoricaAbajo() {
    RedireccionarPagIndex();
}