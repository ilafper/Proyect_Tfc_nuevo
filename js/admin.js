$(document).ready(function () {
  const API_URL = 'https://api-tfc-five.vercel.app/api';
  let mangasData = [];

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario) {
    $('#nombreUsuario').text(usuario.nombre);
  }

  // Menu hamburguesa mobile
  $('#btnMenuHamburguesa').on('click', function () {
    $('#sidebarMobile').addClass('show');

    $('body').css('overflow', 'hidden');
  });

  $('#btnCerrarSidebar').on('click', function () {
    $('#sidebarMobile').removeClass('show');

    $('body').css('overflow', 'auto');
  });

  $('#avatarBtn').on('click', function (e) {
    e.stopPropagation();
    $('#modalPerfil').toggleClass('show');
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('#avatarBtn, #modalPerfil').length) {
      $('#modalPerfil').removeClass('show');
    }
  });

  $('#modalPerfil').on('click', function (e) {
    e.stopPropagation();
  });

  $('.logout').click(function () {
    localStorage.removeItem('usuario');
    window.location.href = "../html/login.html";
  });



  // Función para mostrar modal de mensaje.
  function mostrarModalMensaje(titulo, mensaje, tipo) {
    const iconoSuccess = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#10b981" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
    const iconoError = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#ef4444" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;

    $('#modalMensajeTitulo').text(titulo);
    $('#modalMensajeTexto').text(mensaje);
    $('#modalMensajeIcono').html(tipo === 'success' ? iconoSuccess : iconoError);
    $('#modalMensaje').addClass('show');
  }

  function cargarMangas() {
    $.ajax({
      url: `${API_URL}/mangas`,
      method: 'GET',
      success: function (mangas) {
        mangasData = mangas;
        mostrarTablaMangas(mangas);
      },

      error: function (err) {
        console.error("Error al cargar mangas:", err);
        $('#mangasTableBody').html('<tr><td colspan="7" style="text-align:center; color:#ef4444;">Error al cargar mangas</td></tr>');
      }
    });
  }



  function mostrarTablaMangas(mangas) {
    const tablaMangas = $('#mangasTableBody');
    tablaMangas.empty();

    if (mangas.length === 0) {
      tbody.html('<tr><td colspan="7" style="text-align:center;">No hay mangas registrados</td></tr>');
      return;
    }

    for (let i = 0; i < mangas.length; i++) {
      const manga = mangas[i];

      const generos = Array.isArray(manga.genero) ? manga.genero : [];

      let generosHTML = '';

      // Crear HTML de géneros (máximo 2)
      for (let j = 0; j < generos.length && j < 2; j++) {
        generosHTML += `<span class="genero-tag">${generos[j]}</span>`;
      }

      const extraGeneros = generos.length > 2 ? `<span class="genero-tag">+${generos.length - 2}</span>` : '';

      const estadoClass = manga.estado === 'En publicación' ? 'publicacion' : manga.estado === 'Finalizado' ? 'finalizado' : 'pausado';


      const mangaJSON = JSON.stringify(manga).replace(/'/g, "&#39;").replace(/"/g, "&quot;");

      //cada manga tabla 
      const cada_fila_manga = `
        <tr>
          <td data-manga='${manga._id}'><img src="../src/${manga.imagen}" alt="${manga.nombre}" class="manga-img"></td>
          <td><strong>${manga.nombre}</strong></td>
          <td>${manga.autor}</td>
          <td><div class="manga-generos">${generosHTML}${extraGeneros}</div></td>
          <td>${manga.volumenes || 0}</td>
          <td><span class="estado-badge ${estadoClass}">${manga.estado}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-action btn-editar" data-datos='${mangaJSON}' data-id='${manga._id}'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/>
                </svg>
              </button>

              <button data-ideliminar='${manga._id}' data-ideliminar='${manga.nombre}'   class="btn-action btn-eliminar" data-id="${manga._id}" data-nombre="${manga.nombre}">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;



      tablaMangas.append(cada_fila_manga);
      //console.log(cada_fila_manga);

    }
  }

  $('#buscarManga').on('input', function () {
    const termino = $(this).val().toLowerCase();
    const mangasFiltrados = [];

    for (let i = 0; i < mangasData.length; i++) {
      const manga = mangasData[i];
      if (manga.nombre.toLowerCase().includes(termino) ||
        manga.autor.toLowerCase().includes(termino)) {
        mangasFiltrados.push(manga);
      }
    }

    mostrarTablaMangas(mangasFiltrados);
  });

  $('#btnCerrarModal').click(function () {
    console.log("clickck");

    $('#modalManga').removeClass('show');
  });


  //modal creacion nuevo tomo
  $('#btnNuevoManga').click(function () {
    $('#modalManga').toggleClass('show');
  });



  $(document).on('click', '#btnAddTemporada', function () {
    //longitud actual de temporadas
    const numTemporadas = $('.temporada-item').length;
    //objeto temporada nueva

    const nuevaTemporada = `
      <div class="temporada-item">
        <div class="temporada-header">
          <strong>Tomo ${numTemporadas + 1}</strong>
          <button type="button" class="btn-remove-temporada">Eliminar</button>
        </div>
        <div class="temporada-inputs">
          <input type="number" class="tomo-numero" value="${numTemporadas + 1}" placeholder="Nº Tomo" min="1" required>
          <input type="number" class="tomo-capitulos" placeholder="Capítulos (ej: 1,2,3,4,5)" required>
        </div>
      </div>
    `;


    $(this).before(nuevaTemporada);
  });

  //eliminar temporada 
  $(document).on('click', '.btn-remove-temporada', function () {
    $(this).closest('.temporada-item').remove();
  });




  //guardar manga Nuevo
  $('.guardarManga').click(async function (e) {
    e.preventDefault();

    // 1. Obtener la imagen
    const imagenInput = document.getElementById('imagenManga');
    if (!imagenInput.files || !imagenInput.files[0]) {
      mostrarModalMensaje('Error', 'Debes seleccionar una imagen de portada', 'error');
      return;
    }

    // 2. Validar que sea una imagen
    const file = imagenInput.files[0];
    if (!file.type.startsWith('image/')) {
      mostrarModalMensaje('Error', 'El archivo debe ser una imagen', 'error');
      return;
    }

    // 3. Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      mostrarModalMensaje('Error', 'La imagen es demasiado grande. Máximo 5MB', 'error');
      return;
    }

    // 4. Tu código existente para recoger temporadas, géneros, etc...
    const temporadas = [];
    let totalCapitulos = 0;
    let totalVolumenes = 0;
    let numeroCapituloActual = 1;

    const temporadasTotales = $('.temporada-item');

    for (let i = 0; i < temporadasTotales.length; i++) {
      const item = temporadasTotales[i];
      const tomo = parseInt($(item).find('.tomo-numero').val());
      const capitulosInput = $(item).find('.tomo-capitulos').val();
      const cantidadCapitulos = parseInt(capitulosInput);
      const capitulosArray = [];

      for (let j = 0; j < cantidadCapitulos; j++) {
        capitulosArray.push(numeroCapituloActual + j);
      }

      numeroCapituloActual += cantidadCapitulos;
      totalCapitulos += cantidadCapitulos;
      totalVolumenes++;

      const tomoValido = !isNaN(tomo) && tomo > 0 ? tomo : i + 1;

      temporadas.push({
        tomo: tomoValido,
        capitulos: capitulosArray
      });
    }

    if (totalVolumenes === 0) {
      mostrarModalMensaje('Error', 'Debes agregar al menos un tomo', 'error');
      return;
    }

    const generos = [];
    const checkboxesGeneros = $('input[name="generos"]:checked');
    for (let i = 0; i < checkboxesGeneros.length; i++) {
      generos.push(checkboxesGeneros[i].value);
    }

    if (generos.length === 0) {
      mostrarModalMensaje('Error', 'Debes seleccionar al menos un género', 'error');
      return;
    }

    const nombre = $('#nombre').val().trim();
    const autor = $('#autor').val().trim();
    const sinopsis = $('#sinopsis').val().trim();

    if (!nombre || !autor || !sinopsis) {
      mostrarModalMensaje('Error', 'Faltan campos obligatorios', 'error');
      return;
    }


    //const formData = new FormData();

    // Agregar todos los otros datos
    formData.append('nombre', nombre);
    formData.append('autor', autor);
    formData.append('sinopsis', sinopsis);
    formData.append('volumenes', totalVolumenes);
    formData.append('capitulos', totalCapitulos);
    formData.append('editorial', $('#editorial').val().trim());
    formData.append('demografia', $('#demografia').val());
    formData.append('estado', $('#estado').val());
    formData.append('tipo', $('#tipo').val());
    formData.append('genero', JSON.stringify(generos));
    formData.append('temporadas', JSON.stringify(temporadas));

    console.log('Enviando manga con imagen:', {
      nombre: nombre,
      imagen: imagenInput.files[0].name,
      tamaño: (imagenInput.files[0].size / 1024).toFixed(2) + ' KB'
    });

    try {
      // 6. Enviar con FormData (NO con JSON.stringify)
      const response = await $.ajax({
        type: 'POST',
        url: `${API_URL}/nuevomanga`,
        data: formData,
        processData: false,
        contentType: false,
        cache: false
      });

      console.log('Respuesta del servidor:', response);

      // Cerrar el modal
      $('#modalManga').removeClass('show');

      // Mostrar mensaje de éxito
      mostrarModalMensaje('Éxito', 'Manga creado correctamente', 'success');


      cargarMangas();

    } catch (error) {
      console.error('Error al guardar manga:', error);

      let mensajeError = 'Error al guardar el manga';
      if (error.responseJSON && error.responseJSON.mensaje) {
        mensajeError = error.responseJSON.mensaje;
      } else if (error.statusText) {
        mensajeError = error.statusText;
      }

      mostrarModalMensaje('Error', mensajeError, 'error');
    }
  });

  //eliminar


  // Eliminar manga
  $(document).on('click', '.btn-eliminar', function () {
    //obtener id del manga a eliminar
    const mangaId = $(this).attr('data-ideliminar');
    const mangaNombre = $(this).data('nombre');

    console.log("ID a eliminar:", mangaId);
    console.log("Nombre:", mangaNombre);

    // Guardar los datos en el modal de confirmación
    $('#eliminarMangaId').val(mangaId);
    $('#eliminarMangaNombre').text(mangaNombre);
    $('#modalEliminar').addClass('show');
  });

  // Confirmar eliminación
  $(document).on('click', '#btnConfirmarEliminar', async function () {
    const mangaId = $('#eliminarMangaId').val();
    const mangaNombre = $('#eliminarMangaNombre').text();
    console.log("mangaEliminar:");
    console.log(mangaId);

    console.log("Confirmando eliminación de:", mangaId, mangaNombre);

    if (!mangaId) {
      mostrarModalMensaje('Error', 'No se encontró el ID del manga', 'error');
      return;
    }

    try {

      const response = await $.ajax({
        type: 'DELETE',
        url: `${API_URL}/borrarmanga/${mangaId}`,
        contentType: 'application/json',
        dataType: 'json'
      });

      console.log('Respuesta de eliminación:', response);

      // Cerrar modal de confirmación
      $('#modalEliminar').removeClass('show');


      mostrarModalMensaje('Éxito', `Manga "${mangaNombre}" eliminado correctamente`, 'success');


      cargarMangas();


    } catch (error) {
      console.error('Error al eliminar manga:', error);
      console.error('Error detallado:', error.responseJSON);

      let mensajeError = 'Error al eliminar el manga';
      if (error.responseJSON && error.responseJSON.mensaje) {
        mensajeError = error.responseJSON.mensaje;
      } else if (error.responseJSON && error.responseJSON.error) {
        mensajeError = error.responseJSON.error;
      } else if (error.statusText) {
        mensajeError = error.statusText;
      }

      // Cerrar modal de confirmación
      $('#modalEliminar').removeClass('show');

      mostrarModalMensaje('Error', mensajeError, 'error');
    }
  });

  // Función para mostrar modal de mensaje
  function mostrarModalMensaje(titulo, mensaje, tipo) {


    const icono_bien = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#10b981" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
    const icono_mal = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#ef4444" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;

    $('#modalMensajeTitulo').text(titulo);
    $('#modalMensajeTexto').text(mensaje);
    $('#modalMensajeIcono').html(tipo === 'success' ? icono_bien : icono_mal);
    $('#modalMensaje').addClass('show');
  }

  //eliminar. editar
  $(document).on('click', '.btn-cancelar', function () {
    console.log("cancelar Modal");

    $('#modalEliminar').removeClass('show');
    $('#modalEditar').removeClass('show');
  });





  

  

  // Evento para agregar nueva temporada en edición
  $(document).on('click', '#btnAddTemporadaEditar', function () {
    const numTemporadas = $('#temporadasContainerEditar .temporada-item').length;
    const nuevoTomoNum = numTemporadas + 1;

    const nuevaTemporada = `
        <div class="temporada-item">
            <div class="temporada-header">
                <strong>Tomo ${nuevoTomoNum}</strong>
                <button type="button" class="btn-remove-temporada">Eliminar</button>
            </div>
            <div class="temporada-inputs">
                <input type="number" class="tomo-numero" value="${nuevoTomoNum}" placeholder="Nº Tomo" min="1" required>
                <input type="number" class="tomo-capitulos-cantidad" placeholder="Cantidad de capítulos" min="1" required>
                <small class="tomo-descripcion"></small>
            </div>
        </div>
    `;

    // Insertar antes del botón "Agregar Tomo"
    $(this).before(nuevaTemporada);

    // Actualizar contadores
    actualizarContadoresEdicion();
  });

  // Evento para eliminar temporada en edición
  $(document).on('click', '#temporadasContainerEditar .btn-remove-temporada', function () {
    $(this).closest('.temporada-item').remove();

    // Reordenar números de tomo
    $('#temporadasContainerEditar .temporada-item').each(function (index) {
      $(this).find('.tomo-numero').val(index + 1);
      $(this).find('.temporada-header strong').text(`Tomo ${index + 1}`);
    });

    // Actualizar contadores
    actualizarContadoresEdicion();
  });

  // Función para actualizar contadores cuando cambian las temporadas - VERSIÓN SIMPLIFICADA
  function actualizarContadoresEdicion() {
    const temporadas = $('#temporadasContainerEditar .temporada-item');
    let totalCapitulos = 0;

    temporadas.each(function () {
      const cantidad = parseInt($(this).find('.tomo-capitulos-cantidad').val()) || 0;
      totalCapitulos += cantidad;
    });

    $('#volumenesEditar').val(temporadas.length);
    $('#capitulosEditar').val(totalCapitulos);
  }

  // Actualizar contadores cuando se modifica el campo de capítulos
  $(document).on('input', '#temporadasContainerEditar .tomo-capitulos-cantidad', function () {
    actualizarContadoresEdicion();
  });

  // Cerrar modal editar
  $('#btnCerrarModalEditar, #btnCancelarEditar').click(function () {
    $('#modalEditar').removeClass('show');
  });

 $(document).on('click', '.btn-editar', function () {
    console.log("editar modal click");

    const datosJSON = $(this).attr('data-datos');
    console.log(datosJSON);

    try {
      const mangaEditar = JSON.parse(datosJSON);
      console.log("Manga a editar:", mangaEditar);

      // rellener
      $('#mangaIdEditar').val(mangaEditar._id);
      $('#nombreEditar').val(mangaEditar.nombre || '');
      $('#autorEditar').val(mangaEditar.autor || '');
      $('#tipoEditar').val(mangaEditar.tipo || 'manga');
      $('#estadoEditar').val(mangaEditar.estado || 'En publicación');
      $('#sinopsisEditar').val(mangaEditar.sinopsis || '');
      $('#editorialEditar').val(mangaEditar.editorial || '');
      $('#demografiaEditar').val(mangaEditar.demografia || 'Shonen');

      
      $('input[name="generosEditar"]').prop('checked', false);
      if (mangaEditar.genero && Array.isArray(mangaEditar.genero)) {
        mangaEditar.genero.forEach(genero => {
          $(`input[name="generosEditar"][value="${genero}"]`).prop('checked', true);
        });
      }

      // 3. CARGAR TEMPORADAS - VERSIÓN CON CANTIDAD
      cargarTemporadasEnEdicion(mangaEditar);

      // 4. Mostrar el modal
      $('#modalEditar').addClass('show');

    } catch (error) {
      console.error("Error al parsear JSON:", error);
      mostrarModalMensaje('Error', 'No se pudieron cargar los datos', 'error');
    }
  });

 

  // Actualizar contadores cuando se modifica el campo de capítulos
  $(document).on('input', '#temporadasContainerEditar .tomo-capitulos', function () {
    actualizarContadoresEdicion();
  });

  // Cerrar modal editar
  $('#btnCerrarModalEditar, #btnCancelarEditar').click(function () {
    $('#modalEditar').removeClass('show');
  });

  // Cerrar modal editar
  $('#btnCerrarModalEditar, #btnCancelarEditar').click(function () {
    $('#modalEditar').removeClass('show');
  });



  // Cerrar modal de mensaje
  $(document).on('click', '#btnCerrarMensaje', function () {
    $('#modalMensaje').removeClass('show');
  });

  cargarMangas();







  $(document).on('click', '.btn-editar', function () {
    console.log("editar modal click");

    const datosJSON = $(this).attr('data-datos');
    console.log(datosJSON);

    try {
        const mangaEditar = JSON.parse(datosJSON);
        console.log("Manga a editar:", mangaEditar);

        // 1. Llenar los campos básicos
        $('#mangaIdEditar').val(mangaEditar._id);
        $('#nombreEditar').val(mangaEditar.nombre || '');
        $('#autorEditar').val(mangaEditar.autor || '');
        $('#tipoEditar').val(mangaEditar.tipo || 'manga');
        $('#estadoEditar').val(mangaEditar.estado || 'En publicación');
        $('#sinopsisEditar').val(mangaEditar.sinopsis || '');
        $('#editorialEditar').val(mangaEditar.editorial || '');
        $('#demografiaEditar').val(mangaEditar.demografia || 'Shonen');

        // 2. Géneros
        $('input[name="generosEditar"]').prop('checked', false);
        if (mangaEditar.genero && Array.isArray(mangaEditar.genero)) {
            mangaEditar.genero.forEach(genero => {
                $(`input[name="generosEditar"][value="${genero}"]`).prop('checked', true);
            });
        }

        // 3. Cargar temporadas
        cargarTemporadasEnEdicion(mangaEditar);

        // 4. Mostrar el modal
        $('#modalEditar').addClass('show');

    } catch (error) {
        console.error("Error al parsear JSON:", error);
        mostrarModalMensaje('Error', 'No se pudieron cargar los datos', 'error');
    }
});

// Función para cargar temporadas (ya la tienes)
function cargarTemporadasEnEdicion(manga) {
    $('#temporadasContainerEditar').empty();

    if (manga.temporadas && Array.isArray(manga.temporadas) && manga.temporadas.length > 0) {
        manga.temporadas.forEach((temporada, index) => {
            const tomoNum = temporada.tomo || (index + 1);
            let cantidadCapitulos = 0;
            
            if (Array.isArray(temporada.capitulos)) {
                cantidadCapitulos = temporada.capitulos.length;
            } else if (typeof temporada.capitulos === 'number') {
                cantidadCapitulos = temporada.capitulos;
            }

            agregarTemporadaEditar(tomoNum, cantidadCapitulos);
        });
    } else {
        const volumenes = manga.volumenes || 1;
        const capitulosTotales = manga.capitulos || 10;
        const capitulosPorVolumen = Math.max(1, Math.floor(capitulosTotales / volumenes));

        for (let i = 0; i < volumenes; i++) {
            const tomoNum = i + 1;
            let capitulosEsteTomo = capitulosPorVolumen;
            
            if (i === volumenes - 1) {
                capitulosEsteTomo = capitulosTotales - (capitulosPorVolumen * (volumenes - 1));
            }
            
            agregarTemporadaEditar(tomoNum, capitulosEsteTomo);
        }
    }
    
    actualizarContadoresEditar();
}

// Función para agregar una temporada en edición
function agregarTemporadaEditar(tomoNum, capitulos) {
    const temporadaHTML = `
        <div class="temporada-item">
            <div class="temporada-header">
                <strong>Tomo ${tomoNum}</strong>
                <button type="button" class="btn-remove-temporada">Eliminar</button>
            </div>
            <div class="temporada-inputs">
                <input type="number" class="tomo-numero" value="${tomoNum}" placeholder="Nº Tomo" min="1" required>
                <input type="number" class="tomo-capitulos-cantidad" value="${capitulos}" 
                       placeholder="Cantidad de capítulos" min="1" required>
            </div>
        </div>
    `;
    
    // Insertar antes del botón de agregar
    $('#btnAddTemporadaEditar').before(temporadaHTML);
}

// Evento para el botón "Agregar Tomo" en edición
$(document).on('click', '#btnAddTemporadaEditar', function() {
    const totalTemporadas = $('.temporada-item').length;
    const nuevoNumero = totalTemporadas + 1;
    agregarTemporadaEditar(nuevoNumero, 10);
    actualizarContadoresEditar();
});

// Eliminar temporada
$(document).on('click', '.btn-remove-temporada', function() {
    $(this).closest('.temporada-item').remove();
    // Renumerar los tomos después de eliminar
    $('.temporada-item').each(function(index) {
        const nuevoNumero = index + 1;
        $(this).find('.tomo-numero').val(nuevoNumero);
        $(this).find('.temporada-header strong').text(`Tomo ${nuevoNumero}`);
    });
    actualizarContadoresEditar();
});

// Actualizar contadores de volúmenes y capítulos
function actualizarContadoresEditar() {
    const totalVolumenes = $('.temporada-item').length;
    let totalCapitulos = 0;
    
    $('.tomo-capitulos-cantidad').each(function() {
        const valor = parseInt($(this).val()) || 0;
        totalCapitulos += valor;
    });
    
    $('#volumenesEditar').val(totalVolumenes);
    $('#capitulosEditar').val(totalCapitulos);
}

// Actualizar contadores cuando cambian los inputs
$(document).on('input', '.tomo-capitulos-cantidad', function() {
    actualizarContadoresEditar();
});

// ========== ENVÍO DEL FORMULARIO DE EDICIÓN ==========
$(document).on('submit', '#formMangaEditar', function(e) {
    e.preventDefault();
    console.log("Enviando formulario de edición");

    // 1. Recopilar datos básicos
    const mangaId = $('#mangaIdEditar').val();
    const datosActualizados = {
        nombre: $('#nombreEditar').val().trim(),
        autor: $('#autorEditar').val().trim(),
        tipo: $('#tipoEditar').val(),
        estado: $('#estadoEditar').val(),
        sinopsis: $('#sinopsisEditar').val().trim(),
        editorial: $('#editorialEditar').val().trim(),
        demografia: $('#demografiaEditar').val()
    };

    // 2. Recopilar géneros
    const generosSeleccionados = [];
    $('input[name="generosEditar"]:checked').each(function() {
        generosSeleccionados.push($(this).val());
    });
    datosActualizados.genero = generosSeleccionados;

    // 3. Recopilar temporadas
    const temporadas = [];
    $('.temporada-item').each(function(index) {
        const tomoNum = $(this).find('.tomo-numero').val();
        const capitulosCantidad = $(this).find('.tomo-capitulos-cantidad').val();

        if (tomoNum && capitulosCantidad) {
            temporadas.push({
                tomo: parseInt(tomoNum),
                capitulos: parseInt(capitulosCantidad)
            });
        }
    });
    
    datosActualizados.temporadas = temporadas;
    datosActualizados.volumenes = temporadas.length;
    datosActualizados.capitulos = temporadas.reduce((total, temp) => total + (temp.capitulos || 0), 0);

    // 4. Enviar al backend
    enviarActualizacionManga(mangaId, datosActualizados);
});

// Función para enviar la actualización al backend
function enviarActualizacionManga(mangaId, datosActualizados) {
    // Mostrar loading
    $('.guardarMangaEditar').prop('disabled', true).html(`
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
            </path>
        </svg>
        Guardando...
    `);

    // Enviar como JSON
    fetch(`/api/mangas/${mangaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta de actualización:", data);

        if (data.success) {
            // Cerrar modal
            $('#modalEditar').removeClass('show');
            
            // Mostrar mensaje de éxito
            mostrarModalMensaje('Éxito', 'Manga actualizado correctamente', 'success');
            
            // Recargar la lista de mangas
            cargarMangas();
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    })
    .catch(error => {
        console.error("Error al actualizar:", error);
        mostrarModalMensaje('Error', `No se pudo actualizar: ${error.message}`, 'error');
    })
    .finally(() => {
        // Restaurar botón
        $('.guardarMangaEditar').prop('disabled', false).html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3zM6 6h9v4H6V6z"/>
            </svg>
            Guardar cambios
        `);
    });
}

// Cerrar modal de edición
$(document).on('click', '#btnCerrarModalEditar, #btnCancelarEditar', function() {
    $('#modalEditar').removeClass('show');
});

























});