import React from "react";
import { trpc } from "../utils/api";
import { TRPCError } from "@trpc/server";
import Link from "next/link";

const DbConfig = () => {
  const [password, setPassword] = React.useState("");

  const { mutateAsync: fetchDbData, data: DBdata } =
    trpc.db.export.useMutation();
  const {
    mutateAsync: importDbData,
    data,
    isLoading: isUploading,
  } = trpc.db.import.useMutation();
  const [file, setFile] = React.useState<string | null>(null);
  const [newData, setNewData] =
    React.useState<Exclude<typeof DBdata, TRPCError>>(undefined);

  const createFile = async () => {
    try {
      const res = await fetchDbData({ password: password });

      if (!res) {
        return;
      }
      const blob = new Blob([JSON.stringify(res)], { type: "text/json" });
      const url = URL.createObjectURL(blob);
      setFile(url);
    } catch (err) {
      if (err) console.error(err);
    }
  };

  const fileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await file.text();
    const json = JSON.parse(data);
    setNewData(json);
  };

  return (
    <>
      <h1>Not Authorized</h1>
      <Link href={"/"}>
        <a>Go Home</a>
      </Link>
    </>
  );

  //   return (
  //     <div className="">
  //       <PasswordInput
  //         label="Password"
  //         placeholder="Password"
  //         onChange={(e) => setPassword(e.currentTarget.value)}
  //       />
  //       <h1 className="m-3">Export Database</h1>
  //       <button
  //         className=" m-3 rounded-md bg-blue-400 px-2 py-1"
  //         onClick={createFile}
  //       >
  //         export!
  //       </button>
  //       {file ? (
  //         <a
  //           href={file}
  //           download={"db.json"}
  //           className="m-3 rounded-md bg-green-400 px-2 py-1"
  //         >
  //           Download
  //         </a>
  //       ) : (
  //         <br />
  //       )}
  //       <br />
  //       <h1 className="m-3">Import Database</h1>
  //       <input type="file" className=" m-3 px-2 py-1" onChange={fileUpload} />
  //       {newData ? (
  //         <button
  //           onClick={() => importDbData({ ...newData, password: password })}
  //           className={`m-3 px-2 py-1 ${
  //             isUploading ? "bg-yellow-400" : "bg-green-400"
  //           } rounded-md`}
  //         >
  //           Upload
  //         </button>
  //       ) : null}
  //     </div>
  //   );
};

export default DbConfig;
