from django.urls import path

from . import views

urlpatterns = [
    path('', views.listar_membros, name='listar_membros'),
    path('adicionar/', views.criar_membro, name='adicionar_membros'),
    path('criar/', views.criar_membro, name='criar_membro'),
    path('editar/<int:id>/', views.editar_membro, name='editar_membro'),
    path('deletar/<int:id>/', views.deletar_membro, name='deletar_membro'),
<<<<<<< HEAD
    path('produtos/', views.produtos, name='produtos'),
    path('home/', views.home, name='home'),
=======
    path('macacoes/', views.macacoes, name='macacoes'),
>>>>>>> 47bb5b9212c0ca6426b5460e4fb484bdf9bed241
]