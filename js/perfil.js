$(document).ready(function () {
  
  let API_URL = 'https://api-tfc-five.vercel.app/api';
  let favoritosData = [];
  let usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    window.location.href = '../html/login.html';
    return;
  }

  // Cargar datos del usuario en la pagina
  $('#nombreUsuario').text(usuario.nombre);
  $('#nombreUsuarioModal').text(usuario.nombre);
  $('#emailUsuario').text(usuario.email);

  

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
    console.log(favoritosData);
    
    mostrarMangasFavUsuario(listaFav);
    actualizarEstadisticas(listaFav);
  }

  function mostrarMangasFavUsuario(mangas) {
    let favoritos = $('#favoritosGrid');
    favoritos.empty();

    if (mangas.length === 0) {
      mostrarVacio();
      return;
    }

    $('#favoritosVacio').hide();

    favoritos.show();

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
      card += '        ' + (manga.volumenes || 0) + ' vol.';
      card += '      </span>';
      card += '      <span>';
      card += '        ' + (manga.capitulos || 0) + ' cap.';
      card += '      </span>';
      card += '    </div>';
      card += '  </div>';
      card += '</div>';

      favoritos.append(card);
    }
  }



  function mostrarVacio() {
    $('#favoritosGrid').hide();
    $('#favoritosVacio').show();
  }









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



  $(document).on('click', '.favorito-card', function (e) {
    if ($(e.target).closest('.btn-quitar-favorito').length) return;
    abrirModalManga($(this).data('manga'));
  });

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

  

  $('#buscarFavorito').on('input', function () {
    let termino = $(this).val().toLowerCase();

    if (!termino) return mostrarMangasFavUsuario(favoritosData);

    let filtrados = favoritosData.filter(m =>
      m.nombre.toLowerCase().includes(termino) ||
      m.autor.toLowerCase().includes(termino)
    );
    mostrarMangasFavUsuario(filtrados);
  });



  cargarFavoritos();

});
