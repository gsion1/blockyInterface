from django.urls import path, include
#from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('fileList/', views.fileList, name="fileList"),
    path('devices/', views.connectedDevices, name="devices"),
    path('get_state/', views.get_state, name="get-state"),
    path('start_file/<str:dir>/<str:fileName>/', views.start_file, name="start-file"),
    path('stop/', views.stop, name="stop"),
    path('pause/', views.pause, name="pause"),
    path('play/', views.play, name="play"),
    path('button/<str:btn>/', views.button, name="button"),
    path('simple_scheduler/', views.simple_scheduler, name="simple-scheduler"),
    path('usb/', views.usb, name="usb"),
    path('update/', views.update, name="update"),
    path('del_file/<str:fileName>/', views.delete_seq, name="delete-seq"),
    path('load_file/<str:dir>/<str:fileName>/', views.load_seq, name="load-seq"),
    path('save_file/', views.save_seq, name="save-seq"),
    path('mqttCmd/<str:cmd>/', views.mqttCmd, name="mqttCmd"),
]