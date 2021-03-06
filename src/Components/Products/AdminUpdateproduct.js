import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { WarnToast } from "../../utils/WarnToast";
import AdminHeader from "../Admin/AdminHeader";
import AdminSidebar from "../Admin/AdminSidebar";

const AdminUpdateProduct = ({ adminData }) => {
  // for holding the particular category id
  const { pid } = useParams();
  const [pname, setPname] = useState("");
  const [pdesc, setPdesc] = useState("");
  const [pprice, setPprice] = useState("");
  const [pqty, setPqty] = useState("");
  const [pic, setPic] = useState("");
  const [unSeenNoti, setUnseenNoti] = useState([]);

  const [cart, setCart] = useState([]);
  const [productQtyCart, setProductQtyCart] = useState([]);
  //   holding data

  const [productdata, setProductdata] = useState([]);
  // token for admin
  const {
    register,
    handleSubmit,
    // getValues,
    formState: { errors },
  } = useForm({ shouldUseNativeValidation: false });

  //   for display category info initail when page is render
  useEffect(() => {
    axios
      .get("http://localhost:5000/get-total-products-cart")
      .then((response) => {
        if (response) {
          console.log(response.data[0].productQuantity);
          setCart(response.data);
        } else {
          console.log("Something went wrong");
        }
      })

      .catch(() => {
        console.log("error occur");
      });
    axios
      .get("http://localhost:5000/service/all-noti-unseen")
      .then((response) => {
        setUnseenNoti(response.data);
      })

      .catch(() => {
        console.log("error occur");
      });
  }, [pid, unSeenNoti]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/singleproduct/" + pid)
      .then((getResult) => {
        console.log(getResult.data.pic);
        setProductdata(getResult.data);
        setPname(getResult.data.pname);
        setPdesc(getResult.data.pdesc);
        setPprice(getResult.data.pprice);
        setPqty(getResult.data.pqty);
        setPic(getResult.data.pic);
      })
      .catch((err) => console.log(err));
  }, []);

  const onSubmitProductUpdateForm = (data, e) => {
    e.preventDefault();
    const productUpdateForm = new FormData();
    productUpdateForm.append("pid", pid);
    productUpdateForm.append("pname", pname);
    productUpdateForm.append("pdesc", pdesc);
    productUpdateForm.append("pprice", pprice);
    productUpdateForm.append("pqty", pqty);
    productUpdateForm.append("image", pic);

    axios
      .put(`http://localhost:5000/update-product/${pid}`, productUpdateForm)

      .then((result) => {
        console.log(result.data);

        // window.location = "/view-admin-products";
        toast.success(<UpdateToast />, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: false,
        });
        setPname("");
        setPdesc("");
        setPprice("");
        setPqty("");
        setPic("");
      })
      .catch((e) => {
        toast.warn(<WarnToast />, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: true,
        });
      });
  };

  useEffect(() => {
    calculation();
  });

  // calculating total products number in cart
  const calculation = () => {
    setProductQtyCart(
      cart.map((x) => x.productQuantity).reduce((x, y) => x + y, 0)
    );
  };
  return (
    <>
      <div className="container-fluid ps-0 py-3">
        <AdminHeader noti={unSeenNoti} productQtyCart={productQtyCart} />
        <div className="row py-4 me-4">
          <AdminSidebar adminData={adminData} />
          <div className="col-md-9">
            <div className="hori_line">
              <hr />
            </div>
            <div className="farm_product_heading container-fluid">
              <div className="row">
                <div className="col-md-12 mt-2 mb-3">
                  <h1>Update Product</h1>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-md-10">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12">
                          {/* customer form */}
                          <form
                            method="POST"
                            onSubmit={handleSubmit(onSubmitProductUpdateForm)}
                            encType="multipart/form-data"
                          >
                            {/* input field for product name */}
                            <div className="form-group fw-bold my-2">
                              <label htmlFor="pname" className="py-2">
                                Product Name
                              </label>
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.setPname && "invalid"
                                }`}
                                placeholder="Enter product name"
                                autoComplete="nope"
                                // firstname : validation
                                {...register("setPname", {
                                  required: "product name is required",
                                  minLength: {
                                    value: 3,
                                    message: "product name is too short",
                                  },
                                  maxLength: {
                                    value: 20,
                                    message: "product name is too long",
                                  },
                                })}
                                // changing data on typing and set data to product name variable and send to database
                                value={pname}
                                onChange={(e) => setPname(e.target.value)}
                              />
                              {/* for displaying error message on validating */}
                              {errors.setpname && (
                                <small className="text-danger">
                                  {errors.setPname.message}
                                </small>
                              )}
                            </div>
                            {/* input field for product pic */}
                            <div className="form-group fw-bold my-2">
                              <label htmlFor="file" className="py-2">
                                Choose Product pic
                              </label>
                              <input
                                type="file"
                                name="image"
                                className="form-control"
                                {...register("setPic", {
                                  required: "Choose product pic",
                                })}
                                onChange={(e) => setPic(e.target.files[0])}
                              />
                              {errors.setpic && (
                                <small className="text-danger">
                                  {errors.setPic.message}
                                </small>
                              )}
                            </div>
                            {/* input field for product qty */}
                            <div className="form-group fw-bold my-2">
                              <label htmlFor="pqty" className="py-2">
                                pqty
                              </label>
                              <input
                                type="phone"
                                className={`form-control ${
                                  errors.setPqty && "invalid"
                                }`}
                                placeholder="Enter qty number"
                                {...register("setPqty", {
                                  required: "qty is required",
                                  min: {
                                    value: 1,
                                    message:
                                      "Product qty should not be less than 1",
                                  },
                                  pattern: {
                                    value: /^[0-9\b]+$/,
                                    message: "Enter digits only",
                                  },
                                })}
                                value={pqty}
                                onChange={(e) => setPqty(e.target.value)}
                              />
                              {errors.setpqty && (
                                <small className="text-danger">
                                  {errors.setPqty.message}
                                </small>
                              )}
                            </div>

                            {/* input field for product price*/}
                            <div className="form-group fw-bold my-2">
                              <label htmlFor="pprice" className="py-2">
                                Product Price
                              </label>
                              <input
                                type="phone"
                                className={`form-control ${
                                  errors.setPprice && "invalid"
                                }`}
                                placeholder="Enter product price"
                                {...register("setPprice", {
                                  required: "product price is required",
                                  pattern: {
                                    value: /^[0-9\b]+$/,
                                    message: "Enter digits only",
                                  },
                                })}
                                value={pprice}
                                onChange={(e) => setPprice(e.target.value)}
                              />
                              {errors.setpprice && (
                                <small className="text-danger">
                                  {errors.setPprice.message}
                                </small>
                              )}
                            </div>
                            {/* input field for product desc */}
                            <div className="form-group fw-bold my-2">
                              <label htmlFor="pdesc" className="py-2">
                                Description
                              </label>
                              <textarea
                                type="text"
                                className={`form-control ${
                                  errors.setPdesc && "invalid"
                                }`}
                                id="exampleFormControlTextarea1"
                                rows="2"
                                placeholder="write something for it"
                                {...register("setPdesc", {
                                  required: "description is required", // JS only: <p>error message</p> TS only support string
                                })}
                                value={pdesc}
                                onChange={(e) => setPdesc(e.target.value)}
                              ></textarea>
                              {errors.setpdesc && (
                                <small className="text-danger">
                                  {errors.setPdesc.message}
                                </small>
                              )}
                            </div>
                            <button
                              type="submit"
                              className="farm_product_add_btn btn btn-info mt-2 w-100 fw-bold text-white"
                            >
                              Submit
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminUpdateProduct;
const UpdateToast = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 text-center bg-gradient">
            <p className="text-dark">
              You have successfully updated product !!! Click "OK" to continue..
            </p>
            <Link
              to="/view-admin-products"
              className="btn btn-outline-success"
              style={{
                fontWeight: "bold",
                borderRadius: "15px",
                border: "2px solid green",
              }}
            >
              OK
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
