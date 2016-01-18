from django.conf.urls import url
from django.contrib import admin

from Web import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^login', views.login),
    url(r'^logout', views.logout),
    url(r'^areaSelection', views.areaSelection),
    url(r'^table/', views.table),
    url(r'^manhattan', views.manhattan),
    url(r'^admin/', admin.site.urls),
]
