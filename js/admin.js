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


  //cada manga en tabla estilo 
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
    const temporadas = [];
    let totalCapitulos = 0;
    let totalVolumenes = 0;

    // recoger cada temporada.
    const temporadasTotales = $('.temporada-item');

    for (let i = 0; i < temporadasTotales.length; i++) {
      const item = temporadasTotales[i];
      const tomo = parseInt($(item).find('.tomo-numero').val());
      const capitulosStr = $(item).find('.tomo-capitulos').val();

      const capitulosArray = [];
      if (capitulosStr) {
        const numeros = capitulosStr.split(',');
        for (let j = 0; j < numeros.length; j++) {
          const num = parseInt(numeros[j].trim());
          if (!isNaN(num)) {
            capitulosArray.push(num);
          }
        }
      }

      totalCapitulos += capitulosArray.length;
      totalVolumenes++;
      temporadas.push({ tomo, capitulos: capitulosArray });
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

    // campos oblihatorio(autor, nombre, sinopsis)
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

    const mangaNuevo = {
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
      temporadas: temporadas,
      imagen:"frieren.png"
    };

    console.log('Datos del manga a guardar:', mangaNuevo);

    try {
      
      const response = await $.ajax({
        type: 'POST',
        url: `${API_URL}/nuevomanga`,
        contentType: 'application/json',
        data: JSON.stringify(mangaNuevo)
      });

      console.log('Respuesta del servidor:', response);

      // Cerrar el modal
      $('#modalManga').removeClass('show');

      // Mostrar mensaje de éxito
      mostrarModalMensaje('Éxito', 'Manga creado correctamente', 'success');

      // Recargar la lista de mangas
      cargarMangas();

    } catch (error) {
      console.error('Error al guardar manga:', error);

      let mensajeError = 'Error al guardar el manga';
      if (error.responseJSON && error.responseJSON.mensaje) {
        mensajeError = error.responseJSON.mensaje;
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
    $('.mooodal').removeClass('show');
  });












  // click boton editar
$(document).on('click', '.btn-editar', function () {
    console.log("editar modal click");
    
    //coger los datos 
    const datosJSON = $(this).attr('data-datos');

    console.log(datosJSON);

    try {

        const mangaEditar = JSON.parse(datosJSON);
        console.log("Manga a editar:", mangaEditar);

       
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
            mangaEditar.genero.forEach(genero => {$(`input[name="generosEditar"][value="${genero}"]`).prop('checked', true);});
        }

        cargarTemporadasEnEdicion(mangaEditar);

        //Mostrar el modal
        $('#modalEditar').addClass('show');
    } catch (error) {
        console.error("Error al parsear JSON:", error);
        mostrarModalMensaje('Error', 'No se pudieron cargar los datos', 'error');
    }
});

// cargar las temporadas
function cargarTemporadasEnEdicion(manga) {
    // Limpiar el contenedor de temporadas
    $('#temporadasContainerEditar').empty();

    let totalVolumenes = 0;
    let totalCapitulos = 0;

    // Verificar si el manga tiene temporadas
    if (manga.temporadas.length > 0) {
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

// añadir temporada
$(document).on('click', '#btnAddTemporadaEditar', function() {
    const totalTemporadas = $('.temporada-item').length;
    //numero de temporada en  funcion de los que haya
    const nuevoNumero = totalTemporadas + 1;
    
    const temporadaHTML = `
        <div class="temporada-item">
            <div class="temporada-header">
                <strong>Tomo ${nuevoNumero}</strong>
                <button type="button" class="btn-remove-temporada">Eliminar</button>
            </div>
            <div class="temporada-inputs">
                <input type="number" class="tomo-numero" value="${nuevoNumero}" placeholder="Nº Tomo" min="1" required>
                <input type="number" class="tomo-capitulos-cantidad" value="10" placeholder="Cantidad de capítulos" min="1" required>
                <small class="tomo-descripcion"></small>
            </div>
        </div>
    `;
    
    // Insertar antes del botón de agregar
    $(this).before(temporadaHTML);
    actualizarContadoresEditar();
});

// ========== EVENTO PARA ELIMINAR TOMO ==========
$(document).on('click', '.btn-remove-temporada', function() {
    $(this).closest('.temporada-item').remove();
    // Renumerar los tomos
    $('.temporada-item').each(function(index) {
        const nuevoNumero = index + 1;
        $(this).find('.tomo-numero').val(nuevoNumero);
        $(this).find('.temporada-header strong').text(`Tomo ${nuevoNumero}`);
    });
    actualizarContadoresEditar();
});

// ========== ACTUALIZAR CONTADORES AUTOMÁTICAMENTE ==========
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

    
    enviarActualizacionManga(mangaId, datosActualizados);
});










function enviarActualizacionManga(mangaId, datosActualizados) {
   
    //efecto de carga en el boton de guardar
    //desabilitar boton para evitar multiple clicks
    $('.guardarMangaEditar').prop('disabled', true).html(`
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
            </path>
        </svg>
        Guardando...
    `);
    
    console.log("Enviando actualización a:", `${API_URL}/editarmanga/${mangaId}`);
    console.log("Datos a enviar:", datosActualizados);

    // Enviar como JSON
    fetch(`https://api-tfc-five.vercel.app/api/editarmanga/${mangaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
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
            if (typeof cargarMangas === 'function') {
                cargarMangas();
            } else {
                location.reload(); // O recarga la página si no tienes la función
            }
        } else {
            throw new Error(data.error || 'Error desconocido del servidor');
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

// ========== CERRAR MODAL ==========
$(document).on('click', '#btnCerrarModalEditar, #btnCancelarEditar', function() {
    $('#modalEditar').removeClass('show');
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