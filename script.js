// script.js (COMPLETO)

// Função auxiliar para carregar e exibir os TCCs
async function loadCatalogo(filtroAno = '', filtroQuery = '') {
    const previewsContainer = document.getElementById('previews');
    previewsContainer.innerHTML = ''; 
    let tccsVisiveis = 0;

    // Se o filtro de ano ainda não foi populado, preenche.
    if (document.getElementById('yearFilter').options.length <= 1) {
        populateYearFilter();
    }

    catalogoTCCs.forEach((item, index) => {
        // Prepara dados para busca (usando a estrutura de item.autor e item.palavraschave)
        const autores = item.autor || '';
        const palavrasChave = item.palavraschave || '';
        const searchableText = `${item.titulo} ${autores} ${palavrasChave}`.toLowerCase();
        
        const itemAno = String(item.ano); // Converte o ano para string para comparação

        // Lógica de Filtro Combinada:
        const anoCorresponde = (filtroAno === '' || itemAno === filtroAno);
        const textoCorresponde = (filtroQuery === '' || searchableText.includes(filtroQuery));
        
        if (anoCorresponde && textoCorresponde) {
            tccsVisiveis++;

            const resultItem = document.createElement('div');
            resultItem.classList.add('tcc-item');
            resultItem.setAttribute('data-title', item.titulo.toLowerCase());
            resultItem.setAttribute('data-searchable-text', searchableText); 
            
            // GERAÇÃO DO HTML (Incluindo autores e palavras-chave)
            resultItem.innerHTML = `
                <div class="tcc-content">
                    <div class="text-content">
                        <div class="result-title">${item.titulo}</div>
                        
                        <p class="result-description">
                            <i class="fi fi-rr-user"></i> <strong>Autor(es):</strong> ${autores}
                        </p>
                        <p class="result-description keywords">
                            <i class="fi fi-rr-tags"></i> <strong>Palavras-Chave:</strong> ${palavrasChave}
                        </p>
                        
                        <br>
                        <a href="ficha.html?id=${index}" class="result-file">Ficha Catalográfica</a>
                        <br>
                        <br>
                        <a href="${encodeURI(item.arquivo)}" class="result-file" target="_blank">Acesse o arquivo PDF</a>
                    </div>
                </div>
            `;
            previewsContainer.appendChild(resultItem);
        }
    });

    // Depois de carregar e exibir, aplica o destaque (se houver query)
    highlightTextInPage(filtroQuery);

    // Opcional: Exibir mensagem se não houver resultados
    if (tccsVisiveis === 0) {
        previewsContainer.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 50px; font-size: 1.2rem; color: #666;">Nenhum TCC encontrado com os critérios de busca.</p>';
    }
}

/**
 * Preenche o dropdown de filtro com os anos disponíveis nos TCCs.
 */
function populateYearFilter() {
    const yearFilter = document.getElementById('yearFilter');
    const anosUnicos = [...new Set(catalogoTCCs.map(item => item.ano))]; // Extrai anos únicos
    
    // Ordena os anos em ordem decrescente
    anosUnicos.sort((a, b) => b - a);

    // Cria as opções no <select>
    anosUnicos.forEach(ano => {
        const option = document.createElement('option');
        option.value = String(ano);
        option.textContent = String(ano);
        yearFilter.appendChild(option);
    });
}


/**
 * Destaca a palavra encontrada na página HTML.
 */
function highlightTextInPage(query) {
    const elementsToHighlight = document.querySelectorAll('.result-title, .result-description');
    
    // 1. Remove o destaque anterior
    elementsToHighlight.forEach(element => {
        // Limpa destaques mantendo o HTML interno (ícones/negrito)
        const originalContent = element.getAttribute('data-original-html');
        if (originalContent) {
            element.innerHTML = originalContent;
            element.removeAttribute('data-original-html');
        }
    });

    if (!query) {
        return;
    }

    // 2. Aplica o novo destaque
    const regex = new RegExp(query, 'gi');
    
    elementsToHighlight.forEach(element => {
        // Salva o HTML original (com ícones/strong) antes de manipular
        if (!element.getAttribute('data-original-html')) {
            element.setAttribute('data-original-html', element.innerHTML);
        }

        const textContent = element.textContent;
        
        // Esta é uma lógica simplificada para não quebrar tags HTML internas (como <strong>)
        // Apenas aplica o destaque no texto puro:
        const highlighted = textContent.replace(regex, (match) => `<span class="highlight">${match}</span>`);
        
        // Substitui apenas o conteúdo de texto, tentando preservar a estrutura HTML
        element.innerHTML = element.innerHTML.replace(textContent, highlighted);
    });
}


// Função principal de filtro que combina busca de texto e ano
function applyFilters() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();
    const ano = document.getElementById("yearFilter").value;
    
    // Recarrega o catálogo com ambos os filtros
    loadCatalogo(ano, query);
}

// Ao carregar a página, exibe todos os TCCs e popula o filtro de ano
document.addEventListener('DOMContentLoaded', () => {
    loadCatalogo();
    
    // Adiciona o listener para a pesquisa de texto
    document.getElementById("searchInput").addEventListener("input", applyFilters);

    // Adiciona o listener para o filtro de ano
    document.getElementById("yearFilter").addEventListener("change", applyFilters);
});

// Nota: A função 'filterItems' e a lógica de display:none foi removida
// pois o novo 'loadCatalogo' lida com a filtragem eficiente refazendo a lista.