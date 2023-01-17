import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import LoginBox from "../components/LoginBox";

import { trpc } from "../utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Go Go Dice Roller</title>
        <meta name="description" content="The Best Dice Roller in the Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen items-center justify-center">
        <LoginBox />
      </main>
    </>
  );
};

export default Home;
