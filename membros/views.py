from django.shortcuts import render, redirect, get_object_or_404
from .models import Membros
from .forms import MembrosForm

def listar_membros(request):
    """Lista todos os membros"""
    lista = Membros.objects.all().order_by('firstname')
    return render(request, "atividade.html", {"membros": lista})

def criar_membro(request):
    """Cria um novo membro"""
    if request.method == "POST":
        form = MembrosForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('listar_membros.html')
    else:
        form = MembrosForm()
    
    return render(request, "adicionar_membro.html", {"form": form})

def editar_membro(request, id):
    """Edita um membro existente"""
    membro = get_object_or_404(Membros, id=id)
    
    if request.method == "POST":
        form = MembrosForm(request.POST, instance=membro)
        if form.is_valid():
            form.save()
            return redirect('listar_membros.html')
    else:
        form = MembrosForm(instance=membro)
    
    return render(request, "editar_membro.html", {"form": form, "membro": membro})

def deletar_membro(request, id):
    """Deleta um membro"""
    membro = get_object_or_404(Membros, id=id)
    
    if request.method == "POST":
        membro.delete()
        return redirect('listar_membros')
    
    return render(request, "confirmar_delecao.html", {"membro": membro})

def produtos(request):
    return render(request, 'produtos.html')

def home(request):
    return render(request, 'home.html')