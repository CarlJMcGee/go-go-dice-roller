import { type AppType } from "next/app";

import { trpc } from "../utils/api";

import "../styles/globals.css";

import GoDice from "../../public/godice";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
