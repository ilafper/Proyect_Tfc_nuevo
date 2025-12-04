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
    $('#sidebarOverlay').addClass('show');
    $('body').css('overflow', 'hidden');
  });

  $('#btnCerrarSidebar, #sidebarOverlay').on('click', function () {
    $('#sidebarMobile').removeClass('show');
    $('#sidebarOverlay').removeClass('show');
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


      const cada_fila_manga = `
        <tr>
          <td data-manga='${manga._id}'><img src="../src/frieren.png" alt="${manga.nombre}" class="manga-img"></td>
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




  //guardar manga
  $('.guardarManga').click(async function (e) {
    e.preventDefault();
    const temporadas = [];
    let totalCapitulos = 0;
    let totalVolumenes = 0;


    let numeroCapituloActual = 1; // Empezamos desde el capítulo 1

    // recoger cada temporada.
    const temporadasTotales = $('.temporada-item');
    console.log(temporadasTotales);

    for (let i = 0; i < temporadasTotales.length; i++) {
      const item = temporadasTotales[i];
      const tomo = parseInt($(item).find('.tomo-numero').val());
      const capitulosInput = $(item).find('.tomo-capitulos').val();

      // Convertir a número
      const cantidadCapitulos = parseInt(capitulosInput);

      // Crear array de capítulos secuencialmente
      const capitulosArray = [];


      for (let j = 0; j < cantidadCapitulos; j++) {
        capitulosArray.push(numeroCapituloActual + j);
      }

      console.log(capitulosArray);
      // Actualizar el contador para el próximo tomo
      numeroCapituloActual += cantidadCapitulos;

      totalCapitulos += cantidadCapitulos;
      totalVolumenes++;

      // Asegurar que el tomo tenga un valor válido
      const tomoValido = !isNaN(tomo) && tomo > 0 ? tomo : i + 1;

      temporadas.push({
        tomo: tomoValido,
        capitulos: capitulosArray
      });

      console.log(`Tomo ${tomoValido} (${cantidadCapitulos} caps):`, capitulosArray);
    }

    // Validar que haya al menos una temporada
    if (totalVolumenes === 0) {
      mostrarModalMensaje('Error', 'Debes agregar al menos un tomo', 'error');
      return;
    }

    const generos = [];
    const checkboxesGeneros = $('input[name="generos"]:checked');
    for (let i = 0; i < checkboxesGeneros.length; i++) {
      generos.push(checkboxesGeneros[i].value);
    }

    // Validar que haya al menos un género
    if (generos.length === 0) {
      mostrarModalMensaje('Error', 'Debes seleccionar al menos un género', 'error');
      return;
    }

    // campos obligatorios(autor, nombre, sinopsis)
    const nombre = $('#nombre').val().trim();
    const autor = $('#autor').val().trim();
    const sinopsis = $('#sinopsis').val().trim();

    if (!nombre) {
      mostrarModalMensaje('Error', 'El nombre del manga es obligatorio', 'error');
      return;
    }

    if (!autor) {
      mostrarModalMensaje('Error', 'El autor es obligatorio', 'error');
      return;
    }

    if (!sinopsis) {
      mostrarModalMensaje('Error', 'La sinopsis es obligatoria', 'error');
      return;
    }

    const mangaData = {
      nombre: nombre,
      autor: autor,
      genero: generos,
      sinopsis: sinopsis,
      volumenes: totalVolumenes,
      capitulos: totalCapitulos,
      editorial: $('#editorial').val().trim(),
      demografia: $('#demografia').val(),
      estado: $('#estado').val(),
      tipo: $('#tipo').val(),
      temporadas: temporadas
    };

    console.log('Datos del manga a guardar:', mangaData);

    try {
      const response = await $.ajax({
        type: 'POST',
        url: `${API_URL}/nuevomanga`,
        contentType: 'application/json',
        data: JSON.stringify(mangaData)
      });

      console.log('Respuesta del servidor:', response);

      // Cerrar el modal
      $('#modalManga').removeClass('show');

      // Mostrar mensaje de éxito
      mostrarModalMensaje('Éxito', 'Manga creado correctamente', 'success');

      // Recargar la lista de mangas
      cargarMangas();

      // Limpiar el formulario
      $('#formManga')[0].reset();

      // Limpiar temporadas
      $('.temporada-item').remove();

    } catch (error) {
      console.error('Error al guardar manga:', error);

      let mensajeError = 'Error al guardar el manga';
      if (error.responseJSON && error.responseJSON.mensaje) {
        mensajeError = error.responseJSON.mensaje;
      }

      mostrarModalMensaje('Error', mensajeError, 'error');
    }
  });



  // Eliminar manga - CORREGIDO
  $(document).on('click', '.btn-eliminar', function () {
    const mangaId = $(this).attr('data-ideliminar');  // Usamos attr() para obtener el ID
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

      // Mostrar mensaje de éxito
      mostrarModalMensaje('Éxito', `Manga "${mangaNombre}" eliminado correctamente`, 'success');

      // Recargar la lista de mangas después de 1 segundo
      setTimeout(() => {
        cargarMangas();
      }, 1000);

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

      // 3. CARGAR TEMPORADAS - VERSIÓN CON CANTIDAD
      cargarTemporadasEnEdicion(mangaEditar);

      // 4. Mostrar el modal
      $('#modalEditar').addClass('show');

    } catch (error) {
      console.error("Error al parsear JSON:", error);
      mostrarModalMensaje('Error', 'No se pudieron cargar los datos', 'error');
    }
  });

  // Función para cargar temporadas en el formulario de edición - VERSIÓN CON CANTIDAD
  function cargarTemporadasEnEdicion(manga) {
    // Limpiar el contenedor de temporadas
    $('#temporadasContainerEditar').empty();

    let totalVolumenes = 0;
    let totalCapitulos = 0;

    // Verificar si el manga tiene temporadas
    if (manga.temporadas && Array.isArray(manga.temporadas) && manga.temporadas.length > 0) {
      // Si tiene temporadas estructuradas
      manga.temporadas.forEach((temporada, index) => {
        const tomoNum = temporada.tomo || (index + 1);

        // Obtener la CANTIDAD de capítulos (no la lista)
        let cantidadCapitulos = 0;
        if (Array.isArray(temporada.capitulos)) {
          cantidadCapitulos = temporada.capitulos.length;
        } else if (typeof temporada.capitulos === 'number') {
          cantidadCapitulos = temporada.capitulos;
        }

        totalCapitulos += cantidadCapitulos;

        totalVolumenes++;

        // Crear HTML para esta temporada - mostrar solo la CANTIDAD
        const temporadaHTML = `
                <div class="temporada-item">
                    <div class="temporada-header">
                        <strong>Tomo ${tomoNum}</strong>
                        <button type="button" class="btn-remove-temporada">Eliminar</button>
                    </div>
                    <div class="temporada-inputs">
                        <input type="number" class="tomo-numero" value="${tomoNum}" placeholder="Nº Tomo" min="1" required>
                        <input type="number" class="tomo-capitulos-cantidad" value="${cantidadCapitulos}" 
                               placeholder="Cantidad de capítulos" min="1" required>
                        <small class="tomo-descripcion"></small>
                    </div>
                </div>
            `;

        $('#temporadasContainerEditar').append(temporadaHTML);
      });
    } else {
      // Si no tiene temporadas, crear basado en volúmenes y capítulos totales
      const volumenes = manga.volumenes || 1;
      const capitulosTotales = manga.capitulos || 10;
      const capitulosPorVolumen = Math.max(1, Math.floor(capitulosTotales / volumenes));

      for (let i = 0; i < volumenes; i++) {
        const tomoNum = i + 1;

        // Para el último tomo, ajustar para que sumen exactamente los capítulos totales
        let capitulosEsteTomo = capitulosPorVolumen;
        if (i === volumenes - 1) {
          capitulosEsteTomo = capitulosTotales - (capitulosPorVolumen * (volumenes - 1));
        }

        totalVolumenes++;
        totalCapitulos += capitulosEsteTomo;

        const temporadaHTML = `
                <div class="temporada-item">
                    <div class="temporada-header">
                        <strong>Tomo ${tomoNum}</strong>
                        <button type="button" class="btn-remove-temporada">Eliminar</button>
                    </div>
                    <div class="temporada-inputs">
                        <input type="number" class="tomo-numero" value="${tomoNum}" placeholder="Nº Tomo" min="1" required>
                        <input type="number" class="tomo-capitulos-cantidad" value="${capitulosEsteTomo}" placeholder="Cantidad de capítulos" min="1" required>
                    </div>
                </div>
            `;

        $('#temporadasContainerEditar').append(temporadaHTML);
      }
    }

    // Agregar botón para añadir más tomos
    $('#temporadasContainerEditar').append(`
        <button type="button" class="btn-add-temporada" id="btnAddTemporadaEditar">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Agregar Tomo
        </button>
    `);

    // Actualizar contadores
    $('#volumenesEditar').val(totalVolumenes);
    $('#capitulosEditar').val(totalCapitulos);
  }

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

  // Función para procesar la edición (para el botón "Guardar cambios")
  function procesarEdicionManga() {
    const temporadas = [];
    let totalCapitulos = 0;
    let totalVolumenes = 0;
    let numeroCapituloActual = 1; // Empezar desde el capítulo 1

    const temporadasTotales = $('#temporadasContainerEditar .temporada-item');

    temporadasTotales.each(function (index) {
      const tomo = parseInt($(this).find('.tomo-numero').val()) || (index + 1);
      const cantidadCapitulos = parseInt($(this).find('.tomo-capitulos-cantidad').val()) || 0;

      // Crear array de capítulos secuencialmente
      const capitulosArray = [];
      for (let j = 0; j < cantidadCapitulos; j++) {
        capitulosArray.push(numeroCapituloActual + j);
      }

      // Actualizar el contador para el próximo tomo
      numeroCapituloActual += cantidadCapitulos;

      totalCapitulos += cantidadCapitulos;
      totalVolumenes++;

      temporadas.push({
        tomo: tomo,
        capitulos: capitulosArray
      });
    });

    console.log("Temporadas generadas:", temporadas);
    console.log("Total volúmenes:", totalVolumenes);
    console.log("Total capítulos:", totalCapitulos);

    return {
      temporadas: temporadas,
      volumenes: totalVolumenes,
      capitulos: totalCapitulos
    };
  }

  // Ejemplo de cómo usar en el botón "Guardar cambios":
  $('.guardarCambios').click(async function (e) {
    e.preventDefault();

    // Procesar temporadas
    const datosTemporadas = procesarEdicionManga();

    // Aquí continuarías con el resto de validaciones y el envío a la API
    // similar a como haces en el guardar normal, pero con método PUT
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



});