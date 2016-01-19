from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpRequest

# Create your views here.

# Index function
def index(request):
    print request
    return HttpResponse("Test String Http Response to index")

# Login
def login(request):
    print request
    return HttpResponse('Login')


# HTML Table & Static Manhattan file
def table(request):
    print request
    return HttpResponse('Table & Static Manhattan plot')

# Logout
def logout(request):
    print request
    return HttpResponse('Logout')

