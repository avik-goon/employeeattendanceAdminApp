import React from "react";
import {
  NativeBaseProvider,
} from "native-base";
import theme from "./theme/config";
import Primarystack from "./navigators/stack/PrimaryStack";
import store from "./store/store";
import { Provider } from "react-redux";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Reanimated 2', 'Setting a timer']);
export default function App() {
  return (
    <Provider store={store} >
      <NativeBaseProvider theme={theme}>
        <Primarystack />
      </NativeBaseProvider>
    </Provider>
  )
}


