// main.js - Lógica de Roteamento SPA

document.addEventListener('DOMContentLoaded', () => {
    // 1. Oculta todos os contêineres de seção (exceto o inicial)
    const sectionContainers = document.querySelectorAll('.section-container');
    // Inicializa ocultando todos. Assumimos que o CSS controla o display via classes.
    // Para simplificar via DOM, podemos definir display: none em todos, e display: block no ativo.
    sectionContainers.forEach(container => {
        container.style.display = 'none'; 
    });
    
    // Exibe a seção 'inicio' por padrão
    const defaultSection = document.getElementById('inicio');
    if(defaultSection) defaultSection.style.display = 'block';

    // 2. Intercepta os cliques de navegação (Links da Navbar e Rodapé)
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a, .btn-custom-primary');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            
            // Verifica se o link é interno (tem hash # ou aponta para uma seção SPA)
            // No seu código, você já usa onclick="showSection('id', event)", 
            // então vamos padronizar essa função.
            
            // Impede o recarregamento da página caso o href seja uma URL
            event.preventDefault(); 
            
            // Lógica para extrair o ID do alvo. 
            // Você pode usar o href (ex: href="#projetos") ou um data-attribute.
            let targetId = this.getAttribute('href').replace('#', '');
            
            // Se o href for 'projetos.html', limpamos para 'projetos'
            if(targetId.includes('.html')) {
                targetId = targetId.split('.')[0]; 
            }
            // Mapeamento: index -> inicio
            if(targetId === 'index' || targetId === '') targetId = 'inicio';

            showSection(targetId);
            
            // Atualiza a classe ativa na Navbar
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            if(this.classList.contains('nav-link')){
                this.classList.add('active');
            } else {
                 // Se o clique veio do rodapé/botão, procura o link correspondente na navbar
                 const correspondingNavLink = document.querySelector(`.nav-link[href*="${targetId}"]`);
                 if(correspondingNavLink) correspondingNavLink.classList.add('active');
            }
        });
    });
});

// 3. Função Global de Renderização (Manipulação do DOM)
function showSection(sectionId, event = null) {
    if(event) event.preventDefault();

    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
        // Oculta todos os contêineres
        document.querySelectorAll('.section-container').forEach(container => {
            container.style.display = 'none';
        });

        // Exibe o contêiner alvo
        targetSection.style.display = 'block';
        
        // Aplica uma animação de fade-in para transição suave (requer CSS)
        targetSection.classList.add('animate__animated', 'animate__fadeIn');

        // Rola para o topo da página suavemente
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // (Opcional) Fecha o menu hambúrguer no mobile após o clique
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click(); // Usa o Bootstrap para fechar
        }
    } else {
        console.warn(`Seção '${sectionId}' não encontrada no DOM.`);
    }
}