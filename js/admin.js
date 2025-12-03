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
    tablaMangas  .empty();

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
              <button class="btn-action btn-editar" data-id="${manga._id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/>
                </svg>
              </button>
              <button data-ideliminar='${manga._id}' class="btn-action btn-eliminar" data-id="${manga._id}" data-nombre="${manga.nombre}">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      tablaMangas.append(cada_fila_manga);
      //console.log(row);
      
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

  $('#btnCerrarModal, #btnCancelar').click(function () {
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




  //guardar manga.
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
  $(document).on('click', '.btn-eliminar', function () {
    console.log("modal click");
    let mangaEliminar = $(this).data('ideliminar');
    console.log(mangaEliminar);
    
    $('#modalEliminar').toggleClass('show');
  });

  //eliminar
  $(document).on('click', '.btn-cancelar', function () {
    console.log("cancelar Modal");
    
    $('#modalEliminar').removeClass('show');
  });


  // Cerrar modal de mensaje
  $(document).on('click', '#btnCerrarMensaje', function () {
    $('#modalMensaje').removeClass('show');
  });

  cargarMangas();



});