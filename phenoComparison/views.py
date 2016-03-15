from django.shortcuts import render
from Tools import connect
# Create your views here.

def comparison(phenotypes):
    phenotype1=connect.fetchData("select distinct a.rs_id_assoc,a.chromosome, a.pos, a.pvalue_assoc, a.allele_A, a.allele_B,m.gene_before,m.gene, m.gene_after from assoc a join marqueurs m on a.rs_id_assoc=m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where a. pvalue_assoc<0.001 and p.nom = '"+phenotype1+"'")
    phenotype2=connect.fetchData("select distinct a.rs_id_assoc,a.chromosome, a.pos,a.pvalue_assoc, a.allele_A, a.allele_B,m.gene_before,m.gene, m.gene_after from assoc a join marqueurs m on a.rs_id_assoc=m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where a. pvalue_assoc<0.001 and  p.nom = '"+phenotype2+"'")
    data = pd.merge(chrarea1,chrarea2,on='rs_id_assoc',how='inner')
