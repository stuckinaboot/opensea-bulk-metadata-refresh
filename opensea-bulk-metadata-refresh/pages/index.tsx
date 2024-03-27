import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Typography } from "@mui/material";
import BulkRefresh from "../components/BulkRefresh";
import { Analytics } from "@vercel/analytics/react"

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Analytics />

      <Head>
        <title>NFT bulk metadata refresh</title>
        <meta name="description" content="Bulk metadata refresh" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Bulk Metadata Refresh on OpenSea</h1>
        <BulkRefresh />
      </main>

      <footer className={styles.footer}>
        <Typography>
          This tool uses the OpenSea public API. Use this tool at your own
          discretion, it was created in an hr as a side project by{" "}
          <b>
            <a
              href="https://twitter.com/AspynPalatnick"
              target="_blank"
              rel="noreferrer"
            >
              Aspyn
            </a>
          </b>
        </Typography>
      </footer>
    </div>
  );
};

export default Home;
