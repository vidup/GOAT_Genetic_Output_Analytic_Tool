# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# Authors of this page : Beatriz Kanzki & Victor Dupuy


from django.conf.urls import url
from django.contrib import admin
from django.conf.urls.static import static

from Web import views as web
from bokeh_GOAT import views as bokehGOAT
from AreaSelection import views as AreaSelection
from GetPhenotypes import views as phenotypes
from autocomplete import views as autoComplete
# Config variables
import settings

print "Server is starting now !"
urlpatterns = [
    url(r'^$', web.index),
    url(r'^login', web.login),
    url(r'^logout', web.logout),
    url(r'^table/(?P<type>\w{0,20})/(?P<value>[0-9a-zA-Z_\- ()]{0,100})/', web.table),
    url(r'^table_csv/(?P<rsID>\w{0,50})/$', web.table_csv),
    url(r'^snpsForGene/(?P<gene>\w{0,20})/', web.snpsForGene),
    url(r'^areaSelection/(?P<chromosome>[0-9]{0,2})/(?P<position>[0-9]{0,50})/(?P<phenotype>[0-9a-zA-Z_ ()]{0,200})/(?P<userWidth>[0-9]{0,6})/(?P<userHeight>[0-9]{0,6})', AreaSelection.areaSelection),
    url(r'^autocomplete/genes/(?P<text>\w{0,20})/', autoComplete.autoCompleteGenes),
    url(r'^autocomplete/phenotypes/(?P<text>\w{0,20})/', autoComplete.AutoCompletePhenotypes),
    url(r'^manhattan/(?P<type>\w{0,20})/(?P<value>[0-9a-zA-Z_ ]{0,50})/(?P<userWidth>[0-9]+)/(?P<userHeight>[0-9]+)/', bokehGOAT.manhattan),
    url(r'^div', bokehGOAT.getManhattanDiv),
    url(r'^phenotypes/', phenotypes.get),
    url(r'^admin/', admin.site.urls),
] +static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
