$(document).ready(function () {
	// Define if its device is a mobile
	if (navigator.userAgent.match(/(Mobile|iPhone|iPod|iPad|Android|BlackBerry)/)) {
		document.isIndex = true;
		document.addEventListener("deviceready", mobileEventsHandler, false);
	}

    var isVolverIndex = true;
    if (!localStorage.getItem("storageTelefono")) {
        isVolverIndex = false;
    }
    if (isVolverIndex) {
        window.location.href = "index.html";
    } else {
		ActualizarAltoFondoBloqueo();
        OcultarDivBloqueo();
    }
});

function onclickIngresarTelefono() {
    if (!$.trim($('#txtTelefonoArea').val()).length || !$.trim($('#txtTelefono').val()).length) { // zero-length string AFTER a trim
		alert('Existe un error en la aplicación. Contáctese con su proveedor.');
    } else {
        var varTelefono = $('#txtTelefonoArea').val() + $('#txtTelefono').val();
        if (varTelefono != '') {
            if (varTelefono.length == 10) {
                funGuardarTelefono(varTelefono);
            } else {
                alert('Formato del número incorrecto');
            }
        }
    }
}

function justNumbers(e) {
    var key = window.Event ? e.which : e.keyCode;
	return (key >= 48 && key <= 57);
}