import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useForm } from "react-hook-form";
import Rodal from "rodal";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DoExpence, { alert } from "./DoExpence";

function DoIncome() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [orders, setOrders] = useState(
    () => JSON.parse(localStorage.getItem("orders")) || []
  );
  const [options, setOptions] = useState(
    () => JSON.parse(localStorage.getItem("options")) || []
  );
  const [count, setCount] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const { handleSubmit, register, reset } = useForm();

  const addOrder = (data) => {
    if (!selectedOption || !data.price) {
      alert("Mahsulot nomi va narxini kiriting!", false);
      return;
    }

    const newOrder = {
      name: selectedOption.label,
      price: parseInt(data.price),
      count,
      products: [],
      total: parseInt(data.price) * count,
    };

    const updatedOrders = [...orders, newOrder].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    alert("Buyurtma qo'shildi", true);
    reset();
    setSelectedOption(null);
    setCount(1);
  };

  const createOption = (e) => {
    if (e?.__isNew__) {
      const newOption = { label: e.label, value: e.value };
      const updatedOptions = [...options, newOption];
      setOptions(updatedOptions);
      localStorage.setItem("options", JSON.stringify(updatedOptions));
    }
    setSelectedOption(e);
  };

  const deleteOrder = () => {
    if (!window.confirm("Haqiqatan ham ushbu buyurtmani o‘chirmoqchimisiz?"))
      return;
    console.log(selectedOrder);

    const updatedOrders = orders.filter((_, i) => {
      console.log(i);
      return i != selectedOrder.i;
    });
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setModalVisible(false);
    alert("Buyurtma o'chirildi", true);
  };

  const calcIncome = (itm) => {
    const totalExpense = itm.products.reduce((sum, p) => {
      console.log("sum: " + sum);
      console.log("p: " + p.price);
      console.log("c: " + p.count);

      console.log("s: " + (sum + p.price * p.count));

      return sum + p.price * p.count;
    }, 0);
    return (itm.price - totalExpense) * itm.count;
  };

  function showProducts(itm) {
    if (itm.products.length > 0) {
      let partOfProducts = "";
      for (let i = 0; i < itm.products.length; i++) {
        partOfProducts += itm.products[i].name + ", ";
        if (i >= 3) break;
      }
      return <span className="text-success">{partOfProducts + "..."}</span>;
    } else {
      return <span className="text-danger">{"Hech narsa"}</span>;
    }
  }

  return (
    <>
      <ToastContainer />
      <form className="p-3 card shadow-lg" onSubmit={handleSubmit(addOrder)}>
        <h1 className="text-center">FMMebel</h1>
        <label className="mb-2 fs-5">
          Ismi:
          <CreatableSelect
            options={options}
            isClearable
            value={selectedOption}
            onChange={createOption}
            className="mb-3 border-black"
          />
        </label>
        <label className="mb-2 fs-5">
          Mahsulot narxi:
          <input
            type="number"
            {...register("price")}
            className="form-control border-black mb-2"
            onKeyUp={(e) => {
              if (e.target.value < 1) e.target.value = "";
            }}
          />
        </label>
        <label className="mb-2 fs-5">
          Soni:
          <div
            style={{ width: "max-content !important", pointerEvents: "none" }}
            className="d-flex gap-2 w-75 align-items-center"
          >
            <div
              type="button"
              style={{pointerEvents: "auto"}}
              onClick={() => setCount(count + 1)}
              className="btn btn-success fs-1 w-25"
            >
              +
            </div>
            <h1 className="m-0">{count}</h1>
            <div
              type="button"
              style={{pointerEvents: "auto"}}
              onClick={() => count > 1 && setCount(count - 1)}
              className="btn btn-danger fs-1 w-25"
            >
              -
            </div>
          </div>
        </label>
        <button className="btn btn-success w-100">Tasdiqlash</button>
      </form>

      <div
        className="card shadow-lg mt-3"
        style={{ maxHeight: 500, minHeight: 300, overflowY: "auto" }}
      >
        <div
          className="card shadow-lg mt-3"
          style={{ maxHeight: 500, minHeight: 300, overflowY: "auto" }}
        >
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>№</th>
                <th>Ismi</th>
                <th>Narxi</th>
                <th>Soni</th>
                <th>Sof foyda (шт)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((itm, i) => (
                <tr
                  key={i}
                  onClick={() =>
                    setSelectedOrder({ ...itm, i }) & setModalVisible(true)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-center">{i + 1}</td>
                  <td className="text-center">{itm.name}</td>
                  <td className="text-center">{itm.price}</td>
                  <td className="text-center">{itm.count}</td>
                  <td className="text-center">
                    {itm.price -
                      itm.products.reduce(
                        (sum, p) => sum + p.price * p.count,
                        0
                      )}
                  </td>
                </tr>
              ))}
              {/* Umumiy hisoblar qatori */}
              {orders.length > 0 && (
                <tr style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
                  <td colSpan={2} className="text-center">
                    Jami
                  </td>
                  <td className="text-center">
                    {orders.reduce((sum, itm) => sum + itm.price, 0)}
                  </td>
                  <td className="text-center">
                    {orders.reduce((sum, itm) => sum + itm.count, 0)}
                  </td>
                  <td className="text-center">
                    {orders.reduce(
                      (sum, itm) =>
                        sum +
                        (itm.price -
                          itm.products.reduce(
                            (total, p) => total + p.price * p.count,
                            0
                          )),
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
          height={400}
          width={350}
          onClose={() => setModalVisible(false)}
          visible={modalVisible}
        >
          <div className="d-flex flex-column justify-content-between h-100">
            <div>
              <h1 className="text-center fs-1 text-bg-dark p-2 mb-3">
                {selectedOrder.name}
              </h1>
              <h4>
                Narxi:{" "}
                <span className="fw-light">{selectedOrder.price} so'm</span>
              </h4>
              <h4>
                Soni: <span className="fw-light">{selectedOrder.count} ta</span>
              </h4>
              <h4>
                Sof foyda:{" "}
                <span className="fw-light">
                  {calcIncome(selectedOrder)} so'm
                </span>
              </h4>
              <h4 className="my-1">
                Mahsulotlari:{" "}
                <span
                  className="fw-light"
                  onDoubleClick={() => navigate("/expence/" + selectedOrder.i)}
                >
                  {showProducts(selectedOrder)}
                </span>
              </h4>
            </div>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setModalVisible(false)}
              >
                Yopish
              </button>
              <button
                className="btn btn-warning"
                onClick={() => navigate("/expence/" + selectedOrder.i)}
              >
                Chiqimlar
              </button>
              <button className="btn btn-danger" onClick={deleteOrder}>
                O'chirish
              </button>
            </div>
          </div>
        </Rodal>
      )}
    </>
  );
}

export default DoIncome;
