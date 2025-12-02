/*cambiar entre login y registro */
function cambiar(formId) {
    document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    document.getElementById(formId).classList.add('active');
    document.querySelector(`.tab[onclick*="${formId}"]`).classList.add('active');
}

$(document).ready(function () {
    // Toggle mostrar/ocultar contraseña
    $('.toggle-password').on('click', function () {
        console.log("se pulso");
        
        const targetId = $(this).data('target');
        const input = $('#' + targetId);
        const eyeIcon = $(this).find('.eye-icon');
        const eyeOffIcon = $(this).find('.eye-off-icon');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            eyeIcon.hide();
            eyeOffIcon.show();

        } else {
            input.attr('type', 'password');
            eyeIcon.show();
            eyeOffIcon.hide();
        }
    });

    //iniciar sesión
    $('.checklogin').click(async function (e) {
        e.preventDefault();
        //valores del login.
        let nombre = $('#nombre').val().trim();
        let password = $('#password').val().trim();


        console.log("nombre introducido", nombre);
        console.log("contraseña",password);
        
        
        try {
            const response = await $.ajax({
                type: 'POST',
                url: 'https://api-tfc-five.vercel.app/api/checkLogin',
                contentType: 'application/json',
                data: JSON.stringify({ nombre, password })
            });
            
            if (response.usuario.rol == "user") {
                console.log("no tiene derechos");
                
                window.location.href = "../html/home.html";
            } else if (response.usuario.rol == "admin") {
                console.log("tiene derechos");
                window.location.href = "../html/admin.html";
            }

            localStorage.setItem('usuario', JSON.stringify(response.usuario));

        } catch (error) {
            if (error.status === 401) {
                alert("Nombre o contraseña incorrecta.");
            } else {
                alert("Error en el servidor, intenta más tarde.");
            }
        }
    });
    //nuevo usuario







    $('.botonUni').click(async function (e) {
        e.preventDefault();

        const nombre = $('#nuevo_nombre').val().trim();
        const email = $('#email_nuevo').val().trim();
        const password1 = $('#contresena1').val();
        const password2 = $('#contrasena2').val();
        console.log(nombre);
        console.log(email);
        console.log(password1);
        console.log(password2);

        

        if (!nombre || !email || !password1 || !password2) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (password1 !== password2) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await $.ajax({
                type: 'POST',
                url: 'https://api-tfc-five.vercel.app/api/registrarse',
                contentType: 'application/json',
                data: JSON.stringify({ nombre, email, password1 })
            });

            alert(response.mensaje);

            if (response.success) {
                cambiar('login');
            }

        } catch (error) {
            alert(error.responseJSON?.mensaje || "Error en el servidor");
        }
    });
});