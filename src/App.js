import {useEffect, useState} from 'react';
import styled from "styled-components";
import Cart from "./components/Cart";
import Products from "./components/Products";


async function api(url, method, body = undefined) {
    return await fetch(`http://localhost:4000${url}`, {
        body: body !== undefined ? JSON.stringify(body) : body,
        method: method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
}

async function apiGetProducts() {
    const data = await api("/products", "GET");
    return data.products;
}

async function apiSubmitCart(products) {
    await api("/purchases", "POST", {products});
}


function App() {
  const [productsLoading, setProductsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  async function getProducts() {
    setProductsLoading(true);
    setProducts(await apiGetProducts());
    setProductsLoading(false);
  }

  async function submitCart() {
    setCartLoading(true);
    await apiSubmitCart(cart);
    setCart([]);
    setCartLoading(false);

    getProducts();
  }

  function setProduct(product, change) {
    const products = cart.filter(({ id }) => {
      return id !== product.id;
    });

    product.units += change;

    if (product.units > 0) {
      setCart(() => [...products, product]);
    } else {
      setCart(() => [products]);
      setProducts((lastProducts) => [...lastProducts, product]);
    }
  }

  function addProduct(product) {
    product.units = 1;

    setCart(() => [...cart, product]);

    setProducts(() => 
      products.filter(({id}) => {
        return id !== product.id;
      })
    )
  }
  
  useEffect(() => {
    getProducts();
  }, []);

  const SMain = styled.main`
    max-width: 600px;
    margin: 0px auto;
  `

  return (
    <SMain>
      <Cart 
        products={cart}
        onChange={setProduct}
        onClick={submitCart}
        isLoading={cartLoading}
      />

      <Products 
        products={products}
        onClick={addProduct}
        isLoading={productsLoading}
      />
    </SMain>
  );
}

export default App;
