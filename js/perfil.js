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

      // const tarjeta = $(`
      //       <div class="favorito-card" data-manga=${JSON.stringify(manga)}>
      //     <div class="favorito-img-container">
      //       <img src="../src/frieren.png" alt="manga.nombre">

      //       <button class="btn-quitar-favorito" data-id="manga._id" title="Quitar de favoritos">
      //         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      //           <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      //         </svg>
      //       </button>

      //       <span class="estado-badge estadoClass">
      //         manga.estado
      //       </span>
      //     </div>

      //     <div class="favorito-info">
      //       <h3>manga.nombre</h3>
      //       <p class="favorito-autor">por manga.autor</p>

      //       <div class="favorito-generos">
      //         generosHTML extraGeneros
      //       </div>

      //       <div class="favorito-meta">
      //         <span>
      //           manga.volumenes vol.
      //         </span>
      //         <span>
      //           manga.capitulos cap.
      //         </span>
      //       </div>
      //     </div>
      //   </div>

      //     `);

      //favoritos.append(tarjeta);
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



  cargarFavoritos();

});
