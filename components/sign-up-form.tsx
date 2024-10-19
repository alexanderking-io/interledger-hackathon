import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { z } from "zod";

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

// TODO: validation & error messages
export function SignUpForm() {
  const ctx = usePageContext();

  const form = useForm({
    defaultValues: {
      email: "",
      walletAddress: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const response = await fetch(`/api/signup`, {
        method: "POST",
        body: JSON.stringify({ email: value.email, password: value.password }),
        headers: { "Content-Type": "application/json" },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: Record<string, any> = await response.json();
      if ("error" in result) {
        console.error("A validation error has occurred :", result.error);
      } else {
        await navigate("/");
      }
    },
  });

  return (
    <Card className="mx-auto max-w-sm min-w-96">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
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
                validators={{
                  onBlur: ({ value }) =>
                    z.string().email().safeParse(value).success ? undefined : "Invalid email address",
                }}
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
                    {field.state.meta.errors.map((err) => (
                      <div className="text-sm text-red-500" key={err?.toString()}>
                        {err}
                      </div>
                    ))}
                  </>
                )}
              />
            </div>
            <div className="grid gap-2">
              <form.Field
                name="walletAddress"
                children={(field) => (
                  <>
                    <Label htmlFor="email">Wallet Address</Label>
                    <Input
                      id="wallet-address"
                      type="text"
                      placeholder="$ilp.wallet.com/abc123456"
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
                validators={{
                  onBlur: ({ value }) =>
                    value.length < 8 ? "Password must have a length at least 8 characters " : undefined,
                }}
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
                    {field.state.meta.errors.map((err) => (
                      <div className="text-sm text-red-500" key={err?.toString()}>
                        {err}
                      </div>
                    ))}
                  </>
                )}
              />
            </div>
            <div className="grid gap-2">
              <form.Field
                name="confirmPassword"
                validators={{
                  onChangeListenTo: ["password"],
                  onChange: ({ value, fieldApi }) => {
                    if (value !== fieldApi.form.getFieldValue("password")) {
                      return "Passwords do not match";
                    }
                    return undefined;
                  },
                }}
                children={(field) => (
                  <>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confrim Password"
                      required
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.map((err) => (
                      <div className="text-sm text-red-500" key={err?.toString()}>
                        {err}
                      </div>
                    ))}
                  </>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
