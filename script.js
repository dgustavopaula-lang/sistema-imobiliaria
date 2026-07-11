// ==========================
// CONTROLE DE ABAS
// ==========================
function mostrarAba(nomeAba) {
    document.querySelectorAll('.aba-conteudo').forEach(function (secao) {
        secao.style.display = 'none';
    });
    document.querySelectorAll('.aba-btn').forEach(function (botao) {
        botao.classList.remove('ativa');
    });

    document.getElementById('aba-' + nomeAba).style.display = 'block';
    event.target.classList.add('ativa');
}

// ==========================
// DADOS (LocalStorage)
// ==========================
function carregarImoveis() {
    return JSON.parse(localStorage.getItem('imoveis')) || [];
}
function salvarImoveis(lista) {
    localStorage.setItem('imoveis', JSON.stringify(lista));
}

function carregarClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
}
function salvarClientes(lista) {
    localStorage.setItem('clientes', JSON.stringify(lista));
}

function carregarInteresses() {
    return JSON.parse(localStorage.getItem('interesses')) || [];
}
function salvarInteresses(lista) {
    localStorage.setItem('interesses', JSON.stringify(lista));
}

// ==========================
// IMOVEIS - CADASTRO
// ==========================
const formImovel = document.getElementById('form-imovel');

formImovel.addEventListener('submit', function (e) {
    e.preventDefault();

    const endereco = document.getElementById('endereco').value.trim();
    const tipo = document.getElementById('tipo-imovel').value;
    const area = document.getElementById('area').value;
    const valor = document.getElementById('valor').value;
    const status = document.getElementById('status-imovel').value;

    const imoveis = carregarImoveis();

    imoveis.push({
        id: Date.now(),
        endereco: endereco,
        tipo: tipo,
        area: area,
        valor: valor,
        status: status
    });

    salvarImoveis(imoveis);
    formImovel.reset();
    renderizarImoveis();
    preencherSelectImoveis();
});

// ==========================
// IMOVEIS - RENDERIZAR TABELA
// ==========================
function renderizarImoveis(filtro) {
    const tbody = document.querySelector('#tabela-imoveis tbody');
    tbody.innerHTML = '';

    let imoveis = carregarImoveis();

    if (filtro) {
        const termo = filtro.toLowerCase();
        imoveis = imoveis.filter(function (i) {
            return i.endereco.toLowerCase().includes(termo);
        });
    }

    imoveis.forEach(function (i) {
        const tr = document.createElement('tr');
        const classeStatus = 'tag-' + i.status.toLowerCase();
        tr.innerHTML =
            '<td>' + i.endereco + '</td>' +
            '<td>' + i.tipo + '</td>' +
            '<td>' + i.area + ' m2</td>' +
            '<td>' + formatarMoeda(i.valor) + '</td>' +
            '<td class="' + classeStatus + '">' + i.status + '</td>' +
            '<td>' +
                '<button class="btn-excluir" onclick="excluirImovel(' + i.id + ')">Excluir</button>' +
            '</td>';
        tbody.appendChild(tr);
    });
}

function excluirImovel(id) {
    if (!confirm('Tem certeza que deseja excluir este imovel? Isso nao remove interesses ja registrados.')) {
        return;
    }
    let imoveis = carregarImoveis();
    imoveis = imoveis.filter(function (i) {
        return i.id !== id;
    });
    salvarImoveis(imoveis);
    renderizarImoveis();
    preencherSelectImoveis();
}

// ==========================
// BUSCA DE IMOVEIS
// ==========================
document.getElementById('busca-imovel').addEventListener('input', function (e) {
    renderizarImoveis(e.target.value);
});

// ==========================
// CLIENTES - CADASTRO
// ==========================
const formCliente = document.getElementById('form-cliente');

formCliente.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome-cliente').value.trim();
    const telefone = document.getElementById('telefone-cliente').value.trim();
    const interesse = document.getElementById('interesse-cliente').value;

    const clientes = carregarClientes();

    clientes.push({
        id: Date.now(),
        nome: nome,
        telefone: telefone,
        interesse: interesse
    });

    salvarClientes(clientes);
    formCliente.reset();
    renderizarClientes();
    preencherSelectClientes();
});

// ==========================
// CLIENTES - RENDERIZAR TABELA
// ==========================
function renderizarClientes(filtro) {
    const tbody = document.querySelector('#tabela-clientes tbody');
    tbody.innerHTML = '';

    let clientes = carregarClientes();

    if (filtro) {
        const termo = filtro.toLowerCase();
        clientes = clientes.filter(function (c) {
            return c.nome.toLowerCase().includes(termo);
        });
    }

    clientes.forEach(function (c) {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + c.nome + '</td>' +
            '<td>' + c.telefone + '</td>' +
            '<td>' + c.interesse + '</td>' +
            '<td>' +
                '<button class="btn-excluir" onclick="excluirCliente(' + c.id + ')">Excluir</button>' +
            '</td>';
        tbody.appendChild(tr);
    });
}

function excluirCliente(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }
    let clientes = carregarClientes();
    clientes = clientes.filter(function (c) {
        return c.id !== id;
    });
    salvarClientes(clientes);
    renderizarClientes();
    preencherSelectClientes();
}

// ==========================
// BUSCA DE CLIENTES
// ==========================
document.getElementById('busca-cliente').addEventListener('input', function (e) {
    renderizarClientes(e.target.value);
});

// ==========================
// PREENCHER SELECTS (Interesses)
// ==========================
function preencherSelectClientes() {
    const clientes = carregarClientes();
    const select = document.getElementById('cliente-select');
    select.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach(function (c) {
        const opcao = document.createElement('option');
        opcao.value = c.id;
        opcao.textContent = c.nome;
        select.appendChild(opcao);
    });
}

function preencherSelectImoveis() {
    const imoveis = carregarImoveis();
    const select = document.getElementById('imovel-select');
    select.innerHTML = '<option value="">Selecione um imovel</option>';

    imoveis.forEach(function (i) {
        const opcao = document.createElement('option');
        opcao.value = i.id;
        opcao.textContent = i.endereco + ' - ' + i.tipo;
        select.appendChild(opcao);
    });
}

// ==========================
// INTERESSES - CADASTRO
// ==========================
const formInteresse = document.getElementById('form-interesse');

formInteresse.addEventListener('submit', function (e) {
    e.preventDefault();

    const clienteId = document.getElementById('cliente-select').value;
    const clienteNome = document.getElementById('cliente-select').selectedOptions[0].textContent;
    const imovelId = document.getElementById('imovel-select').value;
    const imovelDescricao = document.getElementById('imovel-select').selectedOptions[0].textContent;

    const interesses = carregarInteresses();

    interesses.push({
        id: Date.now(),
        clienteId: clienteId,
        clienteNome: clienteNome,
        imovelId: imovelId,
        imovelDescricao: imovelDescricao,
        data: new Date().toLocaleDateString('pt-BR')
    });

    salvarInteresses(interesses);
    formInteresse.reset();
    renderizarInteresses();
});

// ==========================
// INTERESSES - RENDERIZAR LISTA
// ==========================
function renderizarInteresses() {
    const container = document.getElementById('lista-interesses');
    container.innerHTML = '';

    let interesses = carregarInteresses();
    interesses = interesses.slice().reverse();

    interesses.forEach(function (item) {
        const div = document.createElement('div');
        div.className = 'interesse-item';
        div.innerHTML =
            '<h3>' + item.clienteNome + '</h3>' +
            '<p><strong>Imovel:</strong> ' + item.imovelDescricao + '</p>' +
            '<p><strong>Data do registro:</strong> ' + item.data + '</p>' +
            '<button class="btn-excluir" onclick="excluirInteresse(' + item.id + ')">Excluir Registro</button>';
        container.appendChild(div);
    });
}

function excluirInteresse(id) {
    if (!confirm('Tem certeza que deseja excluir este registro de interesse?')) {
        return;
    }
    let interesses = carregarInteresses();
    interesses = interesses.filter(function (item) {
        return item.id !== id;
    });
    salvarInteresses(interesses);
    renderizarInteresses();
}

// ==========================
// FUNCAO AUXILIAR: FORMATAR MOEDA
// ==========================
function formatarMoeda(valor) {
    return 'R$ ' + parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// ==========================
// INICIALIZACAO DO SISTEMA
// ==========================
renderizarImoveis();
renderizarClientes();
renderizarInteresses();
preencherSelectClientes();
preencherSelectImoveis();