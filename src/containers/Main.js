import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Route, Redirect, Switch } from "react-router-dom";
import RegisterContainer from "./registerContainer";
import LoginContainer from "./LoginContainer";
import AdminConfigsContainer from "./AdminConfigsContainer";
import { useSelector, useDispatch } from "react-redux";
import ProductsContainer from "../containers/ProductsContainer";
import CartContainer from "./CartContainer";
import { fetchIsLogged, login, loggUser } from "../store/action-creators/login";
import ProductContainer from "../containers/ProductContainer";
import { createCart } from "../store/action-creators/cart";
import CompletedOrdersContainer from "../containers/CompletedOrdersContainer";
import CompletedOrderDetailContainer from "../containers/CompletedOrderDetailsContainer";
import axios from "axios";
import { fetchProducts } from "../store/action-creators/products";
import ResultsProductContainer from "../containers/ResultsProductContainer";
axios.defaults.withCredentials = true;

//use effect q busca libros, pasa libros a products container. renderizar products filtrados y no filtrados con el com. ProductsContainer

function App() {
  const dispatch = useDispatch();
  // const islogged = useSelector((state) => {
  //   return state.login.logged;
  // });
  const products = useSelector((state) => {
    return state.products.list;
  });
  const search = useSelector((state) => {
    return state.products.list;
  });
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  useEffect(() => {
    //axios.defaults.withCredentials = true;

    axios
      .get("http://localhost:1337/api/user/me")
      .then((res) => res.data)
      .then((user) => {
        console.log(user);
        dispatch(loggUser(user));
        return user;
      })
      .then((user) => {
        console.log("USUARIO ANTES DE SALIR", user);
        const productsArray = [];
        for (const key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            productsArray.push(JSON.parse(localStorage.getItem(key)));
          }
        }
        return axios.post(
          `http://localhost:1337/api/orders/newOrder/${user.id}`,
          { productsArray }
        );
      })
      .catch(() => {
        console.log("not logged in");
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <Switch>
          <Route path="/register" component={RegisterContainer} />
          <Route path="/login" component={LoginContainer} />
          <Route exact path="/completed" component={CompletedOrdersContainer} />
          <Route
            exact
            path="/details"
            component={CompletedOrderDetailContainer}
          />

          <Route
            exact
            path="/"
            render={() => <ProductsContainer products={products} />}
          />
          <Route
            exact
            path="/products"
            render={() => <ProductsContainer products={products} />}
          />
          <Route
            exact
            path="/search"
            render={() => <ResultsProductContainer search={search} />}
          />

          <Route path="/cart" component={CartContainer} />
          <Route path="/configs" component={AdminConfigsContainer} />
          <Route path="/products/:productId" component={ProductContainer} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
