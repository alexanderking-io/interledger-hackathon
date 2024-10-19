import { usePageContext } from "vike-react/usePageContext";

import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  const ctx = usePageContext();

  return (
    <>
      <SignUpForm />
    </>
  );
}
