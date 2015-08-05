var pushNotification;

function infoRegistracion() {
    this.uuid = '';
    this.type = ''; // "gcm" (Android), "apn" (iOS) y "mpn" (Windows Phone)
    this.regid = '';
    this.fecha = '';
    this.platform = '';
}
var objDatosTelefono = null;

function LlamarFuncionRegistracionTelefono(pUrlCargaDatosTel) {
    $.ajax({
        url: pUrlCargaDatosTel,
        type: 'GET',
        data: {},
        success: function (data) {
            //  alert(data);
        },
        error: function (e) {
			processError('', 7000, '');
        }
    });
}

function onDeviceReady() {
    //alert('onDeviceReady');
    objDatosTelefono = new infoRegistracion();
    pushNotification = window.plugins.pushNotification;
    objDatosTelefono.platform = device.platform;

    // Depending on the device, a few examples are:
    //   - "Android"
    //   - "iOS"
    //   - "WinCE"
    if (device.platform == 'android' || device.platform == 'Android') {
        try {
            pushNotification.register(successHandler, errorHandler, {
                "senderID": "347764234854",
                "ecb": "onNotification"
            });
        } catch (err) {
			processError('', 6000, '');
        }
    } else if (device.platform == 'iOS') {
        try {
            pushNotification.register(tokenHandler, errorHandler, {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "onNotificationAPN"
            });
        } catch (err) {
			processError('', 6000, '');
        }
    } else if (device.platform == 'WinCE' || device.platform == 'Win32NT') {
        var channelName = 'AFASCL.AFAMvil';
        try {
            pushNotification.register(
                channelHandler,
                errorHandler, {
                    "channelName": channelName,
                    "ecb": "onNotificationWP8",
                    "uccb": "channelHandler",
                    "errcb": "wpnErrorHandler"
                });
        } catch (err) {
			processError('', 6000, '');
        }
    }
    objDatosTelefono.uuid = device.uuid;
    //alert(device.platform);
    localStorage.setItem('storagePlatform', device.platform);

	document.target = { 'isIndex': true };
	mobileEventsHandler(document);

	CargaDeLosDatosPrevioTelefono();
}

function successHandler(result) {
    //  alert('Callback Success! Result = '+result);
}

function errorHandler(error) {
	processError('', 6000, '');
}

function onNotification(e) {
	//alert('onNotification');
	switch (e.event) {
	case 'registered':
		if (e.regid.length > 0) {
			objDatosTelefono.regid = e.regid;
			objDatosTelefono.type = 'gcm';
			var urlCargaDatosTel = wsUrlRegistracionTelefono + objDatosTelefono.uuid + '/' + objDatosTelefono.type + '/' + objDatosTelefono.regid;

			LlamarFuncionRegistracionTelefono(urlCargaDatosTel);
		}
		break;

	case 'message':
		if (e.message.length > 0) {
			CargarVentanaAlerta(e.payload.title, e.message);
		}
		break;

	case 'error':
		//alert('Error al registrar el dispositivo con Android.');
		processError('', 6000, '');
		break;

	default:
		//alert('Error al registrar el dispositivo con Android.');
		processError('', 6000, '');
	}
}

function onNotificationAPN(event) {
    if (event.body && event.body.length > 0) {
        CargarVentanaAlerta(event.title, event.body);
    }
    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }
    if (event.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

function tokenHandler(result) {
	// Your iOS push server needs to know the token before it can push to this device
	// here is where you might want to send it the token for later use.
	//alert('device token = ' + result);
	objDatosTelefono.regid = result;
	objDatosTelefono.type = 'apn';
	var urlCargaDatosTel = wsUrlRegistracionTelefono + objDatosTelefono.uuid + '/' + objDatosTelefono.type + '/' + objDatosTelefono.regid;

	LlamarFuncionRegistracionTelefono(urlCargaDatosTel);
}

function channelHandler(event) {   
    objDatosTelefono.regid = event.uri.replace(/\//g, 'ELLECKTRACODE');
    objDatosTelefono.type = 'mpn';
    var urlCargaDatosTel = wsUrlRegistracionTelefono + objDatosTelefono.uuid + '/' + objDatosTelefono.type + '/' + objDatosTelefono.regid;

	LlamarFuncionRegistracionTelefono(urlCargaDatosTel);
    //alert(event.uri);
}

// Handler MPNS notifications for WP8
function onNotificationWP8(e) {
	if (e.jsonContent && e.jsonContent["wp:Text2"].length > 0) {
		CargarVentanaAlerta(e.jsonContent["wp:Text1"], e.jsonContent["wp:Text2"]);
	}
	if (e.type == "toast" && e.jsonContent) {
		pushNotification.showToastNotification(successHandler, errorHandler, {
			"Title": e.jsonContent["wp:Text1"],
			"Subtitle": e.jsonContent["wp:Text2"],
			"NavigationUri": e.jsonContent["wp:Param"]
		});
	}
	if (e.type == "raw" && e.jsonContent && e.jsonContent.Body.length > 0) {
		//alert(JSON.stringify(e));
		CargarVentanaAlerta(JSON.stringify(e), e.jsonContent.Body);
	}
}

function wpnErrorHandler(error) {
    //alert('Error al registrar el dispositivo con Windows Phone.');
	processError('', 6000, '');
}
