"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import Layout from "@/components/Layout/Layout";
import { Provider } from "react-redux";
import store from "@/store";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Layout>{children}</Layout>
    </Provider>
  );
}
