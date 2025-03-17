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
    const detalhesContainer = document.querySelector('.detalhes-container');
    detalhesContainer.innerHTML = `
        <h2 class="text-center col-12 mb-4" style="font-family: 'Roboto', sans-serif; font-size: 1.8rem; font-weight: 700; color: #34495e; border-bottom: 2px solid #2ecc71; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 1.5px;">
            Abaixo estão as opções de ${tipo.tipo}
        </h2>
    `;

    tipo.detalhes.forEach(detalhe => {
        if (detalhe.imagens.length > 0) {
            const detalheCard = document.createElement('div');
            detalheCard.classList.add('col-6', 'col-md-4', 'col-lg-3', 'mb-4');

            const cardWrapper = document.createElement('div');
            cardWrapper.classList.add('card', 'h-100');

            // Imagem
            const imgDetalhe = document.createElement('img');
            imgDetalhe.src = detalhe.imagens[0].href;
            imgDetalhe.alt = detalhe.texto || 'Imagem do detalhe';
            imgDetalhe.classList.add('card-img-top', 'img-fluid', 'quadrado');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'text-center');

            // Texto e valor
            const valor = document.createElement('p');
            valor.classList.add('valor', 'mb-2');
            valor.innerHTML = '<strong>' + detalhe.valor + '</strong>';

            const texto = document.createElement('p');
            texto.classList.add('texto');
            texto.textContent = detalhe.texto;

            // Botão "Saiba mais"
            const saibaMaisBtn = document.createElement('button');
            saibaMaisBtn.classList.add('btn', 'btn-primary', 'mt-3');
            saibaMaisBtn.textContent = 'Saiba mais';
            saibaMaisBtn.addEventListener('click', () => {
                atualizarCarrossel(detalhe.imagens, detalhe.texto, detalhe.detalhes, tipo.wame);
            });

            cardBody.appendChild(valor);
            cardBody.appendChild(texto);
            cardBody.appendChild(saibaMaisBtn);

            cardWrapper.appendChild(imgDetalhe);
            cardWrapper.appendChild(cardBody);
            detalheCard.appendChild(cardWrapper);
            detalhesContainer.appendChild(detalheCard);
        }
    });
}

// Atualize a Função `atualizarCarrossel`
function atualizarCarrossel(imagens, titulo, detalhes, wame) {
    // Atualiza o título no modalLabel (cabeçalho do carrossel)
    const modalLabel = document.getElementById('carrosselModalLabel');
    modalLabel.textContent = titulo;
    modalLabel.innerHTML += `
        <a href="${wame + encodeURIComponent(titulo)}" target="_blank" style="margin-left: 10px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 20px; height: 20px; vertical-align: middle; cursor: pointer;">
        </a>`

    // Atualiza o rodapé com os detalhes
    const detalhesTexto = detalhes.replace(/\n/g, '<br>'); // Substitui \n por <br>
    const modalFooter = document.getElementById('carrosselModalFooter');
    modalFooter.innerHTML = detalhesTexto || 'Nenhuma informação adicional disponível.';; 

    const carouselInner = document.querySelector('#carrosselImagens .carousel-inner');
    carouselInner.innerHTML = ''; // Limpa o conteúdo existente do carrossel

    // Adiciona imagens ao carrossel com descrição
    imagens.forEach((imagem, index) => {
        const div = document.createElement('div');
        div.className = 'carousel-item' + (index === 0 ? ' active' : ''); // Define a classe active na primeira imagem

        // Imagem principal do carrossel
        const img = document.createElement('img');
        img.className = 'd-block w-100'; // Ocupa toda a largura do slide
        img.src = imagem.href;
        img.alt = imagem.descricao || 'Imagem do carrossel';

        // Descrição da imagem dentro do carrossel
        const descricao = document.createElement('div');
        descricao.classList.add('carousel-caption', 'd-md-block');
        descricao.innerHTML = `
            <p>${imagem.descricao || ''}</p>
        `;

        div.appendChild(img);
        div.appendChild(descricao);
        carouselInner.appendChild(div);
    });

    // Mostra o carrossel
    const carrosselModal = new bootstrap.Modal(document.getElementById('carrosselModal'));
    carrosselModal.show();
}