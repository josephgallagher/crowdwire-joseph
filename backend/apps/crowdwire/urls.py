from django.conf.urls import url
from django.conf import settings

from views import EventList, EventDetail, AddEvent


# URL endpoints for the feed, individual events by ID, adding events and the media root where the photos are stored
urlpatterns = [
    url('^events/$', EventList.as_view(), name='event-list'),
    url('^events/(?P<pk>[0-9]+)/$', EventDetail.as_view(), name='event-detail'),
    url('^add-event$', AddEvent.as_view(), name='add-event'),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
]