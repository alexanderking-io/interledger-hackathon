"use client";
import { useState } from "react";

import { navigate } from "vike/client/router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";

import { Link } from "./Link";

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const response = await fetch(`/api/login`, {
        method: "POST",
        body: JSON.stringify({ email: value.email, password: value.password }),
        headers: { "Content-Type": "application/json" },
      });
      const result: Record<string, any> = await response.json();
      if (response.status !== 200) {
        console.log("response", response);
        setError("Incorrect username or password.");
      } else if ("error" in result) {
        console.error("A validation error has occurred :", result.error);
        setError(result.error);
      } else {
        await navigate("/dashboard");
      }
    },
  });
  return (
    <Card className="mx-auto max-w-sm min-w-96">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Enter your details below to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <form.Field
                name="email"
                children={(field) => (
                  <>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                )}
              />
            </div>
            <div className="grid gap-2">
              <form.Field
                name="password"
                children={(field) => (
                  <>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      required
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {/* TODO: forgot password page */}
                  </>
                )}
              />
              <div className="flex items-center">
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            {error && <div className="text-sm text-red-500 flex justify-center">{error}</div>}
            {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
