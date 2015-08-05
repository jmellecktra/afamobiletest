var swiper = null;
var porcentajeArriba = 0.55;
var porcentajeAbajo = 0.45;

$(document).ready(function () {
    swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
    });	

	if (!swiper) {
		alert("Ha ocurrido un error al ejecutar la aplicación. Contáctese con su proveedor.");
		processError('', 9000, '');
	} else {
		// Define if its device is a mobile
		if (navigator.userAgent.match(/(Mobile|iPhone|iPod|iPad|Android|BlackBerry)/)) {
			document.addEventListener("deviceready", onDeviceReady, false);
		} else {
			CargaDeLosDatosPrevioTelefono();
		}
	}
});

$(document).ajaxStop(function () {
    finCargarInicial();
});

function CargaDeLosDatosPrevioTelefono() {
	var varParametroUrl = '';
	if (window.localStorage && localStorage.getItem("storageIndexVolver")) {
		varParametroUrl = localStorage.getItem("storageIndexVolver");
	}
	// Startup's app
	if (varParametroUrl === '') {
		FuncionInicio(); // at cargardatos.js
	} else if (varParametroUrl == '1') {
		// Una vez abierta la app, navegación entre las diferentes pantallas hacia el index (cuando se usa libreria.js::RedireccionarPagIndex())
		if (window.localStorage) {
			localStorage.setItem('storageIndexVolver', '');
		} else {
			processError('', 1000, '');
		}
		if (!localStorage.getItem("storageListaCotizacionesDestacada")) {
			//alert('storageListaCotizacionesDestacada is null');
			processError('', 1000, '');
		} else {
			var cotizacionesDestacadaGuardada = localStorage.getItem("storageListaCotizacionesDestacada");
			cotizacionesDestacada = eval('(' + cotizacionesDestacadaGuardada + ')');
		}
		if (!localStorage.getItem("storageListaNovedades")) {
			//alert('storageListaNovedades is null');
			processError('', 1000, '');
		} else {
			var listaNovedadesGuardada = localStorage.getItem("storageListaNovedades");
			listaNovedades = eval('(' + listaNovedadesGuardada + ')');
		}
		if (!localStorage.getItem("storageListaInformes")) {
			//alert('storageListaInformes is null');
			processError('', 1000, '');
		} else {
			var listaInformesGuardada = localStorage.getItem("storageListaInformes");
			listaInformes = eval('(' + listaInformesGuardada + ')');
		}

		CargarCotizacionesDestacadaHtml();
		CargarNovedadesHtml();
		if (!listaNovedades) {
			porcentajeArriba = 1;
			porcentajeAbajo = 0;
		} else if (listaNovedades.length == 0) {
			porcentajeArriba = 1;
			porcentajeAbajo = 0;
		}

		onresizeBody();
		OcultarDivBloqueo();
	} else if (varParametroUrl == '2') {
		onclickActualizar();
	}
}

var isMoverAmpliar = false;
var cantNN = 0;

function onmousedownAmpliar(e) {
    isMoverAmpliar = true;
}

function onmouseoverAmpliar(e) {
    isMoverAmpliar = false;
    cantNN = 0;
}

function onmousemoveAmpliar(e) {
    if (isMoverAmpliar) {
        if (cantNN == 0) {
            cantNN = e.clientY;
        } else {
            if (cantNN < e.clientY) {
                porcentajeArriba = porcentajeArriba + 0.001;
                porcentajeAbajo = porcentajeAbajo - 0.001;
            } else {
                porcentajeArriba = porcentajeArriba - 0.001;
                porcentajeAbajo = porcentajeAbajo + 0.001;
            }
            cantNN = e.clientY;
            onresizeBody();
        }
    }
}

function onmouseupAmpliar(e) {
    isMoverAmpliar = false;
    cantNN = 0;
}

function onresizeBody() {
    var altura = ($(document).height() - ($('#header').outerHeight() + $('#StatusBar').outerHeight()));
    var alturaCotizacionesDestacada = altura * porcentajeArriba; //0.55;
    // incio redondear para abajo
    var arrAlturaCotizacionesDestacada = alturaCotizacionesDestacada.toString().split(".");
    var enteroAlturaCotizacionesDestacada = 0;
    var decimalAlturaCotizacionesDestacada = 0;
    if (arrAlturaCotizacionesDestacada.length == 2) {
        enteroAlturaCotizacionesDestacada = parseInt(arrAlturaCotizacionesDestacada[0]);
        decimalAlturaCotizacionesDestacada = parseInt(arrAlturaCotizacionesDestacada[1]);
    } else {
        enteroAlturaCotizacionesDestacada = parseInt(arrAlturaCotizacionesDestacada[0]);
    }
    // fin redondear para abajo
    var alturaParteAbajo = altura * porcentajeAbajo; // 0.45;
    // incio redondear para arriba
    var arrAlturaParteAbajo = alturaParteAbajo.toString().split(".");
    var enteroAlturaParteAbajo = 0;
    var decimalAlturaParteAbajo = 0;
    if (arrAlturaParteAbajo.length == 2) {
        enteroAlturaParteAbajo = parseInt(arrAlturaParteAbajo[0]);
        decimalAlturaParteAbajo = parseInt(arrAlturaParteAbajo[1]);
    } else {
        enteroAlturaParteAbajo = parseInt(arrAlturaParteAbajo[0]);
    }
    if (decimalAlturaCotizacionesDestacada > 0) {
        enteroAlturaParteAbajo = enteroAlturaParteAbajo + 1;
    }
    $('#divCotizacionesDestacada').css('height', enteroAlturaCotizacionesDestacada);
    $('#divBarraAbajo').css('height', enteroAlturaParteAbajo);

    var cantPxBotonesSlider = parseInt($('.swiper-pagination').css('bottom').replace('px', '')) + $('.swiper-pagination').outerHeight() + 12; //2;+ 12

    $('.swiper-slide').css('height', $('#divBarraAbajo').outerHeight());
    var cantPaddingNovedadesSlider = 0;
    if (document.getElementById('swiper-slide1')) {
        cantPaddingNovedadesSlider = parseInt($('#swiper-slide1').css('padding-top').replace('px', ''));
    }

    $('#divRowParteScrollNovedades').css('height', ($('#divBarraAbajo').outerHeight() - (cantPxBotonesSlider + cantPaddingNovedadesSlider)));
    $('#divParteScrollCotizacionHistorica').css('height', $('#divBarraAbajo').outerHeight() - ($('#divParteFijaCotizacionHistorica').outerHeight() + cantPxBotonesSlider));
    $('#divInformeDescripcion').css('height', $('#divBarraAbajo').outerHeight() - ($('#divInformeFecha').outerHeight() + $('#divInformeTitulo').outerHeight() + cantPxBotonesSlider)); // 
}

function onclikAcodeon() {
    //alert('Ok');
}

function CargarCotizacionesDestacadaHtml() {
	if (!cotizacionesDestacada || (cotizacionesDestacada && cotizacionesDestacada.length == 0)) {
		processError('', 1000, '');
		return;
	}
    var resultadoDiv = '<div class="row cssDestacadoEncabezado ">';
    resultadoDiv += '<div class="col-xs-4">';
    resultadoDiv += 'PRODUCTO';
    resultadoDiv += '</div>';
    resultadoDiv += '<div class="col-xs-4 cssDestacadoPuertoTitulo">';
    resultadoDiv += 'PUERTO';
    resultadoDiv += '</div>';
    resultadoDiv += '<div class="col-xs-4 cssDestacadoPrecioTitulo">';
    resultadoDiv += 'PRECIO P/TN';
    resultadoDiv += '</div>';
    resultadoDiv += '</div>';
    resultadoDiv += '<div class="accordion" id="accordion2">';

    var cantValorMoneda = 0;
    for (var i = 0; i < cotizacionesDestacada.length; i++) {
        var cantValorMonedaAUX = cotizacionesDestacada[i].abreviaturaMoneda.length + String(cotizacionesDestacada[i].valorString).length;
        if (cantValorMoneda < cantValorMonedaAUX) {
            cantValorMoneda = cantValorMonedaAUX;
        }
    }
    //alert(cantValorMoneda);
	var index = -1;
    $(cotizacionesDestacada).each(function () {
        index++;

        resultadoDiv += '<div class="accordion-group" onclick="onclikAcodeon()">';
        resultadoDiv += '<div class="accordion-heading cssAccordion-heading ">';
        resultadoDiv += '<div class="accordion-toggle" href="#collapse' + index + '" data-toggle="collapse" data-parent="#accordion2">';
        resultadoDiv += '<div class="row cssDestacado">';
        resultadoDiv += '<div class="col-xs-4 cssDestacadoDescripcionProducto">';
        resultadoDiv += '<div class="cssDestacadoDescripcionProductoMargenes">'; // Margenes
        resultadoDiv += this.descripcionProducto.toUpperCase();
        resultadoDiv += '</div>'; // Fin Margenes
        resultadoDiv += '</div>';
        resultadoDiv += '<div class="col-xs-4 cssDestacadoDescripcionPuerto">';
        resultadoDiv += this.descripcionPuerto;
        resultadoDiv += '</div>';
        resultadoDiv += '<div class="col-xs-4 cssDestacadoPrecio">';
        var strCssColorPrecio = 'colRectanguloPrecioGris';
        if (this.variacion == '-') {
            strCssColorPrecio = 'colRectanguloPrecioRojo';
        } else if (this.variacion == '+') {
            strCssColorPrecio = 'colRectanguloPrecioVerde';
        }

        resultadoDiv += '<div class="colRectanguloPrecio ' + strCssColorPrecio + '">'; // rectangulo    
        var cantValorMonedaAUX = this.abreviaturaMoneda.length + String(this.valorString).length;

        var strCantValorMonedaLeft = '';
        var strCantValorMonedaRight = '';
        if (cantValorMonedaAUX < cantValorMoneda) {
            for (var iValorMoneda = cantValorMonedaAUX; iValorMoneda < cantValorMoneda; iValorMoneda++) {
                strCantValorMonedaLeft += '&nbsp;';
                strCantValorMonedaRight += '&nbsp;';
            }
        }

        resultadoDiv += strCantValorMonedaLeft + this.abreviaturaMoneda + ' ' + this.valorString + strCantValorMonedaRight;
        resultadoDiv += '</div>'; // fin rectangulo
        resultadoDiv += '</div>';
        resultadoDiv += '</div>';
        resultadoDiv += '</div>';
        resultadoDiv += '</div>';
        resultadoDiv += '<div class="accordion-body collapse" id="collapse' + index + '" style="height: 0px;">';
        resultadoDiv += '<div class="accordion-inner">';
        // detalle
        if (this.listaDetalle.length > 0) {
            // Encabezado detalle
            resultadoDiv += '<div class="row">';
            resultadoDiv += '<div class="row cssDetalleEncabezado">';
            resultadoDiv += '<div class="col-xs-4">';
            resultadoDiv += 'PUERTO';
            resultadoDiv += '</div>';
            resultadoDiv += '<div class="col-xs-4">';
            resultadoDiv += 'PRECIO P/TN';
            resultadoDiv += '</div>';
            resultadoDiv += '<div class="col-xs-4">';
            resultadoDiv += 'OBSERVACI&#211;N';
            resultadoDiv += '</div>';
            resultadoDiv += '</div>';
            // fin Encabezado detalle
        }
        for (var iDetalle = 0; iDetalle < this.listaDetalle.length; iDetalle++) {
            var strHtmlColorFondo = '';
            if (iDetalle % 2 != 0) {
                strHtmlColorFondo = ' cssDetalleImpar ';
            }
            //if (this.codigoProducto == this.listaDetalle[iDetalle].codigoProducto) {
                resultadoDiv += '<div class="row cssDetalle' + strHtmlColorFondo + '">';
                resultadoDiv += '<div class="col-xs-4 colDetalleDescripcionPuerto">';
                resultadoDiv += this.listaDetalle[iDetalle].descripcionPuerto;
                resultadoDiv += '</div>';
                resultadoDiv += '<div class="col-xs-4 colDetallePrecio">';

                resultadoDiv += this.listaDetalle[iDetalle].abreviaturaMoneda + ' ' + this.listaDetalle[iDetalle].valorString;
                resultadoDiv += '</div>';
                resultadoDiv += '<div class="col-xs-4 colDetalleObservacion">';
                resultadoDiv += this.listaDetalle[iDetalle].observacion;
                resultadoDiv += '</div>';
                resultadoDiv += '</div>';
            //}
        }
        resultadoDiv += '</div>';
        // fin detalle
        resultadoDiv += '</div>';
        resultadoDiv += '</div>';

        resultadoDiv += '</div>';
    });
    // VER MAS
    resultadoDiv += '<div class="colVerMas" onclick="onclickVerMas()">';
    resultadoDiv += '+ VER MAS';
    resultadoDiv += '</div>';
    //FIN VER MAS

    resultadoDiv += '</div>';
    $('#divCotizacionesDestacada').html(resultadoDiv);

    $('.collapse').on('show.bs.collapse', function (e) {
        $otherPanels = $(this).parents('.accordion-group').siblings('.accordion-group');
        $('.collapse', $otherPanels).removeClass('in');
    });
    $('.collapse').on('show.bs.collapse', function (e) {
        var index = parseInt(e.target.id.replace('collapse', ''));
        grabarStorageIndexCotizacionDestacadaSeleccionda(index);
        CargarCotizacionesHistoricaHtml(index);
        var indexSlide2 = -1;
        for (var i = 0; i < swiper.slides.length; i++) {
            if (swiper.slides[i].id == 'swiper-slide2') {
                indexSlide2 = i;
            }
        }
        if (indexSlide2 != -1) {
            swiper.slideTo(indexSlide2);
            //            setTimeout(function () {
            //                swiper.slideTo(indexSlide2);
            //            }, 200);
        }
        onresizeBody();
        //   $('#swiper-slide2').scrollTop(0);
        setTimeout(function () {
            CargarDeNuevoHistorico();
        }, 500);
    });

    $('.collapse').on('hide.bs.collapse', function (e) {
        var indexSlide3 = -1;
        var indexSlide2 = -1;
        var indexSlide1 = -1;
        for (var i = 0; i < swiper.slides.length; i++) {
            if (swiper.slides[i].id == 'swiper-slide2') {
                indexSlide2 = i;
            } else if (swiper.slides[i].id == 'swiper-slide3') {
                indexSlide3 = i;
            } else if (swiper.slides[i].id == 'swiper-slide1') {
                indexSlide1 = i;
            }
        }
        if (indexSlide2 != -1) {
            swiper.removeSlide(indexSlide2);
        }
        if (indexSlide1 != -1) {
            swiper.slideTo(indexSlide1);
            $('#swiper-slide1').scrollTop(0);
        } else {
            porcentajeArriba = 1;
            porcentajeAbajo = 0;
            onresizeBody();
        }
    });
    onresizeBody();

	CargarHtmlFechaMenuPrincipal();
	timeOutCallbacks[0] = 1;
}

function CargarDeNuevoHistorico() {
    if (!localStorage.getItem("storageIndexCotizacionDestacadaSeleccionda")) {
		processError('', 1000, '');
		return;
	}

    var index = parseInt(localStorage.getItem('storageIndexCotizacionDestacadaSeleccionda'));
    CargarCotizacionesHistoricaHtml(index);
}

function CargarInformeCierreMercado() {
	if (!listaInformes) {
		processError('', 1000, '');
		return;
	}

    var isTimeoutInformeCierreMercado = true;
	if (listaInformes.length > 0) {
		isTimeoutInformeCierreMercado = false;
		var indexSlide3 = -1;
		for (var i = 0; i < swiper.slides.length; i++) {
			if (swiper.slides[i].id == 'swiper-slide3') {
				indexSlide3 = i;
			}
		}
		if (indexSlide3 == -1) {
			swiper.appendSlide('<div id="swiper-slide3" class="swiper-slide">' + CargarInformeHtml() + '</div>');
		} else {
			$('#swiper-slide3').html(CargarInformeHtml());
		}
	}

    if (isTimeoutInformeCierreMercado) {
        setTimeout(function () {
            CargarInformeCierreMercado();
        }, 115);
    }
}

function onclickVerMas() {
    window.location.href = "todascotizaciones.html";
}

function CargarCotizacionesHistoricaHtml(pIndex) {
	if (!cotizacionesDestacada[pIndex] || (cotizacionesDestacada[pIndex] && !cotizacionesDestacada[pIndex].listaHistorico)) {
		processError('', 1000, '');
		return;
	}
    var resultadoDiv = '';
    if (cotizacionesDestacada[pIndex].listaHistorico.length > 0) {
        resultadoDiv += '<div id="divParteFijaCotizacionHistorica" >'; // div parte fija
        resultadoDiv += '<div class="row">';
        resultadoDiv += '<div class="col-xs-11 colHistoricoTitulo">';
        resultadoDiv += 'Cotizaci&#243;n hist&#243;rica: ' + cotizacionesDestacada[pIndex].descripcionProducto.toUpperCase();
        resultadoDiv += '</div>';
        //
        resultadoDiv += '<div class="col-xs-1 cssAmpliarAchicar" >'; // onclick="onclickFullScreenCotizacionesHistorica()"
        resultadoDiv += '</div>';
        //
        resultadoDiv += '</div>';
        resultadoDiv += '<div class="row cssHistoricoEncabezado">';
        resultadoDiv += '<div class="col-xs-6 colHistoricoEncabezadoFecha">';
        resultadoDiv += 'FECHA';
        resultadoDiv += '</div>';
        resultadoDiv += '<div class="col-xs-6 colHistoricoEncabezadoPrecio">';
        resultadoDiv += 'PRECIO P/TN';
        resultadoDiv += '</div>';
        resultadoDiv += '</div>';

        resultadoDiv += '</div>'; // fin div parte fija

        resultadoDiv += '<div id="divParteScrollCotizacionHistorica" >'; // div scroll
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
				resultadoDiv += '<div class="col-xs-6 colHistoricoFecha"><span style="opacity:1;">';
				resultadoDiv += obtenerFechaMostrar(this.fechaCotizacion);
				resultadoDiv += '</span></div>';
				resultadoDiv += '<div class="col-xs-6 colHistoricoPrecio">';
	
				resultadoDiv += this.abreviaturaMoneda + ' ' + this.valorString;
				resultadoDiv += '</div>';
				resultadoDiv += '</div>';
			}
        });
        resultadoDiv += '</div>'; // fin div scroll
    } else {
        resultadoDiv += '<div id="divParteFijaCotizacionHistorica" >'; // div parte fija
        resultadoDiv += '<div class="divNoSeEncuentraRegistro" >'; // 
        resultadoDiv += varNoSeEncuentraRegistroHistorica;
        resultadoDiv += '</div>'; // 
        resultadoDiv += '</div>'; // fin div scroll
    }
    var isAgregarSlides2 = true;
    for (var i = 0; i < swiper.slides.length; i++) {
        if (swiper.slides[i].id == 'swiper-slide2') {
            isAgregarSlides2 = false;
            break;
        }
    }
    if (isAgregarSlides2) {
        swiper.appendSlide('<div id="swiper-slide2" class="swiper-slide">' + resultadoDiv + '</div>');
    } else {
        $('#swiper-slide2').html(resultadoDiv);
    }
    if (cotizacionesDestacada[pIndex].listaHistorico.length > 0) {
        porcentajeArriba = 0.55;
        porcentajeAbajo = 0.45;
        onresizeBody();
    }
}

function CargarNovedadesHtml() {
	if (!listaNovedades || (listaNovedades && listaNovedades.length == 0)) {
		processError('', 1000, '');
		return;
	}
    var resultadoDiv = '<div id="divRowParteScrollNovedades">'; // parte scroll      
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
		resultadoDiv += '</div>';
		resultadoDiv += '<div class="col-xs-11 ">';
		// Primer fila novedades
		resultadoDiv += '<div class="row">';
		resultadoDiv += '<div class="col-xs-12 cssNovedadesTitulo">';
		resultadoDiv += this.titulo;
		resultadoDiv += '</div>';
		resultadoDiv += '</div>';
		// fin  Primer fila novedades
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
		resultadoDiv += '</table>';
		resultadoDiv += '</tr>';
		resultadoDiv += '</div>';

		resultadoDiv += '</div>';
		resultadoDiv += '<div class="row">';
		resultadoDiv += '<div class="col-xs-12 cssNovedadesDescripcion">';
		resultadoDiv += this.descripcion;
		resultadoDiv += '</div>';
		resultadoDiv += '</div>';

		resultadoDiv += '</div>';
	});
	resultadoDiv += '</div>'; // fin parte scroll

	if (listaNovedades.length > 0) {

		var indexSlide1 = -1;
		for (var i = 0; i < swiper.slides.length; i++) {
			if (swiper.slides[i].id == 'swiper-slide1') {
				indexSlide1 = i;
			}
		}
		if (indexSlide1 == -1) {
			swiper.appendSlide('<div id="swiper-slide1" class="swiper-slide">' + resultadoDiv + '</div>');
		} else {
			$('#swiper-slide1').html(resultadoDiv);
		}
	}

    CargarInformeCierreMercado();
	timeOutCallbacks[1] = 1;
}

function CargarInformeHtml() {
	if (!listaInformes) {
		processError('', 1000, '');
		return;
	}

    var informesHtml = '';
    for (var i = 0; i < listaInformes.length; i++) {
        //alert(listaInformes[i].titulo);
        informesHtml += '<div id="divInformeTitulo" class="cssInformeTitulo">' + listaInformes[i].titulo + '</div>';
        informesHtml += '<div id="divInformeFecha" class="cssInformeFecha">' + obtenerFechaMostrar(listaInformes[i].fecha) + '</div>';
        informesHtml += '<div id="divInformeDescripcion" class="cssInformeDescripcion">' + listaInformes[i].texto + '</div>';
        //informesHtml += ;+ '<br/>' + '<a href="javascript:loadURL(\''+ 'http://www.ejemplo.com/archivo.pdf' +'\');" >pdf </a>' 
        break;
    }
    return informesHtml;
}

function onclickFullScreenNovedades() {
    window.location.href = "novedades.html";
}

function onclickFullScreenCotizacionesHistorica() {
    window.location.href = "todascotizacioneshistorica.html";
}

function onclickFullScreenButtonAmpliar() {
    if (swiper.slides[swiper.activeIndex].id == 'swiper-slide1') {
        window.location.href = "novedades.html";
    } else if (swiper.slides[swiper.activeIndex].id == 'swiper-slide2') {
        window.location.href = "todascotizacioneshistorica.html";
    } else if (swiper.slides[swiper.activeIndex].id == 'swiper-slide3') {
        window.location.href = "informe.html";
    }
}

function finCargarInicial() {
    if (listaNovedades == null) {
        porcentajeArriba = 1;
        porcentajeAbajo = 0;
    } else if (listaNovedades.length == 0) {
        porcentajeArriba = 1;
        porcentajeAbajo = 0;
    }

    onresizeBody();
}