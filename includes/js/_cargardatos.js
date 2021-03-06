/*
var wsUrlCotizacion = "http://concentrador.afascl.coop:38080/Concentrador/webservices/CotizacionCerealPuertoService?wsdl/";
var wsUrlCotizacionHistorico = "http://concentrador.afascl.coop:38080/Concentrador/webservices/CotizacionCerealPuertoService?wsdl/";
var wsUrlNovedades = "http://concentrador.afascl.coop:38080/Concentrador/webservices/NotificacionService?wsdl/";
var wsUrlAuditoria = "http://concentrador.afascl.coop:38080/Concentrador/webservices/AuditoriaService?wsdl/";
var wsUrlInforme = "http://concentrador.afascl.coop:38080/Concentrador/webservices/InformeService?wsdl/";
var wsUrlGuardarTelefono = "http://concentrador.afascl.coop:38080/Concentrador/webservices/TelefonoService?wsdl/";
*/

var wsUrlCotizacion = "http://concentrador.afascl.coop:8080/Concentrador/webservices/CotizacionCerealPuertoService?wsdl/";
var wsUrlCotizacionHistorico = "http://concentrador.afascl.coop:8080/Concentrador/webservices/CotizacionCerealPuertoService?wsdl/";
var wsUrlNovedades = "http://concentrador.afascl.coop:8080/Concentrador/webservices/NotificacionService?wsdl/";
var wsUrlAuditoria = "http://concentrador.afascl.coop:8080/Concentrador/webservices/AuditoriaService?wsdl/";
var wsUrlInforme = "http://concentrador.afascl.coop:8080/Concentrador/webservices/InformeService?wsdl/";
var wsUrlGuardarTelefono = "http://concentrador.afascl.coop:8080/Concentrador/webservices/TelefonoService?wsdl/";
var wsUrlRegistracionTelefono = 'http://190.210.143.156:50002/registrationinfo/';

var cotizacionesDestacada = null;
var indexCotizacionesDestacada = null;
var listaTodasCotizaciones = null;
var listaNovedades = null;
var listaTablaModificaciones = null;
var listaInformes = null;

var isCargarCotizaciones = true;
var isCargarNotificaciones = true;
var isCargarInformes = true;

var telefonoDelUsuario = '';

//*** CESAR ***
var reqCotizaciones = [];
var reqCotHistoricas = '';

function cotizacion() {
    this.fechaCotizacion = '';
    this.codigoMoneda = 0;
    this.descripcionMoneda = '';
    this.codigoTipoCotizacion = 0;
    this.codigoTipoCotizacion = 0;
    this.descripcionTipoCotizacion = '';
    this.codigoPuerto = 0;
    this.descripcionPuerto = '';
    this.codigoProducto = 0;
    this.descripcionProducto = '';
    this.valor = 0;
    this.valorString = '';
    this.observacion = '';
    this.abreviaturaMoneda = '';
    this.variacion = '';
    this.listaDetalle = [];
    this.listaHistorico = [];
}

function novedades() {
    this.codigoNotificacion = 0;
    this.fecha = '';
    this.titulo = '';
    this.descripcion = '';
    this.url = '';
    this.codigoCategoria = 0;
    this.descripcionCategoria = '';
}

function modificacionesTabla() {
    this.codigoTabla = 0;
    this.fecha = '';
    this.hora = '';
}

function informes() {
    this.codigoInforme = 0;
    this.fecha = '';
    this.titulo = '';
    this.texto = '';
    this.url = '';
}

function FuncionInicio() {
    var isGuardarTelefono = false;
	if (window.localStorage) {
		if (!localStorage.getItem("storageTelefono")) {
			isGuardarTelefono = isPhone();

			if (!isGuardarTelefono) {
				localStorage.setItem('storageTelefono', '');
			}
		}
		if (isGuardarTelefono) {
			window.location.href = "telefono.html";
		} else {
			CargarAuditoria();
		}
	} //Falta definir q pasa en caso de que no haya soporte al localStorage!!!
}

function CargarParametroEntradaGuardarTelefono(pTelefono) {
        var soapRequest = '<?xml version="1.0" encoding="utf-8"?>';
        soapRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.afascl.coop/servicios">';
        soapRequest += '<soapenv:Header/>';
        soapRequest += '<soapenv:Body>';
        soapRequest += '<ser:guardarTelefono>';
        if (pTelefono != '') {
            soapRequest += '<telefono>' + pTelefono + '</telefono> ';
        }
        soapRequest += '</ser:guardarTelefono>';
        soapRequest += '</soapenv:Body>';
        soapRequest += '</soapenv:Envelope>';

        return soapRequest;
}

function funGuardarTelefono(pTelefono) {
    telefonoDelUsuario = pTelefono;
    $.ajax({
        type: "POST",
        url: wsUrlGuardarTelefono,
        contentType: "application/xml; charset=utf-8", //"text/xml",
        dataType: "xml",
        // data: '{"username": "' + 'user' + '", "password" : "' + 'pass123' + '"}',        
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Password', 'pass123');
            xhr.setRequestHeader('Username', 'user');
        },
        crossDomain: true,
        xhrFields: {
            // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
            // This can be used to set the 'withCredentials' property.
            // Set the value to 'true' if you'd like to pass cookies to the server.
            // If this is enabled, your server must respond with the header
            // 'Access-Control-Allow-Credentials: true'.
            withCredentials: true
        },
        data: CargarParametroEntradaGuardarTelefono(pTelefono),
        success: processSuccessGuardarTelefono
    });
}

function processSuccessGuardarTelefono(data, status, req) {
	var codigoRespuesta = 1;
	$(req.responseText).find('return').each(function () {
		codigoRespuesta = parseInt($(this).find('codigoResultado').text());
	});

	if (codigoRespuesta == 0) {
		localStorage.setItem('storageTelefono', telefonoDelUsuario);
	}
	$('#divFondoBloqueo').css('display', 'block');
	window.location.href = "index.html";
}

function CargarAuditoria() {
    listaTablaModificaciones = null;
	//t = setInterval(timeController, 1000);
    $.ajax({
        type: "POST",
        url: wsUrlAuditoria,
        contentType: "application/xml; charset=utf-8",
        dataType: "xml",
        crossDomain: true,		
        xhrFields: { withCredentials: true },
        data: CargarParametroEntradaAuditoria(),
        success: successAuditoria
    });
	
}

function defineLoadUpdates() {
	var labelTableStorage = "storageTablaModificaciones";
	var update = false;	
	for (var i = 0; i < listaTablaModificaciones.length; i++) {
		//alert(i+1);
		//console.log(listaTablaModificaciones[i]);
		var tableNameKey = labelTableStorage + listaTablaModificaciones[i].codigoTabla;
		if (!localStorage.getItem(tableNameKey)) {
			update = true;
			localStorage.setItem(tableNameKey, JSON.stringify(listaTablaModificaciones[i]));
		} else {
			var newDate = obtenerFechaUTC(listaTablaModificaciones[i].fecha, listaTablaModificaciones[i].hora);
			var updateStorage = localStorage.getItem(tableNameKey);
			var updateStorageObject = eval('(' + updateStorage + ')');
			storageDate = obtenerFechaUTC(updateStorageObject.fecha, updateStorageObject.hora);
			if (newDate != storageDate) {
				update = true;
				localStorage.setItem(tableNameKey, JSON.stringify(listaTablaModificaciones[i]));
			}
		}
		switch (listaTablaModificaciones[i].codigoTabla) {
			case 1: isCargarCotizaciones = update; break;
			case 2: isCargarNotificaciones = update; break; // listaNovedades = update; 
			case 3: isCargarInformes = update; break; //listaInformes = update; 
			default: processError('', 20004, ''); // unknow update
		}
	}
}

function timeController() {
	if (startTime == startTimeOut) {
		CargaNovedades(); // timeOutCallbacks[0]				
	}
	startTime--;

	var timeOut = 1;
	//Si hay al menos un módulo cargado, se puede ocultar el bloque de espera general.
	for (var i = 0; i < 1; i++) {//i <  timeOutCallbacks.length
		timeOut *= parseInt(timeOutCallbacks[i]);
	}
	
	
	if ((startTimeOut-startTime) > (startTimeOut/2)) {
		$('#alertavelocidad').css('display', 'block');
	}
	if (startTime == 1) {
		window.clearTimeout(t);
		OcultarDivBloqueo();
		if (timeOut == 0) {
			processError('', 5000, '');
		}
	} else {
		if (timeOut == 1) {			
			window.clearTimeout(t);	
			callswipper();
			//setTimeout(function(){ callswipper(); }, 1000);
			OcultarDivBloqueo();
		}
	}
}

function callswipper() {
	try {
		porcentajeArriba = 0.55;
        porcentajeAbajo = 0.45;
        onresizeBody();		
	}
	catch(err) {
		//document.getElementById("error").innerHTML = err.message;
	}
	
	
}

function successAuditoria(data, status, req) {
	// No se pudo traer la info auditoria de las actualizaciones
	if (!req || (req && req.responseText.length == 0)) {
		processError('', 3000, '');
	}

	isCargarCotizaciones = true;
	isCargarNotificaciones = true;
	isCargarInformes = true;
	CargarResultadoAuditoriaJavascript(req.responseText);
	if (listaTablaModificaciones && (listaTablaModificaciones.length > 0)) {
		// Hay actualizaciones, definir si las mismas son diferentes que las almacenadas
		defineLoadUpdates();
	}
	timeOutCallbacks[3] = 1;
	t = setInterval(timeController, 1000);
}

function CargarParametroEntradaAuditoria() {
    var soapRequest = '<?xml version="1.0" encoding="utf-8"?>';
    soapRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.afascl.coop/servicios">';
    soapRequest += '<soapenv:Header/>';
    soapRequest += '<soapenv:Body>';
    soapRequest += '<ser:consultaModificaciones/>';
    soapRequest += '</soapenv:Body>';
    soapRequest += '</soapenv:Envelope>';
    return soapRequest;
}

function CargarResultadoAuditoriaJavascript(pXML) {
    listaTablaModificaciones = [];
	// Object updates format: {codigoTabla: 1|2|3, fecha: "dd/mm/yyyy", hora: "hh:mm:ss"}
    $(pXML).find('modificaciones').each(function () {
        var obj = new modificacionesTabla();
        obj.codigoTabla = parseInt($(this).find('codigoTabla').text());
		if (obj.codigoTabla != 1 && obj.codigoTabla != 2 && obj.codigoTabla != 3) {
			processError('', 20001, '');
			return;
		}

        obj.fecha = $(this).find('fecha').text();
		if (!obj.fecha || 
			(obj.fecha && obj.fecha.length == 0) ) {
			processError('', 20002, '');
			return;
		}

		obj.hora = $(this).find('hora').text();
		if (!obj.hora || 
			(obj.hora && obj.hora.length == 0) ) {
			processError('', 20003, '');
			return;
		}

        listaTablaModificaciones.push(obj);
    });
}

function CargaCotizacionDestacada() {
	
    if (isCargarCotizaciones || !localStorage.getItem("storageListaCotizacionesDestacada")) {
        $.ajax({
            type: "POST",
            url: wsUrlCotizacion,
            contentType: "application/xml; charset=utf-8",
            dataType: "xml",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            data: CargarParametroEntradaCotizaciones_Ordenada(1, 14, obtenerFechaParametroEntrada(0), '', '', '', '', ''),
            success: processSuccessCotizacionDestacada
        });
    } else {
		if (!localStorage.getItem("storageListaCotizacionesDestacada")) {
			processError('', 1000, '');
		}
		var cotizacionesDestacadaGuardada = localStorage.getItem("storageListaCotizacionesDestacada");
		cotizacionesDestacada = eval('(' + cotizacionesDestacadaGuardada + ')');
        CargarCotizacionesDestacadaHtml();
    }
}

function processSuccessCotizacionDestacada(data, status, req) {
    CargarResultadoCotizacionDestacadoJavascript(req.responseText);
}

/* Inicio Error */
function processError(data, status, req) {
	var id = -1;
	if (status > 0) {
		id = status;
	}
    window.location.href = "error.html?id=" + id;
}

function CargarResultadoCotizacionDestacadoJavascript(pXML) {
    cotizacionesDestacada = [];
	var maxUtcValue = 0;
	var maxDate = '';
    $(pXML).find('cotizaciones').each(function () {
        var obj = new cotizacion();
        obj.fechaCotizacion = $(this).find('fechaCotizacion').text();
        obj.codigoMoneda = parseInt($(this).find('codigoMoneda').text());
        obj.descripcionMoneda = $(this).find('descripcionMoneda').text();
        obj.codigoTipoCotizacion = parseInt($(this).find('codigoTipoCotizacion').text());
        obj.descripcionTipoCotizacion = $(this).find('descripcionTipoCotizacion').text();
        obj.codigoPuerto = parseInt($(this).find('codigoPuerto').text());
        obj.descripcionPuerto = $(this).find('descripcionPuerto').text();
        obj.codigoProducto = $(this).find('codigoProducto').text();
        obj.descripcionProducto = $(this).find('descripcionProducto').text();
        obj.valor = parseFloat($(this).find('valor').text());
        obj.valorString = convertValorImporte(obj.valor);
        obj.observacion = $(this).find('observacion').text();
        obj.abreviaturaMoneda = $(this).find('abreviaturaMoneda').text();
        obj.variacion = $(this).find('variacion').text();
        cotizacionesDestacada.push(obj);
 
		// fechaCotizacion format: yyyy-mm-ddThh:mm:ss-xx:xx where +/-xx:xx is GMT zone time value (-03:00 for Argentina)
		maxDate = obj.fechaCotizacion;
		var fechaData = obj.fechaCotizacion.split('T');

		var fechaPartes = fechaData[0].split('-');
		var fecha = fechaPartes[2]+'/'+fechaPartes[1]+'/'+fechaPartes[0]; // new format: dd/mm/yyyy
		var horaPartes = fechaData[1].split('-');
		var newUtcValue = obtenerFechaUTC(fecha, horaPartes[0]);
		
		if (newUtcValue > maxUtcValue) {
			maxUtcValue = newUtcValue;
			maxDate = obj.fechaCotizacion;
		}
    });

    if (cotizacionesDestacada.length > 0) {
        // Inicio Cargar Fecha Actual
        grabarStorageFechaCotizacion(obtenerFechaMostrarDsdCotizacionesDestacada(maxDate));
        // Fin Cargar Fecha Actual
        indexCotizacionesDestacada = 0;
        CargaConIndiceDetalleCotizacion(indexCotizacionesDestacada);
    }

	//timeOutCallbacks[0] = 1;
}

function CargarParametroEntradaCotizaciones_Ordenada(pCodigoTipoCotizacion, pCodigoTipoCliente, pFechaDesde, pFechaHasta, pTipoOrden, pProductos, pPuertos, pMonedas) {
    var soapRequest = '<?xml version="1.0" encoding="utf-8"?>';
    soapRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.afascl.coop/servicios" >';
    soapRequest += '<soapenv:Header/>';
    soapRequest += '<soapenv:Body>';
    soapRequest += '<ser:consultaCotizacionProductoPuertoMonedaOrdenada>';
    if (pCodigoTipoCotizacion != '') {
        soapRequest += '<codigoTipoCotizacion>' + pCodigoTipoCotizacion + '</codigoTipoCotizacion>';
    }
    if (pCodigoTipoCliente != '') {
        soapRequest += '<codigoTipoCliente>' + pCodigoTipoCliente + '</codigoTipoCliente>';
    }
    if (pFechaDesde != '') {
        soapRequest += '<fechaDesde>' + pFechaDesde + '</fechaDesde>';
    }
    if (pTipoOrden != '') {
        soapRequest += '<tipoOrden>' + pTipoOrden + '</tipoOrden>';
    }
    if (pFechaHasta != '') {
        soapRequest += '<fechaHasta>' + pFechaHasta + '</fechaHasta>';
    }
    if (pProductos != '') {
        soapRequest += '<productos>' + pProductos + '</productos>';
    }
    if (pPuertos != '') {
        soapRequest += '<puertos>' + pPuertos + '</puertos>';
    }
    if (pMonedas != '') {
        soapRequest += '<monedas>' + pMonedas + '</monedas>';
    }
    soapRequest += '</ser:consultaCotizacionProductoPuertoMonedaOrdenada>';
    soapRequest += '</soapenv:Body>';
    soapRequest += '</soapenv:Envelope>';

    return soapRequest;
}

function CargarParametroEntradaCotizaciones(pCodigoTipoCotizacion, pCodigoTipoCliente, pFechaDesde, pFechaHasta, pProductos, pPuertos, pMonedas) {
    var soapRequest = '<?xml version="1.0" encoding="utf-8"?>';
    soapRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.afascl.coop/servicios" >';
    soapRequest += '<soapenv:Header/>';
    soapRequest += '<soapenv:Body>';
    soapRequest += '<ser:consultaCotizacionProductoPuertoMoneda>';
    if (pCodigoTipoCotizacion != '') {
        soapRequest += '<codigoTipoCotizacion>' + pCodigoTipoCotizacion + '</codigoTipoCotizacion>';
    }
    if (pCodigoTipoCliente != '') {
        soapRequest += '<codigoTipoCliente>' + pCodigoTipoCliente + '</codigoTipoCliente>';
    }
    if (pFechaDesde != '') {
        soapRequest += '<fechaDesde>' + pFechaDesde + '</fechaDesde>';
    }
    if (pFechaHasta != '') {
        soapRequest += '<fechaHasta>' + pFechaHasta + '</fechaHasta>';
    }
    if (pProductos != '') {
        soapRequest += '<productos>' + pProductos + '</productos>';
    }
    if (pPuertos != '') {
        soapRequest += '<puertos>' + pPuertos + '</puertos>';
    }
    if (pMonedas != '') {
        soapRequest += '<monedas>' + pMonedas + '</monedas>';
    }
    soapRequest += '</ser:consultaCotizacionProductoPuertoMoneda>';
    soapRequest += '</soapenv:Body>';
    soapRequest += '</soapenv:Envelope>';

    return soapRequest;
}


// *** CESAR *** 
function CargaConIndiceDetalleCotizacion(pIndex) {
		$.ajax({
			type: "POST",
			url: wsUrlCotizacion,
			contentType: "application/xml; charset=utf-8", //"text/xml",
			dataType: "xml",
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			data: CargarParametroEntradaCotizaciones_Ordenada(1, 11, obtenerFechaParametroEntrada(0), '', '', '', '', ''),
			success: processSuccessDetalleCotizacion
		});
}

function processSuccessDetalleCotizacion(data, status, req) {
	reqCotizaciones = ObtenerResultadoCotizacionDetalleJavascript(req.responseText);
	CargaCotizacionHistoricaConIndiceDetacado(0);
	if (window.localStorage) {
		localStorage.removeItem('storagereqCotizaciones');
		var reqCotizacionesDestacadaAGuardar = JSON.stringify(reqCotizaciones);
		localStorage.setItem('storagereqCotizaciones', reqCotizacionesDestacadaAGuardar);
		//UPDATE-PERFORMANCE
		//CargaTodasCotizaciones();
		timeOutCallbacks[1] = 1;
		
	} else {
		processError('', 1000, '');
	}	
}

function ObtenerResultadoCotizacionDetalleJavascript(pXML) {
    var cotizacionesDetalle = [];
    $(pXML).find('cotizaciones').each(function () {
        var obj = new cotizacion();
        obj.fechaCotizacion = $(this).find('fechaCotizacion').text();
        obj.codigoMoneda = parseInt($(this).find('codigoMoneda').text());
        obj.descripcionMoneda = $(this).find('descripcionMoneda').text();
        obj.codigoTipoCotizacion = parseInt($(this).find('codigoTipoCotizacion').text());
        obj.descripcionTipoCotizacion = $(this).find('descripcionTipoCotizacion').text();
        obj.codigoPuerto = parseInt($(this).find('codigoPuerto').text());
        obj.descripcionPuerto = $(this).find('descripcionPuerto').text();
        obj.codigoProducto = $(this).find('codigoProducto').text();
        obj.descripcionProducto = $(this).find('descripcionProducto').text();
        obj.valor = parseFloat($(this).find('valor').text());
        obj.valorString = convertValorImporte(obj.valor);
        obj.observacion = $(this).find('observacion').text();
        obj.abreviaturaMoneda = $(this).find('abreviaturaMoneda').text();
        obj.variacion = $(this).find('variacion').text();
        cotizacionesDetalle.push(obj);
    });
    return cotizacionesDetalle;
}

function CargaCotizacionHistoricaConIndiceDetacado(pIndex) {
	if (reqCotHistoricas == '') {
		$.ajax({
			type: "POST",
			url: wsUrlCotizacionHistorico,
			contentType: "application/xml; charset=utf-8",
			dataType: "xml",
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			data: CargarParametroEntradaCotizaciones_Ordenada(1, 11, obtenerFechaParametroEntrada(-10), obtenerFechaParametroEntrada(0), 9, '', '', ''),
			success: processSuccessCotizacionHistorica
		});
	} else {
		processSuccessCotizacionHistoricaBis(reqCotHistoricas);	
	}
}

function ObtenerCotizacionHistoricaConIndiceProductoDestacado(pXML) {
    var listaHistorica = [];
    $(pXML).find('cotizaciones').each(function () {
        var obj = new cotizacion();
        obj.fechaCotizacion = $(this).find('fechaCotizacion').text();
        obj.codigoMoneda = parseInt($(this).find('codigoMoneda').text());
        obj.descripcionMoneda = $(this).find('descripcionMoneda').text();
        obj.codigoTipoCotizacion = parseInt($(this).find('codigoTipoCotizacion').text());
        obj.descripcionTipoCotizacion = $(this).find('descripcionTipoCotizacion').text();
        obj.codigoPuerto = parseInt($(this).find('codigoPuerto').text());
        obj.descripcionPuerto = $(this).find('descripcionPuerto').text();
        obj.codigoProducto = $(this).find('codigoProducto').text();
        obj.descripcionProducto = $(this).find('descripcionProducto').text();
        obj.valor = parseFloat($(this).find('valor').text());
        obj.valorString = convertValorImporte(obj.valor);
        obj.observacion = $(this).find('observacion').text();
        obj.abreviaturaMoneda = $(this).find('abreviaturaMoneda').text();
        obj.variacion = $(this).find('variacion').text();
        listaHistorica.push(obj);
    });
    return listaHistorica;
}

function processSuccessCotizacionHistorica(data, status, req) {
	reqCotHistoricas = req;
	cotizacionesDestacada[indexCotizacionesDestacada].listaHistorico = ObtenerCotizacionHistoricaConIndiceProductoDestacado(req.responseText);
	if ((cotizacionesDestacada.length - 1) > indexCotizacionesDestacada) {
		indexCotizacionesDestacada++;
		CargaCotizacionHistoricaConIndiceDetacado(indexCotizacionesDestacada);
	} else {
		if (window.localStorage) {
			var cotizacionesDestacadaAGuardar = JSON.stringify(cotizacionesDestacada);
			localStorage.setItem('storageListaCotizacionesDestacada', cotizacionesDestacadaAGuardar);
		} else {
			processError('', 1000, '');
		}
		CargarCotizacionesDestacadaHtml();
	}
}
function processSuccessCotizacionHistoricaBis(req) {
	cotizacionesDestacada[indexCotizacionesDestacada].listaHistorico = ObtenerCotizacionHistoricaConIndiceProductoDestacado(req.responseText);
	if ((cotizacionesDestacada.length - 1) > indexCotizacionesDestacada) {
		indexCotizacionesDestacada++;
		CargaCotizacionHistoricaConIndiceDetacado(indexCotizacionesDestacada);
	} else {
		if (window.localStorage) {
			var cotizacionesDestacadaAGuardar = JSON.stringify(cotizacionesDestacada);
			localStorage.setItem('storageListaCotizacionesDestacada', cotizacionesDestacadaAGuardar);
		} else {
			processError('', 1000, '');
		}
		CargarCotizacionesDestacadaHtml();
		window.clearTimeout(t);
		// Por Swiper CargaUltimoInforme();
	}
}


function CargaTodasCotizaciones() {
    if (isCargarCotizaciones) {		
		//TUNING-PERFORMANCE
		if (reqCotizaciones.length == 0 || !localStorage.getItem("storagereqCotizaciones")) { //Ya fue cargado
			$.ajax({
				type: "POST",
				url: wsUrlCotizacion,
				contentType: "application/xml; charset=utf-8", //"text/xml",
				dataType: "xml",
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				//data: CargarParametroEntradaCotizaciones(1, 11, obtenerFechaParametroEntrada(0), '', '', '', ''),
				data: CargarParametroEntradaCotizaciones_Ordenada(1, 11, obtenerFechaParametroEntrada(0), '', '', '', '', ''),
				success: processSuccessTodasCotizaciones
			});
		} else {
			processSuccessTodasCotizacionesBis();	
		}
    }
}

function processSuccessTodasCotizaciones(data, status, req) {
	listaTodasCotizaciones = ObtenerTodasCotizaciones(req.responseText);
	if (window.localStorage) {
		var listaTodasCotizacionesAGuardar = JSON.stringify(listaTodasCotizaciones);
		localStorage.setItem('storageListaTodasCotizaciones', listaTodasCotizacionesAGuardar);
		timeOutCallbacks[2] = 1;
	} else {
		processError('', 1000, '');
	}
}

//TUNING-PERFORMANCE
function processSuccessTodasCotizacionesBis() {
	listaTodasCotizaciones = ObtenerTodasCotizaciones(reqCotizaciones);
	if (window.localStorage) {
		var listaTodasCotizacionesAGuardar = JSON.stringify(listaTodasCotizaciones);
		localStorage.setItem('storageListaTodasCotizaciones', listaTodasCotizacionesAGuardar);
		timeOutCallbacks[2] = 1;
	} else {
		processError('', 1000, '');
	}
}

function ObtenerTodasCotizaciones(pXML) {
    var listaTodasCotizaciones = [];
    $(pXML).find('cotizaciones').each(function () {
        var obj = new cotizacion();
        obj.fechaCotizacion = $(this).find('fechaCotizacion').text();
        obj.codigoMoneda = parseInt($(this).find('codigoMoneda').text());
        obj.descripcionMoneda = $(this).find('descripcionMoneda').text();
        obj.codigoTipoCotizacion = parseInt($(this).find('codigoTipoCotizacion').text());
        obj.descripcionTipoCotizacion = $(this).find('descripcionTipoCotizacion').text();
        obj.codigoPuerto = parseInt($(this).find('codigoPuerto').text());
        obj.descripcionPuerto = $(this).find('descripcionPuerto').text();
        obj.codigoProducto = $(this).find('codigoProducto').text();
        obj.descripcionProducto = $(this).find('descripcionProducto').text();
        obj.valor = parseFloat($(this).find('valor').text());
        obj.valorString = convertValorImporte(obj.valor);
        obj.observacion = $(this).find('observacion').text();
        obj.abreviaturaMoneda = $(this).find('abreviaturaMoneda').text();
        obj.variacion = $(this).find('variacion').text();
        listaTodasCotizaciones.push(obj);
    });
    return listaTodasCotizaciones;
}

function CargarParametroEntradaNovedades(pFechaDesde, pFechaHasta, pCodigoCategoria) {
    var soapRequest = '<?xml version="1.0" encoding="utf-8"?>';
    soapRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.afascl.coop/servicios">';
    soapRequest += '<soapenv:Header/>';
    soapRequest += '<soapenv:Body>';
    soapRequest += '<ser:consultaNotificaciones>';
    if (pFechaDesde != '') {
        soapRequest += '<fechaDesde>' + pFechaDesde + '</fechaDesde>';
    }
    if (pFechaHasta != '') {
        soapRequest += '<fechaHasta>' + pFechaHasta + '</fechaHasta>';
    }
    if (pCodigoCategoria != '') {
        soapRequest += '<codigoCategoria>' + pCodigoCategoria + '</codigoCategoria>';
    }
    soapRequest += '</ser:consultaNotificaciones>';
    soapRequest += '</soapenv:Body>';
    soapRequest += '</soapenv:Envelope>';
    return soapRequest;
}

function CargaNovedades() {
    if (isCargarNotificaciones || !localStorage.getItem("storageListaNovedades")) {
        $.ajax({
            type: "POST",
            url: wsUrlNovedades,
            contentType: "application/xml; charset=utf-8", //"text/xml",
            dataType: "xml",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: CargarParametroEntradaNovedades('', '', ''),
            success: processSuccessNovedades
        });
    } else {
		timeOutCallbacks[0] = 1;
        CargaUltimoInforme();
    }
}

function processSuccessNovedades(data, status, req) {
	listaNovedades = ObtenerNovedades(req.responseText);
	if (window.localStorage) {
		var listaNovedadesAGuardar = JSON.stringify(listaNovedades);
		localStorage.setItem('storageListaNovedades', listaNovedadesAGuardar);
	} else {
		processError('', 1000, '');
	}
	
	timeOutCallbacks[0] = 1;
	CargaUltimoInforme();

}

function ObtenerNovedades(pXML) {
    var listaNovedadesAux = [];
    $(pXML).find('notificaciones').each(function () {
        var obj = new novedades();
        obj.codigoNotificacion = parseInt($(this).find('codigoNotificacion').text());
        obj.fecha = $(this).find('fecha').text();
        obj.titulo = $(this).find('titulo').text();
        obj.descripcion = $(this).find('descripcion ').text();
        obj.url = $(this).find('url').text();
        obj.codigoCategoria = parseInt($(this).find('codigoCategoria').text());
        obj.descripcionCategoria = $(this).find('descripcionCategoria').text();
        listaNovedadesAux.push(obj);
    });
    return listaNovedadesAux;
}

function CargaUltimoInforme() {
    if (isCargarInformes || !localStorage.getItem("storageListaInformes")) {
        $.ajax({
            type: "POST",
            url: wsUrlInforme,
            contentType: "application/xml; charset=utf-8", //"text/xml",
            dataType: "xml",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: CargarParametroEntradaInforme('', '', 1),
            success: processSuccessInforme
        })
    } else {
		timeOutCallbacks[2] = 1;		
		CargarNovedadesHtml();
		CargaCotizacionDestacada();
	}
}

function CargarParametroEntradaInforme(pFechaDesde, pFechaHasta, pTipoConsulta) {
    var soapRequest = '<?xml version="1.0" encoding="utf-8"?>';
    soapRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.afascl.coop/servicios">';
    soapRequest += '<soapenv:Header/>';
    soapRequest += '<soapenv:Body>';
    soapRequest += '<ser:consultaInformes>';
    if (pFechaDesde != '') {
        soapRequest += '<fechaDesde>' + pFechaDesde + '</fechaDesde>';
    }
    if (pFechaHasta != '') {
        soapRequest += '<fechaHasta>' + pFechaHasta + '</fechaHasta>';
    }
    if (pTipoConsulta != '') {
        soapRequest += '<tipoConsulta>' + pTipoConsulta + '</tipoConsulta>';
    }
    soapRequest += '</ser:consultaInformes>';
    soapRequest += '</soapenv:Body>';
    soapRequest += '</soapenv:Envelope>';
    return soapRequest;
}

function processSuccessInforme(data, status, req) {
	listaInformes = ObtenerInforme(req.responseText);
	if (window.localStorage) {
		var listaInformesAGuardar = JSON.stringify(listaInformes);
		localStorage.setItem('storageListaInformes', listaInformesAGuardar);
		timeOutCallbacks[2] = 1;
	} else {
		processError('', 1000, '');
	}
	timeOutCallbacks[2] = 1;
	CargarNovedadesHtml();
	CargaCotizacionDestacada();
}

function ObtenerInforme(pXML) {
    var listaInformesAUX = [];
    $(pXML).find('informes').each(function () {
        var obj = new informes();
        obj.codigoInforme = parseInt($(this).find('codigoInforme').text());
        obj.fecha = $(this).find('fecha').text();
        obj.titulo = $(this).find('titulo').text();
        obj.texto = $(this).find('texto').text();
        obj.url = $(this).find('url').text();
        listaInformesAUX.push(obj);
    });
    return listaInformesAUX;
}