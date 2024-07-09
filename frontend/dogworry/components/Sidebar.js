import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UserDetails from '../screens/user/UserDetails';

const Drawer = createDrawerNavigator();

const SideBar = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="User Details" component={UserDetails} />
        </Drawer.Navigator>
    );
};

export default SideBar;