import React from 'react';
import {Route, Switch} from "react-router-dom";
import Sample from "../sample/Sample";
import Products from "../products/Products";
import Product from "../product/Product";
import Basket from "../basket/Basket";


const Main = () => (
    <main>
        <Switch>
            <Route exact path='/sample' component={Sample} />
            <Route exact path='/basket' component={Basket} />
            <Route exact path='/products' component={Products} />
            <Route exact path='/product/:id' component={Product} />
        </Switch>
    </main>
);

export default Main;
