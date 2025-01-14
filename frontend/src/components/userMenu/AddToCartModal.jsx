const AddToCartModal = ({ item, addToCart, setSelectedItem }) => {
    const [quantity, setQuantity] = useState(1);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50">
        <div>
          <h2>{item.name}</h2>
          <button onClick={() => setSelectedItem(null)}>Close</button>
          <button onClick={() => addToCart(item, {}, quantity)}>Add</button>
        </div>
      </div>
    );
  };
  export default AddToCartModal;
  