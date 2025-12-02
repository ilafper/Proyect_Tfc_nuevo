$(document).ready(function () {
  const API_URL = 'https://api-tfc-five.vercel.app/api';
  let mangasData = [];
  let editandoManga = null;

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

  // Toggle modo claro/oscuro en sidebar mobile
  $('#ligthModeToggleMobile').on('click', function () {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    const toggleBtn = document.getElementById("ligthModeToggle");
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21Z"/></svg>`;
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.538 1.463T17 12q0 2.075-1.463 3.538T12 17ZM2 13v-2h2v2H2Zm18 0v-2h2v2h-2ZM11 2h2v2h-2V2Zm0 18h2v2h-2v-2ZM6.4 7.75L5 6.35l1.4-1.4l1.4 1.4l-1.4 1.4Zm12.3 12.3l-1.4-1.4l1.4-1.4l1.4 1.4l-1.4 1.4Zm-1.4-12.3l-1.4-1.4l1.4-1.4l1.4 1.4l-1.4 1.4ZM5 19.65l1.4-1.4l1.4 1.4l-1.4 1.4l-1.4-1.4Z"/></svg>`;
    
    if (isDark) {
      toggleBtn.innerHTML = sunIcon;
      localStorage.setItem("modo", "oscuro");
    } else {
      toggleBtn.innerHTML = moonIcon;
      localStorage.setItem("modo", "claro");
    }
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

  // Función para mostrar modal de mensaje
  function mostrarModalMensaje(titulo, mensaje, tipo) {
    const iconoSuccess = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#10b981" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
    const iconoError = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#ef4444" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
    
    $('#modalMensajeTitulo').text(titulo);
    $('#modalMensajeTexto').text(mensaje);
    $('#modalMensajeIcono').html(tipo === 'success' ? iconoSuccess : iconoError);
    $('#modalMensaje').addClass('show');
  }

  // Mostrar modal de confirmación para eliminar.
  
  function mostrarModalEliminar(mangaId, nombreManga) {
    $('#eliminarMangaId').val(mangaId);
    $('#eliminarMangaNombre').text(nombreManga);
    $('#modalEliminar').addClass('show');
  }

  function cargarMangas() {
    $.ajax({
      url: `${API_URL}/mangas`,
      method: 'GET',
      success: function (mangas) {
        mangasData = mangas;
        renderizarTabla(mangas);
        renderizarCards(mangas);
      },

      error: function (err) {
        console.error("Error al cargar mangas:", err);
        $('#mangasTableBody').html('<tr><td colspan="7" style="text-align:center; color:#ef4444;">Error al cargar mangas</td></tr>');
      }
    });
  }

  function renderizarTabla(mangas) {
    const tbody = $('#mangasTableBody');
    tbody.empty();

    if (mangas.length === 0) {
      tbody.html('<tr><td colspan="7" style="text-align:center;">No hay mangas registrados</td></tr>');
      return;
    }

    mangas.forEach(manga => {

      const generos = Array.isArray(manga.genero) ? manga.genero : [];
      const generosHTML = generos.slice(0, 2).map(genero => 
        `<span class="genero-tag">${genero}</span>`
      ).join('');
      
      const extraGeneros = generos.length > 2 ? `<span class="genero-tag">+${generos.length - 2}</span>` : '';
      
      const estadoClass = manga.estado === 'En publicación' ? 'publicacion' : manga.estado === 'Finalizado' ? 'finalizado' : 'pausado';

      const row = `
        <tr>
          <td><img src="../src/frieren.png" alt="${manga.nombre}" class="manga-img"></td>
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
              <button class="btn-action btn-eliminar" data-id="${manga._id}" data-nombre="${manga.nombre}">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      tbody.append(row);
    });
  }

  function renderizarCards(mangas) {
    const container = $('#mangasCards');
    container.empty();

    mangas.forEach(manga => {
      const generos = Array.isArray(manga.genero) ? manga.genero : [];
      const generosHTML = generos.slice(0, 2).join(', ');
      const estadoClass = manga.estado === 'En publicación' ? 'publicacion' : 
                         manga.estado === 'Finalizado' ? 'finalizado' : 'pausado';

      const card = `
        <div class="manga-card">
          <img src="../src/frieren.png" alt="${manga.nombre}" class="manga-card-img">
          <h3>${manga.nombre}</h3>
          <p><strong>Autor:</strong> ${manga.autor}</p>
          <p><strong>Géneros:</strong> ${generosHTML}</p>
          <p><strong>Volúmenes:</strong> ${manga.volumenes || 0}</p>
          <p><span class="estado-badge ${estadoClass}">${manga.estado}</span></p>
          <div class="table-actions" style="margin-top: 1rem;">
            <button class="btn-action btn-editar" data-id="${manga._id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/>
              </svg>
            </button>
            <button class="btn-action btn-eliminar" data-id="${manga._id}" data-nombre="${manga.nombre}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
      container.append(card);
    });
  }

  $('#buscarManga').on('input', function () {
    const termino = $(this).val().toLowerCase();
    const mangasFiltrados = mangasData.filter(manga => 
      manga.nombre.toLowerCase().includes(termino) ||
      manga.autor.toLowerCase().includes(termino)
    );
    renderizarTabla(mangasFiltrados);
    renderizarCards(mangasFiltrados);
  });

  $('#btnNuevoManga').click(function () {
    editandoManga = null;
    $('#modalTitle').text('Nuevo Manga');
    $('#formManga')[0].reset();
    $('#mangaId').val('');
    $('#temporadasContainer').html(`
      <button type="button" class="btn-add-temporada" id="btnAddTemporada">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Agregar Tomo
      </button>
    `);
    $('#modalManga').addClass('show');
    renderGeneros();
  });

  $('#btnCerrarModal, #btnCancelar').click(function () {
    $('#modalManga').removeClass('show');
  });

  $(document).on('click', '#btnAddTemporada', function () {
    const numTemporadas = $('.temporada-item').length;
    const nuevaTemporada = `
      <div class="temporada-item">
        <div class="temporada-header">
          <strong>Tomo ${numTemporadas + 1}</strong>
          <button type="button" class="btn-remove-temporada">Eliminar</button>
        </div>
        <div class="temporada-inputs">
          <input type="number" class="tomo-numero" value="${numTemporadas + 1}" placeholder="Nº Tomo" min="1" required>
          <input type="text" class="tomo-capitulos" placeholder="Capítulos (ej: 1,2,3,4,5)" required>
        </div>
      </div>
    `;
    $(this).before(nuevaTemporada);
  });

  $(document).on('click', '.btn-remove-temporada', function () {
    $(this).closest('.temporada-item').remove();
  });

  $('#formManga').submit(async function (e) {
    e.preventDefault();

    const temporadas = [];
    $('.temporada-item').each(function () {
      const tomo = parseInt($(this).find('.tomo-numero').val());
      const capitulosStr = $(this).find('.tomo-capitulos').val();
      const capitulos = capitulosStr.split(',').map(c => parseInt(c.trim())).filter(c => !isNaN(c));
      
      temporadas.push({ tomo, capitulos });
    });

    const generosStr = $('#genero').val();
    const generos = generosStr.split(',').map(g => g.trim()).filter(g => g.length > 0);

    const mangaData = {
      nombre: $('#nombre').val().trim(),
      autor: $('#autor').val().trim(),
      genero: generos,
      sinopsis: $('#sinopsis').val().trim(),
      volumenes: parseInt($('#volumenes').val()),
      capitulos: parseInt($('#capitulos').val()),
      editorial: $('#editorial').val().trim(),
      demografia: $('#demografia').val(),
      estado: $('#estado').val(),
      tipo: $('#tipo').val(),
      temporadas: temporadas
    };

    try {
      const mangaId = $('#mangaId').val();
      const method = mangaId ? 'PUT' : 'POST';
      const url = mangaId ? `${API_URL}/mangas/${mangaId}` : `${API_URL}/mangas`;

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mangaData)
      });

      if (response.ok) {
        $('#modalManga').removeClass('show');
        mostrarModalMensaje('Éxito', mangaId ? 'Manga actualizado correctamente' : 'Manga creado correctamente', 'success');
        cargarMangas();
      } else {
        const error = await response.json();
        mostrarModalMensaje('Error', error.mensaje || 'No se pudo guardar el manga', 'error');
      }
    } catch (error) {
      console.error('Error al guardar manga:', error);
      mostrarModalMensaje('Error', 'Error al conectar con el servidor', 'error');
    }
  });

  // Función para editar manga
  async function editarManga(mangaId) {
    try {
      const response = await fetch(`${API_URL}/mangas/${mangaId}`);
      const manga = await response.json();

      editandoManga = manga;
      $('#modalTitle').text('Editar Manga');
      $('#mangaId').val(manga._id);
      $('#nombre').val(manga.nombre);
      $('#autor').val(manga.autor);
      $('#genero').val(Array.isArray(manga.genero) ? manga.genero.join(', ') : '');
      $('#sinopsis').val(manga.sinopsis);
      $('#volumenes').val(manga.volumenes);
      $('#capitulos').val(manga.capitulos);
      $('#editorial').val(manga.editorial || '');
      $('#demografia').val(manga.demografia || 'Shonen');
      $('#estado').val(manga.estado || 'En publicación');
      $('#tipo').val(manga.tipo || 'manga');

      const temporadas = Array.isArray(manga.temporadas) ? manga.temporadas : [];
      const temporadasHTML = temporadas.map(temp => `
        <div class="temporada-item">
          <div class="temporada-header">
            <strong>Tomo ${temp.tomo}</strong>
            <button type="button" class="btn-remove-temporada">Eliminar</button>
          </div>
          <div class="temporada-inputs">
            <input type="number" class="tomo-numero" value="${temp.tomo}" placeholder="Nº Tomo" min="1" required>
            <input type="text" class="tomo-capitulos" value="${Array.isArray(temp.capitulos) ? temp.capitulos.join(',') : ''}" placeholder="Capítulos" required>
          </div>
        </div>
      `).join('');

      $('#temporadasContainer').html(`
        ${temporadasHTML}
        <button type="button" class="btn-add-temporada" id="btnAddTemporada">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Agregar Tomo
        </button>
      `);

      $('#modalManga').addClass('show');
      // renderizar géneros marcando los que ya tiene el manga
      renderGeneros(Array.isArray(manga.genero) ? manga.genero : []);
    } catch (error) {
      console.error('Error al cargar manga:', error);
      mostrarModalMensaje('Error', 'Error al cargar el manga', 'error');
    }
  }

  // Renderiza la lista de géneros como checkboxes dentro de .lista-generos
  function renderGeneros(selected = []) {
    const container = $('.lista-generos');
    if (!container.length) return;

    const html = GENEROS.map(g => {
      const slug = g.toLowerCase().replace(/\s+/g, '-');
      const isChecked = selected.includes(g) ? 'checked' : '';
      return `
        <div class="generoChech">
          <input type="checkbox" id="genero-${slug}" name="generos" value="${g}" class="checkbox-input" ${isChecked}>
          <label for="genero-${slug}" class="checkbox-label">
            <span class="genre-name">${g}</span>
          </label>
        </div>
      `;
    }).join('');

    container.html(html + '<small>Selecciona uno o varios géneros que describan el manga</small>');
  }

  // Función para eliminar manga
  async function eliminarManga(mangaId) {
    try {
      const response = await fetch(`${API_URL}/mangas/${mangaId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        mostrarModalMensaje('Éxito', 'Manga eliminado correctamente', 'success');
        cargarMangas();
      } else {
        mostrarModalMensaje('Error', 'Error al eliminar el manga', 'error');
      }
    } catch (error) {
      console.error('Error al eliminar manga:', error);
      mostrarModalMensaje('Error', 'Error al conectar con el servidor', 'error');
    }
  }

  // Evento delegado para botón editar
  $(document).on('click', '.btn-editar', function () {
    const mangaId = $(this).data('id');
    editarManga(mangaId);
  });

  // Evento delegado para botón eliminar - muestra modal de confirmación
  $(document).on('click', '.btn-eliminar', function () {
    const mangaId = $(this).data('id');
    const nombreManga = $(this).data('nombre');
    mostrarModalEliminar(mangaId, nombreManga);
  });

  // Confirmar eliminación
  $(document).on('click', '#btnConfirmarEliminar', function () {
    const mangaId = $('#eliminarMangaId').val();
    $('#modalEliminar').removeClass('show');
    eliminarManga(mangaId);
  });

  // Cancelar eliminación
  $(document).on('click', '#btnCancelarEliminar, #btnCerrarModalEliminar', function () {
    $('#modalEliminar').removeClass('show');
  });

  // Cerrar modal de mensaje
  $(document).on('click', '#btnCerrarMensaje', function () {
    $('#modalMensaje').removeClass('show');
  });

  cargarMangas();

});
