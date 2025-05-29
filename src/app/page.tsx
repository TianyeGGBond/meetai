"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { session } from "@/db/schema";


export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = authClient.useSession();

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      password,
      name,
    }, {
      onError: () => {
        window.alert("Something went wrong");
      },
      onSuccess: () => {
        window.alert("Success");
      }
    });
  }；

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password,
    }, {
      onError: () => {
        window.alert("Something went wrong");
      },
      onSuccess: () => {
        window.alert("Success");
      }
    });
  }；

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Loggied in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}> Sign out </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-10">
      <div className="p-4 flex flex-col gap-y-4">
        <Input placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)} />
        <Input placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onSubmit}>
          Create user
        </Button>
      </div>

      <div className="p-4 flex flex-col gap-y-4">
        <Input placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onLogin}>
          Login
        </Button>
      </div>
    </div>
  );
};

