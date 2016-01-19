from django.conf.urls import url
from django.contrib import admin
from django.conf.urls.static import static

from Web import views as web
from bokeh_GOAT import views as bokehGOAT

# Config variables
import settings

print "Server is starting now !"
urlpatterns = [
    url(r'^$', web.index),
    url(r'^login', web.login),
    url(r'^logout', web.logout),
    url(r'^table/', web.table),
    url(r'^table_csv/(?P<rsID>\w{0,50})/$', web.table_csv),
    url(r'^areaSelection', bokehGOAT.areaSelection),
    url(r'^manhattan', bokehGOAT.manhattan),
    url(r'^admin/', admin.site.urls),
] +static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
