import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "../utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Go Go Dice Roller</title>
        <meta name="description" content="The Best Dice Roller in the Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center"></main>
    </>
  );
};

export default Home;
