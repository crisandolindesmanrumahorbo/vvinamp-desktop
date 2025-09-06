import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./components/Input";
import { invoke } from "@tauri-apps/api/core";
import {
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/plugin-notification";

import "./App.css";

const Login = () => {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center">
        <div
          className="flex xl:flex-row flex-col items-center sm:gap-10 gap-2 border 
          dark:border-gray-600 border-gray-400 p-12 mx-4 rounded-2xl h-full shadow-xl"
        >
          <div className="w-full items-center justify-center flex mb-6">
            <div className="relative sm:w-[400px] sm:h-[400px] w-[200px] h-[200px]">
              <img
                src="/tauri.svg"
                alt="Apiiiii"
                className="items-center w-full h-full"
              />
            </div>
          </div>

          <div className="h-full w-full">
            <FormLogin />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

function FormLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setTokenmessage] = useState("streaming");

  const showNotification = async () => {
    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }
    console.log({ permissionGranted });

    if (permissionGranted) {
      // If permission is granted, call the Rust command
      await invoke("show_notification");
    } else {
      console.warn("Notification permission denied by the user.");
      alert("Cannot show notification: permission denied.");
    }
  };

  const login = async (username: string, password: string) => {
    const body = JSON.stringify({
      username,
      password,
    });
    const response = await fetch(`http://127.0.0.1:7879/login`, {
      method: "POST",
      body,
    });
    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      return { data, error: null };
    }
    if (response.status >= 400 && response.status < 500) {
      return { data: null, error: "credential is wrong" };
    }
    return { data: null, error: "server have problem," };
  };

  const onLogin = async () => {
    if (!username || !password) {
      setMessage("Username and password are required");
      return;
    }
    const { data, error } = await login(username, password);
    if (error) {
      setMessage(error);
      return;
    }
    // await initCookies({ token: data.token });
    setTokenmessage(data.token);
    console.log(data);
    navigate({
      pathname: "/",
    });
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
      >
        <div className="md:w-[60vh] flex flex-col gap-1">
          <Input
            inputMode="text"
            value={username}
            onChange={(value: string) => {
              setUsername(value?.trim());
              setMessage("");
            }}
            isError={message.length > 0}
            label={`Username`}
          />
          <Input
            inputMode="password"
            value={password}
            onChange={(value: string) => {
              setPassword(value);
              setMessage("");
            }}
            isError={message.length > 0}
            label={`Password`}
          />
        </div>
        <p className="text-red-400">{message}</p>

        <button
          className="font-semibold bg-green-800 px-2 py-2 w-full rounded mt-4 cursor-pointer hover:bg-white hover:text-green-800 border border-green-800  hover:outline-white text-white"
          type="submit"
        >
          Login
        </button>

        <p>{token}</p>
      </form>
      <button
        className="font-semibold bg-green-800 px-2 py-2 w-full rounded mt-4 cursor-pointer hover:bg-white hover:text-green-800 border border-green-800  hover:outline-white text-white"
        onClick={showNotification}
      >
        Show
      </button>
    </>
  );
}
