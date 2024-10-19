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
import { client } from "@/ts-rest/client";
import { useForm } from "@tanstack/react-form";

import { Link } from "./Link";

interface SignUpFormProps {
  onSubmit: (email: string, password: string) => void;
}

// TODO: validation & error messages
export function SignUpForm({ onSubmit }: SignUpFormProps) {

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const result = await client.signUp({ body: { email: value.email, password: value.password } });

      if (result.status === 200) {
        navigate("/");
      } else {
        // TODO: handle
        console.error("Failed to sign up");
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
                  </>
                )}
              />
            </div>
            <div className="grid gap-2">
              <form.Field
                name="confirmPassword"
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
