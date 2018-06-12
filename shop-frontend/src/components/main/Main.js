import React from 'react';
import {Route, Switch} from "react-router-dom";
import Sample from "../sample/Sample";
import Products from "../products/Products";
import Product from "../product/Product";
import Basket from "../basket/Basket";
import requireAuthentication from '../AuthenticatedComponent'
import ProductsManagement from "../products-management/ProductsManagement";
import ProductManagement from "../product-management/ProductManagement";
import Orders from "../orders/Orders";


const Main = () => (
    <main>
        <Switch>
            <Route exact path='/sample' component={requireAuthentication(Sample)} />
            <Route exact path='/basket' component={Basket} />
            <Route exact path='/products' component={Products} />
            <Route exact path='/product/:id' component={Product} />
            <Route exact path='/products-management/' component={ProductsManagement} />
            <Route exact path='/product-management/:id' component={ProductManagement} />
            <Route exact path='/orders' component={Orders} />
        </Switch>
    </main>
);

export default Main;
