import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import SingleEvent from './SingleEvent';
import EventRow from './EventRow';
import LocalEventRow from './LocalEventRow';
import { getSavedEventsByUserId } from '../services/events';

const EventList = (props) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const seatGeek = props.seatGeek || [];
    const localEvents = props.localEvents || [];
    const handlePress = props.handleSelectEvent;
    const savedEventsIDArr = props.savedEventsIDArr;

    return (
        <ScrollView style={styles.container}>
            {
                seatGeek.map((event) => (
                    <EventRow
                        key={event.id}
                        event={event}
                        handlePress={handlePress}
                        savedEventsIDArr={props.savedEventsIDArr}
                        updateSaveEventID={props.updateSaveEventID} 
                    />
                ))
            }
            {
                localEvents.map((event, idx) => (
                    <LocalEventRow
                        key={event.id}
                        event={event}
                        handlePress={handlePress}
                        savedEventsIDArr={props.savedEventsIDArr}
                        updateSaveEventID={props.updateSaveEventID} 
                    />
                ))
            }
            {
                selectedEvent
                    ? <SingleEvent
                        event={selectedEvent}
                        handlePress={handlePress}
                        savedEventsIDArr={savedEventsIDArr}
                    />
                    : null
            }
        </ScrollView>
    )

}

const dateFormatter = (dateStr) => {
    return `${new Date(dateStr + 'Z')}`.slice(0, 21);
}

const dateFormatterLocal = (timestamp) => {
    return `${new Date(timestamp * 1000)}`.slice(0, 21);
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.25,
        backgroundColor: '#fff',
        margin: 2
    },
    event: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },
    image: {
        width: 150,
        height: 90,
        margin: 2
    },
    text: {
        padding: 2,
        alignItems: 'stretch',
    }
});

export default EventList;
