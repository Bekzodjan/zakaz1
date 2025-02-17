import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Rodal from "rodal";

// Xabar beruvchi funksiya
export function alert(msg, success) {
  toast[success ? "success" : "error"](msg, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    theme: "light",
    transition: Bounce,
  });
}

function DoExpence() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State-lar
  const [orders, setOrders] = useState([]);
  const [element, setElement] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [count, setCount] = useState(1);
  const [remainingPrice, setRemainingPrice] = useState(0); // Qolgan summa

  useEffect(() => {
    const ordersFromStorage = JSON.parse(localStorage.getItem("orders"));
    const currentElement = ordersFromStorage?.[id];

    if (!currentElement) {
      navigate("/error");
      return;
    }

    setElement(currentElement);
    setOrders(currentElement.products);
  }, [id, navigate]);

  useEffect(() => {
    calculateRemainingPrice();
  }, [orders]);

  useEffect(() => {
    const savedOptions = localStorage.getItem("options2");
    setOptions(savedOptions ? JSON.parse(savedOptions) : []);
  }, []);

  const { handleSubmit, register, reset } = useForm();

  // Qolgan narxni hisoblash
  const calculateRemainingPrice = () => {
    if (!element) return;
    const totalUsed = orders.reduce((sum, p) => sum + p.count * p.price, 0);
    setRemainingPrice(element.price - totalUsed);
  };

  // Buyurtma qo'shish funksiyasi
  const addOrder = (data) => {
    if (!selectedOption || !data.price) {
      alert("Mahsulot nomi va narxini kiriting!", false);
      return;
    }

    const newOrder = {
      ...data,
      count,
      price: parseInt(data.price),
      name: selectedOption,
    };

    const totalNewPrice = newOrder.price * newOrder.count;
    if (totalNewPrice > remainingPrice) {
      alert("Xatolik! Qolgan summadan oshirib bo'lmaydi!", false);
      return;
    }

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);

    const updatedElement = { ...element, products: updatedOrders };
    const allOrders = JSON.parse(localStorage.getItem("orders"));
    allOrders[id] = updatedElement;
    localStorage.setItem("orders", JSON.stringify(allOrders));

    calculateRemainingPrice();

    alert(`${newOrder.name} buyurtmaga qo'shildi.`, true);

    reset({ count: 1, price: 0 });
    setSelectedOption(null);
  };

  // Yangi option yaratish
  const createOption = (e) => {
    if (e?.__isNew__) {
      const newOption = { label: e.label, value: e.value };
      const updatedOptions = [...options, newOption];
      setOptions(updatedOptions);
      localStorage.setItem("options2", JSON.stringify(updatedOptions));
    }
    setSelectedOption(e?.value);
  };

  const deleteOrder = () => {
    if (!window.confirm("Haqiqatan ham ushbu buyurtmani o‘chirmoqchimisiz?"))
      return;
    const updatedOrders = orders.filter((_, i) => i !== selectedOrder.i);
    setOrders(updatedOrders);

    const updatedElement = { ...element, products: updatedOrders };
    const allOrders = JSON.parse(localStorage.getItem("orders"));
    allOrders[id] = updatedElement;
    localStorage.setItem("orders", JSON.stringify(allOrders));

    setModalVisible(false);
    alert("Buyurtma o'chirildi", true);
  };

  return (
    <div>
      <ToastContainer />
      <form className="card p-2" onSubmit={handleSubmit(addOrder)}>
        <h1 className="text-center">
          FMMebel{" "}
          <Link
            to={"/"}
            className="text-danger text-decoration-none"
            style={{ float: "right", cursor: "pointer" }}
          >
            X
          </Link>
        </h1>
        <h3 className="text-center text-bg-secondary p-2">
          ------|{" "}
          <span className="text-warning fs-1 fw-semibold">
            {remainingPrice}
          </span>{" "}
          |------
        </h3>

        <label className="d-block mt-3" htmlFor="name">
          Ismi:
          <CreatableSelect
            options={options}
            isClearable
            onChange={createOption}
            className="mb-2 border-black w-100"
          />
        </label>

        <label className="d-block" htmlFor="price">
          Narxi:
          <input
            type="number"
            name="price"
            id="price"
            className="form-control mb-2"
            onKeyUp={(e) => {
              if (e.target.value < 1) e.target.value = "";
            }}
            {...register("price")}
          />
        </label>

        <label className="mb-2 fs-5 w-75">
          Soni:
          <div
            style={{ width: "max-content !important", pointerEvents: "none" }}
            className="d-flex gap-2 w-100 align-items-center"
          >
            <div
              type="button"
              style={{pointerEvents: "auto"}}
              onClick={() => setCount(count + 1)}
              className="btn btn-success d-block fs-1 w-25"
            >
              +
            </div>
            <h3 className="m-0">{count} kg, ta</h3>
            <div
              type="button"
              style={{pointerEvents: "auto"}}
              onClick={() => count > 1 && setCount(count - 1)}
              className="btn btn-danger d-block fs-1 w-25"
            >
              -
            </div>
          </div>
        </label>

        <button className="btn btn-success w-100 mx-auto d-block">
          Tasdiqlash
        </button>
      </form>

      <div
        className="card shadow-lg mt-3"
        style={{ maxHeight: 500, minHeight: 257, overflowY: "auto" }}
      >
        <div
          className="card shadow-lg mt-3"
          style={{ maxHeight: 500, minHeight: 257, overflowY: "auto" }}
        >
          {/* Mahsulotlar ro'yxati */}
          <table className="table table-hover">
            <thead>
              <tr>
                <th>№</th>
                <th>Ismi</th>
                <th>Soni</th>
                <th>Narxi</th>
                <th>Jami</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((itm, i) => (
                <tr
                  key={i}
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedOrder({ ...itm, i });
                  }}
                >
                  <td className="text-center">{i + 1}</td>
                  <td className="text-center">{itm.name}</td>
                  <td className="text-center">{itm.count}</td>
                  <td className="text-center">{itm.price}</td>
                  <td className="text-center">{itm.count * itm.price}</td>
                </tr>
              ))}
              {/* Umumiy hisoblar qatori */}
              {orders.length > 0 && (
                <tr style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
                  <td colSpan={2} className="text-center">
                    Jami
                  </td>
                  <td className="text-center">
                    {orders.reduce((sum, itm) => sum + itm.count, 0)}
                  </td>
                  <td className="text-center">
                    {orders.reduce((sum, itm) => sum + itm.price, 0)}
                  </td>
                  <td className="text-center">
                    {orders.reduce(
                      (sum, itm) => sum + itm.price * itm.count,
                      0
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <Rodal
          height={250}
          width={350}
          onClose={() => setModalVisible(false)}
          visible={modalVisible}
        >
          <div className="d-flex flex-column justify-content-between h-100">
            <div>
              <h1 className="text-center fs-1 text-bg-dark p-2 mb-3 mt-4">
                {selectedOrder.name}
              </h1>
              <h4>
                Narxi:{" "}
                <span className="fw-light">{selectedOrder.price} so'm</span>
              </h4>
              <h4>
                Soni:{" "}
                <span className="fw-light">{selectedOrder.count} kg, ta</span>
              </h4>
            </div>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setModalVisible(false)}
              >
                Yopish
              </button>
              <button className="btn btn-danger" onClick={deleteOrder}>
                O'chirish
              </button>
            </div>
          </div>
        </Rodal>
      )}
    </div>
  );
}

export default DoExpence;
