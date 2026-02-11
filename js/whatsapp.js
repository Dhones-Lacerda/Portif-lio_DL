function sendWhats(event) {
            event.preventDefault(); // Impede o comportamento padrão do formulário de recarregar a página
        const nome = document.getElementById('nome');
        const telefone = document.getElementById('telefone');
        const mensagem = document.getElementById('mensagem');
        const meutelefone = '5577988423616'; // Substitua pelo seu número de telefone
        const texto = `Olá! Me chamo ${nome.value}, meu telefone whatsapp é ${telefone.value}, ${mensagem.value}`; // Personalize a mensagem conforme necessário
        const msgFormat = encodeURIComponent(texto); // formata a mensagem para

        const url = `https://wa.me/${meutelefone}?text=${msgFormat}`; // URL do WhatsApp com a mensagem

        window.open(url, '_blank'); // Abre o WhatsApp em uma nova aba
        }