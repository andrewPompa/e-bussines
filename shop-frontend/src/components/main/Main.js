import React from 'react';
import {Route, Switch} from "react-router-dom";
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
            <Route exact path='/basket' component={requireAuthentication(Basket)} />
            <Route exact path='/products' component={requireAuthentication(Products)} />
            <Route exact path='/product/:id' component={requireAuthentication(Product)} />
            <Route exact path='/products-management/' component={requireAuthentication(ProductsManagement)} />
            <Route exact path='/product-management/:id' component={requireAuthentication(ProductManagement)} />
            <Route exact path='/orders' component={requireAuthentication(Orders)} />
        </Switch>
    </main>
);

export default Main;
