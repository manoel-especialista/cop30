let wameOriginal = ''; // Armazena o valor original 

document.addEventListener('DOMContentLoaded', function () {
    fetch('./api/imoveis.json')
        .then(response => response.json())
        .then(data => {
            inicializarPagina(data);
            adicionarBotaoWhatsApp(data.wame); // Adiciona o botão flutuante ao carregar a página
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
});



function adicionarBotaoWhatsApp(wame) {
    // Verifica se o WhatsApp link está disponível
    if (!wame) return;

    // Cria o botão flutuante
    const botaoWhatsApp = document.createElement('div');
    botaoWhatsApp.classList.add('whatsapp-float');

    // Conteúdo do botão
    botaoWhatsApp.innerHTML = `
        <a href="${wame}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" title="Entre em contato pelo WhatsApp">
        </a>
    `;

    // Adiciona o botão ao corpo da página
    document.body.appendChild(botaoWhatsApp);
}


function inicializarPagina(data) {
    // Define o título da página
    document.title = data.tituloPagina;

    // Atualiza o título do Header com o título vindo do JSON
    const header = document.querySelector('header');
    header.querySelector('h1').textContent = data.tituloPagina;

    // Salva o valor original de wame
    wameOriginal = data.wame;

    // Renderiza os tipos de imóveis na seção correta
    renderizarTipos(data.tiposImoveis, data.wame);

    // Limpa a área de detalhes ao carregar a página
    limparDetalhes();
}

function limparDetalhes() {
    // Garante que o container de detalhes esteja vazio
    const detalhesContainer = document.querySelector('.detalhes-container');
    if (detalhesContainer) {
        detalhesContainer.innerHTML = '';
    }
}

function renderizarTipos(tiposImoveis, wame) {
    const tiposContainer = document.querySelector('.tipos-container');

    tiposImoveis.forEach((tipo) => {
        const tipoCard = document.createElement('div');
        tipoCard.classList.add('col-12', 'col-sm-6', 'col-lg-3', 'mb-4', 'tipo-card');

        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card', 'h-100');

        // Pega a primeira imagem representativa do tipo
        if (tipo.detalhes.length > 0 && tipo.detalhes[0].imagens.length > 0) {
            const imgTipo = document.createElement('img');
            imgTipo.src = tipo.detalhes[0].imagens[0].href;
            imgTipo.alt = `Imagem de ${tipo.tipo}`;
            imgTipo.classList.add('card-img-top', 'img-fluid', 'quadrado'); // Imagem responsiva
            cardWrapper.appendChild(imgTipo);

            // Adiciona o evento de clique para exibir os detalhes do tipo
            imgTipo.addEventListener('click', () => {
                mostrarDetalhes(tipo, wameOriginal); // Usa o valor original de wame
            });
        }

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'text-center');

        // Adiciona o título do tipo
        const tituloTipo = document.createElement('h5');
        tituloTipo.textContent = tipo.tipo;
        tituloTipo.classList.add('fw-bold');
        cardBody.appendChild(tituloTipo);

        cardWrapper.appendChild(cardBody);
        tipoCard.appendChild(cardWrapper);
        tiposContainer.appendChild(tipoCard);
    });
}

function mostrarDetalhes(tipo, wame) {
    const detalhesContainer = document.querySelector('.detalhes-container');
    detalhesContainer.innerHTML = `
        <h2 class="text-center col-12 mb-4" style="font-size: 1.8rem; font-weight: 700; color: #343a40;">
            Abaixo estão as opções de ${tipo.tipo}
        </h2>
    `;

    tipo.detalhes.forEach((detalhe) => {
        if (detalhe.imagens.length > 0) {
            const detalheCard = document.createElement('div');
            detalheCard.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4');

            const cardWrapper = document.createElement('div');
            cardWrapper.classList.add('card', 'h-100');

            // Imagem do imóvel
            const imgDetalhe = document.createElement('img');
            imgDetalhe.src = detalhe.imagens[0].href;
            imgDetalhe.alt = detalhe.texto || 'Imagem do detalhe';
            imgDetalhe.classList.add('card-img-top', 'img-fluid', 'quadrado');

            // Corpo do card
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'text-center');

            // Texto e valor
            const valor = document.createElement('p');
            valor.classList.add('valor', 'mb-2');
            valor.innerHTML = detalhe.valor ? `<strong>${detalhe.valor}</strong>` : 'Valor não disponível';

            const texto = document.createElement('p');
            texto.classList.add('texto', 'text-muted');
            texto.textContent = detalhe.texto;

            // Botão "Saiba mais"
            const saibaMaisBtn = document.createElement('button');
            saibaMaisBtn.classList.add('btn', 'btn-primary', 'mt-3');
            saibaMaisBtn.textContent = 'Saiba mais';

            // Adiciona evento ao botão para abrir o carrossel e ajustar o link do WhatsApp
            saibaMaisBtn.addEventListener('click', () => {
                atualizarCarrossel(detalhe.imagens, detalhe.texto, detalhe.detalhes);
                atualizarLinkWhatsApp(wame, detalhe.texto); // Atualiza o botão WhatsApp
            });

            imgDetalhe.addEventListener('click', () => {
                atualizarCarrossel(detalhe.imagens, detalhe.texto, detalhe.detalhes);
                atualizarLinkWhatsApp(wame, detalhe.texto); // Atualiza o botão WhatsApp
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

    // Rola até o título <h2> após a renderização
    const titulo = detalhesContainer.querySelector('h2');
    if (titulo) {
        setTimeout(() => {
            titulo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // Garante que o título esteja renderizado
    }

    // Restaura o botão WhatsApp ao valor original ao voltar
    atualizarLinkWhatsApp(wameOriginal);
}

function atualizarCarrossel(imagens, titulo, detalhes) {
    // Atualiza o título no modalLabel (cabeçalho do carrossel)
    const modalLabel = document.getElementById('carrosselModalLabel');
    modalLabel.textContent = titulo;

    // Atualiza o rodapé com os detalhes
    const detalhesTexto = detalhes.replace(/\n/g, '<br>'); // Substitui \n por <br>
    const modalFooter = document.getElementById('carrosselModalFooter');
    modalFooter.innerHTML = detalhesTexto || 'Nenhuma informação adicional disponível.';

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

    // Adiciona o botão flutuante do WhatsApp dentro do carrossel
    const carrosselModal = document.getElementById('carrosselModal');
    const botaoWhatsApp = document.createElement('div');
    botaoWhatsApp.classList.add('whatsapp-float');
    botaoWhatsApp.innerHTML = `
        <a href="https://wa.me/?text=${encodeURIComponent(titulo)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" title="Entre em contato pelo WhatsApp">
        </a>
    `;
    carrosselModal.appendChild(botaoWhatsApp);

    // Mostra o carrossel
    const bootstrapModal = new bootstrap.Modal(carrosselModal);
    bootstrapModal.show();
}


function atualizarLinkWhatsApp(wame, texto = '') {
    const botaoWhatsApp = document.querySelector('.whatsapp-float a');
    if (botaoWhatsApp) {
        botaoWhatsApp.href = texto ? `${wame}${encodeURIComponent(texto)}` : wame;
    }
}
