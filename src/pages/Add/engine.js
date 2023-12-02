import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const engine =
  (Component) =>
  ({ ...props }) => {
    const [validating, setValidating] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const formik = useFormik({
      initialValues: { barcode: "", barcodeType: "", price: "" },
      validationSchema: Yup.object().shape({
        barcode: Yup.string().required("Barcode Required"),
        price: Yup.string().required("Price Required"),
      }),
      onSubmit: async (values, { setSubmitting, resetForm }) => {
        try {
          await axios({
            url: process.env.REACT_APP_LAMBDA_URL,
            data: JSON.stringify(values),
            method: "POST",
          });
          toast.success("Product added successfully.");
          queryClient.invalidateQueries({ queryKey: ["products"] });
          resetForm();
          navigate("/");
        } catch (error) {
          toast.success("Error occured!.");
        } finally {
          setSubmitting(false);
        }
      },
    });

    const validateBarcode = async (event) => {
      setValidating(true);

      formik.setFieldValue("barcode", "");
      formik.setFieldValue("barcodeType", "");

      const formdata = new FormData();
      formdata.append("file", event.target.files[0]);

      try {
        const { data: { data } = {} } = await axios({
          url: `${process.env.REACT_APP_EC2_URL}/decode-barcode`,
          data: formdata,
          method: "POST",
        });
        formik.setFieldValue("barcode", data.RawText);
        formik.setFieldValue("barcodeType", data.BarcodeType);
      } catch (error) {
        console.log(error);
        formik.setErrors({
          ...formik.errors,
          barcode: error?.response?.data?.message,
        });
      } finally {
        setValidating(false);
      }
    };

    return (
      <Component
        {...props}
        {...{
          formik,
          validateBarcode,
          validating,
          setValidating,
        }}
      />
    );
  };

export default engine;
