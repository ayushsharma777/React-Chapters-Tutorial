import React, { useEffect, useState } from "react";
import axios from "axios";
const App = () => {
  const [products, setProducts] = useState([]);
  const [text, setText] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal; // both above to avoid race condition
    (async () => {
      try {
        const response = await axios.get("https://dummyjson.com/products/", {
          signal,
        });
        setProducts(response.data.products);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("request cancelled", error.message);
          return; // important if using axios as we use signal it throws request cancel error to catch
        }
        console.log(error);
      }
    })(); // ()()  -- we are using iife (immediate invoke functions) we can also create function like const datafetch = async ()=>{} and then call it after datafetch();

    return () => {
      controller.abort(); // this is to avoid race condition
    };
  }, [text]); // only change when there is change in text
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      {products.length > 0 ? (
        products.map((product) => {
          return (
            <div key={product.id}>
              <h2>{`Product title: ${product.title}`}</h2>
              <h3>{`Price: ${product.price}`}</h3>
              <h4>{`Description: ${product.description}`}</h4>
              <img src={`${product.images[0]}`} alt="" />
            </div>
          );
        })
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
