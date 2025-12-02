import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();
const porta = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'campeonato-lol-2024-secreto',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

let equipes = [];
let jogadores = []; 
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Campeonato LoL</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
                .container {
                    max-width: 600px;
                    margin: 100px auto;
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 30px;
                }
                p {
                    color: #666;
                    line-height: 1.6;
                    text-align: center;
                }
                .btn {
                    display: block;
                    width: 100%;
                    padding: 15px;
                    background: #667eea;
                    color: white;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    font-size: 16px;
                }
                .btn:hover {
                    background: #5568d3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Campeonato Amador de League of Legends</h1>
                <p>Sistema de gerenciamento de equipes e jogadores</p>
                <p>Faca login para acessar o sistema</p>
                <a href="/login" class="btn">Fazer Login</a>
            </div>
        </body>
        </html>
    `);
});

app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
                .container {
                    max-width: 400px;
                    margin: 100px auto;
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    color: #555;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                button {
                    width: 100%;
                    padding: 15px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                }
                button:hover {
                    background: #5568d3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Login no Sistema</h1>
                <form method="POST" action="/autenticar">
                    <div class="form-group">
                        <label>Usuario:</label>
                        <input type="text" name="usuario" required>
                    </div>
                    <div class="form-group">
                        <label>Senha:</label>
                        <input type="password" name="senha" required>
                    </div>
                    <button type="submit">Entrar</button>
                </form>
            </div>
        </body>
        </html>
    `);
}); 
app.post('/autenticar', (req, res) => {
    const { usuario, senha } = req.body;
    
    if(usuario === 'admin' && senha === '123') {
        req.session.usuarioLogado = usuario;
        
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString('pt-BR');
        const horaFormatada = agora.toLocaleTimeString('pt-BR');
        res.cookie('ultimoAcesso', `${dataFormatada} as ${horaFormatada}`, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        
        res.redirect('/menu');
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                    }
                    .container {
                        max-width: 500px;
                        margin: 100px auto;
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        text-align: center;
                    }
                    h1 {
                        color: #d32f2f;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 30px;
                        background: #667eea;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Usuario ou senha incorretos</h1>
                    <p>Tente novamente</p>
                    <a href="/login">Voltar</a>
                </div>
            </body>
            </html>
        `);
    }
});

 app.get('/menu', (req, res) => {
    if(!req.session.usuarioLogado) {
        res.redirect('/login');
        return;
    }
    
    const ultimoAcesso = req.cookies.ultimoAcesso || 'Primeiro acesso ao sistema';
    
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Menu Principal</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                     min-height: 100vh;
                }
                .header {
                    background: rgba(0,0,0,0.2);
                    padding: 15px 0;
                    text-align: center;
                    color: white;
                    margin-bottom: 30px;
                }
                .container {
                    max-width: 700px;
                    margin: 50px auto;
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                     box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 10px;
                }
                .info-acesso {
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 30px;
                    padding: 10px;
                   
                    background: #f0f0f0;
                    border-radius: 5px;
                }
                .menu-opcoes {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .opcao {
                    display: block;
                     padding: 30px 20px;
                    background: #667eea;
                    color: white;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 18px;
                    transition: all 0.3s;
                }
                .opcao:hover {
                    background: #5568d3;
                    transform: translateY(-2px);
                }
                
                .btn-logout {
                    display: block;
                    width: 100%;
                    padding: 15px;
                    background: #d32f2f;
                    color: white;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .btn-logout:hover {
                    background: #b71c1c;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Campeonato de LOL - Sistema de Gerenciamento de equipes e jogadores</h2>
            </div>
           
            <div class="container">
                <h1>Menu Principal</h1>
                <div class="info-acesso">
                    Ultimo acesso: ${ultimoAcesso}
                </div>
                <div class="menu-opcoes">
                    <a href="/cadastrar-equipe" class="opcao">Cadastrar Equipe</a>
                    <a href="/cadastrar-jogador" class="opcao">Cadastrar Jogador</a>
                
                    </div>
                <a href="/logout" class="btn-logout">Sair do Sistema</a>
            </div>
        </body>
        </html>
    `);
});
app.get('/cadastrar-equipe', (req, res) => {
    if(!req.session.usuarioLogado) {
        res.redirect('/login');
        return;
    }
    
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastrar Equipe</title>
            <style>
                body {
                       font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
                .container {
                    max-width: 700px;
                     margin: 50px auto;
                    background: white;
                      padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                    margin-bottom: 30px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    color: #555;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                button {
                     width: 100%;
                    padding: 15px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-top: 10px;
                }
                button:hover {
                    background: #5568d3;
                }
               
                .btn-voltar {
                    display: inline-block;
                    padding: 12px 25px;
                    background: #757575;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .btn-voltar:hover {
                    background: #616161;
                }
                .obrigatorio {
                    color: red;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Cadastro de Equipe</h1>
                <form method="POST" action="/salvar-equipe">
                    <div class="form-group">
                        <label>Nome da Equipe: <span class="obrigatorio">*</span></label>
                        <input type="text" name="nomeEquipe" required>
                    </div>
                             <div class="form-group">
                        <label>Nome do Capitao: <span class="obrigatorio">*</span></label>
                        <input type="text" name="nomeCapitao" required>
                    </div>
                    <div class="form-group">
                        <label>Telefone/WhatsApp do Capitao: <span class="obrigatorio">*</span></label>
                        <input type="text" name="telefoneCapitao" placeholder="(00) 00000-0000" required>
                    </div>
                        <button type="submit">Cadastrar Equipe</button>
                </form>
                <a href="/menu" class="btn-voltar">Voltar ao Menu</a>
            </div>
        </body>
        </html>
    `);
});

app.post('/salvar-equipe', (req, res) => {
    if(!req.session.usuarioLogado) {
        res.redirect('/login');
        return;
    }
    
    const { nomeEquipe, nomeCapitao, telefoneCapitao } = req.body;
    
    let erros = [];
    
    if(!nomeEquipe || nomeEquipe.trim() === '') {
        erros.push('Nome da equipe e obrigatorio');
    }
    if(!nomeCapitao || nomeCapitao.trim() === '') {
        erros.push('Nome do capitao e obrigatorio');
    }
    if(!telefoneCapitao || telefoneCapitao.trim() === '') {
        erros.push('Telefone do capitao e obrigatorio');
    }
    
    if(erros.length > 0) {
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro de Validacao</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                    }
                    .container {
                        max-width: 600px;
                        margin: 100px auto;
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                    }
                    h1 {
                        color: #d32f2f;
                    }
                    ul {
                        color: #666;
                        line-height: 2;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 30px;
                        background: #667eea;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Erro ao cadastrar equipe</h1>
                    <p>Os seguintes erros foram encontrados:</p>
                    <ul>
                        ${erros.map(erro => `<li>${erro}</li>`).join('')}
                    </ul>
                    <a href="/cadastrar-equipe">Voltar</a>
                </div>
            </body>
            </html>
        `);
        return;
    }
    
    equipes.push({
        nome: nomeEquipe,
        capitao: nomeCapitao,
        telefone: telefoneCapitao
    });
    
    res.redirect('/lista-equipes');
});
app.get('/lista-equipes', (req, res) => {
    if(!req.session.usuarioLogado) {
        res.redirect('/login');
        return;
    }
    
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Equipes Cadastradas</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
                .container {
                    max-width: 900px;
                    margin: 50px auto;
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                }
                h1 {
                    color: #333;
                    margin-bottom: 30px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background: #667eea;
                    color: white;
                }
                tr:hover {
                    background: #f5f5f5;
                }
                .botoes {
                    display: flex;
                    gap: 15px;
                }
                a {
                    padding: 12px 25px;
                    background: #667eea;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
                a:hover {
                    background: #5568d3;
                }
                .btn-menu {
                    background: #757575;
                }
                .btn-menu:hover {
                    background: #616161;
                }
                .vazio {
                    text-align: center;
                    color: #999;
                    padding: 40px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Equipes Cadastradas</h1>
                ${equipes.length === 0 ? `
                    <div class="vazio">
                        <p>Nenhuma equipe cadastrada ainda</p>
                    </div>
                ` : `
                    <table>
                        <thead>
                            <tr>
                                <th>Nome da Equipe</th>
                                <th>Capitao</th>
                                <th>Telefone/WhatsApp</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${equipes.map(equipe => `
                                <tr>
                                    <td>${equipe.nome}</td>
                                    <td>${equipe.capitao}</td>
                                    <td>${equipe.telefone}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `}
                <div class="botoes">
                    <a href="/cadastrar-equipe">Nova Equipe</a>
                    <a href="/menu" class="btn-menu">Voltar ao Menu</a>
                </div>
            </div>
        </body>
        </html>
    `);
});
app.get('/cadastrar-jogador', (req, res) => {
    if(!req.session.usuarioLogado) {
        res.redirect('/login');
        return;
    }
    
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastrar Jogador</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #106ebbff 100%);
                    min-height: 100vh;
                }
                .container {
                    max-width: 700px;
                    margin: 50px auto;
                       background: white;
                    padding: 40px;
                    border-radius: 10px;
                }
                h1 {
                    color: #333;
                    margin-bottom: 30px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    color: #555;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                input, select {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                button {
                    width: 100%;
                    padding: 15px;
                    background: #667eea;
                    color: white;
                    border: none;
                      border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-top: 10px;
                }
                button:hover {
                    background: #5568d3;
                }
                .btn-voltar {
                    display: inline-block;
                    padding: 12px 25px;
                    background: #757575;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .btn-voltar:hover {
                    background: #616161;
                }
                .obrigatorio {
                    color: red;
                }
                .aviso {
                    background: #fff3cd;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Cadastro de Jogador</h1>
                ${equipes.length === 0 ? `
                    <div class="aviso">
                        <strong>Atenção:</strong> Voce precisa cadastrar pelo menos uma equipe antes de cadastrar jogadores.
                    </div>
                    <a href="/cadastrar-equipe" class="btn-voltar">Cadastrar Equipe</a>
                    <a href="/menu" class="btn-voltar">Voltar ao Menu</a>
                ` : `
                    <form method="POST" action="/salvar-jogador">
                        <div class="form-group">
                            <label>Nome do Jogador: <span class="obrigatório">*</span></label>
                            <input type="text" name="nomeJogador" required>
                        </div>
                        <div class="form-group">
                            <label>Nickname in-game: <span class="obrigatório">*</span></label>
                            <input type="text" name="nickname" required>
                        </div>
                        <div class="form-group">
                            <label>Função (Posição): <span class="obrigatório">*</span></label>
                            <select name="funcao" required>
                                <option value="">Selecione uma função</option>
                                <option value="Top">Top</option>
                                <option value="Jungle">Jungle</option>
                                <option value="Mid">Mid</option>
                                <option value="Atirador">Atirador</option>
                                <option value="Suporte">Suporte</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>ível (Ranqueado): <span class="obrigatório">*</span></label>
                            <select name="nivel" required>
                                <option value="">Selecione o nivel</option>
                                <option value="Ferro">Ferro</option>
                                <option value="Bronze">Bronze</option>
                                <option value="Prata">Prata</option>
                                <option value="Ouro">Ouro</option>
                                <option value="Platina">Platina</option>
                                <option value="Esmeralda">Esmeralda</option>
                                <option value="Diamante">Diamante</option>
                                <option value="Mestre">Mestre</option>
                                <option value="Grao-Mestre">Grao-Mestre</option>
                                <option value="Desafiante">Desafiante</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Genero: <span class="obrigatorio">*</span></label>
                            <select name="genero" required>
                                <option value="">Selecione o genero</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Equipe: <span class="obrigatorio">*</span></label>
                            <select name="equipe" required>
                                <option value="">Selecione uma equipe</option>
                                ${equipes.map(equipe => `<option value="${equipe.nome}">${equipe.nome}</option>`).join('')}
                            </select>
                        </div>
                        <button type="submit">Cadastrar Jogador</button>
                    </form>
                    <a href="/menu" class="btn-voltar">Voltar ao Menu</a>
                `}
            </div>
        </body>
        </html>
    `);
});
app.post('/salvar-jogador', (req, res) => {
    if(!req.session.usuarioLogado) {
        res.redirect('/login');
        return;
    }
    
    const { nomeJogador, nickname, funcao, nivel, genero, equipe } = req.body;
    
    let erros = [];
    
    if(!nomeJogador || nomeJogador.trim() === '') {
        erros.push('Nome do jogador e obrigatorio');
    }
    if(!nickname || nickname.trim() === '') {
        erros.push('Nickname e obrigatorio');
    }
    if(!funcao || funcao === '') {
        erros.push('Funcao e obrigatoria');
    }
    if(!nivel || nivel === '') {
        erros.push('Nivel e obrigatorio');
    }
    if(!genero || genero === '') {
        erros.push('Genero e obrigatorio');
    }
    if(!equipe || equipe === '') {
        erros.push('Equipe e obrigatoria');
    }
    
    if(erros.length > 0) {
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro de Validacao</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                         min-height: 100vh;
                    }
                    .container {
                        max-width: 600px;
                        margin: 100px auto;
                        background: white;
                        padding: 40px;
                       
                        border-radius: 10px;
                    }
                    h1 {
                        color: #d32f2f;
                    }
                    ul {
                        color: #666;
                        line-height: 2;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 30px;
                        background: #667eea;
                         color: white;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                       <h1>Erro ao cadastrar jogador</h1>
                    <p>Os seguintes erros foram encontrados:</p>
                    <ul>
                        ${erros.map(erro => `<li>${erro}</li>`).join('')}
                    </ul>
                    <a href="/cadastrar-jogador">Voltar</a>
                </div>
            </body>
            </html>
        `);
        return;
    }
    
    jogadores.push({
        nome: nomeJogador,
        nickname: nickname,
        funcao: funcao,
        nivel: nivel,
        genero: genero,
        equipe: equipe
    });
    
    res.redirect('/lista-jogadores');
});
app.get('/lista-jogadores', (req, res) => {
             if(!req.session.usuarioLogado) {
           res.redirect('/login');
        return;
    }
    
    const jogadoresPorEquipe = {};
    equipes.forEach(equipe => {
           jogadoresPorEquipe[equipe.nome] = [];
    });
    
    jogadores.forEach(jogador => {
        if(jogadoresPorEquipe[jogador.equipe]) {
          
            jogadoresPorEquipe[jogador.equipe].push(jogador);
        }
    });
    
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Jogadores Cadastrados</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                       margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }  
                .container {
                    max-width: 1100px;
                    m  argin: 50px auto;
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                }
                h1 {
                    color: #333;
                    margin-bottom: 30px;
                }
                .equipe-section {
                    margin-bottom: 40px;
                }
                .equipe-titulo {
                    background: #667eea;
                    color: white;
                          padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                    font-size: 18px;
                    font-weight: bold;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                           border-bottom: 1px solid #ddd;
                }
                th {
                    background: #f5f5f5;
                    color: #333;
                }
                tr:hover {
                    background: #f9f9f9;
                }
                .botoes {
                    display: flex;
                    gap: 15px;
                }
                a {
                    padding: 12px 25px;
                         background: #667eea;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
                a:hover {
                    background: #5568d3;
                }
                .btn-menu {
                    background: #757575;
                }
                     .btn-menu:hover {
                    background: #616161;
                }
                .vazio {
                    text-align: center;
                    color: #999;
                    padding: 20px;
                    font-style: italic;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Jogadores Cadastrados por Equipe</h1>
                ${jogadores.length === 0 ? `
                    <div class="vazio">
                        <p>Nenhum jogador cadastrado ainda</p>
                    </div>
                ` : `
                    ${Object.keys(jogadoresPorEquipe).map(nomeEquipe => {
                        const jogadoresDaEquipe = jogadoresPorEquipe[nomeEquipe];
                        return `
                            <div class="equipe-section">
                                <div class="equipe-titulo">${nomeEquipe}</div>
                                ${jogadoresDaEquipe.length === 0 ? `
                                    <div class="vazio">Nenhum jogador cadastrado nesta equipe</div>
                                ` : `
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Nickname</th>
                                                <th>Funcao</th>
                                                <th>Nivel</th>
                                                    <th>Genero</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${jogadoresDaEquipe.map(jogador => `
                                                <tr>
                                                    <td>${jogador.nome}</td>
                                                    <td>${jogador.nickname}</td>
                                                    <td>${jogador.funcao}</td>
                                                    <td>${jogador.nivel}</td>
                                                    <td>${jogador.genero}</td>
                                                </tr>
                                            `).join('')}
                                      
                                            </tbody>
                                    </table>
                                `}
                            </div>
                        `;
                    }).join('')}
                `}
                <div class="botoes">
                    <a href="/cadastrar-jogador">Novo Jogador</a>
                       <a href="/menu" class="btn-menu">Voltar ao Menu</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});

export default app;