from django.conf.urls import include, url
from django.contrib import admin

# URL endpoints for the Django admin, and the project's backend backend root directory
urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url('^', include('apps.crowdwire.urls')),
]