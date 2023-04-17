import "./App.css";
import { createContext, useContext, useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Appbar from "./Appbar";

export const cartCtx = createContext();

const currencyFormatter = (number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    number
  );

//const API = "http://localhost:4000";
const API = "http://localhost:9000";

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(`${API}/cart`)
      .then((data) => data.json())
      .then((mobile) => setCart(mobile));
  }, []);

  // +, _, AssToCart
  const updateCart = ({ mobile, type }) => {
    //const entireCart = cart;
    //console.log(JSON.stringify({ ...mobile }));
    fetch(`${API}/cart?type=${type}`, {
      method: "PUT",
      body: JSON.stringify(mobile),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((mobile) => setCart(mobile));
  };

  return (
    <div className="App">
      <cartCtx.Provider value={[cart, updateCart]}>
        <Appbar/>
        <PhoneList />
        <Cart />
      </cartCtx.Provider>
    </div>
  );
}

function PhoneList() {
  const [mobiles, setMobiles] = useState([]);

  useEffect(() => {
    fetch(`${API}/mobiles`)
      .then((data) => data.json())
      .then((mobile) => setMobiles(mobile));
  }, []);

  return (
    <div className="phone-list-container">
      {mobiles.map((mobile) => (
        <Phone key={mobile._id} mobile={mobile} />
      ))}
    </div>
  );
}

function Phone({ mobile }) {
  const [cart, updateCart] = useContext(cartCtx);
  return (
    <div className="phone-container">
      <img src={mobile.img} alt={mobile.img} className="phone-picture" />
      <div>
        <h2 className="phone-name">{mobile.model}</h2>
        <p className="phone-company">{mobile.company}</p>
        <h2 className="phone-price">
          Price: {currencyFormatter(mobile.price)}
        </h2>
        <div className="phone-add-cart">
          <Button variant="outlined" onClick={() => updateCart({ mobile, type: "increment" })}>
          Add to cart &nbsp;<AddShoppingCartIcon/>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const [cart, updateCart] = useContext(cartCtx);

  const total = cart
    .map((item) => item.qty * item.price)
    .reduce((sum, value) => sum + value, 0);

  useEffect(() => {}, [cart]);
  return (
    <section className="cart-list">
      <h2>Shopping Cart</h2>
      <div className="phone-list-container">
        {cart.map((mobile) => (
          <CartItem key={mobile._id} mobile={mobile} />
        ))}
      </div>
      <h2>Total: {currencyFormatter(total)}</h2>
      <div className="cart-checkout">
        <button>✔️Checkout</button>
      </div>
    </section>
  );
}
function CartItem({ mobile }) {
  const [cart, updateCart] = useContext(cartCtx);

  return (
    <div className="cart-item-container">
      <img src={mobile.img} alt={mobile.img} className="cart-item-picture" />
      <div>
        <h2 className="cart-item-name">{mobile.model}</h2>
        <p className="cart-item-company">{mobile.company}</p>
        <p className="cart-item-quantity">
          <h4>Price: {currencyFormatter(mobile.price)}</h4>
          <IconButton color="secondary" onClick={() => updateCart({ mobile, type: "decrement" })}>
          <RemoveIcon/>
          </IconButton>
          <span>&nbsp; Quantity: &nbsp;</span>
           {mobile.qty}
           &nbsp;
          <IconButton color="secondary" onClick={() => updateCart({ mobile, type: "increment" })}>
          <AddIcon/>
          </IconButton>
        </p>
      </div>
    </div>
  );
}

export default App;
