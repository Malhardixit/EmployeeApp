import { StyleSheet, Text, View } from "react-native";
import React, { createContext, useReducer } from "react";
import Constants from "expo-constants";
import Home from "./screens/Home";
import CreateEmployee from "./screens/CreateEmployee";
import Profile from "./screens/Profile";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { initState, reducer } from "./reducers/reducer";

// const store = createStore(reducer);
export const myContext = createContext();

const Stack = createStackNavigator();

const myOptions = {
  title: "Home Screen",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#006aff",
  },
};

function App() {
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={myOptions} />
        <Stack.Screen
          name="Create"
          component={CreateEmployee}
          options={{ ...myOptions, title: "Create Employee" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ ...myOptions, title: "View/Edit Employee Details" }}
        />
      </Stack.Navigator>
    </View>
  );
}

export default () => {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <myContext.Provider value={{ state, dispatch }}>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </myContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0", //#ededed
    // marginTop: Constants.statusBarHeight,
  },
});
