document.addEventListener('DOMContentLoaded', function() {
    fetch('./api/imoveis.json')
        .then(response => response.json())
        .then(data => {
            inicializarPagina(data);
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
});

function inicializarPagina(data) {
    // Define o título da página
    document.title = data.tituloPagina;
    document.COMMENT_NODE = data.wame;

    // Renderiza a estrutura inicial da página
    const container = document.querySelector('.container');
    container.innerHTML = `
        <h1 class="text-center my-5">${data.tituloPagina}</h1>
        <div class="row tipos-container mb-5"></div>
        <div class="row detalhes-container"></div>
    `;

    // Adiciona os tipos de imóveis no topo
    const tiposContainer = container.querySelector('.tipos-container');
    data.tiposImoveis.forEach((tipo) => {
        const tipoCard = document.createElement('div');
        tipoCard.classList.add('col-6', 'col-md-4', 'col-lg-3', 'mb-4', 'tipo-card');

        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card', 'h-100');

        // Pega a primeira imagem do primeiro detalhe como representativa do tipo
        if (tipo.detalhes.length > 0 && tipo.detalhes[0].imagens.length > 0) {
            const imgTipo = document.createElement('img');
            imgTipo.src = tipo.detalhes[0].imagens[0].href;
            imgTipo.alt = `Imagem de ${tipo.tipo}`;
            imgTipo.classList.add('card-img-top', 'img-fluid', 'quadrado'); // Classe para forçar tamanho quadrado
            cardWrapper.appendChild(imgTipo);
            tipo['wame'] = data.wame;

            // Adiciona o evento de clique para exibir os detalhes do tipo
            imgTipo.addEventListener('click', () => mostrarDetalhes(tipo));
        }

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'text-center');

        // Adiciona o título do tipo
        const tituloTipo = document.createElement('h5');
        tituloTipo.textContent = tipo.tipo;
        cardBody.appendChild(tituloTipo);

        cardWrapper.appendChild(cardBody);
        tipoCard.appendChild(cardWrapper);
        tiposContainer.appendChild(tipoCard);
    });
}

function mostrarDetalhes(tipo) {
    // Renderiza os detalhes abaixo mantendo os tipos no topo
    const detalhesContainer = document.querySelector('.detalhes-container');
    detalhesContainer.innerHTML = `
        <h2 class="text-center col-12 mb-4" style="font-family: 'Roboto', sans-serif; font-size: 1.8rem; font-weight: 700; color: #34495e; border-bottom: 2px solid #2ecc71; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 1.5px;">
    Abaixo estão as opções de ${tipo.tipo}
</h2>

    `;

    // Adiciona os detalhes do tipo
    tipo.detalhes.forEach(detalhe => {
        if (detalhe.imagens.length > 0) {
            const detalheCard = document.createElement('div');
            detalheCard.classList.add('col-6', 'col-md-4', 'col-lg-3', 'mb-4');

            const cardWrapper = document.createElement('div');
            cardWrapper.classList.add('card', 'h-100');

            // Pega a primeira imagem do detalhe
            const imgDetalhe = document.createElement('img');
            imgDetalhe.src = detalhe.imagens[0].href;
            imgDetalhe.alt = detalhe.texto || 'Imagem do detalhe';
            imgDetalhe.classList.add('card-img-top', 'img-fluid', 'quadrado'); // Classe para forçar tamanho quadrado

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'text-center');

            // Adiciona informações do detalhe (valor e texto)
            const valor = document.createElement('p');
            valor.classList.add('valor', 'mb-2');
            valor.innerHTML = '<strong>' + detalhe.valor + '</strong>';

            const texto = document.createElement('p');
            texto.classList.add('texto');
            texto.textContent = detalhe.texto;

            cardBody.appendChild(valor);
            cardBody.appendChild(texto);

            // Monta o card completo
            cardWrapper.appendChild(imgDetalhe);
            cardWrapper.appendChild(cardBody);
            detalheCard.appendChild(cardWrapper);
            detalhesContainer.appendChild(detalheCard);

            // Evento de clique para abrir o modal do carrossel
            imgDetalhe.addEventListener('click', () => {
                atualizarCarrossel(detalhe.imagens, detalhe.texto, tipo.wame);
            });
        }
    });
}

function atualizarCarrossel(imagens, titulo, wame) {
    const modalLabel = document.getElementById('carrosselModalLabel');
    modalLabel.innerText = titulo;

    const carouselInner = document.querySelector('#carrosselImagens .carousel-inner');
    carouselInner.innerHTML = ''; // Limpa o conteúdo existente do carrossel

    imagens.forEach((imagem, index) => {
        const div = document.createElement('div');
        div.className = 'carousel-item' + (index === 0 ? ' active' : '');

        // Imagem principal no carrossel
        const img = document.createElement('img');
        img.className = 'd-block w-100'; // Ocupa toda a largura do modal
        img.src = imagem.href;
        img.alt = imagem.descricao || 'Imagem do carrossel';

        const descricao = document.createElement('div');
        descricao.classList.add('carousel-caption', 'd-md-block');
        descricao.innerHTML = `
            <p>${imagem.descricao || ''}</p>
        `;

        // Ícone do WhatsApp
        const whatsappLink = document.createElement('a');
        whatsappLink.href = wame + encodeURIComponent(titulo);
        whatsappLink.target = '_blank';
        whatsappLink.classList.add('btn', 'btn-success', 'mt-3');
        whatsappLink.innerHTML = `
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 20px; height: 20px; margin-right: 5px;">
            Contatar pelo WhatsApp
        `;

        descricao.appendChild(whatsappLink);

        div.appendChild(img);
        div.appendChild(descricao);
        carouselInner.appendChild(div);
    });

    // Abre o modal do carrossel após a configuração
    const carrosselModal = new bootstrap.Modal(document.getElementById('carrosselModal'));
    carrosselModal.show();
}
