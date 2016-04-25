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

#!/usr/bin/Python-2.7.11


from django.shortcuts import render
from Tools import connect
# Create your views here.

def comparison(phenotypes):
    phenotype1=connect.fetchData("select distinct a.rs_id_assoc,a.chromosome, a.pos, a.allele_A, a.allele_B,m.gene_before,m.gene, m.gene_after from assoc a join marqueurs m on a.rs_id_assoc=m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where a. pvalue_assoc<0.001 and p.nom = '"+phenotype1+"'")
    phenotype2=connect.fetchData("select distinct a.rs_id_assoc,a.chromosome, a.pos, a.allele_A, a.allele_B,m.gene_before,m.gene, m.gene_after from assoc a join marqueurs m on a.rs_id_assoc=m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where a. pvalue_assoc<0.001 and  p.nom = '"+phenotype2+"'")
    data = pd.merge(chrarea1,chrarea2,on='rs_id_assoc',how='inner')
