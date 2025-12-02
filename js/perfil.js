
$(document).ready(function () {
  
  
  let API_URL = 'https://api-tfc-five.vercel.app/api';
  let favoritosData = [];
  let usuario = JSON.parse(localStorage.getItem('usuario'));

  
  if (!usuario) {
    window.location.href = '../html/login.html';
    return;
  }

  // Cargar datos del usuario en la pagina
  $('#nombreUsuario').text(usuario.nombre || 'Usuario');
  $('#nombreUsuarioModal').text(usuario.nombre || 'Usuario');
  $('#emailUsuario').text(usuario.email || 'usuario@email.com');


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


  $('#ligthModeToggleMobile').on('click', function () {
    document.body.classList.toggle("dark-mode");
    let isDark = document.body.classList.contains("dark-mode");
    let toggleBtn = document.getElementById("ligthModeToggle");
    let moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21Z"/></svg>';
    let sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.538 1.463T17 12q0 2.075-1.463 3.538T12 17ZM2 13v-2h2v2H2Zm18 0v-2h2v2h-2ZM11 2h2v2h-2V2Zm0 18h2v2h-2v-2ZM6.4 7.75L5 6.35l1.4-1.4l1.4 1.4l-1.4 1.4Zm12.3 12.3l-1.4-1.4l1.4-1.4l1.4 1.4l-1.4 1.4Zm-1.4-12.3l-1.4-1.4l1.4-1.4l1.4 1.4l-1.4 1.4ZM5 19.65l1.4-1.4l1.4 1.4l-1.4 1.4l-1.4-1.4Z"/></svg>';
    
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
  
  // Cargar favoritos del usuario
  function cargarFavoritos() {
    let listaFav = usuario.lista_Fav || [];
    
    if (listaFav.length === 0) {
      mostrarVacio();
      actualizarEstadisticas([]);
      return;
    }

    favoritosData = listaFav;
    renderizarFavoritos(listaFav);
    actualizarEstadisticas(listaFav);
  }



  // Renderizar los mangas favoritos
  function renderizarFavoritos(mangas) {
    let grid = $('#favoritosGrid');
    grid.empty();

    if (mangas.length === 0) {
      mostrarVacio();
      return;
    }

    $('#favoritosVacio').hide();
    grid.show();

    for (let i = 0; i < mangas.length; i++) {
      let manga = mangas[i];
      let generos = Array.isArray(manga.genero) ? manga.genero : [];
      
      // Crear HTML de generos
      let generosHTML = '';
      let maxGeneros = generos.length > 2 ? 2 : generos.length;
      for (let j = 0; j < maxGeneros; j++) {
        generosHTML += '<span class="genero-tag">' + generos[j] + '</span>';
      }
      
      let extraGeneros = '';
      if (generos.length > 2) {
        extraGeneros = '<span class="genero-tag">+' + (generos.length - 2) + '</span>';
      }
      
      // Determinar clase de estado
      let estadoClass = 'pausado';
      if (manga.estado === 'En publicacion') {
        estadoClass = 'publicacion';
      } else if (manga.estado === 'Finalizado') {
        estadoClass = 'finalizado';
      }

      let card = '';
      card += '<div class="favorito-card" data-manga=\'' + JSON.stringify(manga) + '\'>';
      card += '  <div class="favorito-img-container">';
      card += '    <img src="../src/frieren.png" alt="' + manga.nombre + '">';
      card += '    <button class="btn-quitar-favorito" data-id="' + manga._id + '" title="Quitar de favoritos">';
      card += '      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">';
      card += '        <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>';
      card += '      </svg>';
      card += '    </button>';
      card += '    <span class="estado-badge ' + estadoClass + '">' + (manga.estado || 'Desconocido') + '</span>';
      card += '  </div>';
      card += '  <div class="favorito-info">';
      card += '    <h3>' + manga.nombre + '</h3>';
      card += '    <p class="favorito-autor">por ' + manga.autor + '</p>';
      card += '    <div class="favorito-generos">' + generosHTML + extraGeneros + '</div>';
      card += '    <div class="favorito-meta">';
      card += '      <span>';
      card += '        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">';
      card += '          <path fill="currentColor" d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2zm0 14H5V5c0-.806.55-.988 1-1h13v12z"/>';
      card += '        </svg>';
      card += '        ' + (manga.volumenes || 0) + ' vol.';
      card += '      </span>';
      card += '      <span>';
      card += '        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">';
      card += '          <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>';
      card += '        </svg>';
      card += '        ' + (manga.capitulos || 0) + ' cap.';
      card += '      </span>';
      card += '    </div>';
      card += '  </div>';
      card += '</div>';
      
      grid.append(card);
    }
  }

  // Mostrar estado vacio
  function mostrarVacio() {
    $('#favoritosGrid').hide();
    $('#favoritosVacio').show();
  }

  // Actualizar estadisticas del perfil
  function actualizarEstadisticas(mangas) {
    let totalFav = mangas.length;
    let totalVol = 0;
    let totalCap = 0;
    
    for (let i = 0; i < mangas.length; i++) {
      totalVol += mangas[i].volumenes || 0;
      totalCap += mangas[i].capitulos || 0;
    }

    $('#totalFavoritos').text(totalFav);
    $('#totalVolumenes').text(totalVol);
    $('#totalCapitulos').text(totalCap);
  }


  /* ----------------------------------------
   * QUITAR DE FAVORITOS
   * ---------------------------------------- */
  $(document).on('click', '.btn-quitar-favorito', function (e) {
    e.stopPropagation();
    let mangaId = $(this).data('id');
    
    if (!confirm('Quieres quitar este manga de tus favoritos?')) {
      return;
    }

    // Actualizar localmente
    let nuevaLista = [];
    for (let i = 0; i < usuario.lista_Fav.length; i++) {
      if (usuario.lista_Fav[i]._id !== mangaId) {
        nuevaLista.push(usuario.lista_Fav[i]);
      }
    }
    
    usuario.lista_Fav = nuevaLista;
    localStorage.setItem('usuario', JSON.stringify(usuario));
    favoritosData = nuevaLista;
    renderizarFavoritos(favoritosData);
    actualizarEstadisticas(favoritosData);

    // Intentar sincronizar con el servidor
    $.ajax({
      url: API_URL + '/usuarios/' + usuario._id + '/favoritos/' + mangaId,
      method: 'DELETE',
      error: function(err) {
        console.error('Error al sincronizar con servidor:', err);
      }
    });
  });


  /* ----------------------------------------
   * MODAL DE MANGA
   * ---------------------------------------- */
  
  // Abrir modal al hacer clic en una card
  $(document).on('click', '.favorito-card', function (e) {
    if ($(e.target).closest('.btn-quitar-favorito').length) {
      return;
    }
    let manga = $(this).data('manga');
    abrirModalManga(manga);
  });

  // Funcion para abrir el modal
  function abrirModalManga(manga) {
    $('#modal-manga-image').attr('src', '../src/frieren.png');
    $('#modal-manga-titulo').text(manga.nombre);
    $('#modal-manga-estado').text(manga.estado || 'Desconocido');
    $('#modal-manga-sinopsis').text(manga.sinopsis || 'Sin sinopsis disponible');

    // Generos
    let generos = Array.isArray(manga.genero) ? manga.genero : [];
    let generosHTML = '';
    for (let i = 0; i < generos.length; i++) {
      generosHTML += '<span class="genero-tag">' + generos[i] + '</span>';
    }
    $('#modal-generos-list').html(generosHTML);

    // Temporadas/Volumenes
    let temporadas = Array.isArray(manga.temporadas) ? manga.temporadas : [];
    let volumenesHTML = '';
    
    if (temporadas.length > 0) {
      for (let i = 0; i < temporadas.length; i++) {
        let temp = temporadas[i];
        let capitulos = Array.isArray(temp.capitulos) ? temp.capitulos : [];
        
        let capitulosHTML = '';
        for (let j = 0; j < capitulos.length; j++) {
          capitulosHTML += '<span class="capitulo-item">Cap. ' + capitulos[j] + '</span>';
        }
        
        volumenesHTML += '<div class="volumen-item">';
        volumenesHTML += '  <div class="volumen-header">';
        volumenesHTML += '    <span class="volumen-numero">Tomo ' + temp.tomo + '</span>';
        volumenesHTML += '    <span class="volumen-caps">' + capitulos.length + ' capitulos</span>';
        volumenesHTML += '  </div>';
        volumenesHTML += '  <div class="capitulos-lista">' + capitulosHTML + '</div>';
        volumenesHTML += '</div>';
      }
      $('#modal-volumenes-lista').html(volumenesHTML);
    } else {
      $('#modal-volumenes-lista').html('<p style="color: #64748b; text-align: center;">No hay informacion de volumenes</p>');
    }

    $('#modalManga').addClass('show');
  }

  // Cerrar modal
  $(document).on('click', '.cerrarModal', function () {
    $('#modalManga').removeClass('show');
  });

  $(document).on('click', '#modalManga', function (e) {
    if ($(e.target).is('#modalManga')) {
      $('#modalManga').removeClass('show');
    }
  });

  // Toggle lista de episodios
  $(document).on('click', '.toggle-episodios', function () {
    $(this).closest('.modal-episodios-section').find('.volumenes-lista').toggleClass('collapsed');
    $(this).find('.chevron-icon').toggleClass('rotated');
  });


  /* ----------------------------------------
   * BUSQUEDA Y FILTROS
   * ---------------------------------------- */
  
  // Busqueda en favoritos
  $('#buscarFavorito').on('input', function () {
    let termino = $(this).val().toLowerCase();
    
    if (termino === '') {
      renderizarFavoritos(favoritosData);
      return;
    }

    let filtrados = [];
    for (let i = 0; i < favoritosData.length; i++) {
      let manga = favoritosData[i];
      let nombreMatch = manga.nombre.toLowerCase().indexOf(termino) !== -1;
      let autorMatch = manga.autor.toLowerCase().indexOf(termino) !== -1;
      
      if (nombreMatch || autorMatch) {
        filtrados.push(manga);
      }
    }
    renderizarFavoritos(filtrados);
  });

  // Filtro por estado
  $('#filtroEstado').on('change', function () {
    aplicarFiltros();
  });

  // Filtro por orden
  $('#filtroOrden').on('change', function () {
    aplicarFiltros();
  });

  // Aplicar filtros
  function aplicarFiltros() {
    let estado = $('#filtroEstado').val();
    let orden = $('#filtroOrden').val();

    // Copiar array
    let filtrados = [];
    for (let i = 0; i < favoritosData.length; i++) {
      filtrados.push(favoritosData[i]);
    }

    // Filtrar por estado
    if (estado !== 'todos') {
      let temp = [];
      for (let i = 0; i < filtrados.length; i++) {
        if (filtrados[i].estado === estado) {
          temp.push(filtrados[i]);
        }
      }
      filtrados = temp;
    }

    // Ordenar
    if (orden === 'nombre') {
      filtrados.sort(function(a, b) {
        return a.nombre.localeCompare(b.nombre);
      });
    } else if (orden === 'volumenes') {
      filtrados.sort(function(a, b) {
        return (b.volumenes || 0) - (a.volumenes || 0);
      });
    }

    renderizarFavoritos(filtrados);
  }


  /* ----------------------------------------
   * INICIALIZACION
   * ---------------------------------------- */
  cargarFavoritos();

});
