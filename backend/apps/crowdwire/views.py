from rest_framework import generics

from serializers import *


"""
Create the views for listing events, displaying individual event detail and adding events.
The "serializer_class" attribute is just telling Django which serializer to use for this view,
and the queryset attribute is telling Django what models (or subsets of certain models, etc.) to pull
data from.  Notice that the AddEvent view does not have a queryset: When adding an event, there's
no need to query the database, and the create functionality is already built into the EventSerialzer.
 """


class EventList(generics.ListAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class AddEvent(generics.CreateAPIView):
    serializer_class = EventSerializer