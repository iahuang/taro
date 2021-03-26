/*
    TaroJS

    A super lightweight library that implements JSX-React syntax without
    all the boilerplate state managment syntax of React or the extra dependencies
    such as Webpack, Babel, or Rollup.
*/
import { Taro } from "./taro/api";
export { Taro } from "./taro/api";
import { __TaroReact } from "./taro/react_dom";

(window as any).React = new __TaroReact();
(window as any).Taro = Taro;
