
$(document).ready(function () {

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

  // Modal de perfil
  $('#avatarBtn').on('click', function (e) {
    e.stopPropagation();
    $('#modalPerfil').toggleClass('show');
  });

  // Cerrar modal de perfil al hacer clic fuera
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#avatarBtn, #modalPerfil').length) {
      $('#modalPerfil').removeClass('show');
    }
  });

  // Evitar que el modal se cierre al hacer clic dentro
  $('#modalPerfil').on('click', function (e) {
    e.stopPropagation();
  });

  $('.cartasWrap').on('click', '.heart-btn', function (e) {
    e.stopPropagation(); // evita abrir el modal
    $(this).toggleClass('liked');
    const svg = $(this).find('.heart-icon');
    svg.attr('fill', $(this).hasClass('liked') ? '#e0245e' : 'none');
  });

  $('.cartasWrap').on('click', '.guardar', function (e) {
    e.stopPropagation();
  });

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    $('#nombreUsuario').text(usuario.nombre);
  }

  // Cerrar sesión con jQuery
  $('.logout').click(function () {
    localStorage.removeItem('usuario');
    window.location.href = "../html/login.html";
  });

  //carga los mangas 
  function cargarMangas() {
    $.ajax({
      url: 'https://api-tfc-five.vercel.app/api/mangas',
      method: 'GET',
      success: function (mangas) {
        const contenedor = $('.cartasWrap');
        contenedor.empty();

        mangas.forEach(function (manga) {
          const generos = manga.genero || [];

          let tags = '';
          for (let j = 0; j < 2 && j < generos.length; j++) {
            tags += `<span class="cada_genero">${generos[j]}</span>`;
          }
          const extraTag = generos.length > 2 ? `<span class="cada_genero">+${generos.length - 2}</span>` : '';
          
          //estructura manga
          const tarjeta = $(`
            <div class="card" data-manga='${JSON.stringify(manga)}'>
              <img src="../src/${manga.imagen}" alt="${manga.nombre}">
              <div class="card-info">
                <h3>${manga.nombre}</h3>
                <p>por ${manga.autor}</p>
                <div class="generos">
                  ${tags}${extraTag}
                </div>
                <div class="meta">
                  <span>${manga.volumenes} volúmenes</span>
                  <span>${manga.capitulos} capítulos</span>
                </div>
                <div class="interactions">
                  <button class="heart-btn" data-id="${manga._id}" aria-label="Me gusta">
                    <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#e0245e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 21C12 21 5 14.5 5 9.5C5 6.42 7.42 4 10.5 4C12 4 13.5 5 14 6C14.5 5 16 4 17.5 4C20.58 4 23 6.42 23 9.5C23 14.5 16 21 16 21H12Z"/>
                    </svg>
                    
                  </button>
                  <button class="guardar" aria-label="guardar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="#ffffff" d="M5 21h14a2 2 0 0 0 2-2V8l-5-5H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zM7 5h4v2h2V5h2v4H7V5zm0 8h10v6H7v-6z"/>
                    </svg>
                    <p>Guardar</p>
                  </button>
                </div>
              </div>
            </div>
          `);

          // // Marcar favoritos si el usuario ya los tiene
          if (usuario && usuario.lista_Fav && usuario.lista_Fav.some(fav => fav._id === manga._id)) {
            tarjeta.find('.heart-btn').addClass('liked');
            tarjeta.find('.heart-icon').attr('fill', '#e0245e');
          }

          contenedor.append(tarjeta);
        });
      },
      error: function (err) {
        console.error("Error al cargar mangas:", err);
        $('.cartasWrap').html("<p style='text-align:center; color:#64748b;'>No se pudieron cargar los mangas. Intenta de nuevo.</p>");
      }
    });
  }


  cargarMangas();

  // Función de búsqueda
  function buscarMangas() {
    const $input = $(".buscar input");

    // Detecta cuando el usuario escribe
    $input.on("input", function () {
      const nombre = $(this).val().trim();

      // Si el input está vacío, carga todos los mangas
      if (nombre === "") {
        cargarMangas();
        return;
      }


      $.ajax({
        url: `https://api-tfc-five.vercel.app/api/mangas/buscar?nombre=${encodeURIComponent(nombre)}`,
        method: "GET",
        dataType: "json",
        success: function (mangas) {
          console.log("Mangas encontrados:", mangas);
          mangasBuscados(mangas);
        },
        error: function (err) {
          console.error("Error al buscar mangas:", err);
          const contenedor = $(".cartasWrap");
          contenedor.empty();
          contenedor.append("<p style='text-align: center; padding: 2rem; color: #64748b;'>Error al buscar. Intenta de nuevo.</p>");
        }
      });
    });
  }

  function mangasBuscados(mangas) {
    const contenedor = $(".cartasWrap");
    contenedor.empty();

    if (!mangas || mangas.length === 0) {
      contenedor.append("<p style='text-align: center; padding: 2rem; color: #64748b;'>No se encontraron mangas con ese nombre.</p>");
      return;
    }

    for (let i = 0; i < mangas.length; i++) {
      const manga = mangas[i];
      const generos = manga.genero;

      let tags = '';
      for (let j = 0; j < 2 && j < generos.length; j++) {
        tags += `<span class="tag">${generos[j]}</span>`;
      }

      const extraTag = generos.length > 2 ? `<span class="tag">+${generos.length - 2}</span>` : '';

      const tarjeta = $(`
        <div class="card">
          <img src="../src/${manga.imagen}" alt="${manga.nombre}">
          <div class="card-info">
            <h3>${manga.nombre}</h3>
            <p>por ${manga.autor}</p>
            <div class="tags">
              ${tags}${extraTag}
            </div>
            <div class="meta">
              <span>${manga.volumenes || 0} volúmenes</span>
              <span>${manga.capitulos || 0} capítulos</span>
            </div>
            <div class="interactions">
              <button class="heart-btn" aria-label="Me gusta">
                <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" width="24" height="24" fill="none" 
                  stroke="#e0245e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 21C12 21 5 14.5 5 9.5C5 6.42 7.42 4 10.5 4C12 4 13.5 5 14 6C14.5 5 16 4 17.5 4C20.58 4 23 6.42 23 9.5C23 14.5 16 21 16 21H12Z"/>
                </svg>
                <p>Me gusta</p>
              </button>
              <button class="guardar" aria-label="guardar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M5 21h14a2 2 0 0 0 2-2V8l-5-5H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zM7 5h4v2h2V5h2v4H7V5zm0 8h10v6H7v-6z"/>
                </svg>
                <p>Guardar</p>
              </button>
            </div>
          </div>
        </div>
      `);

      contenedor.append(tarjeta);
    }
  }



  // Inicializar búsqueda
  buscarMangas();




  //modal

  // Mostrar modal
  $('.cartasWrap').on('click', '.card', function () {
    const manga = JSON.parse($(this).attr('data-manga'));

    // imagen
   $('#modal-manga-image').attr('src', `../src/${manga.imagen}`).attr('alt', manga.nombre);

    // Rellenar título
    $('#modal-manga-titulo').text(manga.nombre);

    // Rellenar estado
    $('#modal-manga-estado').text('En emisión');

    // Rellenar sinopsis (si existe en los datos)
    const sinopsis = manga.sinopsis || 'Una historia épica de piratas, donde narra la historia de "Monkey D. Luffy" quien cuando tenia 7 años, comió accidentalmente una "Akuma no mi"(Futa del diablo) la cual le dio poderes de goma.';
    $('#modal-manga-sinopsis').text(sinopsis);

    // Rellenar géneros


    const generos = manga.genero || [];
    let generosHTML = '';
    for (let i = 0; i < generos.length; i++) {
      generosHTML += `<span class="genero-pill">${generos[i]}</span>`;
    }
    $('#modal-generos-list').html(generosHTML);

    // Generar el HTML de los volúmenes con capítulos desplegables
    let volumenesHTML = '';
    const temporadas = manga.temporadas || [];
    const totalCapitulos = manga.capitulos || 0;

    // Actualizar título de episodios
    $('#modal-episodios-titulo').text(`Episodios del 1 al ${totalCapitulos}`);



    // Recorrer las temporadas (tomos) del manga
    if (temporadas.length > 0) {
      for (let i = 0; i < temporadas.length; i++) {
        const temporada = temporadas[i];
        const tomoNum = temporada.tomo;
        const capsDelTomo = temporada.capitulos || [];

        let capitulosHTML = '';
        // Recorrer los capítulos de este tomo
        for (let j = 0; j < capsDelTomo.length; j++) {
          const capNum = capsDelTomo[j];
          capitulosHTML += `
            <div class="capitulo-item">
              <span>Tomo ${tomoNum} - Cap ${capNum}</span>
            </div>
          `;
        }

        // Verificar si este tomo está marcado como visto
        const tomoVisto = usuario && usuario.capitulos_vistos && usuario.capitulos_vistos.some(cv => cv.mangaId === manga._id && cv.tomo === tomoNum && cv.visto);
        
        const claseVisto = tomoVisto ? 'visto' : '';
        
        //icono visto e icono no visto
        const iconoOjo = tomoVisto 
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5c0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28l.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22L21 20.73L3.27 3L2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65c0 1.66 1.34 3 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53c-2.76 0-5-2.24-5-5c0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15l.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`;

        volumenesHTML += `
          <div class="volumen-item">
            <div class="volumen-header">
              <div class="volumen-header-left">
                <span class="volumen-titulo">Tomo ${tomoNum}</span>
              </div>
              <div class="volumen-header-right">
                <button class="btn-visto ${claseVisto}" data-tomo="${tomoNum}" data-manga-id="${manga._id}">
                  ${iconoOjo}
                  <span>Visto</span>
                </button>
                <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6l1.41-1.41z"/>
                </svg>
              </div>
            </div>
            <div class="capitulos-lista" style="display: none;">
              ${capitulosHTML}
            </div>
          </div>
        `;
      }
    }

    $('#modal-volumenes-lista').html(volumenesHTML);

    $('.modalManga').css('display', 'flex').addClass('show');
  });

  // Toggle desplegable de sección completa de episodios
  $('.modalManga').on('click', '.toggle-episodios', function (e) {
    e.stopPropagation();
    const $volumenes = $('#modal-volumenes-lista');
    const $chevron = $(this).find('.chevron-icon');

    $volumenes.slideToggle(300);
    $chevron.toggleClass('rotated');
  });

  // Toggle desplegable de capítulos
  $('.modalManga').on('click', '.volumen-header', function (e) {
    if ($(e.target).closest('.btn-visto').length) {
      return;
    }

    const $this = $(this);
    const $capitulos = $this.next('.capitulos-lista');
    const $chevron = $this.find('.chevron-icon');

    $capitulos.slideToggle(300);
    $chevron.toggleClass('rotated');
  });

  
  

  $('.modalManga').on('click', '.btn-visto', async function (e) {
    e.stopPropagation();
    
    const $btn = $(this);
    const tomoNum = $btn.data('tomo');
    const mangaId = $btn.data('manga-id');
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      console.error('Inicia sesion');
    }

    $btn.toggleClass('visto');
    const isVisto = $btn.hasClass('visto');

    const iconoOjoNormal = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"/></svg>`;
    const iconoOjoTachado = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5c0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28l.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22L21 20.73L3.27 3L2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65c0 1.66 1.34 3 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53c-2.76 0-5-2.24-5-5c0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15l.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`;
    
    $btn.find('svg').replaceWith(isVisto ? iconoOjoNormal : iconoOjoTachado);

    try {
      const res = await fetch('https://api-tfc-five.vercel.app/api/marcarCapituloVisto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          usuarioId: usuario._id, 
          mangaId: mangaId,
          tomo: tomoNum,
          visto: isVisto
        })
      });
      
      console.log("Respuesta status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Respuesta del servidor:', data);

      // Actualizar usuario en localStorage
      usuario.capitulos_vistos = data.capitulos_vistos;
      localStorage.setItem('usuario', JSON.stringify(usuario));

      console.log(`Tomo ${tomoNum} ${isVisto ? 'marcado' : 'desmarcado'} como visto`);
    } catch (err) {
      console.error('Error al actualizar capítulo visto:', err);
      // Revertir el cambio visual si hay error
      $btn.toggleClass('visto');
      $btn.find('svg').replaceWith(isVisto ? iconoOjoTachado : iconoOjoNormal);
      alert('Error al actualizar. Verifica que el endpoint /api/marcarCapituloVisto exista en tu API.');
    }
  });

  // Cerrar modal.
  $('.modalManga').on('click', '.cerrarModal', function () {
    $('.modalManga').removeClass('show').fadeOut(200);
  });

  $('.modalManga').on('click', function (e) {
    if ($(e.target).is('.modalManga')) {
      $(this).removeClass('show').fadeOut(200);
    }
  });



  $('.cartasWrap').on('click', '.heart-btn', async function (e) {
    e.stopPropagation();
    
    const $btn = $(this);
    const mangaId = $btn.data('id');

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) return alert('Debes iniciar sesión');
    const $card = $btn.closest('.card');
    const mangaCompleto = JSON.parse($card.attr('data-manga'));

    try {
      const res = await fetch('https://api-tfc-five.vercel.app/api/gustarManga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: usuario._id, manga: mangaCompleto })
      });
      const data = await res.json();

      const isLiked = data.lista_Fav.some(fav => fav._id === mangaId);
      $btn.toggleClass('liked', isLiked);
      $btn.find('.heart-icon').attr('fill', isLiked ? '#e0245e' : 'none');

      // Actualizar datos nuevos.
      usuario.lista_Fav = data.lista_Fav;
      usuario.capitulos_vistos = data.capitulos_vistos || [];
      localStorage.setItem('usuario', JSON.stringify(usuario));

    } catch (err) {
      console.error('Error al actualizar favoritos:', err);
    }
  });

});