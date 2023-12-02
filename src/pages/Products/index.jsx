import { Delete } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { map, replace } from "lodash";
import MUIDataTable from "mui-datatables";
import React, { Fragment } from "react";
import engine from "./engine";

function Products({ data, deleteProduct }) {
  return (
    <Fragment>
      <MUIDataTable
        title="Listed Products"
        data={map(data?.Items, (item) => [
          item.name,
          item.image,
          item.brand,
          { code: item.barcode, type: item.barcodeType },
          item.barcode,
          item.price,
          item.barcode,
        ])}
        columns={[
          "Name",
          {
            name: "Image",
            label: "Image",
            options: {
              filter: false,
              customBodyRender: (value) => {
                return (
                  <img
                    src={value}
                    alt=""
                    style={{
                      height: "70px",
                      width: "100px",
                      objectFit: "contain",
                    }}
                  />
                );
              },
              setCellProps: (value) => ({ sx: { py: 0 }, align: "center" }),
              setCellHeaderProps: (value) => ({
                align: "center",
              }),
            },
          },
          "Brand",
          {
            name: "barcode",
            label: "Barcode",
            options: {
              filter: false,
              customBodyRender: (value) => {
                return (
                  <img
                    src={`https://barcode.tec-it.com/barcode.ashx?data=${
                      value.code
                    }&code=${replace(value.type, "_", "")}`}
                    alt=""
                    style={{
                      height: "70px",
                      objectFit: "contain",
                    }}
                  />
                );
              },
              setCellProps: (value) => ({ sx: { py: 0 }, align: "center" }),
              setCellHeaderProps: (value) => ({
                align: "center",
              }),
            },
          },
          "Code",
          {
            name: "price",
            label: "Price",
            options: {
              customBodyRender: (value) => {
                return (
                  <Typography>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "EUR",
                    }).format(value)}
                  </Typography>
                );
              },
              setCellProps: (value) => ({ sx: { py: 0 } }),
            },
          },
          {
            name: "delete",
            label: "Delete",
            options: {
              sort: false,
              download: false,
              filter: false,
              customBodyRender: (value) => {
                return (
                  <IconButton
                    color="error"
                    onClick={() => deleteProduct(value)}
                  >
                    <Delete />
                  </IconButton>
                );
              },
              setCellProps: (value) => ({ sx: { py: 0 }, align: "center" }),
              setCellHeaderProps: (value) => ({
                align: "center",
              }),
            },
          },
        ]}
        options={{
          selectableRowsHideCheckboxes: true,
          elevation: 0,
          print: false,
          sort: false,
          rowsPerPage: 100,
        }}
      />
    </Fragment>
  );
}

export default engine(Products);
