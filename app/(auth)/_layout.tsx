import { Slot } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';

export default function _Layout() {
    return (
        <SafeAreaView>
            <Text>Auth Layout</Text>
            <Slot/>
        </SafeAreaView>
    );
};
