var wsUrl = "http://concentrador.afascl.coop:8080/Concentrador/webservices/CotizacionCerealPuertoService?wsdl/";
var cotizaciones = [];

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
    this.observacion = '';
}
function obtenerObjetoJavascript(pXML) {
    $(pXML).find('cotizaciones').each(function () {
        var obj = new cotizacion();
        obj.fechaCotizacion = $(this).find('fechaCotizacion').text();
        obj.codigoMoneda = parseInt($(this).find('codigoMoneda').text());
        obj.descripcionMoneda = $(this).find('descripcionMoneda').text();
        obj.codigoTipoCotizacion = parseInt($(this).find('codigoTipoCotizacion').text());
        obj.descripcionTipoCotizacion = $(this).find('descripcionTipoCotizacion').text();
        obj.codigoPuerto = parseInt($(this).find('codigoPuerto').text());
        obj.descripcionPuerto = $(this).find('descripcionPuerto').text();
        obj.codigoProducto = parseInt($(this).find('codigoProducto').text());
        obj.descripcionProducto = $(this).find('descripcionProducto').text();
        obj.valor = parseInt($(this).find('valor').text());
        obj.observacion = $(this).find('observacion').text();
        cotizaciones.push(obj);
    });
    var resultadoDiv = '';
    $(cotizaciones).each(function () {
        resultadoDiv += '<div>Fecha Cotizacion: ' + this.fechaCotizacion + '</div>';
        resultadoDiv += '<div>Codigo Moneda: ' + this.codigoMoneda + '</div>';
        resultadoDiv += '<div>descripcionMoneda: ' + this.descripcionMoneda + '</div>';
        resultadoDiv += '<div>codigoTipoCotizacion: ' + this.codigoTipoCotizacion + '</div>';
        resultadoDiv += '<div>descripcionTipoCotizacion: ' + this.descripcionTipoCotizacion + '</div>';
        resultadoDiv += '<div>codigoPuerto: ' + this.codigoPuerto + '</div>';
        resultadoDiv += '<div>descripcionPuerto: ' + this.descripcionPuerto + '</div>';
        resultadoDiv += '<div>codigoProducto: ' + this.codigoProducto + '</div>';
        resultadoDiv += '<div>descripcionProducto: ' + this.descripcionProducto + '</div>';
        resultadoDiv += '<div>valor: ' + this.valor + '</div>';
        resultadoDiv += '<div>observacion: ' + this.observacion + '</div>';
        resultadoDiv += '<br/>' + '<br/>';

    });
    $('#response').html(resultadoDiv);
    cotizaciones = [];
}
function CargarParametroEntrada(pCodigoTipoCotizacion, pCodigoTipoCliente, pFechaDesde, pFechaHasta, pProductos, pPuertos, pMonedas) {

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
$(document).ready(function () {
    jQuery.support.cors = true;
    $("#btnDetalleCotizacion").click(function (event) {
        $.ajax({
            type: "POST",
            url: wsUrl,
            contentType: "application/xml; charset=utf-8", //"text/xml",
            dataType: "xml",
            crossDomain: true,
            xhrFields: {
                // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
                // This can be used to set the 'withCredentials' property.
                // Set the value to 'true' if you'd like to pass cookies to the server.
                // If this is enabled, your server must respond with the header
                // 'Access-Control-Allow-Credentials: true'.
                withCredentials: true
            },
            data: CargarParametroEntrada(1,14,'03032015','16032015',1,'',''),
            success: processSuccessDetalleCotizacion,
            error: processError
        });

    });
    $("#btnCallWebService").click(function (event) {

        var soapRequest = '<?xml version="1.0" encoding="utf-8"?>';
        soapRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.afascl.coop/servicios" >';
        soapRequest += '<soapenv:Header/>';
        soapRequest += '<soapenv:Body>';
        soapRequest += '<ser:consultaCotizacionProductoPuertoMoneda>';
        soapRequest += '<codigoTipoCotizacion>1</codigoTipoCotizacion>';
        soapRequest += '<codigoTipoCliente>15</codigoTipoCliente>';
        soapRequest += '<fechaDesde>03032015</fechaDesde>';
        //soapRequest += '<fechaHasta></fechaHasta>';
        //soapRequest += '<productos></productos>';
        //soapRequest += '<puertos></puertos>';
        //soapRequest += '<monedas></monedas>';
        soapRequest += '</ser:consultaCotizacionProductoPuertoMoneda>';
        soapRequest += '</soapenv:Body>';
        soapRequest += '</soapenv:Envelope>';

        $.ajax({
            type: "POST",
            url: wsUrl,
            contentType: "application/xml; charset=utf-8", //"text/xml",
            dataType: "xml",
            crossDomain: true,
            xhrFields: {
                // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
                // This can be used to set the 'withCredentials' property.
                // Set the value to 'true' if you'd like to pass cookies to the server.
                // If this is enabled, your server must respond with the header
                // 'Access-Control-Allow-Credentials: true'.
                withCredentials: true
            },
            data: soapRequest,
            success: processSuccess,
            error: processError
        });

    });
});

function processSuccessDetalleCotizacion(data, status, req) {
    if (status == "success") {
      // alert(req.responseText);
  //('#response').html(req.responseText);
         obtenerObjetoJavascript(req.responseText);
    }

    //obtenerObjetoJavascript(req.responseText);
}
function processSuccess(data, status, req) {
    if (status == "success")
    //alert(req.responseText);
    //$('#txtResultado').val(req.responseText);
        obtenerObjetoJavascript(req.responseText);
}
function processError(data, status, req) {
    alert('Error');
}
