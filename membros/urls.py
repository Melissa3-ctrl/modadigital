from django.urls import path

from . import views

urlpatterns = [ 
    path('', views.Membros, name='membros'), 
    path('adicionar/', views.adicionar_membro, name='adicionar_membros'),
    path('criar', views.criar_membro, name='criar_membro'),
    path('editar/<int:id>/', views.editar_membro, name='editar_membro'), 
    path('deletar/<int:id>/', views.deletar_membro, name='deletar_mebro')
]