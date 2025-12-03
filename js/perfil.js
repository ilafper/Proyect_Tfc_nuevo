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
      
      let generosHTML = '';
      let maxGeneros = generos.length > 2 ? 2 : generos.length;
      for (let j = 0; j < maxGeneros; j++) {
        generosHTML += '<span class="genero-tag">' + generos[j] + '</span>';
      }
      
      let extraGeneros = generos.length > 2 
        ? '<span class="genero-tag">+' + (generos.length - 2) + '</span>' 
        : '';

      let estadoClass = 'pausado';
      if (manga.estado === 'En publicacion') estadoClass = 'publicacion';
      if (manga.estado === 'Finalizado') estadoClass = 'finalizado';

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
      card += '        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="currentColor" d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2zm0 14H5V5c0-.806.55-.988 1-1h13v12z"/></svg>';
      card += '        ' + (manga.volumenes || 0) + ' vol.';
      card += '      </span>';
      card += '      <span>';
      card += '        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>';
      card += '        ' + (manga.capitulos || 0) + ' cap.';
      card += '      </span>';
      card += '    </div>';
      card += '  </div>';
      card += '</div>';

      grid.append(card);
    }
  }

  /* ----------------------------------------
   * VACÍO
   * ---------------------------------------- */

  function mostrarVacio() {
    $('#favoritosGrid').hide();
    $('#favoritosVacio').show();
  }

  /* ----------------------------------------
   * ESTADÍSTICAS
   * ---------------------------------------- */

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

    if (!confirm('¿Quieres quitar este manga de tus favoritos?')) return;

    let nuevaLista = usuario.lista_Fav.filter(m => m._id !== mangaId);

    usuario.lista_Fav = nuevaLista;
    localStorage.setItem('usuario', JSON.stringify(usuario));

    favoritosData = nuevaLista;
    renderizarFavoritos(favoritosData);
    actualizarEstadisticas(favoritosData);

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

  $(document).on('click', '.favorito-card', function (e) {
    if ($(e.target).closest('.btn-quitar-favorito').length) return;
    abrirModalManga($(this).data('manga'));
  });

  function abrirModalManga(manga) {
    $('#modal-manga-image').attr('src', '../src/frieren.png');
    $('#modal-manga-titulo').text(manga.nombre);
    $('#modal-manga-estado').text(manga.estado || 'Desconocido');
    $('#modal-manga-sinopsis').text(manga.sinopsis || 'Sin sinopsis disponible');

    let generosHTML = '';
    (manga.genero || []).forEach(g => {
      generosHTML += '<span class="genero-tag">' + g + '</span>';
    });
    $('#modal-generos-list').html(generosHTML);

    let temporadas = manga.temporadas || [];
    let volumenesHTML = '';

    if (temporadas.length > 0) {
      temporadas.forEach(temp => {
        let capsHTML = '';
        (temp.capitulos || []).forEach(c => {
          capsHTML += '<span class="capitulo-item">Cap. ' + c + '</span>';
        });

        volumenesHTML += `
          <div class="volumen-item">
            <div class="volumen-header">
              <span class="volumen-numero">Tomo ${temp.tomo}</span>
              <span class="volumen-caps">${(temp.capitulos || []).length} capitulos</span>
            </div>
            <div class="capitulos-lista">${capsHTML}</div>
          </div>`;
      });
      $('#modal-volumenes-lista').html(volumenesHTML);
    } else {
      $('#modal-volumenes-lista').html('<p style="color:#64748b; text-align:center;">No hay información de volumenes</p>');
    }

    $('#modalManga').addClass('show');
  }

  $(document).on('click', '.cerrarModal', function () {
    $('#modalManga').removeClass('show');
  });

  $(document).on('click', '#modalManga', function (e) {
    if ($(e.target).is('#modalManga')) {
      $('#modalManga').removeClass('show');
    }
  });

  $(document).on('click', '.toggle-episodios', function () {
    $(this).closest('.modal-episodios-section').find('.volumenes-lista').toggleClass('collapsed');
    $(this).find('.chevron-icon').toggleClass('rotated');
  });

  /* ----------------------------------------
   * BUSQUEDA
   * ---------------------------------------- */

  $('#buscarFavorito').on('input', function () {
    let termino = $(this).val().toLowerCase();

    if (!termino) return renderizarFavoritos(favoritosData);

    let filtrados = favoritosData.filter(m =>
      m.nombre.toLowerCase().includes(termino) ||
      m.autor.toLowerCase().includes(termino)
    );
    renderizarFavoritos(filtrados);
  });

  $('#filtroEstado, #filtroOrden').on('change', aplicarFiltros);

  function aplicarFiltros() {
    let estado = $('#filtroEstado').val();
    let orden = $('#filtroOrden').val();

    let filtrados = [...favoritosData];

    if (estado !== 'todos') {
      filtrados = filtrados.filter(m => m.estado === estado);
    }

    if (orden === 'nombre') {
      filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === 'volumenes') {
      filtrados.sort((a, b) => (b.volumenes || 0) - (a.volumenes || 0));
    }

    renderizarFavoritos(filtrados);
  }


  cargarFavoritos();

});
