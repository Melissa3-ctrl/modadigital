// ============================================
// SCRIPT COMPLETO - MODA DIGITAL
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    // ============================================
    // CARRINHO DE COMPRAS
    // ============================================

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    function salvarCarrinho() {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarContador();
    }

    function atualizarContador() {
        let contador = document.querySelector("#contador-carrinho");
        if (!contador) return;

        let quantidade = carrinho.reduce(function (total, produto) {
            return total + produto.quantidade;
        }, 0);

        contador.textContent = quantidade;
    }

    function adicionarAoCarrinho(produto) {
        let existente = carrinho.find(function (item) {
            return item.nome === produto.nome;
        });

        if (existente) {
            existente.quantidade++;
        } else {
            produto.quantidade = 1;
            carrinho.push(produto);
        }

        salvarCarrinho();
        alert("🛍️ " + produto.nome + " adicionado ao carrinho!");
    }

    function criarProduto(elemento) {
        let card = elemento.closest(".produto");
        if (!card) return null;

        let nome = card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "Produto";

        let precoElemento = card.querySelector("ins");
        let preco = precoElemento
            ? parseFloat(precoElemento.textContent.replace("R$", "").replace(".", "").replace(",", ".").trim())
            : 0;

        let imagem = card.querySelector("img") ? card.querySelector("img").getAttribute("src") : "";

        return {
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        };
    }

    // Botões "Adicionar ao Carrinho"
    document.querySelectorAll(".btn-carrinho").forEach(function (botao) {
        botao.addEventListener("click", function () {
            let produto = criarProduto(botao);
            if (produto) {
                adicionarAoCarrinho(produto);
            }
        });
    });

    // Botões "Comprar Agora"
    document.querySelectorAll(".btn-comprar").forEach(function (botao) {
        botao.addEventListener("click", function () {
            let produto = criarProduto(botao);
            if (produto) {
                let existente = carrinho.find(function (item) {
                    return item.nome === produto.nome;
                });

                if (existente) {
                    existente.quantidade++;
                } else {
                    produto.quantidade = 1;
                    carrinho.push(produto);
                }

                salvarCarrinho();
                abrirCarrinho();
            }
        });
    });

    // ============================================
    // MODAL DO CARRINHO
    // ============================================

    window.abrirCarrinho = function() {
        let modal = document.getElementById("modalCarrinho");
        if (modal) {
            modal.style.display = "flex";
            exibirCarrinhoNoModal();
        }
    };

    window.fecharCarrinho = function() {
        let modal = document.getElementById("modalCarrinho");
        if (modal) {
            modal.style.display = "none";
        }
    };

    function exibirCarrinhoNoModal() {
        let lista = document.getElementById("listaCarrinho");
        let totalSpan = document.getElementById("totalCarrinho");

        if (!lista || !totalSpan) return;

        if (carrinho.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #999; padding: 30px 0;">Seu carrinho está vazio.</p>';
            totalSpan.textContent = "0,00";
            return;
        }

        let html = "";
        let total = 0;

        carrinho.forEach(function(produto, indice) {
            let subtotal = produto.preco * produto.quantidade;
            total += subtotal;

            html += `
                <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${produto.nome}</strong>
                            <br>
                            <span style="color: #e91e63;">R$ ${produto.preco.toFixed(2).replace(".", ",")}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button onclick="diminuirQuantidade(${indice})" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 18px;">−</button>
                            <span style="font-weight: bold; min-width: 20px; text-align: center;">${produto.quantidade}</span>
                            <button onclick="aumentarQuantidade(${indice})" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 18px;">+</button>
                            <button onclick="removerItemCarrinho(${indice})" style="width: 30px; height: 30px; border-radius: 50%; border: none; background: #ff4444; color: #fff; cursor: pointer; font-size: 16px;">✕</button>
                        </div>
                    </div>
                    <div style="text-align: right; font-size: 14px; color: #666; margin-top: 5px;">
                        Subtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}
                    </div>
                </div>
            `;
        });

        lista.innerHTML = html;
        totalSpan.textContent = total.toFixed(2).replace(".", ",");
    }

    // Remove painel lateral antigo se existir
    let painelAntigo = document.querySelector("#painel-carrinho");
    if (painelAntigo) {
        painelAntigo.remove();
    }

    window.aumentarQuantidade = function(indice) {
        if (carrinho[indice]) {
            carrinho[indice].quantidade++;
            salvarCarrinho();
            exibirCarrinhoNoModal();
        }
    };

    window.diminuirQuantidade = function(indice) {
        if (carrinho[indice]) {
            if (carrinho[indice].quantidade > 1) {
                carrinho[indice].quantidade--;
            } else {
                carrinho.splice(indice, 1);
            }
            salvarCarrinho();
            exibirCarrinhoNoModal();
        }
    };

    window.removerItemCarrinho = function(indice) {
        carrinho.splice(indice, 1);
        salvarCarrinho();
        exibirCarrinhoNoModal();
    };

    window.finalizarCompra = function() {
        if (carrinho.length === 0) {
            alert("🛒 Seu carrinho está vazio!");
            return;
        }

        let total = carrinho.reduce(function(soma, produto) {
            return soma + (produto.preco * produto.quantidade);
        }, 0);

        let confirmar = confirm(
            "✨ Total da compra: R$ " + total.toFixed(2).replace(".", ",") + "\n\n" +
            "Deseja finalizar a compra?"
        );

        if (confirmar) {
            alert("🎉 Compra finalizada com sucesso!\n\nObrigada por comprar na Moda Digital! 🛍️");
            carrinho = [];
            salvarCarrinho();
            exibirCarrinhoNoModal();
            window.fecharCarrinho();
        }
    };

    // ============================================
    // FUNÇÃO PARA ADICIONAR PRODUTOS TESTE (PÁGINA INICIAL)
    // ============================================

    window.adicionarProdutoTeste = function(nome, preco) {
        let produto = {
            nome: nome,
            preco: preco,
            imagem: "",
            quantidade: 1
        };

        let existente = carrinho.find(function(item) {
            return item.nome === produto.nome;
        });

        if (existente) {
            existente.quantidade++;
        } else {
            carrinho.push(produto);
        }

        salvarCarrinho();
        alert("🛍️ " + nome + " adicionado ao carrinho!");
    };

    // ============================================
    // PESQUISA
    // ============================================

    const produtosParaPesquisa = [
        { nome: "Macacão Feminino Azul-Marinho", preco: 249.90 },
        { nome: "Macacão Feminino Utility Verde", preco: 149.90 },
        { nome: "Macacão Feminino Jeans", preco: 199.90 },
        { nome: "Macacão Feminino Estampado", preco: 99.90 },
        { nome: "Macacão Feminino Social Bege", preco: 99.90 },
        { nome: "Macacão Feminino Social Branco", preco: 99.90 },
        { nome: "Macacão Feminino Clássico Preto", preco: 99.90 },
        { nome: "Macacão Feminino Vinho", preco: 99.90 },
        { nome: "Macacão Elegance Assimétrico", preco: 99.90 },
        { nome: "Macacão Utility Casual", preco: 99.90 },
        { nome: "Macacão Social Vermelho", preco: 99.90 },
        { nome: "Macacão Rosa-Claro Fluido", preco: 99.90 },
    ];

    window.abrirPesquisa = function() {
        let modal = document.getElementById("modalPesquisa");
        if (modal) {
            modal.style.display = "flex";
            document.getElementById("campoPesquisa").focus();
            document.getElementById("resultadoPesquisa").innerHTML = "";
        }
    };

    window.fecharPesquisa = function() {
        let modal = document.getElementById("modalPesquisa");
        if (modal) {
            modal.style.display = "none";
            document.getElementById("resultadoPesquisa").innerHTML = "";
        }
    };

    window.pesquisarProduto = function() {
        let termo = document.getElementById("campoPesquisa").value.trim().toLowerCase();
        let resultado = document.getElementById("resultadoPesquisa");

        if (termo === "") {
            resultado.innerHTML = '<p style="color: #999; text-align: center;">Digite o nome do produto</p>';
            return;
        }

        let encontrados = produtosParaPesquisa.filter(function(p) {
            return p.nome.toLowerCase().includes(termo);
        });

        if (encontrados.length === 0) {
            resultado.innerHTML = '<p style="color: #e91e63; text-align: center;">Nenhum produto encontrado</p>';
            return;
        }

        let html = '<div style="margin-top: 15px;">';
        encontrados.forEach(function(p) {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; gap: 10px;">
                    <span style="flex: 1;">${p.nome}</span>
                    <span style="font-weight: bold; color: #e91e63;">R$ ${p.preco.toFixed(2).replace(".", ",")}</span>
                    <button onclick="adicionarDaPesquisa('${p.nome}', ${p.preco})" style="background: #4CAF50; color: #fff; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">
                        🛒
                    </button>
                </div>
            `;
        });
        html += '</div>';

        resultado.innerHTML = html;
    };

    window.adicionarDaPesquisa = function(nome, preco) {
        let produto = {
            nome: nome,
            preco: preco,
            imagem: "",
            quantidade: 1
        };

        let existente = carrinho.find(function(item) {
            return item.nome === produto.nome;
        });

        if (existente) {
            existente.quantidade++;
        } else {
            carrinho.push(produto);
        }

        salvarCarrinho();
        alert("🛍️ " + nome + " adicionado ao carrinho!");
        window.fecharPesquisa();
        document.getElementById("campoPesquisa").value = "";
    };

    // Enter na pesquisa
    let campoPesquisa = document.getElementById("campoPesquisa");
    if (campoPesquisa) {
        campoPesquisa.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                window.pesquisarProduto();
            }
        });
    }

    // ============================================
    // LOGIN
    // ============================================

    // Verifica se usuário está logado
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

    function atualizarHeaderUsuario() {
        let acoes = document.querySelector(".acoes");
        if (!acoes) return;

        let btnAntigo = acoes.querySelector(".btn-usuario");
        if (btnAntigo) {
            btnAntigo.remove();
        }

        let btnUsuario = document.createElement("button");
        btnUsuario.className = "btn-usuario";
        btnUsuario.type = "button";

        if (usuarioLogado) {
            btnUsuario.innerHTML = "👤 " + usuarioLogado.nome;
            btnUsuario.title = "Clique para sair";
            btnUsuario.onclick = function() {
                if (confirm("Deseja sair da sua conta?")) {
                    localStorage.removeItem("usuarioLogado");
                    usuarioLogado = null;
                    window.location.reload();
                }
            };
        } else {
            btnUsuario.innerHTML = "👤 Entrar";
            btnUsuario.onclick = function() {
                abrirLogin();
            };
        }

        let btnCarrinho = acoes.querySelector("button:last-child");
        acoes.insertBefore(btnUsuario, btnCarrinho);
    }

    // ============================================
    // MODAL DE LOGIN
    // ============================================

    function abrirLogin() {
        let modalLogin = document.getElementById("modalLogin");
        if (modalLogin) {
            modalLogin.style.display = "flex";
            document.getElementById("mensagemLogin").innerHTML = "";
        }
    }

    window.fecharLogin = function() {
        let modal = document.getElementById("modalLogin");
        if (modal) {
            modal.style.display = "none";
        }
        document.getElementById("mensagemLogin").innerHTML = "";
    };

    window.fazerLogin = function() {
        let email = document.getElementById("emailLogin").value.trim();
        let senha = document.getElementById("senhaLogin").value.trim();
        let mensagem = document.getElementById("mensagemLogin");

        if (email === "" || senha === "") {
            mensagem.innerHTML = "❌ Preencha todos os campos";
            mensagem.style.color = "red";
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
        let encontrado = usuarios.find(function(u) {
            return u.email === email && u.senha === senha;
        });

        if (!encontrado) {
            mensagem.innerHTML = "❌ E-mail ou senha incorretos";
            mensagem.style.color = "red";
            return;
        }

        localStorage.setItem("usuarioLogado", JSON.stringify({
            nome: encontrado.nome,
            email: encontrado.email
        }));

        mensagem.innerHTML = "✅ Login realizado com sucesso!";
        mensagem.style.color = "green";

        setTimeout(function() {
            window.fecharLogin();
            window.location.reload();
        }, 1000);
    };

    // Enter no login
    let senhaLogin = document.getElementById("senhaLogin");
    if (senhaLogin) {
        senhaLogin.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                window.fazerLogin();
            }
        });
    }

    // ============================================
    // CADASTRO
    // ============================================

    window.abrirCadastro = function() {
        let modal = document.getElementById("modalCadastro");
        if (modal) {
            modal.style.display = "flex";
            document.getElementById("mensagemCadastro").innerHTML = "";
        }
    };

    window.fecharCadastro = function() {
        let modal = document.getElementById("modalCadastro");
        if (modal) {
            modal.style.display = "none";
            document.getElementById("mensagemCadastro").innerHTML = "";
        }
    };

    window.cadastrarUsuario = function() {
        let nome = document.getElementById("nomeCadastro").value.trim();
        let email = document.getElementById("emailCadastro").value.trim();
        let senha = document.getElementById("senhaCadastro").value.trim();
        let mensagem = document.getElementById("mensagemCadastro");

        if (nome === "") {
            mensagem.innerHTML = "❌ Informe seu nome";
            mensagem.style.color = "red";
            return;
        }

        if (email === "" || !email.includes("@") || !email.includes(".")) {
            mensagem.innerHTML = "❌ Informe um e-mail válido";
            mensagem.style.color = "red";
            return;
        }

        if (senha === "" || senha.length < 6) {
            mensagem.innerHTML = "❌ A senha deve ter pelo menos 6 caracteres";
            mensagem.style.color = "red";
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        if (usuarios.some(function(u) { return u.email === email; })) {
            mensagem.innerHTML = "❌ Este e-mail já está cadastrado";
            mensagem.style.color = "red";
            return;
        }

        usuarios.push({
            nome: nome,
            email: email,
            senha: senha,
            data: new Date().toLocaleString()
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mensagem.innerHTML = "✅ Cadastro realizado! Faça login.";
        mensagem.style.color = "green";

        document.getElementById("nomeCadastro").value = "";
        document.getElementById("emailCadastro").value = "";
        document.getElementById("senhaCadastro").value = "";

        setTimeout(function() {
            window.fecharCadastro();
            abrirLogin();
        }, 1500);
    };

    // Enter no cadastro
    let senhaCadastro = document.getElementById("senhaCadastro");
    if (senhaCadastro) {
        senhaCadastro.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                window.cadastrarUsuario();
            }
        });
    }

    // ============================================
    // CONTATO
    // ============================================

    window.abrirContato = function() {
        alert(
            "📧 Entre em contato com a Moda Digital!\n\n" +
            "📩 E-mail: contato@modadigital.com.br\n" +
            "📱 WhatsApp: (11) 99999-9999\n" +
            "📞 Telefone: (11) 3333-4444\n\n" +
            "🕐 Atendimento: Seg-Sex 9h às 18h"
        );
    };

    // ============================================
    // CARROSSEL - 2 SEGUNDOS
    // ============================================

    let slideAtual = 0;
    let slides = document.querySelectorAll(".slide");
    let bolinhas = document.querySelectorAll(".bolinha");
    let intervaloCarrossel;

    window.mudarSlide = function(direcao) {
        if (slides.length === 0) return;
        let novoSlide = slideAtual + direcao;
        if (novoSlide < 0) novoSlide = slides.length - 1;
        if (novoSlide >= slides.length) novoSlide = 0;
        window.irParaSlide(novoSlide);
    };

    window.irParaSlide = function(index) {
        if (slides.length === 0) return;
        slides.forEach(function(s) { s.classList.remove("ativo"); });
        bolinhas.forEach(function(b) { b.classList.remove("ativo"); });
        slides[index].classList.add("ativo");
        bolinhas[index].classList.add("ativo");
        slideAtual = index;
    };

    function iniciarCarrossel() {
        if (slides.length === 0) return;
        
        if (intervaloCarrossel) {
            clearInterval(intervaloCarrossel);
        }
        
        intervaloCarrossel = setInterval(function() {
    window.mudarSlide(1);
}, 2000);

        let carrossel = document.querySelector(".carrossel");
        if (carrossel) {
            carrossel.addEventListener("mouseenter", function() {
                clearInterval(intervaloCarrossel);
            });
            
            carrossel.addEventListener("mouseleave", function() {
                if (intervaloCarrossel) {
                    clearInterval(intervaloCarrossel);
                }
                intervaloCarrossel = setInterval(function() {
    window.mudarSlide(1);
}, 2000);
            });
        }
    }

    iniciarCarrossel();

    // ============================================
    // FECHAR MODAIS CLICANDO FORA
    // ============================================

    window.onclick = function(event) {
        let modals = document.querySelectorAll(".modal");
        modals.forEach(function(modal) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    };

    // ============================================
    // INICIALIZAÇÃO
    // ============================================

    // Remove painel lateral antigo se existir
    let painelExistente = document.querySelector("#painel-carrinho");
    if (painelExistente) {
        painelExistente.remove();
    }

    atualizarHeaderUsuario();
    atualizarContador();
    console.log("✅ Moda Digital - Script carregado!");

});